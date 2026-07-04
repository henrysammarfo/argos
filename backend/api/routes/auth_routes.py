"""Authentication routes — validates admin API key."""

import os

from fastapi import Header, HTTPException
from pydantic import BaseModel

from fastapi import APIRouter

router = APIRouter()


class LoginRequest(BaseModel):
    admin_key: str
    email: str | None = None


@router.post("/login")
async def login(body: LoginRequest):
    expected = os.getenv("ADMIN_API_KEY", "")
    if not body.admin_key.strip():
        raise HTTPException(status_code=400, detail="Admin key is required")

    if expected and body.admin_key != expected:
        raise HTTPException(status_code=401, detail="Invalid admin API key")

    return {
        "authenticated": True,
        "email": body.email or "admin@argos.local",
        "requires_key": bool(expected),
    }


@router.get("/session")
async def session(x_admin_key: str | None = Header(None, alias="X-Admin-Key")):
    expected = os.getenv("ADMIN_API_KEY", "")
    if not expected:
        return {"authenticated": True, "requires_key": False}
    if not x_admin_key or x_admin_key != expected:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {"authenticated": True, "requires_key": True}


@router.post("/logout")
async def logout():
    return {"authenticated": False}
