"""Runtime configuration and production validation."""

import os

ENV = os.getenv("ENV", "development").lower()
IS_PRODUCTION = ENV == "production"

DEFAULT_JWT_SECRET = "argos-dev-secret-change-in-production"

# Connection pool defaults tuned for multi-worker API behind a load balancer.
DB_POOL_SIZE = int(os.getenv("DB_POOL_SIZE", "10"))
DB_MAX_OVERFLOW = int(os.getenv("DB_MAX_OVERFLOW", "20"))
DB_POOL_RECYCLE = int(os.getenv("DB_POOL_RECYCLE", "1800"))

# Cap concurrent OpenAI calls per evaluation run.
EVAL_CONCURRENCY = int(os.getenv("EVAL_CONCURRENCY", "5"))

# Gunicorn worker count hint (used in Dockerfile / docs).
WEB_CONCURRENCY = int(os.getenv("WEB_CONCURRENCY", "4"))


def validate_production_config() -> None:
    """Fail fast when production is misconfigured."""
    if not IS_PRODUCTION:
        return

    jwt_secret = os.getenv("JWT_SECRET", DEFAULT_JWT_SECRET)
    if not jwt_secret or jwt_secret == DEFAULT_JWT_SECRET:
        raise RuntimeError("JWT_SECRET must be set to a strong value when ENV=production")

    database_url = os.getenv("DATABASE_URL", "")
    if not database_url or database_url.startswith("sqlite"):
        raise RuntimeError("DATABASE_URL must be PostgreSQL when ENV=production")

    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError("OPENAI_API_KEY is required when ENV=production")


def expose_verification_codes() -> bool:
    """Demo mode: return verification codes in API responses (dev/test only)."""
    return not IS_PRODUCTION
