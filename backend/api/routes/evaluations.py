import asyncio
import json
import logging
import os
from datetime import datetime

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session

from api.auth import require_admin
from api.database import SessionLocal, get_db
from api.json_utils import dumps, loads
from api.models import Evaluation, Proposal
from api.schemas import EvaluationCreate, EvaluationResponse
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


@router.get("/")
def list_evaluations(db: Session = Depends(get_db)):
    evals = db.query(Evaluation).order_by(Evaluation.created_at.desc()).all()
    return {"evaluations": [_eval_to_response(e) for e in evals]}


@router.post("/", dependencies=[Depends(require_admin)])
async def create_evaluation(data: EvaluationCreate, db: Session = Depends(get_db)):
    evaluation = Evaluation(
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
def get_evaluation(evaluation_id: str, db: Session = Depends(get_db)):
    evaluation = db.query(Evaluation).filter(Evaluation.id == evaluation_id).first()
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    return _eval_to_response(evaluation)


@router.post("/{evaluation_id}/run", dependencies=[Depends(require_admin)])
async def run_evaluation(
    evaluation_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    evaluation = db.query(Evaluation).filter(Evaluation.id == evaluation_id).first()
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found")

    proposals = (
        db.query(Proposal)
        .filter(Proposal.evaluation_id == evaluation_id, Proposal.status == "pending")
        .all()
    )
    if not proposals:
        raise HTTPException(status_code=400, detail="No pending proposals")

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
    async def evaluate_one(proposal_id: str):
        db = SessionLocal()
        try:
            proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()
            if not proposal:
                return

            proposal.status = "evaluating"
            db.commit()

            text = truncate_for_evaluation(proposal.raw_text or "")
            use_mock = not os.getenv("ANTHROPIC_API_KEY")

            if use_mock:
                technical = _mock_technical()
                impact = _mock_impact()
                team = _mock_team()
            else:
                technical, impact, team = await asyncio.gather(
                    evaluate_technical_merit(text, rubric.get("technical", 30)),
                    evaluate_impact(text, rubric.get("impact", 40)),
                    evaluate_team(text, rubric.get("team", 30)),
                    return_exceptions=True,
                )
                if isinstance(technical, Exception):
                    logger.error("Technical eval failed: %s", technical)
                    technical = {}
                if isinstance(impact, Exception):
                    logger.error("Impact eval failed: %s", impact)
                    impact = {}
                if isinstance(team, Exception):
                    logger.error("Team eval failed: %s", team)
                    team = {}

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
        db.commit()
    finally:
        db.close()


def _mock_technical() -> dict:
    return {
        "innovation": {"score": 7, "reasoning": "Mock evaluation — set ANTHROPIC_API_KEY for live scoring."},
        "feasibility": {"score": 7, "reasoning": "Mock evaluation."},
        "methodology": {"score": 7, "reasoning": "Mock evaluation."},
        "red_flags": [],
    }


def _mock_impact() -> dict:
    return {
        "scale": {"score": 7, "reasoning": "Mock evaluation."},
        "sustainability": {"score": 7, "reasoning": "Mock evaluation."},
        "counterfactual": {"score": 7, "reasoning": "Mock evaluation."},
        "red_flags": [],
    }


def _mock_team() -> dict:
    return {
        "track_record": {"score": 7, "reasoning": "Mock evaluation."},
        "expertise": {"score": 7, "reasoning": "Mock evaluation."},
        "risk_management": {"score": 7, "reasoning": "Mock evaluation."},
        "red_flags": [],
    }


@router.get("/{evaluation_id}/status")
def get_evaluation_status(evaluation_id: str, db: Session = Depends(get_db)):
    proposals = db.query(Proposal).filter(Proposal.evaluation_id == evaluation_id).all()
    total = len(proposals)
    complete = sum(1 for p in proposals if p.status == "complete")
    evaluating = sum(1 for p in proposals if p.status == "evaluating")
    pending = sum(1 for p in proposals if p.status == "pending")
    errors = sum(1 for p in proposals if p.status == "error")

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
def get_evaluation_results(evaluation_id: str, db: Session = Depends(get_db)):
    proposals = (
        db.query(Proposal)
        .filter(Proposal.evaluation_id == evaluation_id, Proposal.status == "complete")
        .order_by(Proposal.rank)
        .all()
    )
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
        ]
    }
