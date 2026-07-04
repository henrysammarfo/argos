"""Milestone submission and verification routes."""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.database import get_db
from api.deps import CurrentUser, get_current_user, org_evaluation_ids
from api.json_utils import dumps, loads
from api.models import KaspaEscrow, MilestoneSubmission
from api.schemas import MilestoneSubmissionCreate
from services.claude_evaluator import verify_milestone
from services.kaspa_escrow import release_milestone
from services.kaspa_network import explorer_tx_url
from services.agent_payments import record_agent_payment

router = APIRouter()


@router.post("/submit")
async def submit_milestone(
    data: MilestoneSubmissionCreate,
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    eval_ids = org_evaluation_ids(db, user.organization_id)
    escrow = (
        db.query(KaspaEscrow)
        .filter(KaspaEscrow.id == data.escrow_id, KaspaEscrow.evaluation_id.in_(eval_ids))
        .first()
    )
    if not escrow:
        raise HTTPException(status_code=404, detail="Escrow not found")

    verification = await verify_milestone(data.report_text, data.promised_deliverables)

    record_agent_payment(
        db,
        organization_id=user.organization_id,
        evaluation_id=escrow.evaluation_id,
        agent_name="argos-milestone",
        action="verify_milestone",
        proposal_id=escrow.grantee_proposal_id,
    )

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


@router.post("/{submission_id}/approve")
async def approve_milestone(
    submission_id: str,
    note: str = "",
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    eval_ids = org_evaluation_ids(db, user.organization_id)
    submission = (
        db.query(MilestoneSubmission).filter(MilestoneSubmission.id == submission_id).first()
    )
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    escrow = (
        db.query(KaspaEscrow)
        .filter(
            KaspaEscrow.id == submission.escrow_id,
            KaspaEscrow.evaluation_id.in_(eval_ids),
        )
        .first()
    )
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
        "explorer_tx_url": explorer_tx_url(tx_hash),
    }
