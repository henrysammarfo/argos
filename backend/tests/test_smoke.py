import os
import sys

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault("DATABASE_URL", "sqlite:///./test_argos.db")
os.environ["ADMIN_API_KEY"] = "test-admin-key"
os.environ["OPENAI_API_KEY"] = ""

from api.main import app

client = TestClient(app)
ADMIN_HEADERS = {"X-Admin-Key": "test-admin-key"}


@pytest.fixture(autouse=True)
def setup_db():
    from api.database import engine
    from api.models import Base

    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_health_db():
    r = client.get("/api/health/db")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_dashboard_stats():
    r = client.get("/api/dashboard/stats")
    assert r.status_code == 200
    data = r.json()
    assert "active_rounds" in data
    assert "evaluations_weekly" in data


def test_create_evaluation():
    r = client.post(
        "/api/evaluations/",
        json={
            "title": "Test Round",
            "rubric": {"technical": 30, "impact": 40, "team": 30},
            "grant_amount_kas": 1000,
        },
        headers=ADMIN_HEADERS,
    )
    assert r.status_code == 200
    assert "id" in r.json()


def test_run_requires_openai():
    r = client.post(
        "/api/evaluations/",
        json={"title": "Run Test", "rubric": {"technical": 30, "impact": 40, "team": 30}},
        headers=ADMIN_HEADERS,
    )
    eval_id = r.json()["id"]
    run_r = client.post(f"/api/evaluations/{eval_id}/run", headers=ADMIN_HEADERS)
    assert run_r.status_code == 503


def test_agents_endpoint():
    r = client.get("/api/agents")
    assert r.status_code == 200
    data = r.json()
    assert "agents" in data
    assert len(data["agents"]) == 6
