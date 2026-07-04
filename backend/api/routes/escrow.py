"""Kaspa milestone escrow routes."""

import os

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.auth import require_admin
from api.database import get_db
from api.json_utils import dumps, loads
from api.models import Evaluation, KaspaEscrow, Proposal
from api.schemas import EscrowCreate
from services.kaspa_escrow import calculate_milestone_amounts, verify_deposit

router = APIRouter()


@router.post("/create", dependencies=[Depends(require_admin)])
async def create_escrow(data: EscrowCreate, db: Session = Depends(get_db)):
    evaluation = db.query(Evaluation).filter(Evaluation.id == data.evaluation_id).first()
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found")

    if not evaluation.grant_amount_kas or not evaluation.milestones:
        raise HTTPException(
            status_code=400,
            detail="Evaluation must have grant_amount_kas and milestones set",
        )

    milestones_raw = loads(evaluation.milestones, [])
    milestone_schedule = calculate_milestone_amounts(
        evaluation.grant_amount_kas, milestones_raw
    )
    escrow_address = os.getenv("ESCROW_WALLET_ADDRESS", "kaspa:qr...")

    escrow = KaspaEscrow(
        evaluation_id=data.evaluation_id,
        grantee_proposal_id=data.winner_proposal_id,
        total_kas=evaluation.grant_amount_kas,
        escrow_address=escrow_address,
        milestones=dumps(milestone_schedule),
        grantee_kas_address=data.grantee_kas_address,
        program_admin_kas_address=os.getenv("PROGRAM_ADMIN_ADDRESS", "kaspa:qr..."),
    )
    db.add(escrow)
    db.commit()
    db.refresh(escrow)

    return {
        "escrow_id": escrow.id,
        "escrow_address": escrow_address,
        "total_kas": evaluation.grant_amount_kas,
        "milestones": milestone_schedule,
        "instructions": (
            f"Please deposit {evaluation.grant_amount_kas} KAS to {escrow_address} "
            "to activate the escrow."
        ),
    }


@router.get("/")
def list_escrows(evaluation_id: str | None = None, db: Session = Depends(get_db)):
    q = db.query(KaspaEscrow)
    if evaluation_id:
        q = q.filter(KaspaEscrow.evaluation_id == evaluation_id)
    escrows = q.order_by(KaspaEscrow.created_at.desc()).all()
    return {
        "escrows": [
            {
                "id": e.id,
                "evaluation_id": e.evaluation_id,
                "grantee_proposal_id": e.grantee_proposal_id,
                "total_kas": e.total_kas,
                "escrow_address": e.escrow_address,
                "status": e.status,
                "milestones": loads(e.milestones),
            }
            for e in escrows
        ]
    }


@router.get("/{escrow_id}/status")
async def get_escrow_status(escrow_id: str, db: Session = Depends(get_db)):
    escrow = db.query(KaspaEscrow).filter(KaspaEscrow.id == escrow_id).first()
    if not escrow:
        raise HTTPException(status_code=404, detail="Escrow not found")

    deposit_status = await verify_deposit(escrow.escrow_address, escrow.total_kas)

    return {
        "escrow_id": escrow_id,
        "escrow_address": escrow.escrow_address,
        "total_kas": escrow.total_kas,
        "deposit_verified": deposit_status["verified"],
        "actual_balance": deposit_status["actual_balance_kas"],
        "status": escrow.status,
        "milestones": loads(escrow.milestones),
    }
