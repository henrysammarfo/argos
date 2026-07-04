"""Initial ARGOS schema — organizations, users, evaluations, proposals, escrow."""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "organizations",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("slug", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index("ix_organizations_slug", "organizations", ["slug"])

    op.create_table(
        "users",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("organization_id", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("password_hash", sa.String(), nullable=False),
        sa.Column("full_name", sa.String(), nullable=True),
        sa.Column("role", sa.String(), nullable=True),
        sa.Column("email_verified", sa.Boolean(), nullable=True),
        sa.Column("verification_code", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_organization_id", "users", ["organization_id"])

    op.create_table(
        "evaluations",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("organization_id", sa.String(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("rubric", sa.Text(), nullable=False),
        sa.Column("grant_amount_kas", sa.Float(), nullable=True),
        sa.Column("milestones", sa.Text(), nullable=True),
        sa.Column("status", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_evaluations_org_created", "evaluations", ["organization_id", "created_at"])
    op.create_index("ix_evaluations_org_status", "evaluations", ["organization_id", "status"])

    op.create_table(
        "proposals",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("evaluation_id", sa.String(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("source_type", sa.String(), nullable=True),
        sa.Column("source_url", sa.String(), nullable=True),
        sa.Column("raw_text", sa.Text(), nullable=True),
        sa.Column("team_summary", sa.Text(), nullable=True),
        sa.Column("objectives", sa.Text(), nullable=True),
        sa.Column("methodology", sa.Text(), nullable=True),
        sa.Column("budget_requested", sa.String(), nullable=True),
        sa.Column("timeline", sa.String(), nullable=True),
        sa.Column("technical_scores", sa.Text(), nullable=True),
        sa.Column("impact_scores", sa.Text(), nullable=True),
        sa.Column("team_scores", sa.Text(), nullable=True),
        sa.Column("red_flags", sa.Text(), nullable=True),
        sa.Column("overrides", sa.Text(), nullable=True),
        sa.Column("total_score", sa.Float(), nullable=True),
        sa.Column("rank", sa.Integer(), nullable=True),
        sa.Column("status", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("evaluated_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["evaluation_id"], ["evaluations.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_proposals_evaluation_status", "proposals", ["evaluation_id", "status"])
    op.create_index("ix_proposals_evaluation_rank", "proposals", ["evaluation_id", "rank"])
    op.create_index("ix_proposals_evaluated_at", "proposals", ["evaluated_at"])

    op.create_table(
        "approvals",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("proposal_id", sa.String(), nullable=False),
        sa.Column("evaluator", sa.String(), nullable=True),
        sa.Column("action", sa.String(), nullable=False),
        sa.Column("dimension", sa.String(), nullable=True),
        sa.Column("original_score", sa.Float(), nullable=True),
        sa.Column("new_score", sa.Float(), nullable=True),
        sa.Column("reason", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["proposal_id"], ["proposals.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_approvals_proposal_created", "approvals", ["proposal_id", "created_at"])

    op.create_table(
        "kaspa_escrows",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("evaluation_id", sa.String(), nullable=False),
        sa.Column("grantee_proposal_id", sa.String(), nullable=False),
        sa.Column("total_kas", sa.Float(), nullable=False),
        sa.Column("escrow_address", sa.String(), nullable=True),
        sa.Column("lock_tx_hash", sa.String(), nullable=True),
        sa.Column("milestones", sa.Text(), nullable=False),
        sa.Column("status", sa.String(), nullable=True),
        sa.Column("grantee_kas_address", sa.String(), nullable=False),
        sa.Column("program_admin_kas_address", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["evaluation_id"], ["evaluations.id"]),
        sa.ForeignKeyConstraint(["grantee_proposal_id"], ["proposals.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_escrows_evaluation_id", "kaspa_escrows", ["evaluation_id"])

    op.create_table(
        "milestone_submissions",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("escrow_id", sa.String(), nullable=False),
        sa.Column("milestone_index", sa.Integer(), nullable=False),
        sa.Column("report_text", sa.Text(), nullable=False),
        sa.Column("report_url", sa.String(), nullable=True),
        sa.Column("ai_verdict", sa.String(), nullable=True),
        sa.Column("ai_evidence", sa.Text(), nullable=True),
        sa.Column("ai_completion_pct", sa.Float(), nullable=True),
        sa.Column("human_approved", sa.Boolean(), nullable=True),
        sa.Column("human_note", sa.Text(), nullable=True),
        sa.Column("release_tx_hash", sa.String(), nullable=True),
        sa.Column("kas_released", sa.Float(), nullable=True),
        sa.Column("submitted_at", sa.DateTime(), nullable=True),
        sa.Column("verified_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["escrow_id"], ["kaspa_escrows.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_milestone_submissions_escrow_id", "milestone_submissions", ["escrow_id"])


def downgrade() -> None:
    op.drop_table("milestone_submissions")
    op.drop_table("kaspa_escrows")
    op.drop_table("approvals")
    op.drop_table("proposals")
    op.drop_table("evaluations")
    op.drop_table("users")
    op.drop_table("organizations")
