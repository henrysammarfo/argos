"""Auth dependencies and multi-tenant query helpers."""

from dataclasses import dataclass

import jwt
from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from api.database import get_db
from api.models import Evaluation, Organization, Proposal, User
from services.auth_service import JWT_SECRET, decode_access_token


@dataclass
class CurrentUser:
    id: str
    organization_id: str
    email: str
    email_verified: bool
    organization_name: str
    role: str


def _user_from_db(user: User, org: Organization) -> CurrentUser:
    return CurrentUser(
        id=user.id,
        organization_id=user.organization_id,
        email=user.email,
        email_verified=user.email_verified,
        organization_name=org.name,
        role=user.role,
    )


def get_current_user(
    authorization: str | None = Header(None),
    db: Session = Depends(get_db),
) -> CurrentUser:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization[7:]
    try:
        payload = decode_access_token(token)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    org = db.query(Organization).filter(Organization.id == user.organization_id).first()
    if not org:
        raise HTTPException(status_code=401, detail="Organization not found")

    return _user_from_db(user, org)


def get_evaluation_for_org(
    db: Session, evaluation_id: str, organization_id: str
) -> Evaluation:
    evaluation = (
        db.query(Evaluation)
        .filter(
            Evaluation.id == evaluation_id,
            Evaluation.organization_id == organization_id,
        )
        .first()
    )
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    return evaluation


def get_proposal_for_org(db: Session, proposal_id: str, organization_id: str) -> Proposal:
    proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    get_evaluation_for_org(db, proposal.evaluation_id, organization_id)
    return proposal


def org_evaluation_ids(db: Session, organization_id: str) -> list[str]:
    rows = (
        db.query(Evaluation.id)
        .filter(Evaluation.organization_id == organization_id)
        .all()
    )
    return [r[0] for r in rows]
