#!/usr/bin/env python3
"""Run all ARGOS uAgents with Agentverse mailbox (one process each)."""

import os
import subprocess
import sys
import time

AGENTS = [
    ("orchestrator", "agents/orchestrator.py", 8010),
    ("intake", "agents/intake_agent.py", 8011),
    ("technical", "agents/technical_agent.py", 8012),
    ("impact", "agents/impact_agent.py", 8013),
    ("team", "agents/team_agent.py", 8014),
    ("milestone", "agents/milestone_agent.py", 8015),
]

def main() -> int:
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    env = os.environ.copy()
    env["USE_AGENTVERSE_MAILBOX"] = "true"
    env.setdefault("PYTHONPATH", backend_dir)

    procs: list[subprocess.Popen] = []
    print("Starting ARGOS mailbox agents…")
    for name, script, port in AGENTS:
        p = subprocess.Popen(
            [sys.executable, script],
            cwd=backend_dir,
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
        )
        procs.append(p)
        print(f"  • {name} (port {port}) pid={p.pid}")
        time.sleep(2)

    print("\nAll agents running. Ctrl+C to stop.\n")
    try:
        while True:
            for name, _, _ in AGENTS:
                pass
            time.sleep(5)
            for i, p in enumerate(procs):
                if p.poll() is not None:
                    out = p.stdout.read() if p.stdout else ""
                    print(f"Agent {AGENTS[i][0]} exited: {p.returncode}\n{out[-500:]}")
                    return 1
    except KeyboardInterrupt:
        print("\nStopping agents…")
        for p in procs:
            p.terminate()
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
