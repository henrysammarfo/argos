"""Shared pytest configuration."""

import os

# Disable auth rate limits during test runs (stress tests register many users).
os.environ.setdefault("ARGOS_DISABLE_RATE_LIMIT", "1")
os.environ.setdefault("OPENAI_API_KEY", "test-mock-key")
os.environ.setdefault("ESCROW_WALLET_ADDRESS", "kaspatest:qr5pregk2wqvjexy7aedp88mhjdntveruyenslp2geq0fvsc6xk2v28057au6")
os.environ.setdefault("PROGRAM_ADMIN_ADDRESS", "kaspatest:qr5pregk2wqvjexy7aedp88mhjdntveruyenslp2geq0fvsc6xk2v28057au6")

import pytest


@pytest.fixture(autouse=True)
def disable_rate_limits():
    from api.limiter import limiter

    prev = limiter.enabled
    if os.getenv("ARGOS_DISABLE_RATE_LIMIT") == "1":
        limiter.enabled = False
    yield
    limiter.enabled = prev
