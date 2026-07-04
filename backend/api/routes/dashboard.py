"""Live dashboard aggregates and activity feed."""

from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.database import get_db
from api.deps import CurrentUser, get_current_user, org_evaluation_ids
from api.json_utils import loads
from api.models import Approval, Evaluation, KaspaEscrow, MilestoneSubmission, Proposal

router = APIRouter()


def _flagged_count(proposal: Proposal) -> int:
    flags = loads(proposal.red_flags, [])
    return len(flags) if isinstance(flags, list) else 0


@router.get("/stats")
def dashboard_stats(
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    eval_ids = org_evaluation_ids(db, user.organization_id)
    evaluations = (
        db.query(Evaluation)
        .filter(Evaluation.organization_id == user.organization_id)
        .order_by(Evaluation.created_at.desc())
        .all()
    )
    proposals = (
        db.query(Proposal).filter(Proposal.evaluation_id.in_(eval_ids)).all()
        if eval_ids
        else []
    )
    escrows = (
        db.query(KaspaEscrow).filter(KaspaEscrow.evaluation_id.in_(eval_ids)).all()
        if eval_ids
        else []
    )

    active_rounds = sum(1 for e in evaluations if e.status != "complete")
    total_proposals = len(proposals)
    flagged = sum(_flagged_count(p) for p in proposals)
    pending = sum(1 for p in proposals if p.status == "pending")
    complete = sum(1 for p in proposals if p.status == "complete")

    grant_pool = sum(e.grant_amount_kas or 0 for e in evaluations)
    escrow_managed = sum(e.total_kas for e in escrows)
    escrow_released = 0.0
    for escrow in escrows:
        for m in loads(escrow.milestones, []):
            if m.get("status") == "released":
                escrow_released += m.get("kas_amount", 0)

    # Proposals evaluated per week (last 12 weeks)
    now = datetime.utcnow()
    series: list[int] = []
    for week in range(11, -1, -1):
        start = now - timedelta(weeks=week + 1)
        end = now - timedelta(weeks=week)
        count = sum(
            1
            for p in proposals
            if p.evaluated_at and start <= p.evaluated_at < end
        )
        series.append(count)

    rounds = []
    for e in evaluations[:10]:
        ev_proposals = [p for p in proposals if p.evaluation_id == e.id]
        flagged_n = sum(_flagged_count(p) for p in ev_proposals)
        approved = sum(
            1
            for p in ev_proposals
            if p.status == "complete" and _flagged_count(p) == 0
        )
        rounds.append(
            {
                "id": e.id,
                "title": e.title,
                "description": e.description or "",
                "status": e.status,
                "proposal_count": len(ev_proposals),
                "flagged_count": flagged_n,
                "approved_count": approved,
                "grant_amount_kas": e.grant_amount_kas or 0,
                "created_at": e.created_at.isoformat() if e.created_at else None,
                "rubric": loads(e.rubric),
            }
        )

    return {
        "active_rounds": active_rounds,
        "total_proposals": total_proposals,
        "pending_proposals": pending,
        "complete_proposals": complete,
        "flagged_proposals": flagged,
        "grant_pool_kas": grant_pool,
        "escrow_managed_kas": escrow_managed,
        "escrow_released_kas": escrow_released,
        "evaluations_weekly": series,
        "rounds": rounds,
    }


@router.get("/activity")
def dashboard_activity(
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 20,
):
    eval_ids = org_evaluation_ids(db, user.organization_id)
    if not eval_ids:
        return {"activity": []}

    events: list[dict] = []

    for sub in (
        db.query(MilestoneSubmission)
        .join(KaspaEscrow, MilestoneSubmission.escrow_id == KaspaEscrow.id)
        .filter(
            KaspaEscrow.evaluation_id.in_(eval_ids),
            MilestoneSubmission.release_tx_hash.isnot(None),
        )
        .order_by(MilestoneSubmission.verified_at.desc())
        .limit(limit)
        .all()
    ):
        events.append(
            {
                "type": "milestone_released",
                "text": f"Milestone M{sub.milestone_index + 1} released — {sub.kas_released or 0} KAS",
                "time": (sub.verified_at or sub.submitted_at).isoformat(),
                "tone": "approve",
            }
        )

    for approval in (
        db.query(Approval)
        .join(Proposal, Approval.proposal_id == Proposal.id)
        .filter(Proposal.evaluation_id.in_(eval_ids))
        .order_by(Approval.created_at.desc())
        .limit(limit)
        .all()
    ):
        tone = "flag" if approval.action == "override" else "approve"
        events.append(
            {
                "type": approval.action,
                "text": f"{approval.action.title()} on {approval.dimension or 'score'} — proposal {approval.proposal_id[:8]}…",
                "time": approval.created_at.isoformat(),
                "tone": tone,
            }
        )

    for ev in (
        db.query(Evaluation)
        .filter(Evaluation.organization_id == user.organization_id)
        .order_by(Evaluation.created_at.desc())
        .limit(5)
        .all()
    ):
        events.append(
            {
                "type": "evaluation_created",
                "text": f"Round created: {ev.title}",
                "time": ev.created_at.isoformat() if ev.created_at else datetime.utcnow().isoformat(),
                "tone": "neutral",
            }
        )

    for p in (
        db.query(Proposal)
        .filter(Proposal.evaluation_id.in_(eval_ids), Proposal.status == "complete")
        .order_by(Proposal.evaluated_at.desc())
        .limit(5)
        .all()
    ):
        flags = _flagged_count(p)
        if flags:
            events.append(
                {
                    "type": "proposal_flagged",
                    "text": f"Flagged: {p.title} — {flags} red flag(s)",
                    "time": p.evaluated_at.isoformat() if p.evaluated_at else p.created_at.isoformat(),
                    "tone": "flag",
                }
            )

    events.sort(key=lambda e: e["time"], reverse=True)
    return {"activity": events[:limit]}
