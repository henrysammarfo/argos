"""Public marketing endpoints — no auth required."""

import os
from pathlib import Path

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from api.database import get_db
from api.json_utils import loads
from api.models import Evaluation, KaspaEscrow, Proposal
from services.kaspa_covenant import covenant_summary, load_covenant_source

router = APIRouter()


@router.get("/stats")
def public_stats(db: Session = Depends(get_db)):
    """Aggregate platform stats for marketing pages (no tenant PII)."""
    active_rounds = (
        db.query(func.count(Evaluation.id)).filter(Evaluation.status != "complete").scalar() or 0
    )
    total_proposals = db.query(func.count(Proposal.id)).scalar() or 0
    complete = (
        db.query(func.count(Proposal.id)).filter(Proposal.status == "complete").scalar() or 0
    )
    flagged = 0
    for (red_flags,) in (
        db.query(Proposal.red_flags).filter(Proposal.status == "complete").limit(2000).all()
    ):
        flags = loads(red_flags, [])
        flagged += len(flags) if isinstance(flags, list) else 0

    escrow_managed = db.query(func.coalesce(func.sum(KaspaEscrow.total_kas), 0.0)).scalar() or 0.0

    agent_env_keys = [
        "ORCHESTRATOR_ADDRESS",
        "INTAKE_ADDRESS",
        "TECHNICAL_ADDRESS",
        "IMPACT_ADDRESS",
        "TEAM_ADDRESS",
        "MILESTONE_ADDRESS",
    ]
    agents_online = sum(1 for k in agent_env_keys if os.getenv(k))

    return {
        "active_rounds": active_rounds,
        "total_proposals": total_proposals,
        "complete_proposals": complete,
        "flagged_proposals": flagged,
        "escrow_managed_kas": escrow_managed,
        "agents_online": agents_online,
    }


@router.get("/covenant")
def public_covenant():
    """SilverScript milestone covenant metadata for Kaspa track judges."""
    return covenant_summary()


@router.get("/covenant/source")
def public_covenant_source():
    """Return SilverScript source (for GitHub / judge verification)."""
    return {"source": load_covenant_source()}


@router.get("/escrow-preview")
def public_escrow_preview(db: Session = Depends(get_db)):
    """Latest escrow milestone schedule for marketing (no grantee PII)."""
    escrow = db.query(KaspaEscrow).order_by(KaspaEscrow.created_at.desc()).first()
    if not escrow:
        return {"escrow": None, "covenant": covenant_summary()}

    milestones = loads(escrow.milestones, [])
    return {
        "escrow": {
            "id": escrow.id[:12],
            "total_kas": escrow.total_kas,
            "status": escrow.status,
            "milestones": [
                {
                    "name": m.get("name", f"Milestone {i + 1}"),
                    "percent": m.get("percent", 0),
                    "status": m.get("status", "locked"),
                }
                for i, m in enumerate(milestones)
            ],
        },
        "covenant": covenant_summary(len(milestones)),
    }
