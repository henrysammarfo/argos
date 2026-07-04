#!/usr/bin/env python3
"""Register all ARGOS uAgents on Agentverse with Chat Protocol."""

import os
import sys

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from uagents_core.config import AgentverseConfig
from uagents_core.utils.registration import (
    AgentverseRequestError,
    RegistrationRequestCredentials,
    register_chat_agent,
)

AGENTS = [
    {
        "env": "ORCHESTRATOR_SEED",
        "default_seed": "argos_orchestrator_seed_phrase_change_in_production",
        "name": "argos-orchestrator",
        "description": "ARGOS Orchestrator — coordinates grant proposal evaluation across specialist AI agents. Discover via ASI:One.",
        "readme": """# ARGOS Orchestrator

Primary entry point for grant evaluation via ASI:One.

**Natural language:** "Evaluate grant proposals for our Horizon Europe research program"

**JSON payload:**
```json
{"action": "evaluate", "proposals": [{"source_type": "text", "source": "..."}], "rubric": {"technical": 30, "impact": 40, "team": 30}}
```

Tags: grant-evaluation, procurement, enterprise, asi-one
""",
        "categories": ["grant-evaluation", "procurement", "enterprise"],
    },
    {
        "env": "INTAKE_SEED",
        "default_seed": "argos_intake_seed_phrase_change_in_production",
        "name": "argos-intake",
        "description": "ARGOS Intake Agent — ingests proposals from PDF, URL, or text and extracts structure.",
        "readme": "# ARGOS Intake\n\nIngests and structures grant proposals.\n",
        "categories": ["grant-evaluation", "intake"],
    },
    {
        "env": "TECHNICAL_SEED",
        "default_seed": "argos_technical_seed_phrase_change_in_production",
        "name": "argos-technical",
        "description": "ARGOS Technical Agent — scores innovation, feasibility, and methodology.",
        "readme": "# ARGOS Technical\n\nTechnical merit scoring for grant proposals.\n",
        "categories": ["grant-evaluation", "technical"],
    },
    {
        "env": "IMPACT_SEED",
        "default_seed": "argos_impact_seed_phrase_change_in_production",
        "name": "argos-impact",
        "description": "ARGOS Impact Agent — scores scale, sustainability, and counterfactual impact.",
        "readme": "# ARGOS Impact\n\nImpact and sustainability scoring.\n",
        "categories": ["grant-evaluation", "impact"],
    },
    {
        "env": "TEAM_SEED",
        "default_seed": "argos_team_seed_phrase_change_in_production",
        "name": "argos-team",
        "description": "ARGOS Team Agent — scores track record, expertise, and risk management.",
        "readme": "# ARGOS Team\n\nTeam capability scoring.\n",
        "categories": ["grant-evaluation", "team"],
    },
    {
        "env": "MILESTONE_SEED",
        "default_seed": "argos_milestone_seed_phrase_change_in_production",
        "name": "argos-milestone",
        "description": "ARGOS Milestone Agent — verifies milestone deliverables before Kaspa escrow release.",
        "readme": "# ARGOS Milestone\n\nMilestone verification for Kaspa escrow.\n",
        "categories": ["grant-evaluation", "milestone", "kaspa"],
    },
]


def main() -> int:
    api_key = os.getenv("AGENTVERSE_API_KEY")
    if not api_key:
        print("ERROR: AGENTVERSE_API_KEY not set in backend/.env")
        return 1

    config = AgentverseConfig()
    endpoint = config.mailbox_endpoint
    print(f"Mailbox endpoint: {endpoint}\n")

    # Import after path setup to print addresses
    from agents.orchestrator import orchestrator
    from agents.intake_agent import intake_agent
    from agents.technical_agent import technical_agent
    from agents.impact_agent import impact_agent
    from agents.team_agent import team_agent
    from agents.milestone_agent import milestone_agent

    instances = [
        orchestrator,
        intake_agent,
        technical_agent,
        impact_agent,
        team_agent,
        milestone_agent,
    ]

    ok_count = 0
    for spec, agent in zip(AGENTS, instances, strict=True):
        seed = os.getenv(spec["env"], spec["default_seed"])
        creds = RegistrationRequestCredentials(
            agent_seed_phrase=seed,
            agentverse_api_key=api_key,
        )
        try:
            register_chat_agent(
                name=spec["name"],
                endpoint=endpoint,
                active=True,
                credentials=creds,
                description=spec["description"],
                readme=spec["readme"],
                metadata={
                    "categories": spec["categories"],
                    "is_public": "True",
                    "handle": spec["name"].replace("argos-", "argos_"),
                },
                agentverse_config=config,
            )
            print(f"✓ {spec['name']} — {agent.address}")
            ok_count += 1
        except AgentverseRequestError as e:
            print(f"✗ {spec['name']} — {e}")

    print(f"\nRegistered {ok_count}/{len(AGENTS)} agents on Agentverse")
    print("\n# Add to backend/.env:")
    env_keys = [
        "ORCHESTRATOR_ADDRESS",
        "INTAKE_ADDRESS",
        "TECHNICAL_ADDRESS",
        "IMPACT_ADDRESS",
        "TEAM_ADDRESS",
        "MILESTONE_ADDRESS",
    ]
    for key, agent in zip(env_keys, instances, strict=True):
        print(f"{key}={agent.address}")

    return 0 if ok_count == len(AGENTS) else 1


if __name__ == "__main__":
    raise SystemExit(main())
