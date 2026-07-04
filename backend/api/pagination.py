"""Pagination helpers for list endpoints."""

from typing import TypeVar

from sqlalchemy.orm import Query

T = TypeVar("T")

DEFAULT_LIMIT = 50
MAX_LIMIT = 100


def clamp_pagination(limit: int, offset: int) -> tuple[int, int]:
    safe_limit = min(max(1, limit), MAX_LIMIT)
    safe_offset = max(0, offset)
    return safe_limit, safe_offset


def paginate_query(query: Query[T], limit: int, offset: int) -> tuple[list[T], int]:
    safe_limit, safe_offset = clamp_pagination(limit, offset)
    total = query.count()
    items = query.offset(safe_offset).limit(safe_limit).all()
    return items, total


def pagination_meta(total: int, limit: int, offset: int) -> dict:
    safe_limit, safe_offset = clamp_pagination(limit, offset)
    return {
        "total": total,
        "limit": safe_limit,
        "offset": safe_offset,
        "has_more": safe_offset + safe_limit < total,
    }
