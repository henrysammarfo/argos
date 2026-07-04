"""Milestone Verification Agent — verifies grantee progress reports."""

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
from services.claude_evaluator import verify_milestone

milestone_agent = Agent(
    name="argos-milestone",
    **agent_kwargs(
        port=8015,
        seed_env="MILESTONE_SEED",
        default_seed="argos_milestone_seed_phrase_change_in_production",
        description="ARGOS Milestone — deliverable verification for Kaspa escrow",
    ),
)

chat_proto = Protocol(spec=chat_protocol_spec)


@chat_proto.on_message(ChatMessage)
async def handle_milestone_verify(ctx: Context, sender: str, msg: ChatMessage):
    await ctx.send(
        sender,
        ChatAcknowledgement(timestamp=datetime.utcnow(), acknowledged_msg_id=msg.msg_id),
    )
    for item in msg.content:
        if isinstance(item, TextContent):
            try:
                request = json.loads(item.text)
                result = await verify_milestone(
                    request.get("report_text", ""),
                    request.get("promised_deliverables", []),
                )
                await ctx.send(
                    sender,
                    ChatMessage(
                        timestamp=datetime.utcnow(),
                        msg_id=uuid4(),
                        content=[
                            TextContent(
                                type="text",
                                text=json.dumps({"status": "success", "verification": result}),
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
                                text=json.dumps({"status": "error", "error": str(e)}),
                            )
                        ],
                    ),
                )


@chat_proto.on_message(ChatAcknowledgement)
async def handle_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    pass


milestone_agent.include(chat_proto, publish_manifest=True)

if __name__ == "__main__":
    print(f"Milestone Agent address: {milestone_agent.address}")
    milestone_agent.run()
