import os
import sys

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault("DATABASE_URL", "sqlite:///./test_argos.db")
os.environ["JWT_SECRET"] = "test-jwt-secret"

from api.main import app

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    from api.database import engine
    from api.models import Base

    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def _register(org: str = "Judge Org A", email: str = "judge@example.com") -> dict:
    r = client.post(
        "/api/auth/register",
        json={
            "email": email,
            "password": "securepass123",
            "organization_name": org,
            "full_name": "Test Judge",
        },
    )
    assert r.status_code == 200, r.text
    return r.json()


def _auth_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200


def test_register_login_isolated_tenants():
    a = _register("Tenant Alpha", "alpha@test.org")
    b = _register("Tenant Beta", "beta@test.org")

    assert a["user"]["organization_id"] != b["user"]["organization_id"]
    assert "verification_code" in a

    login_r = client.post(
        "/api/auth/login",
        json={"email": "alpha@test.org", "password": "securepass123"},
    )
    assert login_r.status_code == 200
    assert login_r.json()["access_token"]


def test_tenant_data_isolation():
    a = _register("Isolation Org A", "iso-a@test.org")
    b = _register("Isolation Org B", "iso-b@test.org")
    headers_a = _auth_headers(a["access_token"])
    headers_b = _auth_headers(b["access_token"])

    r_a = client.post(
        "/api/evaluations/",
        json={
            "title": "Round A",
            "rubric": {"technical": 30, "impact": 40, "team": 30},
        },
        headers=headers_a,
    )
    assert r_a.status_code == 200

    list_b = client.get("/api/evaluations/", headers=headers_b)
    assert list_b.status_code == 200
    assert len(list_b.json()["evaluations"]) == 0

    list_a = client.get("/api/evaluations/", headers=headers_a)
    assert len(list_a.json()["evaluations"]) == 1


def test_verify_email():
    data = _register("Verify Org", "verify@test.org")
    headers = _auth_headers(data["access_token"])
    code = data["verification_code"]

    me_before = client.get("/api/auth/me", headers=headers)
    assert me_before.json()["email_verified"] is False

    v = client.post("/api/auth/verify-email", json={"code": code}, headers=headers)
    assert v.status_code == 200

    me_after = client.get("/api/auth/me", headers=headers)
    assert me_after.json()["email_verified"] is True
    assert me_after.json()["email"] == "verify@test.org"


def test_unauthenticated_blocked():
    r = client.get("/api/evaluations")
    assert r.status_code == 401


def test_evaluations_no_trailing_slash_redirect():
    """Proxied clients call /api/evaluations — must not 307 to http:// backend IP."""
    data = _register("Slash Org", "slash@test.org")
    headers = _auth_headers(data["access_token"])
    r = client.get("/api/evaluations", headers=headers)
    assert r.status_code == 200, r.text
    assert r.headers.get("location") is None


def test_run_requires_openai(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    data = _register("OpenAI Org", "openai@test.org")
    headers = _auth_headers(data["access_token"])
    r = client.post(
        "/api/evaluations/",
        json={"title": "Run Test", "rubric": {"technical": 30, "impact": 40, "team": 30}},
        headers=headers,
    )
    eval_id = r.json()["id"]
    run_r = client.post(f"/api/evaluations/{eval_id}/run", headers=headers)
    assert run_r.status_code == 503
