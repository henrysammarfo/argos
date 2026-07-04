import logging
import os
import sys
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from sqlalchemy import text

load_dotenv()

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.database import engine, get_db
from api.models import Base
from api.routes import approvals, escrow, evaluations, milestones, proposals

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
    redirect_slashes=False,
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
async def agent_addresses():
    return {
        "orchestrator": os.getenv("ORCHESTRATOR_ADDRESS", ""),
        "intake": os.getenv("INTAKE_ADDRESS", ""),
        "technical": os.getenv("TECHNICAL_ADDRESS", ""),
        "impact": os.getenv("IMPACT_ADDRESS", ""),
        "team": os.getenv("TEAM_ADDRESS", ""),
        "milestone": os.getenv("MILESTONE_ADDRESS", ""),
    }
