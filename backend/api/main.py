import logging
import os
import sys
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from sqlalchemy import text
from sqlalchemy.orm import Session

load_dotenv()

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.database import engine, get_db
from api.models import Base
from api.routes import approvals, auth_routes, dashboard, escrow, evaluations, milestones, proposals

logging.basicConfig(
    level=logging.INFO,
    format='{"time":"%(asctime)s","level":"%(levelname)s","msg":"%(message)s"}',
)
logger = logging.getLogger("argos")

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    logger.info("ARGOS API started")
    yield
    logger.info("ARGOS API shutting down")


app = FastAPI(
    title="ARGOS API",
    description="AI Grant & Procurement Evaluation System",
    version="1.0.0",
    lifespan=lifespan,
    redirect_slashes=True,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_id_middleware(request: Request, call_next):
    response = await call_next(request)
    return response


app.include_router(auth_routes.router, prefix="/api/auth", tags=["auth"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(evaluations.router, prefix="/api/evaluations", tags=["evaluations"])
app.include_router(proposals.router, prefix="/api/proposals", tags=["proposals"])
app.include_router(approvals.router, prefix="/api/approvals", tags=["approvals"])
app.include_router(escrow.router, prefix="/api/escrow", tags=["escrow"])
app.include_router(milestones.router, prefix="/api/milestones", tags=["milestones"])


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "ARGOS"}


@app.get("/api/health/db")
async def health_db():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return JSONResponse(status_code=503, content={"status": "error", "detail": str(e)})


@app.get("/api/health/kaspa")
async def health_kaspa():
    import httpx

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(f"{os.getenv('KASPA_NODE_URL', 'https://api.kaspa.org')}/info/kaspad")
            r.raise_for_status()
        return {"status": "ok", "kaspa": "reachable"}
    except Exception as e:
        return JSONResponse(status_code=503, content={"status": "error", "detail": str(e)})


@app.get("/api/agents")
def agent_addresses(db: Session = Depends(get_db)):
    from api.models import Proposal

    complete = db.query(Proposal).filter(Proposal.status == "complete").count()
    pending = db.query(Proposal).filter(Proposal.status == "pending").count()

    catalog = [
        ("orchestrator", "ORCHESTRATOR_ADDRESS", "argos-orchestrator", "Orchestrator", "Coordinates evaluation pipeline across specialist agents."),
        ("intake", "INTAKE_ADDRESS", "argos-intake", "Intake", "Ingests proposals from PDF, URL, or text and extracts structure."),
        ("technical", "TECHNICAL_ADDRESS", "argos-technical", "Technical", "Scores innovation, feasibility, and methodology."),
        ("impact", "IMPACT_ADDRESS", "argos-impact", "Impact", "Scores scale, sustainability, and counterfactual impact."),
        ("team", "TEAM_ADDRESS", "argos-team", "Team", "Scores track record, expertise, and risk management."),
        ("milestone", "MILESTONE_ADDRESS", "argos-milestone", "Milestone", "Verifies milestone deliverables before Kaspa release."),
    ]

    agents = []
    online = 0
    for key, env_key, name, role, description in catalog:
        addr = os.getenv(env_key, "")
        if addr:
            online += 1
        handled = complete if key in ("technical", "impact", "team", "orchestrator", "milestone") else pending
        agents.append(
            {
                "id": key,
                "name": name,
                "role": role,
                "description": description,
                "address": addr,
                "status": "online" if addr else "offline",
                "proposals_handled": handled,
            }
        )

    return {
        "agents": agents,
        "online_count": online,
        "proposals_complete": complete,
        "proposals_pending": pending,
    }
