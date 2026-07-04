import logging
import os
import sys
import uuid
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
from starlette.middleware.trustedhost import TrustedHostMiddleware

load_dotenv()

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.config import IS_PRODUCTION, validate_production_config
from api.database import engine, get_db
from api.limiter import limiter
from api.models import Base
from api.routes import approvals, auth_routes, dashboard, escrow, evaluations, milestones, proposals

logging.basicConfig(
    level=logging.INFO,
    format='{"time":"%(asctime)s","level":"%(levelname)s","msg":"%(message)s"}',
)
logger = logging.getLogger("argos")


@asynccontextmanager
async def lifespan(app: FastAPI):
    validate_production_config()
    if not IS_PRODUCTION:
        Base.metadata.create_all(bind=engine)
    logger.info("ARGOS API started (env=%s)", os.getenv("ENV", "development"))
    yield
    logger.info("ARGOS API shutting down")


app = FastAPI(
    title="ARGOS API",
    description="AI Grant & Procurement Evaluation System",
    version="1.0.0",
    lifespan=lifespan,
    redirect_slashes=True,
    docs_url=None if IS_PRODUCTION else "/docs",
    redoc_url=None if IS_PRODUCTION else "/redoc",
    openapi_url=None if IS_PRODUCTION else "/openapi.json",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, lambda r, e: JSONResponse(
    status_code=429,
    content={"detail": "Rate limit exceeded. Please try again later."},
))
app.add_middleware(SlowAPIMiddleware)

trusted_hosts = os.getenv("TRUSTED_HOSTS", "").strip()
if trusted_hosts:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=[h.strip() for h in trusted_hosts.split(",") if h.strip()],
    )

origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins if o.strip()],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
)


@app.middleware("http")
async def request_id_and_security_middleware(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    if IS_PRODUCTION:
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error request_id=%s", getattr(request.state, "request_id", ""))
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


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


@app.get("/api/health/ready")
async def health_ready():
    checks: dict[str, str] = {}
    ok = True

    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        checks["database"] = "ok"
    except Exception:
        checks["database"] = "error"
        ok = False

    if IS_PRODUCTION:
        jwt = os.getenv("JWT_SECRET", "")
        if not jwt or jwt == "argos-dev-secret-change-in-production":
            checks["jwt"] = "error"
            ok = False
        else:
            checks["jwt"] = "ok"
        if not os.getenv("OPENAI_API_KEY"):
            checks["openai"] = "error"
            ok = False
        else:
            checks["openai"] = "ok"

    status_code = 200 if ok else 503
    return JSONResponse(
        status_code=status_code,
        content={"status": "ready" if ok else "not_ready", "checks": checks},
    )


@app.get("/api/health/db")
async def health_db():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception:
        logger.exception("Database health check failed")
        return JSONResponse(status_code=503, content={"status": "error", "database": "unavailable"})


@app.get("/api/health/kaspa")
async def health_kaspa():
    import httpx

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(f"{os.getenv('KASPA_NODE_URL', 'https://api.kaspa.org')}/info/kaspad")
            r.raise_for_status()
        return {"status": "ok", "kaspa": "reachable"}
    except Exception:
        logger.exception("Kaspa health check failed")
        return JSONResponse(status_code=503, content={"status": "error", "kaspa": "unavailable"})


@app.get("/api/agents")
def agent_addresses(db: Session = Depends(get_db)):
    from sqlalchemy import func

    from api.models import Proposal

    complete = db.query(func.count(Proposal.id)).filter(Proposal.status == "complete").scalar() or 0
    pending = db.query(func.count(Proposal.id)).filter(Proposal.status == "pending").scalar() or 0

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
                "address": addr if addr else None,
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
