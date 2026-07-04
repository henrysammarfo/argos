"""Team Agent — evaluates track record, expertise, risk management."""

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
from services.claude_evaluator import evaluate_team

team_agent = Agent(
    name="argos-team",
    **agent_kwargs(
        port=8014,
        seed_env="TEAM_SEED",
        default_seed="argos_team_seed_phrase_change_in_production",
        description="ARGOS Team — track record and expertise scoring",
    ),
)

chat_proto = Protocol(spec=chat_protocol_spec)


@chat_proto.on_message(ChatMessage)
async def handle_team_eval(ctx: Context, sender: str, msg: ChatMessage):
    await ctx.send(
        sender,
        ChatAcknowledgement(timestamp=datetime.utcnow(), acknowledged_msg_id=msg.msg_id),
    )
    for item in msg.content:
        if isinstance(item, TextContent):
            try:
                request = json.loads(item.text)
                scores = await evaluate_team(
                    request.get("proposal_text", ""),
                    request.get("rubric_weight", 30),
                )
                await ctx.send(
                    sender,
                    ChatMessage(
                        timestamp=datetime.utcnow(),
                        msg_id=uuid4(),
                        content=[
                            TextContent(
                                type="text",
                                text=json.dumps({"status": "success", "scores": scores, "agent": "team"}),
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
                                text=json.dumps({"status": "error", "error": str(e), "agent": "team"}),
                            )
                        ],
                    ),
                )


@chat_proto.on_message(ChatAcknowledgement)
async def handle_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    pass


team_agent.include(chat_proto, publish_manifest=True)

if __name__ == "__main__":
    print(f"Team Agent address: {team_agent.address}")
    team_agent.run()
