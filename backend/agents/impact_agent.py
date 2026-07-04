"""Impact Agent — evaluates scale, sustainability, counterfactual impact."""

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
    TextContent,
    chat_protocol_spec,
)

from agents._agentverse import agent_kwargs
from services.claude_evaluator import evaluate_impact

impact_agent = Agent(
    name="argos-impact",
    **agent_kwargs(
        port=8013,
        seed_env="IMPACT_SEED",
        default_seed="argos_impact_seed_phrase_change_in_production",
        description="ARGOS Impact — scale and sustainability scoring",
    ),
)

chat_proto = Protocol(spec=chat_protocol_spec)


@chat_proto.on_message(ChatMessage)
async def handle_impact_eval(ctx: Context, sender: str, msg: ChatMessage):
    await ctx.send(
        sender,
        ChatAcknowledgement(timestamp=datetime.utcnow(), acknowledged_msg_id=msg.msg_id),
    )
    for item in msg.content:
        if isinstance(item, TextContent):
            try:
                request = json.loads(item.text)
                scores = await evaluate_impact(
                    request.get("proposal_text", ""),
                    request.get("rubric_weight", 40),
                )
                await ctx.send(
                    sender,
                    ChatMessage(
                        timestamp=datetime.utcnow(),
                        msg_id=uuid4(),
                        content=[
                            TextContent(
                                type="text",
                                text=json.dumps({"status": "success", "scores": scores, "agent": "impact"}),
                            )
                        ],
                    ),
                )
            except Exception as e:
                await ctx.send(
                    sender,
                    ChatMessage(
                        timestamp=datetime.utcnow(),
                        msg_id=uuid4(),
                        content=[
                            TextContent(
                                type="text",
                                text=json.dumps({"status": "error", "error": str(e), "agent": "impact"}),
                            )
                        ],
                    ),
                )


@chat_proto.on_message(ChatAcknowledgement)
async def handle_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    pass


impact_agent.include(chat_proto, publish_manifest=True)

if __name__ == "__main__":
    print(f"Impact Agent address: {impact_agent.address}")
    impact_agent.run()
