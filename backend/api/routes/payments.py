"""Agent payment ledger — Fetch.ai track."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.database import get_db
from api.deps import CurrentUser, get_current_user
from services.agent_payments import payment_stats

router = APIRouter()


@router.get("/stats")
def get_payment_stats(
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return payment_stats(db, user.organization_id)


@router.get("/ledger")
def get_payment_ledger(
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 50,
):
    from api.models import AgentPayment

    limit = min(max(1, limit), 100)
    rows = (
        db.query(AgentPayment)
        .filter(AgentPayment.organization_id == user.organization_id)
        .order_by(AgentPayment.created_at.desc())
        .limit(limit)
        .all()
    )
    return {
        "payments": [
            {
                "id": p.id,
                "agent_name": p.agent_name,
                "action": p.action,
                "fet_amount": p.fet_amount,
                "evaluation_id": p.evaluation_id,
                "proposal_id": p.proposal_id,
                "tx_reference": p.tx_reference,
                "created_at": p.created_at.isoformat() if p.created_at else None,
            }
            for p in rows
        ]
    }
