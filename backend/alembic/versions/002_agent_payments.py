"""Add agent_payments ledger table."""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "002_agent_payments"
down_revision: Union[str, None] = "001_initial"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "agent_payments",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("organization_id", sa.String(), nullable=False),
        sa.Column("evaluation_id", sa.String(), nullable=True),
        sa.Column("proposal_id", sa.String(), nullable=True),
        sa.Column("agent_name", sa.String(), nullable=False),
        sa.Column("action", sa.String(), nullable=False),
        sa.Column("fet_amount", sa.Float(), nullable=True),
        sa.Column("tx_reference", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"]),
        sa.ForeignKeyConstraint(["evaluation_id"], ["evaluations.id"]),
        sa.ForeignKeyConstraint(["proposal_id"], ["proposals.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_agent_payments_org_created",
        "agent_payments",
        ["organization_id", "created_at"],
    )


def downgrade() -> None:
    op.drop_index("ix_agent_payments_org_created", table_name="agent_payments")
    op.drop_table("agent_payments")
