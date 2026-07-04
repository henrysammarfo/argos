"""Human approval and score override endpoints."""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.auth import require_admin
from api.database import get_db
from api.json_utils import dumps, loads
from api.models import Approval, Proposal
from api.schemas import OverrideRequest
from services.scoring import compute_weighted_score

router = APIRouter()


@router.post("/approve/{proposal_id}", dependencies=[Depends(require_admin)])
def approve_proposal_score(
    proposal_id: str,
    dimension: str,
    evaluator: str = "reviewer",
    db: Session = Depends(get_db),
):
    proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    approval = Approval(
        proposal_id=proposal_id,
        evaluator=evaluator,
        action="approve",
        dimension=dimension,
        created_at=datetime.utcnow(),
    )
    db.add(approval)
    db.commit()
    return {"status": "approved", "dimension": dimension}


@router.post("/override/{proposal_id}", dependencies=[Depends(require_admin)])
def override_score(
    proposal_id: str,
    request: OverrideRequest,
    db: Session = Depends(get_db),
):
    proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    parts = request.dimension.split(".")
    original_score = None

    if len(parts) == 2:
        category, subdim = parts
        category_scores = loads(getattr(proposal, f"{category}_scores") or "{}")

        if subdim in category_scores:
            original_score = category_scores[subdim].get("score")
            category_scores[subdim]["score"] = request.new_score
            category_scores[subdim]["human_override"] = True
            category_scores[subdim]["override_reason"] = request.reason
            setattr(proposal, f"{category}_scores", dumps(category_scores))

    overrides = loads(proposal.overrides, [])
    overrides.append(
        {
            "dimension": request.dimension,
            "original_score": original_score,
            "new_score": request.new_score,
            "reason": request.reason,
            "evaluator": request.evaluator,
            "timestamp": datetime.utcnow().isoformat(),
        }
    )
    proposal.overrides = dumps(overrides)

    evaluation = proposal.evaluation
    if evaluation:
        rubric = loads(evaluation.rubric)
        new_total = compute_weighted_score(
            loads(proposal.technical_scores),
            loads(proposal.impact_scores),
            loads(proposal.team_scores),
            rubric,
        )
        proposal.total_score = new_total

    approval = Approval(
        proposal_id=proposal_id,
        evaluator=request.evaluator,
        action="override",
        dimension=request.dimension,
        original_score=original_score,
        new_score=request.new_score,
        reason=request.reason,
    )
    db.add(approval)
    db.commit()

    return {
        "status": "overridden",
        "dimension": request.dimension,
        "original": original_score,
        "new": request.new_score,
        "new_total_score": proposal.total_score,
    }


@router.get("/audit/{proposal_id}")
def get_audit_trail(proposal_id: str, db: Session = Depends(get_db)):
    approvals = db.query(Approval).filter(Approval.proposal_id == proposal_id).all()
    proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()

    return {
        "proposal_id": proposal_id,
        "title": proposal.title if proposal else None,
        "overrides": loads(proposal.overrides, []) if proposal else [],
        "approvals": [
            {
                "action": a.action,
                "dimension": a.dimension,
                "original_score": a.original_score,
                "new_score": a.new_score,
                "reason": a.reason,
                "evaluator": a.evaluator,
                "timestamp": a.created_at.isoformat() if a.created_at else None,
            }
            for a in approvals
        ],
    }
