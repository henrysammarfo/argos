"""Milestone submission and verification routes."""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.auth import require_admin
from api.database import get_db
from api.json_utils import dumps, loads
from api.models import KaspaEscrow, MilestoneSubmission
from api.schemas import MilestoneSubmissionCreate
from services.claude_evaluator import verify_milestone
from services.kaspa_escrow import release_milestone

router = APIRouter()


@router.post("/submit", dependencies=[Depends(require_admin)])
async def submit_milestone(data: MilestoneSubmissionCreate, db: Session = Depends(get_db)):
    escrow = db.query(KaspaEscrow).filter(KaspaEscrow.id == data.escrow_id).first()
    if not escrow:
        raise HTTPException(status_code=404, detail="Escrow not found")

    verification = await verify_milestone(data.report_text, data.promised_deliverables)

    submission = MilestoneSubmission(
        escrow_id=data.escrow_id,
        milestone_index=data.milestone_index,
        report_text=data.report_text,
        report_url=data.report_url,
        ai_verdict=verification.get("verdict"),
        ai_evidence=dumps(verification.get("evidence", [])),
        ai_completion_pct=verification.get("completion_pct"),
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    return {
        "submission_id": submission.id,
        "ai_verdict": verification.get("verdict"),
        "completion_pct": verification.get("completion_pct"),
        "evidence": verification.get("evidence", []),
    }


@router.post("/{submission_id}/approve", dependencies=[Depends(require_admin)])
async def approve_milestone(
    submission_id: str,
    note: str = "",
    db: Session = Depends(get_db),
):
    submission = (
        db.query(MilestoneSubmission).filter(MilestoneSubmission.id == submission_id).first()
    )
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    escrow = db.query(KaspaEscrow).filter(KaspaEscrow.id == submission.escrow_id).first()
    if not escrow:
        raise HTTPException(status_code=404, detail="Escrow not found")

    milestones = loads(escrow.milestones)
    idx = submission.milestone_index
    if idx >= len(milestones):
        raise HTTPException(status_code=400, detail="Invalid milestone index")

    kas_amount = milestones[idx].get("kas_amount", 0)

    tx_hash = await release_milestone(
        escrow_id=escrow.id,
        milestone_index=idx,
        grantee_address=escrow.grantee_kas_address,
        kas_amount=kas_amount,
        escrow_address=escrow.escrow_address,
    )

    milestones[idx]["status"] = "released"
    milestones[idx]["release_tx"] = tx_hash
    escrow.milestones = dumps(milestones)
    escrow.status = "partial" if any(m["status"] == "locked" for m in milestones) else "complete"

    submission.human_approved = True
    submission.human_note = note
    submission.release_tx_hash = tx_hash
    submission.kas_released = kas_amount
    submission.verified_at = datetime.utcnow()

    db.commit()

    return {
        "approved": True,
        "release_tx_hash": tx_hash,
        "kas_released": kas_amount,
    }
