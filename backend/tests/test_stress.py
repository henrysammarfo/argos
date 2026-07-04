"""Light stress / concurrency tests for launch readiness."""

import os
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault("DATABASE_URL", "sqlite:///./test_stress_argos.db")
os.environ["JWT_SECRET"] = "test-jwt-stress"

from api.main import app

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    from api.database import engine
    from api.models import Base

    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_health_concurrent_100():
    """100 parallel health checks should all succeed."""
    def hit():
        r = client.get("/api/health")
        return r.status_code

    with ThreadPoolExecutor(max_workers=20) as pool:
        results = list(pool.map(lambda _: hit(), range(100)))
    assert all(c == 200 for c in results)


def test_register_many_unique_tenants():
    """20 concurrent signups — each gets isolated org."""
    def register(i: int):
        r = client.post(
            "/api/auth/register",
            json={
                "email": f"stress{i}@loadtest.org",
                "password": "securepass123",
                "organization_name": f"Stress Org {i}",
            },
        )
        return r.status_code, r.json().get("user", {}).get("organization_id")

    with ThreadPoolExecutor(max_workers=10) as pool:
        futures = [pool.submit(register, i) for i in range(20)]
        outcomes = [f.result() for f in as_completed(futures)]

    assert all(code == 200 for code, _ in outcomes)
    org_ids = {org for _, org in outcomes}
    assert len(org_ids) == 20


def test_authenticated_list_under_load():
    """One tenant, 30 parallel evaluation list requests."""
    reg = client.post(
        "/api/auth/register",
        json={
            "email": "loadlist@test.org",
            "password": "securepass123",
            "organization_name": "Load List Org",
        },
    )
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    for i in range(5):
        client.post(
            "/api/evaluations/",
            json={"title": f"Round {i}", "rubric": {"technical": 30, "impact": 40, "team": 30}},
            headers=headers,
        )

    def list_evals():
        r = client.get("/api/evaluations/?limit=50", headers=headers)
        return r.status_code, len(r.json().get("evaluations", []))

    with ThreadPoolExecutor(max_workers=15) as pool:
        results = list(pool.map(lambda _: list_evals(), range(30)))

    assert all(code == 200 for code, _ in results)
    assert all(count == 5 for _, count in results)


def test_ready_endpoint():
    r = client.get("/api/health/ready")
    assert r.status_code == 200
    assert r.json()["status"] == "ready"
