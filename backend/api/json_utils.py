"""JSON helpers for SQLAlchemy text columns storing JSON."""

import json
from typing import Any


def dumps(obj: Any) -> str:
    return json.dumps(obj)


def loads(text: str | None, default: Any = None) -> Any:
    if text is None:
        return default if default is not None else {}
    try:
        return json.loads(text)
    except (json.JSONDecodeError, TypeError):
        return default if default is not None else {}
