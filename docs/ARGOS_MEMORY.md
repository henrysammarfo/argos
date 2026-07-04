# ARGOS Memory — Living Facts & Bible Corrections

> Source of truth for hackathon facts, env vars, agent addresses, and corrections to `ARGOS_BUILD_GUIDE.md`.
> Last updated: 2026-07-04

## Hackathon

| Field               | Value                                                          |
| ------------------- | -------------------------------------------------------------- |
| Event               | UK AI Agent Hackathon EP5 × Conduct                            |
| DoraHacks ID        | [2272](https://dorahacks.io/hackathon/2272)                    |
| Demo Day            | 2026-07-04, Imperial College London                            |
| Submission deadline | 2026-07-04 22:59 UTC                                           |
| Prize pool          | ~$33,300 across 8 bounties                                     |
| Sponsors            | Conduct, Fetch.ai, Kaspa, GCC, Microsoft, Bittensor, Venice.ai |

## Builder

- **Name:** Henry Sam Marfo
- **GitHub:** github.com/henrysammarfo

## Bible Corrections (verified)

1. **`kaspa-sdk` → `kaspa`** — PyPI package is `pip install kaspa` ([kaspanet/kaspa-python-sdk](https://github.com/kaspanet/kaspa-python-sdk))
2. **Covenant escrow** — TN12 testnet only; mainnet uses balance verification via api.kaspa.org
3. **Port collision** — FastAPI `:8000`, orchestrator `:8010`, agents `:8011–8015`
4. **Missing ASI:One key** — Add `ASI_ONE_API_KEY` from [asi1.ai](https://asi1.ai)
5. **DoraHacks link** — Use hackathon/2272, not bounty 1369 (Kaspathon, ended Feb 2026)
6. **£8K Conduct track** — Conduct is title sponsor; no single £8K track confirmed
7. **Theme** — Production uses amber "watcher eye" brand, not bible's electric blue `#3B82F6`

## Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=
DATABASE_URL=postgresql://argos:password@localhost:5432/argos
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
ADMIN_API_KEY=                    # Protects mutations

# Fetch.ai / ASI:One
ASI_ONE_API_KEY=                  # From asi1.ai
AGENTVERSE_API_KEY=               # Optional hosted APIs

# Kaspa
KASPA_NODE_URL=https://api.kaspa.org
KASPA_NETWORK=mainnet             # or testnet-12 for covenants
KASPA_SEED_PHRASE=                # NEVER commit
ESCROW_WALLET_ADDRESS=
PROGRAM_ADMIN_ADDRESS=

# App
PORT=8000
FRONTEND_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK=false
```

## Agent Addresses

Fill after running agents:

| Agent        | Port | Address      |
| ------------ | ---- | ------------ |
| orchestrator | 8010 | `agent1q...` |
| intake       | 8011 | `agent1q...` |
| technical    | 8012 | `agent1q...` |
| impact       | 8013 | `agent1q...` |
| team         | 8014 | `agent1q...` |
| milestone    | 8015 | `agent1q...` |

## Demo URLs

- Frontend: Lovable dev / local `:5173`
- Backend API: `:8000/api`
- OpenAPI: `:8000/docs`
- ASI:One chat session: _(paste after registration)_

## Per-Bounty Pitch

- **Conduct:** Human-in-the-loop, audit trail, enterprise grant workflow (6 weeks → 8 hours)
- **Fetch.ai:** 6 Agentverse agents, Chat Protocol, ASI:One discovery
- **Kaspa:** Real balance verification + milestone release on testnet/mainnet
- **GCC:** Public capital allocation metrics, rubric transparency, counterfactual impact
