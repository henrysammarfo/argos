# ARGOS — AI Grant & Procurement Evaluation System

ARGOS takes 50 grant proposals from 6 weeks of committee review to 8 hours — every AI evaluation step shown, explained, and human-approved — with milestone payments locked in Kaspa conditional escrow.

**Hackathon:** UK AI Agent Hackathon EP5 × Conduct · [DoraHacks #2272](https://dorahacks.io/hackathon/2272)

## Architecture

- **Frontend:** TanStack Start + React 19 + Tailwind v4 (Lovable)
- **Backend:** FastAPI + PostgreSQL + SQLAlchemy
- **AI:** Anthropic Claude (technical, impact, team scoring)
- **Agents:** 6 Fetch.ai uAgents on Agentverse (Chat Protocol)
- **Blockchain:** Kaspa milestone escrow (api.kaspa.org + kaspa SDK)

See [docs/ARGOS_ARCHITECTURE.md](docs/ARGOS_ARCHITECTURE.md) for full diagram.

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set ANTHROPIC_API_KEY, DATABASE_URL, etc.

pip install -r requirements.txt

# SQLite (no Docker):
export DATABASE_URL=sqlite:///./argos.db
export KASPA_SIMULATION=true

uvicorn api.main:app --reload --port 8000
```

### 2. Frontend

```bash
bun install
cp .env.example .env

bun run dev
# Open http://localhost:5173
```

### 3. Docker (PostgreSQL + API)

```bash
docker compose up
```

### 4. Demo pipeline

```bash
cd backend
python demo/run_demo.py
```

### 5. uAgents (optional — for Fetch.ai bounty)

```bash
cd backend
python agents/orchestrator.py    # port 8010
python agents/intake_agent.py    # port 8011
python agents/technical_agent.py # port 8012
python agents/impact_agent.py    # port 8013
python agents/team_agent.py      # port 8014
python agents/milestone_agent.py # port 8015
```

Register addresses on [Agentverse](https://agentverse.ai). Set env vars `ORCHESTRATOR_ADDRESS`, etc.

## API Keys Required

| Key                 | Required        | Purpose              |
| ------------------- | --------------- | -------------------- |
| `ANTHROPIC_API_KEY` | Yes (live eval) | Claude scoring       |
| `ASI_ONE_API_KEY`   | Recommended     | ASI:One discovery    |
| `ADMIN_API_KEY`     | Recommended     | Protect mutations    |
| `KASPA_SEED_PHRASE` | For live Kaspa  | Milestone releases   |
| `DATABASE_URL`      | Yes             | PostgreSQL or SQLite |

Without `ANTHROPIC_API_KEY`, backend uses mock scores for demo.

## API Documentation

- Swagger UI: http://localhost:8000/docs
- Contract: [docs/ARGOS_API_CONTRACT.md](docs/ARGOS_API_CONTRACT.md)

## Per-Bounty Highlights

- **Conduct:** Human-in-the-loop audit trail, score override with reason
- **Fetch.ai:** 6 Agentverse agents, Chat Protocol, ASI:One compatible orchestrator
- **Kaspa:** Balance verification via api.kaspa.org, milestone release flow
- **GCC:** Rubric transparency, counterfactual impact scoring

## Testing

```bash
# Backend
pytest backend/tests/ -v

# Frontend
bun run lint
bun run build
```

## Documentation

- [Build Guide](docs/ARGOS_BUILD_GUIDE.md) — original spec
- [Memory / Facts](docs/ARGOS_MEMORY.md) — living reference + bible corrections
- [Security](docs/ARGOS_SECURITY.md) — threat model and controls
- [Hackathon Checklist](docs/ARGOS_HACKATHON_CHECKLIST.md) — submission checklist
- [Theme](docs/ARGOS_THEME.md) — design system

## Builder

Henry Sam Marfo · github.com/henrysammarfo

## License

MIT
