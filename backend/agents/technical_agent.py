"""Technical Merit Agent — evaluates innovation, feasibility, methodology."""

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
from services.claude_evaluator import evaluate_technical_merit

technical_agent = Agent(
    name="argos-technical",
    **agent_kwargs(
        port=8012,
        seed_env="TECHNICAL_SEED",
        default_seed="argos_technical_seed_phrase_change_in_production",
        description="ARGOS Technical — innovation and feasibility scoring",
    ),
)

chat_proto = Protocol(spec=chat_protocol_spec)


@chat_proto.on_message(ChatMessage)
async def handle_technical_eval(ctx: Context, sender: str, msg: ChatMessage):
    await ctx.send(
        sender,
        ChatAcknowledgement(timestamp=datetime.utcnow(), acknowledged_msg_id=msg.msg_id),
    )
    for item in msg.content:
        if isinstance(item, TextContent):
            try:
                request = json.loads(item.text)
                scores = await evaluate_technical_merit(
                    request.get("proposal_text", ""),
                    request.get("rubric_weight", 30),
                )
                result = {"status": "success", "scores": scores, "agent": "technical"}
                await ctx.send(
                    sender,
                    ChatMessage(
                        timestamp=datetime.utcnow(),
                        msg_id=uuid4(),
                        content=[TextContent(type="text", text=json.dumps(result))],
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
                                text=json.dumps({"status": "error", "error": str(e), "agent": "technical"}),
                            )
                        ],
                    ),
                )


@chat_proto.on_message(ChatAcknowledgement)
async def handle_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    pass


technical_agent.include(chat_proto, publish_manifest=True)

if __name__ == "__main__":
    print(f"Technical Agent address: {technical_agent.address}")
    technical_agent.run()
