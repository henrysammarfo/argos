"""Shared Agentverse mailbox configuration for ARGOS uAgents."""

import os

USE_MAILBOX = os.getenv("USE_AGENTVERSE_MAILBOX", "true").lower() in ("1", "true", "yes")


def agent_kwargs(*, port: int, seed_env: str, default_seed: str, description: str) -> dict:
    """Build Agent() kwargs — mailbox mode for Agentverse hosting."""
    kwargs: dict = {
        "seed": os.getenv(seed_env, default_seed),
        "port": port,
        "description": description,
        "publish_agent_details": True,
    }
    if USE_MAILBOX:
        kwargs["mailbox"] = True
    else:
        kwargs["endpoint"] = [f"http://localhost:{port}/submit"]
    return kwargs
