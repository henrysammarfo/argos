"""Live dashboard aggregates and activity feed."""

from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func
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

    active_rounds = (
        db.query(func.count(Evaluation.id))
        .filter(Evaluation.organization_id == user.organization_id, Evaluation.status != "complete")
        .scalar()
        or 0
    )
    grant_pool = (
        db.query(func.coalesce(func.sum(Evaluation.grant_amount_kas), 0.0))
        .filter(Evaluation.organization_id == user.organization_id)
        .scalar()
        or 0.0
    )

    if eval_ids:
        total_proposals = (
            db.query(func.count(Proposal.id)).filter(Proposal.evaluation_id.in_(eval_ids)).scalar() or 0
        )
        pending = (
            db.query(func.count(Proposal.id))
            .filter(Proposal.evaluation_id.in_(eval_ids), Proposal.status == "pending")
            .scalar()
            or 0
        )
        complete = (
            db.query(func.count(Proposal.id))
            .filter(Proposal.evaluation_id.in_(eval_ids), Proposal.status == "complete")
            .scalar()
            or 0
        )
        escrow_managed = (
            db.query(func.coalesce(func.sum(KaspaEscrow.total_kas), 0.0))
            .filter(KaspaEscrow.evaluation_id.in_(eval_ids))
            .scalar()
            or 0.0
        )
    else:
        total_proposals = pending = complete = 0
        escrow_managed = 0.0

    # Flagged count: load only red_flags column for completed proposals (bounded)
    flagged = 0
    if eval_ids:
        flag_rows = (
            db.query(Proposal.red_flags)
            .filter(Proposal.evaluation_id.in_(eval_ids), Proposal.status == "complete")
            .limit(5000)
            .all()
        )
        for (red_flags,) in flag_rows:
            flags = loads(red_flags, [])
            if isinstance(flags, list):
                flagged += len(flags)

    escrow_released = 0.0
    if eval_ids:
        for escrow in db.query(KaspaEscrow.milestones).filter(KaspaEscrow.evaluation_id.in_(eval_ids)).all():
            for m in loads(escrow[0], []):
                if m.get("status") == "released":
                    escrow_released += m.get("kas_amount", 0)

    now = datetime.utcnow()
    series: list[int] = []
    if eval_ids:
        for week in range(11, -1, -1):
            start = now - timedelta(weeks=week + 1)
            end = now - timedelta(weeks=week)
            count = (
                db.query(func.count(Proposal.id))
                .filter(
                    Proposal.evaluation_id.in_(eval_ids),
                    Proposal.evaluated_at.isnot(None),
                    Proposal.evaluated_at >= start,
                    Proposal.evaluated_at < end,
                )
                .scalar()
                or 0
            )
            series.append(count)
    else:
        series = [0] * 12

    evaluations = (
        db.query(Evaluation)
        .filter(Evaluation.organization_id == user.organization_id)
        .order_by(Evaluation.created_at.desc())
        .limit(10)
        .all()
    )
    eval_id_list = [e.id for e in evaluations]
    proposal_counts: dict[str, int] = {}
    flagged_counts: dict[str, int] = {}
    if eval_id_list:
        for row in (
            db.query(Proposal.evaluation_id, func.count(Proposal.id))
            .filter(Proposal.evaluation_id.in_(eval_id_list))
            .group_by(Proposal.evaluation_id)
            .all()
        ):
            proposal_counts[row[0]] = row[1]
        for row in (
            db.query(Proposal.evaluation_id, Proposal.red_flags)
            .filter(Proposal.evaluation_id.in_(eval_id_list), Proposal.status == "complete")
            .all()
        ):
            flags = loads(row[1], [])
            if isinstance(flags, list) and flags:
                flagged_counts[row[0]] = flagged_counts.get(row[0], 0) + len(flags)

    rounds = []
    for e in evaluations:
        ev_count = proposal_counts.get(e.id, 0)
        flagged_n = flagged_counts.get(e.id, 0)
        rounds.append(
            {
                "id": e.id,
                "title": e.title,
                "description": e.description or "",
                "status": e.status,
                "proposal_count": ev_count,
                "flagged_count": flagged_n,
                "approved_count": max(ev_count - flagged_n, 0),
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
    limit = min(max(1, limit), 50)
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
