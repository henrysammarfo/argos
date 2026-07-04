from datetime import datetime
import uuid

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


def gen_id() -> str:
    return str(uuid.uuid4())


class Organization(Base):
    __tablename__ = "organizations"
    __table_args__ = (Index("ix_organizations_slug", "slug"),)

    id = Column(String, primary_key=True, default=gen_id)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="organization")
    evaluations = relationship("Evaluation", back_populates="organization")


class User(Base):
    __tablename__ = "users"
    __table_args__ = (Index("ix_users_organization_id", "organization_id"),)

    id = Column(String, primary_key=True, default=gen_id)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, default="admin")  # admin | reviewer
    email_verified = Column(Boolean, default=False)
    verification_code = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="users")


class Evaluation(Base):
    __tablename__ = "evaluations"
    __table_args__ = (
        Index("ix_evaluations_org_created", "organization_id", "created_at"),
        Index("ix_evaluations_org_status", "organization_id", "status"),
    )

    id = Column(String, primary_key=True, default=gen_id)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    rubric = Column(Text, nullable=False)  # JSON string
    grant_amount_kas = Column(Float, nullable=True)
    milestones = Column(Text, nullable=True)  # JSON string
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="evaluations")
    proposals = relationship("Proposal", back_populates="evaluation")


class Proposal(Base):
    __tablename__ = "proposals"
    __table_args__ = (
        Index("ix_proposals_evaluation_status", "evaluation_id", "status"),
        Index("ix_proposals_evaluation_rank", "evaluation_id", "rank"),
        Index("ix_proposals_evaluated_at", "evaluated_at"),
    )

    id = Column(String, primary_key=True, default=gen_id)
    evaluation_id = Column(String, ForeignKey("evaluations.id"), nullable=False)

    title = Column(String, nullable=False)
    source_type = Column(String)
    source_url = Column(String, nullable=True)
    raw_text = Column(Text, nullable=True)

    team_summary = Column(Text, nullable=True)
    objectives = Column(Text, nullable=True)
    methodology = Column(Text, nullable=True)
    budget_requested = Column(String, nullable=True)
    timeline = Column(String, nullable=True)

    technical_scores = Column(Text, nullable=True)  # JSON
    impact_scores = Column(Text, nullable=True)
    team_scores = Column(Text, nullable=True)
    red_flags = Column(Text, nullable=True)

    overrides = Column(Text, default="[]")

    total_score = Column(Float, nullable=True)
    rank = Column(Integer, nullable=True)
    status = Column(String, default="pending")

    evaluation = relationship("Evaluation", back_populates="proposals")
    created_at = Column(DateTime, default=datetime.utcnow)
    evaluated_at = Column(DateTime, nullable=True)


class Approval(Base):
    __tablename__ = "approvals"
    __table_args__ = (Index("ix_approvals_proposal_created", "proposal_id", "created_at"),)

    id = Column(String, primary_key=True, default=gen_id)
    proposal_id = Column(String, ForeignKey("proposals.id"), nullable=False)
    evaluator = Column(String, nullable=True)
    action = Column(String, nullable=False)
    dimension = Column(String, nullable=True)
    original_score = Column(Float, nullable=True)
    new_score = Column(Float, nullable=True)
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class KaspaEscrow(Base):
    __tablename__ = "kaspa_escrows"
    __table_args__ = (Index("ix_escrows_evaluation_id", "evaluation_id"),)

    id = Column(String, primary_key=True, default=gen_id)
    evaluation_id = Column(String, ForeignKey("evaluations.id"), nullable=False)
    grantee_proposal_id = Column(String, ForeignKey("proposals.id"), nullable=False)

    total_kas = Column(Float, nullable=False)
    escrow_address = Column(String, nullable=True)
    lock_tx_hash = Column(String, nullable=True)

    milestones = Column(Text, nullable=False)  # JSON
    status = Column(String, default="pending")

    grantee_kas_address = Column(String, nullable=False)
    program_admin_kas_address = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)


class MilestoneSubmission(Base):
    __tablename__ = "milestone_submissions"
    __table_args__ = (Index("ix_milestone_submissions_escrow_id", "escrow_id"),)

    id = Column(String, primary_key=True, default=gen_id)
    escrow_id = Column(String, ForeignKey("kaspa_escrows.id"), nullable=False)
    milestone_index = Column(Integer, nullable=False)

    report_text = Column(Text, nullable=False)
    report_url = Column(String, nullable=True)

    ai_verdict = Column(String, nullable=True)
    ai_evidence = Column(Text, nullable=True)
    ai_completion_pct = Column(Float, nullable=True)

    human_approved = Column(Boolean, nullable=True)
    human_note = Column(Text, nullable=True)

    release_tx_hash = Column(String, nullable=True)
    kas_released = Column(Float, nullable=True)

    submitted_at = Column(DateTime, default=datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)
