import os
import sys

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault("DATABASE_URL", "sqlite:///./test_argos.db")
os.environ.setdefault("KASPA_SIMULATION", "true")

from api.main import app

client = TestClient(app)


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


def test_create_evaluation():
    r = client.post(
        "/api/evaluations",
        json={
            "title": "Test Round",
            "rubric": {"technical": 30, "impact": 40, "team": 30},
            "grant_amount_kas": 1000,
        },
    )
    assert r.status_code == 200
    assert "id" in r.json()


def test_full_pipeline():
    r = client.post(
        "/api/evaluations",
        json={
            "title": "Pipeline Test",
            "rubric": {"technical": 30, "impact": 40, "team": 30},
        },
    )
    eval_id = r.json()["id"]

    client.post(
        "/api/proposals/batch",
        json={
            "evaluation_id": eval_id,
            "proposals": [
                {
                    "evaluation_id": eval_id,
                    "title": "Test Proposal A",
                    "source_type": "text",
                    "source": "A climate adaptation project with strong team.",
                },
                {
                    "evaluation_id": eval_id,
                    "title": "Test Proposal B",
                    "source_type": "text",
                    "source": "An open-source medical AI framework for NHS.",
                },
            ],
        },
    )

    run_r = client.post(f"/api/evaluations/{eval_id}/run")
    assert run_r.status_code == 200

    import time

    for _ in range(30):
        status = client.get(f"/api/evaluations/{eval_id}/status").json()
        if status["done"]:
            break
        time.sleep(0.5)

    results = client.get(f"/api/evaluations/{eval_id}/results").json()
    assert len(results["proposals"]) >= 1
    assert results["proposals"][0]["total_score"] is not None


def test_agents_endpoint():
    r = client.get("/api/agents")
    assert r.status_code == 200
    assert "orchestrator" in r.json()
