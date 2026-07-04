"""Tests for public API and Kaspa covenant metadata."""

import os

os.environ.setdefault("DATABASE_URL", "sqlite:///./test_public.db")
os.environ.setdefault("OPENAI_API_KEY", "test-key")

from fastapi.testclient import TestClient

from api.database import engine
from api.main import app
from api.models import Base

Base.metadata.create_all(bind=engine)

client = TestClient(app)


def test_public_stats():
    r = client.get("/api/public/stats")
    assert r.status_code == 200
    data = r.json()
    assert "active_rounds" in data
    assert "agents_online" in data


def test_public_covenant():
    r = client.get("/api/public/covenant")
    assert r.status_code == 200
    data = r.json()
    assert data["type"] == "silverscript_milestone_covenant"
    assert data["contract"] == "MilestoneEscrow"
    assert len(data["script_sha256"]) == 64
    assert "approve_milestone" in data["entrypoints"]


def test_public_covenant_source():
    r = client.get("/api/public/covenant/source")
    assert r.status_code == 200
    assert "MilestoneEscrow" in r.json()["source"]
