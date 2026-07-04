"""Admin API key dependency for mutation endpoints."""

import os

from fastapi import Header, HTTPException


def require_admin(x_admin_key: str | None = Header(None, alias="X-Admin-Key")) -> None:
    expected = os.getenv("ADMIN_API_KEY", "")
    if not expected:
        return  # dev mode — no key configured
    if x_admin_key != expected:
        raise HTTPException(status_code=401, detail="Invalid or missing admin API key")
