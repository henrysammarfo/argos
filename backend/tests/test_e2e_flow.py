"""End-to-end API flow: auth → evaluation → escrow → milestone release."""

import os
import sys
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault("DATABASE_URL", "sqlite:///./test_e2e_argos.db")
os.environ["JWT_SECRET"] = "test-jwt-secret-e2e"
os.environ["OPENAI_API_KEY"] = "test-key-for-mocks"
os.environ["ESCROW_WALLET_ADDRESS"] = "kaspatest:qr5pregk2wqvjexy7aedp88mhjdntveruyenslp2geq0fvsc6xk2v28057au6"
os.environ["PROGRAM_ADMIN_ADDRESS"] = "kaspatest:qr5pregk2wqvjexy7aedp88mhjdntveruyenslp2geq0fvsc6xk2v28057au6"
os.environ["KASPA_PRIVATE_KEY"] = "07f93ca8902751e10e383d0a1ea809e5ec2da3203197ac11b1762775bcb657e2"

from api.main import app

client = TestClient(app)

MOCK_STRUCTURE = {
    "title": "Solar Research Grant",
    "team_summary": "Dr. Smith lab",
    "objectives": "Improve panel efficiency",
    "methodology": "Lab trials",
    "budget_requested": "500000 EUR",
    "timeline": "36 months",
}

MOCK_VERIFY = {
    "verdict": "approved",
    "completion_pct": 92.0,
    "evidence": ["Deliverable 1 complete", "Metrics report filed"],
}

FAKE_TX = "e2e_test_tx_hash_abc123def456"


@pytest.fixture(autouse=True)
def setup_db():
    from api.database import engine
    from api.models import Base

    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def _register(email: str = "e2e@judge.org") -> dict:
    r = client.post(
        "/api/auth/register",
        json={
            "email": email,
            "password": "securepass123",
            "organization_name": "E2E Judge Org",
            "full_name": "E2E Judge",
        },
    )
    assert r.status_code == 200, r.text
    return r.json()


def _headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


@patch("api.routes.milestones.release_milestone", new_callable=AsyncMock)
@patch("api.routes.milestones.verify_milestone", new_callable=AsyncMock)
@patch("api.routes.proposals.extract_proposal_structure", new_callable=AsyncMock)
@patch("api.routes.proposals.read_proposal", new_callable=AsyncMock)
def test_full_grant_milestone_e2e(
    mock_read,
    mock_extract,
    mock_verify,
    mock_release,
):
    """Judge signup → round → proposal → escrow → milestone submit → approve release."""
    mock_read.return_value = "Grant proposal full text for solar research program."
    mock_extract.return_value = MOCK_STRUCTURE
    mock_verify.return_value = MOCK_VERIFY
    mock_release.return_value = FAKE_TX

    auth = _register()
    token = auth["access_token"]
    h = _headers(token)

    # Create evaluation round with grant + milestones
    ev = client.post(
        "/api/evaluations/",
        json={
            "title": "Horizon Europe Round 1",
            "description": "Clean energy grants",
            "rubric": {"technical": 30, "impact": 40, "team": 30},
            "grant_amount_kas": 1000.0,
            "milestones": [
                {"name": "Phase 1 — Prototype", "date": "2026-06-01", "percent": 40},
                {"name": "Phase 2 — Pilot", "date": "2026-12-01", "percent": 60},
            ],
        },
        headers=h,
    )
    assert ev.status_code == 200
    eval_id = ev.json()["id"]

    # Ingest proposal (OpenAI structure extraction mocked)
    prop = client.post(
        "/api/proposals/",
        json={
            "evaluation_id": eval_id,
            "title": "Solar Panel Efficiency",
            "source_type": "text",
            "source": "We propose novel perovskite layering...",
        },
        headers=h,
    )
    assert prop.status_code == 200
    proposal_id = prop.json()["id"]

    # Create Kaspa escrow for winner
    escrow = client.post(
        "/api/escrow/create",
        json={
            "evaluation_id": eval_id,
            "winner_proposal_id": proposal_id,
            "grantee_kas_address": "kaspatest:qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",
        },
        headers=h,
    )
    assert escrow.status_code == 200, escrow.text
    body = escrow.json()
    assert body["total_kas"] == 1000.0
    assert len(body["milestones"]) == 2
    assert "deposit" in body["instructions"].lower()
    escrow_id = body["escrow_id"]

    # List escrows (tenant scoped)
    listed = client.get("/api/escrow/", headers=h)
    assert listed.status_code == 200
    assert len(listed.json()["escrows"]) == 1

    # Submit milestone report (AI verification mocked)
    sub = client.post(
        "/api/milestones/submit",
        json={
            "escrow_id": escrow_id,
            "milestone_index": 0,
            "report_text": "Phase 1 prototype delivered with 18% efficiency gain.",
            "promised_deliverables": ["Working prototype", "Test report"],
        },
        headers=h,
    )
    assert sub.status_code == 200, sub.text
    assert sub.json()["ai_verdict"] == "approved"
    submission_id = sub.json()["submission_id"]

    # Human approve → backend signs Kaspa release (mocked — no browser wallet)
    approve = client.post(
        f"/api/milestones/{submission_id}/approve?note=Committee+approved",
        headers=h,
    )
    assert approve.status_code == 200, approve.text
    result = approve.json()
    assert result["approved"] is True
    assert result["release_tx_hash"] == FAKE_TX
    assert result["kas_released"] == 400.0  # 40% of 1000

    mock_release.assert_called_once()

    # Escrow status reflects release
    status = client.get(f"/api/escrow/{escrow_id}/status", headers=h)
    assert status.status_code == 200
    milestones = status.json()["milestones"]
    assert milestones[0]["status"] == "released"
    assert milestones[0]["release_tx"] == FAKE_TX
    assert milestones[1]["status"] == "locked"


@patch("services.kaspa_escrow.get_balance", new_callable=AsyncMock)
def test_escrow_deposit_balance_check(mock_balance):
    """Live-style balance read against Kaspa API (mocked in unit run)."""
    mock_balance.return_value = 1000.0

    auth = _register("balance@test.org")
    h = _headers(auth["access_token"])

    ev = client.post(
        "/api/evaluations/",
        json={
            "title": "Balance Test",
            "rubric": {"technical": 30, "impact": 40, "team": 30},
            "grant_amount_kas": 500.0,
            "milestones": [{"name": "M1", "date": "2026-01-01", "percent": 100}],
        },
        headers=h,
    )
    assert ev.status_code == 200, ev.text
    eval_id = ev.json()["id"]

    with patch("api.routes.proposals.read_proposal", new_callable=AsyncMock) as mr, patch(
        "api.routes.proposals.extract_proposal_structure", new_callable=AsyncMock
    ) as me:
        mr.return_value = "text"
        me.return_value = MOCK_STRUCTURE
        prop = client.post(
            "/api/proposals/",
            json={"evaluation_id": eval_id, "title": "P", "source_type": "text", "source": "x"},
            headers=h,
        )
    assert prop.status_code == 200, prop.text
    pid = prop.json()["id"]

    esc = client.post(
        "/api/escrow/create",
        json={
            "evaluation_id": eval_id,
            "winner_proposal_id": pid,
            "grantee_kas_address": "kaspatest:qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",
        },
        headers=h,
    )
    escrow_id = esc.json()["escrow_id"]

    status = client.get(f"/api/escrow/{escrow_id}/status", headers=h)
    assert status.status_code == 200
    assert status.json()["deposit_verified"] is True
    assert status.json()["actual_balance"] == 1000.0


def test_tenant_cannot_see_other_escrow():
    a = _register("tenant-a@test.org")
    b = _register("tenant-b@test.org")

    h_a = _headers(a["access_token"])
    ev = client.post(
        "/api/evaluations/",
        json={
            "title": "Private Round",
            "rubric": {"technical": 30, "impact": 40, "team": 30},
            "grant_amount_kas": 100.0,
            "milestones": [{"name": "M1", "percent": 100, "date": "2026-01-01"}],
        },
        headers=h_a,
    )
    assert ev.status_code == 200, ev.text
    eval_id = ev.json()["id"]

    with patch("api.routes.proposals.read_proposal", new_callable=AsyncMock) as mr, patch(
        "api.routes.proposals.extract_proposal_structure", new_callable=AsyncMock
    ) as me:
        mr.return_value = "t"
        me.return_value = MOCK_STRUCTURE
        prop = client.post(
            "/api/proposals/",
            json={"evaluation_id": eval_id, "title": "P", "source_type": "text", "source": "x"},
            headers=h_a,
        )
    assert prop.status_code == 200, prop.text
    pid = prop.json()["id"]

    esc = client.post(
        "/api/escrow/create",
        json={
            "evaluation_id": eval_id,
            "winner_proposal_id": pid,
            "grantee_kas_address": "kaspatest:qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",
        },
        headers=h_a,
    )
    assert esc.status_code == 200

    other_list = client.get("/api/escrow/", headers=_headers(b["access_token"]))
    assert other_list.status_code == 200
    assert len(other_list.json()["escrows"]) == 0
