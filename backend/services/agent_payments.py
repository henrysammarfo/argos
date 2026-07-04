"""Record agent evaluation fees for Fetch.ai payment protocol track."""

import os
from sqlalchemy.orm import Session

from api.models import AgentPayment

FET_PER_AGENT_CALL = float(os.getenv("FET_PER_AGENT_CALL", "0.01"))


def record_agent_payment(
    db: Session,
    *,
    organization_id: str,
    evaluation_id: str,
    agent_name: str,
    action: str,
    proposal_id: str | None = None,
    tx_reference: str | None = None,
    fet_amount: float | None = None,
) -> AgentPayment:
    payment = AgentPayment(
        organization_id=organization_id,
        evaluation_id=evaluation_id,
        proposal_id=proposal_id,
        agent_name=agent_name,
        action=action,
        fet_amount=fet_amount if fet_amount is not None else FET_PER_AGENT_CALL,
        tx_reference=tx_reference,
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


def payment_stats(db: Session, organization_id: str) -> dict:
    from sqlalchemy import func

    rows = (
        db.query(
            AgentPayment.agent_name,
            func.count(AgentPayment.id),
            func.coalesce(func.sum(AgentPayment.fet_amount), 0.0),
        )
        .filter(AgentPayment.organization_id == organization_id)
        .group_by(AgentPayment.agent_name)
        .all()
    )
    by_agent = [
        {"agent": r[0], "calls": r[1], "fet_total": float(r[2])}
        for r in rows
    ]
    total_fet = sum(a["fet_total"] for a in by_agent)
    total_calls = sum(a["calls"] for a in by_agent)
    return {
        "total_fet": round(total_fet, 4),
        "total_agent_calls": total_calls,
        "by_agent": by_agent,
    }
