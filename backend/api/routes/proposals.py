import logging
import os
import tempfile
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from api.auth import require_admin
from api.database import get_db
from api.json_utils import dumps
from api.models import Evaluation, Proposal
from api.schemas import ProposalBatchCreate, ProposalCreate
from services.claude_evaluator import extract_proposal_structure
from services.proposal_reader import read_proposal, truncate_for_evaluation

logger = logging.getLogger(__name__)
router = APIRouter()

MAX_UPLOAD_BYTES = 10 * 1024 * 1024


async def _ingest_proposal(
    db: Session,
    evaluation_id: str,
    title: str,
    source_type: str,
    source: str,
) -> Proposal:
    evaluation = db.query(Evaluation).filter(Evaluation.id == evaluation_id).first()
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found")

    raw_text = await read_proposal(source_type, source)
    truncated = truncate_for_evaluation(raw_text)

    structure = {}
    if os.getenv("OPENAI_API_KEY"):
        try:
            structure = await extract_proposal_structure(truncated)
        except Exception as e:
            logger.warning("Structure extraction failed: %s", e)

    proposal = Proposal(
        evaluation_id=evaluation_id,
        title=structure.get("title") or title,
        source_type=source_type,
        source_url=source if source_type == "url" else None,
        raw_text=raw_text,
        team_summary=structure.get("team_summary"),
        objectives=structure.get("objectives"),
        methodology=structure.get("methodology"),
        budget_requested=structure.get("budget_requested"),
        timeline=structure.get("timeline"),
        status="pending",
    )
    db.add(proposal)
    db.commit()
    db.refresh(proposal)
    return proposal


@router.post("/", dependencies=[Depends(require_admin)])
async def create_proposal(data: ProposalCreate, db: Session = Depends(get_db)):
    proposal = await _ingest_proposal(
        db, data.evaluation_id, data.title, data.source_type, data.source
    )
    return {"id": proposal.id, "status": "created"}


@router.post("/batch", dependencies=[Depends(require_admin)])
async def create_proposals_batch(data: ProposalBatchCreate, db: Session = Depends(get_db)):
    ids = []
    for p in data.proposals:
        proposal = await _ingest_proposal(
            db, data.evaluation_id, p.title, p.source_type, p.source
        )
        ids.append(proposal.id)
    return {"proposal_ids": ids}


@router.post("/upload", dependencies=[Depends(require_admin)])
async def upload_proposal_pdf(
    evaluation_id: str = Form(...),
    title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(status_code=400, detail="Only PDF files accepted")

    contents = await file.read()
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail="File exceeds 10 MB limit")

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        proposal = await _ingest_proposal(db, evaluation_id, title, "pdf", tmp_path)
    finally:
        Path(tmp_path).unlink(missing_ok=True)

    return {"id": proposal.id, "status": "created"}


@router.get("/")
def list_proposals(evaluation_id: str, db: Session = Depends(get_db)):
    proposals = (
        db.query(Proposal)
        .filter(Proposal.evaluation_id == evaluation_id)
        .order_by(Proposal.created_at.desc())
        .all()
    )
    return {
        "proposals": [
            {
                "id": p.id,
                "evaluation_id": p.evaluation_id,
                "title": p.title,
                "status": p.status,
                "total_score": p.total_score,
                "rank": p.rank,
                "created_at": p.created_at.isoformat() if p.created_at else None,
            }
            for p in proposals
        ]
    }


@router.get("/{proposal_id}")
def get_proposal(proposal_id: str, db: Session = Depends(get_db)):
    p = db.query(Proposal).filter(Proposal.id == proposal_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Proposal not found")
    from api.json_utils import loads

    return {
        "id": p.id,
        "evaluation_id": p.evaluation_id,
        "title": p.title,
        "source_type": p.source_type,
        "raw_text": p.raw_text,
        "team_summary": p.team_summary,
        "objectives": p.objectives,
        "methodology": p.methodology,
        "budget_requested": p.budget_requested,
        "timeline": p.timeline,
        "technical_scores": loads(p.technical_scores),
        "impact_scores": loads(p.impact_scores),
        "team_scores": loads(p.team_scores),
        "red_flags": loads(p.red_flags, []),
        "overrides": loads(p.overrides, []),
        "total_score": p.total_score,
        "rank": p.rank,
        "status": p.status,
        "evaluated_at": p.evaluated_at.isoformat() if p.evaluated_at else None,
    }
