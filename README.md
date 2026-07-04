# ARGOS — AI Grant & Procurement Evaluation System

ARGOS takes grant proposals from weeks of committee review to hours — every AI evaluation step shown, explained, and human-approved — with milestone payments locked in Kaspa conditional escrow.

**Hackathon:** UK AI Agent Hackathon EP5 × Conduct · [DoraHacks #2272](https://dorahacks.io/hackathon/2272)

## Architecture

- **Frontend:** TanStack Start + React 19 + Tailwind v4 (Lovable) — all pages poll live API
- **Backend:** FastAPI + SQLAlchemy (PostgreSQL or SQLite locally)
- **AI:** OpenAI GPT-4o (technical, impact, team scoring) — required, no mock fallback
- **Agents:** 6 Fetch.ai uAgents on Agentverse (Chat Protocol)
- **Blockchain:** Kaspa milestone escrow (testnet via api-tn10.kaspa.org + kaspa SDK)

See [docs/ARGOS_ARCHITECTURE.md](docs/ARGOS_ARCHITECTURE.md) for full diagram.

## Quick Start (local only — no cloud billing required)

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env — OPENAI_API_KEY, ADMIN_API_KEY, Kaspa keys, etc.

pip install -r requirements.txt

# SQLite (simplest):
export DATABASE_URL=sqlite:///./argos.db

uvicorn api.main:app --reload --port 8000
```

### 2. Frontend

```bash
bun install
cp .env.example .env
# Set VITE_API_BASE_URL and VITE_ADMIN_API_KEY

bun run dev
# Open http://localhost:5173
```

### 3. Demo pipeline

```bash
cd backend
source .env
python3 demo/run_demo.py
```

### 4. uAgents (Fetch.ai bounty)

```bash
cd backend

# Register all 6 agents on Agentverse (requires AGENTVERSE_API_KEY in .env)
python3 agents/register_agentverse.py

# Run orchestrator with Agentverse mailbox (keep running for ASI:One chat)
USE_AGENTVERSE_MAILBOX=true python3 agents/orchestrator.py

# Or run all agents
python3 agents/run_mailbox_agents.py

# Test ASI:One API discovery
python3 agents/test_asi_one.py
```

See [docs/SUBMISSION_STATUS.md](docs/SUBMISSION_STATUS.md) for Agentverse profile URLs and hackathon checklist.

## API Keys Required

| Key | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | **Yes** | GPT-4o scoring — no fallback |
| `ADMIN_API_KEY` | **Yes** | Protect mutations + frontend |
| `ASI_ONE_API_KEY` | Recommended | ASI:One discovery |
| `AGENTVERSE_API_KEY` | Recommended | Agent registration |
| `KASPA_PRIVATE_KEY` | For releases | Testnet milestone sends |
| `ESCROW_WALLET_ADDRESS` | For escrow | Deposit address |
| `DATABASE_URL` | Yes | PostgreSQL or SQLite |

See [docs/API_KEYS.md](docs/API_KEYS.md) for step-by-step key acquisition.

## API Documentation

- Swagger UI: http://localhost:8000/docs
- Contract: [docs/ARGOS_API_CONTRACT.md](docs/ARGOS_API_CONTRACT.md)

## Testing

```bash
pytest backend/tests/ -v
bun run lint && bun run build
```

## Documentation

- [API Keys Setup](docs/API_KEYS.md)
- [Memory / Facts](docs/ARGOS_MEMORY.md)
- [Security](docs/ARGOS_SECURITY.md)
- [Hackathon Checklist](docs/ARGOS_HACKATHON_CHECKLIST.md)

## License

MIT
