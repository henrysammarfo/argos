"""Shared uAgent helpers."""

import json
from datetime import datetime
from uuid import uuid4

from uagents_core.contrib.protocols.chat import ChatMessage, TextContent


def create_text_chat(text: str) -> ChatMessage:
    return ChatMessage(
        timestamp=datetime.utcnow(),
        msg_id=uuid4(),
        content=[TextContent(type="text", text=text)],
    )


def parse_json_content(msg: ChatMessage) -> dict:
    for item in msg.content:
        if isinstance(item, TextContent):
            return json.loads(item.text)
    return {}
