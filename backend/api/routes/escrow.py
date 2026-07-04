"""Kaspa milestone escrow routes."""

import os

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.database import get_db
from api.deps import CurrentUser, get_current_user, get_evaluation_for_org, org_evaluation_ids
from api.json_utils import dumps, loads
from api.models import KaspaEscrow
from api.schemas import EscrowCreate
from services.kaspa_escrow import calculate_milestone_amounts, verify_deposit

router = APIRouter()


@router.post("/create")
async def create_escrow(
    data: EscrowCreate,
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    evaluation = get_evaluation_for_org(db, data.evaluation_id, user.organization_id)

    if not evaluation.grant_amount_kas or not evaluation.milestones:
        raise HTTPException(
            status_code=400,
            detail="Evaluation must have grant_amount_kas and milestones set",
        )

    milestones_raw = loads(evaluation.milestones, [])
    milestone_schedule = calculate_milestone_amounts(
        evaluation.grant_amount_kas, milestones_raw
    )
    escrow_address = os.getenv("ESCROW_WALLET_ADDRESS")
    program_admin = os.getenv("PROGRAM_ADMIN_ADDRESS")
    if not escrow_address or not program_admin:
        raise HTTPException(
            status_code=503,
            detail="ESCROW_WALLET_ADDRESS and PROGRAM_ADMIN_ADDRESS must be configured",
        )

    escrow = KaspaEscrow(
        evaluation_id=data.evaluation_id,
        grantee_proposal_id=data.winner_proposal_id,
        total_kas=evaluation.grant_amount_kas,
        escrow_address=escrow_address,
        milestones=dumps(milestone_schedule),
        grantee_kas_address=data.grantee_kas_address,
        program_admin_kas_address=program_admin,
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
def list_escrows(
    evaluation_id: str | None = None,
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    eval_ids = org_evaluation_ids(db, user.organization_id)
    if not eval_ids:
        return {"escrows": []}

    q = db.query(KaspaEscrow).filter(KaspaEscrow.evaluation_id.in_(eval_ids))
    if evaluation_id:
        get_evaluation_for_org(db, evaluation_id, user.organization_id)
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
async def get_escrow_status(
    escrow_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    eval_ids = org_evaluation_ids(db, user.organization_id)
    escrow = (
        db.query(KaspaEscrow)
        .filter(KaspaEscrow.id == escrow_id, KaspaEscrow.evaluation_id.in_(eval_ids))
        .first()
    )
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
