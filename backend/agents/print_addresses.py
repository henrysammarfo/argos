#!/usr/bin/env python3
"""Print uAgent addresses for .env configuration."""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.orchestrator import orchestrator
from agents.intake_agent import intake_agent
from agents.technical_agent import technical_agent
from agents.impact_agent import impact_agent
from agents.team_agent import team_agent
from agents.milestone_agent import milestone_agent

agents = {
    "ORCHESTRATOR_ADDRESS": orchestrator.address,
    "INTAKE_ADDRESS": intake_agent.address,
    "TECHNICAL_ADDRESS": technical_agent.address,
    "IMPACT_ADDRESS": impact_agent.address,
    "TEAM_ADDRESS": team_agent.address,
    "MILESTONE_ADDRESS": milestone_agent.address,
}

print("# Add these to backend/.env:")
for k, v in agents.items():
    print(f"{k}={v}")
