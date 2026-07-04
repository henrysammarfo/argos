from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


class EvaluationCreate(BaseModel):
    title: str
    description: Optional[str] = None
    rubric: dict[str, int] = Field(default={"technical": 30, "impact": 40, "team": 30})
    grant_amount_kas: Optional[float] = None
    milestones: Optional[list[dict[str, Any]]] = None


class EvaluationResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    rubric: dict[str, int]
    grant_amount_kas: Optional[float] = None
    milestones: Optional[list[dict[str, Any]]] = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ProposalCreate(BaseModel):
    evaluation_id: str
    title: str
    source_type: str = "text"
    source: str


class ProposalBatchCreate(BaseModel):
    evaluation_id: str
    proposals: list[ProposalCreate]


class OverrideRequest(BaseModel):
    dimension: str
    new_score: float = Field(ge=1, le=10)
    reason: str
    evaluator: Optional[str] = "reviewer"


class MilestoneSubmissionCreate(BaseModel):
    escrow_id: str
    milestone_index: int
    report_text: str
    report_url: Optional[str] = None
    promised_deliverables: list[str]


class EscrowCreate(BaseModel):
    evaluation_id: str
    winner_proposal_id: str
    grantee_kas_address: str
