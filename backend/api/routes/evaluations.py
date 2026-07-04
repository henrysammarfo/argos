import asyncio
import logging
import os
from datetime import datetime

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from sqlalchemy import func
from sqlalchemy.orm import Session

from api.config import EVAL_CONCURRENCY
from api.deps import CurrentUser, get_current_user, get_evaluation_for_org
from api.database import SessionLocal, get_db
from api.json_utils import dumps, loads
from api.limiter import limiter
from api.models import Evaluation, Proposal
from api.pagination import paginate_query, pagination_meta
from api.schemas import EvaluationCreate
from services.claude_evaluator import (
    evaluate_impact,
    evaluate_team,
    evaluate_technical_merit,
)
from services.proposal_reader import truncate_for_evaluation
from services.scoring import collect_red_flags, compute_weighted_score

logger = logging.getLogger(__name__)
router = APIRouter()


def _eval_to_response(e: Evaluation) -> dict:
    return {
        "id": e.id,
        "title": e.title,
        "description": e.description,
        "rubric": loads(e.rubric),
        "grant_amount_kas": e.grant_amount_kas,
        "milestones": loads(e.milestones, []),
        "status": e.status,
        "created_at": e.created_at.isoformat() if e.created_at else None,
    }


def _flagged_from_red_flags(red_flags: str | None) -> int:
    flags = loads(red_flags, [])
    return len(flags) if isinstance(flags, list) else 0


@router.get("/")
def list_evaluations(
    limit: int = 50,
    offset: int = 0,
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    base = (
        db.query(Evaluation)
        .filter(Evaluation.organization_id == user.organization_id)
        .order_by(Evaluation.created_at.desc())
    )
    evals, total = paginate_query(base, limit, offset)
    eval_ids = [e.id for e in evals]

    counts: dict[str, tuple[int, int]] = {}
    if eval_ids:
        for row in (
            db.query(
                Proposal.evaluation_id,
                func.count(Proposal.id),
            )
            .filter(Proposal.evaluation_id.in_(eval_ids))
            .group_by(Proposal.evaluation_id)
            .all()
        ):
            counts[row[0]] = (row[1], 0)
        for row in (
            db.query(Proposal.evaluation_id, Proposal.red_flags)
            .filter(Proposal.evaluation_id.in_(eval_ids))
            .all()
        ):
            ev_id = row[0]
            if ev_id in counts:
                proposal_count, flagged = counts[ev_id]
                counts[ev_id] = (proposal_count, flagged + _flagged_from_red_flags(row[1]))

    result = []
    for e in evals:
        proposal_count, flagged = counts.get(e.id, (0, 0))
        result.append(
            {
                **_eval_to_response(e),
                "proposal_count": proposal_count,
                "flagged_count": flagged,
            }
        )
    return {"evaluations": result, "pagination": pagination_meta(total, limit, offset)}


@router.post("/")
async def create_evaluation(
    data: EvaluationCreate,
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    evaluation = Evaluation(
        organization_id=user.organization_id,
        title=data.title,
        description=data.description,
        rubric=dumps(data.rubric),
        grant_amount_kas=data.grant_amount_kas,
        milestones=dumps(data.milestones or []),
    )
    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)
    return {"id": evaluation.id, "status": "created"}


@router.get("/{evaluation_id}")
def get_evaluation(
    evaluation_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    evaluation = get_evaluation_for_org(db, evaluation_id, user.organization_id)
    return _eval_to_response(evaluation)


@router.post("/{evaluation_id}/run")
@limiter.limit("10/hour")
async def run_evaluation(
    evaluation_id: str,
    request: Request,
    background_tasks: BackgroundTasks,
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(
            status_code=503,
            detail="OPENAI_API_KEY is required for live evaluation",
        )

    evaluation = get_evaluation_for_org(db, evaluation_id, user.organization_id)

    if evaluation.status == "running":
        raise HTTPException(status_code=409, detail="Evaluation is already running")

    proposals = (
        db.query(Proposal)
        .filter(
            Proposal.evaluation_id == evaluation_id,
            Proposal.status.in_(["pending", "error"]),
        )
        .all()
    )
    if not proposals:
        raise HTTPException(status_code=400, detail="No pending proposals")

    evaluation.status = "running"
    db.commit()

    rubric = loads(evaluation.rubric)
    background_tasks.add_task(
        _run_evaluation_pipeline,
        evaluation_id=evaluation_id,
        proposal_ids=[p.id for p in proposals],
        rubric=rubric,
    )
    return {"status": "started", "proposal_count": len(proposals)}


async def _run_evaluation_pipeline(
    evaluation_id: str, proposal_ids: list[str], rubric: dict
):
    sem = asyncio.Semaphore(EVAL_CONCURRENCY)

    async def evaluate_one(proposal_id: str):
        async with sem:
            db = SessionLocal()
            try:
                proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()
                if not proposal:
                    return

                proposal.status = "evaluating"
                db.commit()

                text = truncate_for_evaluation(proposal.raw_text or "")

                technical, impact, team = await asyncio.gather(
                    evaluate_technical_merit(text, rubric.get("technical", 30)),
                    evaluate_impact(text, rubric.get("impact", 40)),
                    evaluate_team(text, rubric.get("team", 30)),
                    return_exceptions=True,
                )
                if isinstance(technical, Exception):
                    logger.error("Technical eval failed: %s", technical)
                    raise technical
                if isinstance(impact, Exception):
                    logger.error("Impact eval failed: %s", impact)
                    raise impact
                if isinstance(team, Exception):
                    logger.error("Team eval failed: %s", team)
                    raise team

                total_score = compute_weighted_score(technical, impact, team, rubric)
                all_flags = collect_red_flags(technical, impact, team)

                proposal.technical_scores = dumps(technical)
                proposal.impact_scores = dumps(impact)
                proposal.team_scores = dumps(team)
                proposal.total_score = total_score
                proposal.red_flags = dumps(all_flags)
                proposal.status = "complete"
                proposal.evaluated_at = datetime.utcnow()
                db.commit()
            except Exception as e:
                logger.exception("Evaluation failed for %s: %s", proposal_id, e)
                proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()
                if proposal:
                    proposal.status = "error"
                    db.commit()
            finally:
                db.close()

    await asyncio.gather(*[evaluate_one(pid) for pid in proposal_ids])

    db = SessionLocal()
    try:
        completed = (
            db.query(Proposal)
            .filter(
                Proposal.evaluation_id == evaluation_id,
                Proposal.status == "complete",
            )
            .order_by(Proposal.total_score.desc())
            .all()
        )
        for i, proposal in enumerate(completed):
            proposal.rank = i + 1

        evaluation = db.query(Evaluation).filter(Evaluation.id == evaluation_id).first()
        if evaluation:
            evaluation.status = "active"
        db.commit()
    finally:
        db.close()


@router.get("/{evaluation_id}/status")
def get_evaluation_status(
    evaluation_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    get_evaluation_for_org(db, evaluation_id, user.organization_id)
    rows = (
        db.query(Proposal.status, func.count(Proposal.id))
        .filter(Proposal.evaluation_id == evaluation_id)
        .group_by(Proposal.status)
        .all()
    )
    counts = {status: count for status, count in rows}
    total = sum(counts.values())
    complete = counts.get("complete", 0)
    evaluating = counts.get("evaluating", 0)
    pending = counts.get("pending", 0)
    errors = counts.get("error", 0)

    return {
        "total": total,
        "complete": complete,
        "evaluating": evaluating,
        "pending": pending,
        "errors": errors,
        "progress_pct": round((complete / total * 100) if total > 0 else 0),
        "done": complete + errors == total and total > 0,
    }


@router.get("/{evaluation_id}/results")
def get_evaluation_results(
    evaluation_id: str,
    limit: int = 100,
    offset: int = 0,
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    get_evaluation_for_org(db, evaluation_id, user.organization_id)
    base = (
        db.query(Proposal)
        .filter(Proposal.evaluation_id == evaluation_id, Proposal.status == "complete")
        .order_by(Proposal.rank)
    )
    proposals, total = paginate_query(base, limit, offset)
    return {
        "proposals": [
            {
                "id": p.id,
                "rank": p.rank,
                "title": p.title,
                "total_score": p.total_score,
                "technical_scores": loads(p.technical_scores),
                "impact_scores": loads(p.impact_scores),
                "team_scores": loads(p.team_scores),
                "red_flags": loads(p.red_flags, []),
                "overrides": loads(p.overrides, []),
                "status": p.status,
            }
            for p in proposals
        ],
        "pagination": pagination_meta(total, limit, offset),
    }
