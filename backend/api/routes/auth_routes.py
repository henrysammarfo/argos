"""Authentication — register, login, JWT sessions, email verification."""

import re

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from api.database import get_db
from api.deps import CurrentUser, get_current_user
from api.models import Organization, User
from services.auth_service import (
    create_access_token,
    generate_verification_code,
    hash_password,
    verify_password,
)

router = APIRouter()

SLUG_RE = re.compile(r"[^a-z0-9]+")


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    organization_name: str = Field(min_length=2, max_length=120)
    full_name: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class VerifyEmailRequest(BaseModel):
    code: str = Field(min_length=6, max_length=6)


def _slugify(name: str) -> str:
    base = SLUG_RE.sub("-", name.lower()).strip("-") or "org"
    return base[:48]


def _unique_slug(db: Session, name: str) -> str:
    base = _slugify(name)
    slug = base
    n = 1
    while db.query(Organization).filter(Organization.slug == slug).first():
        slug = f"{base}-{n}"
        n += 1
    return slug


def _user_response(user: User, org: Organization, token: str) -> dict:
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "email_verified": user.email_verified,
            "role": user.role,
            "organization_id": org.id,
            "organization_name": org.name,
        },
    }


@router.post("/register")
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    email = body.email.lower().strip()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=409, detail="An account with this email already exists")

    org = Organization(name=body.organization_name.strip(), slug=_unique_slug(db, body.organization_name))
    db.add(org)
    db.flush()

    code = generate_verification_code()
    user = User(
        organization_id=org.id,
        email=email,
        password_hash=hash_password(body.password),
        full_name=body.full_name,
        verification_code=code,
        email_verified=False,
        role="admin",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.refresh(org)

    token = create_access_token(user_id=user.id, organization_id=org.id, email=user.email)
    resp = _user_response(user, org, token)
    resp["verification_code"] = code  # demo: shown once at signup (no SMTP in hackathon)
    return resp


@router.post("/login")
def login(body: LoginRequest, db: Session = Depends(get_db)):
    email = body.email.lower().strip()
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    org = db.query(Organization).filter(Organization.id == user.organization_id).first()
    if not org:
        raise HTTPException(status_code=500, detail="Organization missing")

    token = create_access_token(user_id=user.id, organization_id=org.id, email=user.email)
    return _user_response(user, org, token)


@router.get("/me")
def me(user: CurrentUser = Depends(get_current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "email_verified": user.email_verified,
        "organization_id": user.organization_id,
        "organization_name": user.organization_name,
        "role": user.role,
    }


@router.get("/session")
def session(user: CurrentUser = Depends(get_current_user)):
    return {"authenticated": True, "user": me(user)}


@router.post("/verify-email")
def verify_email(
    body: VerifyEmailRequest,
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_user = db.query(User).filter(User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if db_user.email_verified:
        return {"email_verified": True, "email": db_user.email}
    if not db_user.verification_code or db_user.verification_code != body.code.strip():
        raise HTTPException(status_code=400, detail="Invalid verification code")

    db_user.email_verified = True
    db_user.verification_code = None
    db.commit()
    return {"email_verified": True, "email": db_user.email}


@router.post("/resend-verification")
def resend_verification(
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_user = db.query(User).filter(User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if db_user.email_verified:
        return {"email_verified": True, "message": "Email already verified"}

    code = generate_verification_code()
    db_user.verification_code = code
    db.commit()
    return {
        "email_verified": False,
        "verification_code": code,
        "message": "Verification code regenerated (demo — no email SMTP configured)",
    }


@router.post("/logout")
def logout():
    return {"authenticated": False}
