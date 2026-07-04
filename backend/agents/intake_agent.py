"""Intake Agent — reads grant proposals and extracts structured data."""

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

from services.claude_evaluator import extract_proposal_structure
from services.proposal_reader import read_proposal, truncate_for_evaluation

intake_agent = Agent(
    name="argos-intake",
    seed=os.getenv("INTAKE_SEED", "argos_intake_seed_phrase_change_in_production"),
    port=8011,
    endpoint=[f"http://localhost:8011/submit"],
)

chat_proto = Protocol(spec=chat_protocol_spec)


@chat_proto.on_message(ChatMessage)
async def handle_intake_request(ctx: Context, sender: str, msg: ChatMessage):
    await ctx.send(
        sender,
        ChatAcknowledgement(timestamp=datetime.utcnow(), acknowledged_msg_id=msg.msg_id),
    )
    for item in msg.content:
        if isinstance(item, TextContent):
            try:
                request = json.loads(item.text)
                source_type = request.get("source_type", "text")
                source = request.get("source", "")

                raw_text = await read_proposal(source_type, source)
                truncated = truncate_for_evaluation(raw_text)
                structure = await extract_proposal_structure(truncated)

                result = {
                    "status": "success",
                    "raw_text_length": len(raw_text),
                    "truncated_text": truncated,
                    "structure": structure,
                }
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
                                text=json.dumps({"status": "error", "error": str(e)}),
                            )
                        ],
                    ),
                )


@chat_proto.on_message(ChatAcknowledgement)
async def handle_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    ctx.logger.info(f"ACK from {sender}")


intake_agent.include(chat_proto, publish_manifest=True)

if __name__ == "__main__":
    print(f"Intake Agent address: {intake_agent.address}")
    intake_agent.run()
