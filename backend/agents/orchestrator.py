"""
ARGOS Orchestrator Agent — coordinates all evaluation agents.
Main entry point for ASI:One discovery.
"""

import asyncio
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime
from uuid import uuid4

from uagents import Agent, Context, Protocol
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement,
    ChatMessage,
    StartSessionContent,
    TextContent,
    chat_protocol_spec,
)

from services.openai_evaluator import (
    evaluate_impact,
    evaluate_team,
    evaluate_technical_merit,
    extract_proposal_structure,
    generate_comparison,
)
from services.proposal_reader import read_proposal, truncate_for_evaluation
from services.scoring import collect_red_flags, compute_weighted_score

orchestrator = Agent(
    name="argos-orchestrator",
    seed=os.getenv("ORCHESTRATOR_SEED", "argos_orchestrator_seed_phrase_change_in_production"),
    port=8010,
    endpoint=[f"http://localhost:8010/submit"],
)

chat_proto = Protocol(spec=chat_protocol_spec)


def create_text_chat(text: str) -> ChatMessage:
    return ChatMessage(
        timestamp=datetime.utcnow(),
        msg_id=uuid4(),
        content=[TextContent(type="text", text=text)],
    )


async def evaluate_single_proposal(proposal_text: str, rubric: dict) -> dict:
    results = await asyncio.gather(
        evaluate_technical_merit(proposal_text, rubric.get("technical", 30)),
        evaluate_impact(proposal_text, rubric.get("impact", 40)),
        evaluate_team(proposal_text, rubric.get("team", 30)),
        return_exceptions=True,
    )
    technical = results[0] if not isinstance(results[0], Exception) else {}
    impact = results[1] if not isinstance(results[1], Exception) else {}
    team = results[2] if not isinstance(results[2], Exception) else {}

    total_score = compute_weighted_score(technical, impact, team, rubric)
    all_red_flags = collect_red_flags(technical, impact, team)

    return {
        "technical": technical,
        "impact": impact,
        "team": team,
        "total_score": total_score,
        "red_flags": all_red_flags,
    }


@chat_proto.on_message(ChatMessage)
async def handle_orchestrator_message(ctx: Context, sender: str, msg: ChatMessage):
    await ctx.send(
        sender,
        ChatAcknowledgement(timestamp=datetime.utcnow(), acknowledged_msg_id=msg.msg_id),
    )

    for item in msg.content:
        if isinstance(item, StartSessionContent):
            await ctx.send(
                sender,
                create_text_chat(
                    "ARGOS Grant Evaluation System ready.\n\n"
                    "Send proposals in JSON:\n"
                    '{"action": "evaluate", "proposals": [{"source_type": "text", "source": "..."}], '
                    '"rubric": {"technical": 30, "impact": 40, "team": 30}}'
                ),
            )

        elif isinstance(item, TextContent):
            try:
                try:
                    command = json.loads(item.text)
                    action = command.get("action", "evaluate")
                except json.JSONDecodeError:
                    await ctx.send(
                        sender,
                        create_text_chat(
                            'Send proposals: {"action": "evaluate", "proposals": [...], "rubric": {...}}'
                        ),
                    )
                    continue

                if action == "evaluate":
                    proposals = command.get("proposals", [])
                    rubric = command.get("rubric", {"technical": 30, "impact": 40, "team": 30})

                    await ctx.send(
                        sender,
                        create_text_chat(f"Starting evaluation of {len(proposals)} proposals..."),
                    )

                    results = []
                    for i, proposal_def in enumerate(proposals):
                        try:
                            raw_text = await read_proposal(
                                proposal_def.get("source_type", "text"),
                                proposal_def.get("source", ""),
                            )
                            truncated = truncate_for_evaluation(raw_text)
                            structure = await extract_proposal_structure(truncated)
                            evaluation = await evaluate_single_proposal(truncated, rubric)

                            results.append(
                                {
                                    "index": i + 1,
                                    "structure": structure,
                                    "evaluation": evaluation,
                                    "status": "complete",
                                }
                            )

                            flags = len(evaluation["red_flags"])
                            await ctx.send(
                                sender,
                                create_text_chat(
                                    f"[{i+1}/{len(proposals)}] {structure.get('title', 'Proposal')} "
                                    f"— Score: {evaluation['total_score']}/10"
                                    + (f" ({flags} flags)" if flags else "")
                                ),
                            )
                        except Exception as e:
                            results.append({"index": i + 1, "error": str(e), "status": "error"})

                    successful = [r for r in results if r.get("status") == "complete"]
                    successful.sort(
                        key=lambda x: x["evaluation"]["total_score"], reverse=True
                    )

                    if successful:
                        comparison = await generate_comparison(
                            [
                                {
                                    "rank": i + 1,
                                    "title": r["structure"].get("title"),
                                    "score": r["evaluation"]["total_score"],
                                    "red_flags": r["evaluation"]["red_flags"],
                                }
                                for i, r in enumerate(successful[:3])
                            ],
                            rubric,
                        )
                    else:
                        comparison = "No proposals evaluated successfully."

                    summary = (
                        f"Evaluation complete. {len(successful)}/{len(proposals)} processed.\n\nTOP RANKED:\n"
                    )
                    for i, r in enumerate(successful[:5]):
                        summary += (
                            f"{i+1}. {r['structure'].get('title', 'Untitled')} "
                            f"— {r['evaluation']['total_score']}/10\n"
                        )
                    summary += f"\n{comparison}"

                    await ctx.send(sender, create_text_chat(summary))
                    await ctx.send(
                        sender,
                        create_text_chat(
                            f"Full data:\n{json.dumps({'ranked': successful[:10]}, indent=2)}"
                        ),
                    )

            except Exception as e:
                ctx.logger.error(f"Orchestrator error: {e}")
                await ctx.send(sender, create_text_chat(f"Error: {str(e)}"))


@chat_proto.on_message(ChatAcknowledgement)
async def handle_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    pass


orchestrator.include(chat_proto, publish_manifest=True)

if __name__ == "__main__":
    print(f"ARGOS Orchestrator address: {orchestrator.address}")
    print("Register this address on Agentverse for ASI:One discovery")
    orchestrator.run()
