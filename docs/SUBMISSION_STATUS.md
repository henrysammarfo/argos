# ARGOS — Hackathon Submission Status

Last updated: 2026-07-04

## Ready for submission

| Track | Status | Notes |
|-------|--------|-------|
| **GitHub + docs** | ✅ | Live API, multi-tenant auth, docker-compose, CI |
| **Conduct (enterprise)** | ✅ | Console + audit trail UI, override with reason, Kaspa escrow |
| **Kaspa** | ✅ | tn10 testnet; explorer links; backend-signed releases |
| **Fetch.ai / Agentverse** | ✅ | **6/6 agents registered**; FET payment ledger |
| **GCC** | ✅ | Public capital allocation panel on dashboard |
| **ASI:One discovery** | ⚠️ | Agents live on Agentverse; ASI:One indexing may take time — use profile URLs or `@argos_orchestrator` in [asi1.ai](https://asi1.ai) chat |

## Agentverse agents (paste in Fetch.ai submission)

| Agent | Address | Profile |
|-------|---------|---------|
| Orchestrator | `agent1qffpcqjgpcq6ll3m5xrp4za6eg9w88cxklgn9mue057m072rky75uelwph8` | https://agentverse.ai/agents/details/agent1qffpcqjgpcq6ll3m5xrp4za6eg9w88cxklgn9mue057m072rky75uelwph8/profile |
| Intake | `agent1q06trxxtdy2etqn73hlrcxvyd4v9sq88x8lhhy2a540eq8swqq42wepujxq` | https://agentverse.ai/agents/details/agent1q06trxxtdy2etqn73hlrcxvyd4v9sq88x8lhhy2a540eq8swqq42wepujxq/profile |
| Technical | `agent1q2mq2z6lhzmz798gfdgl4jpkhde5d3rz2zgmufzsu406exdyc2rgjvf2acs` | https://agentverse.ai/agents/details/agent1q2mq2z6lhzmz798gfdgl4jpkhde5d3rz2zgmufzsu406exdyc2rgjvf2acs/profile |
| Impact | `agent1q0aldx57055qyn9s59pmkr9cjr3nzttts8mhzpjutq8rnh20cghx6x80d00` | https://agentverse.ai/agents/details/agent1q0aldx57055qyn9s59pmkr9cjr3nzttts8mhzpjutq8rnh20cghx6x80d00/profile |
| Team | `agent1qtnr225x4j5eku0mdy3jntaljz4sf0arg4t3zhqgkpasnwztwks5snzs25h` | https://agentverse.ai/agents/details/agent1qtnr225x4j5eku0mdy3jntaljz4sf0arg4t3zhqgkpasnwztwks5snzs25h/profile |
| Milestone | `agent1q2gy384d3tracln7cwsrgmjpq50ejflfjal98xwye4xcgpfs2ukv7em9x3h` | https://agentverse.ai/agents/details/agent1q2gy384d3tracln7cwsrgmjpq50ejflfjal98xwye4xcgpfs2ukv7em9x3h/profile |

## Commands (judges / demo)

```bash
# 1. Register agents (uses AGENTVERSE_API_KEY in backend/.env)
cd backend && python3 agents/register_agentverse.py

# 2. Run orchestrator with Agentverse mailbox (keep running during demo)
USE_AGENTVERSE_MAILBOX=true python3 agents/orchestrator.py

# 3. Run all 6 agents
python3 agents/run_mailbox_agents.py

# 4. Test ASI:One API
python3 agents/test_asi_one.py
```

## ASI:One demo script (for video)

1. Open https://asi1.ai and start a new chat
2. Ask: *"I need help evaluating grant proposals for our Horizon Europe research program"*
3. Or invoke directly: *"@argos_orchestrator evaluate this grant proposal..."*
4. Copy the **shared chat session URL** for the Fetch.ai submission form

## Web app demo (Conduct track)

1. `/signup` → create judge account
2. New Round → upload proposals → Run evaluation
3. Review scores → override with reason → audit trail
4. Create Kaspa escrow → milestone release

## Still needed before final submit

- [ ] **3-minute demo video** (screen recording)
- [ ] **DoraHacks BUIDL** entry + thumbnail
- [ ] **Live URL** — Vercel frontend + Render backend ([docs/DEPLOY.md](./DEPLOY.md))
- [ ] **ASI:One shared session URL** from browser chat after agents indexed
- [ ] Run Agentverse **agent evaluation** in dashboard (boosts ASI:One ranking)

## Recommended live hosting (free)

| Service | Platform | Cost |
|---------|----------|------|
| Frontend | Vercel Hobby | $0 |
| PostgreSQL | Neon free | $0 |
| API + uAgents 24/7 | **Oracle Cloud Free VM** + `docker-compose.prod.yml` | $0 |
| Alt backend | Fly.io + Neon | $0–5/mo |

Paid fallback: Render Starter (~$21/mo) — `render.yaml`.

See **[docs/DEPLOY.md](./DEPLOY.md)** for step-by-step.

## Kaspa wallet model (important)

**Judges do NOT connect a browser wallet** (no Kaspium extension, no MetaMask-style flow in the UI).

| Step | Who | How |
|------|-----|-----|
| **Fund escrow** | Grant program / funder | Manually send KAS to the `escrow_address` shown in the console (Kaspium, exchange, etc.) |
| **Grantee address** | Judge at escrow creation | Typed in when creating escrow (`grantee_kas_address`) |
| **Milestone release** | Committee in ARGOS UI | Click **Approve release** → backend signs TX with `KASPA_PRIVATE_KEY` in server `.env` |
| **Balance check** | Automatic | API reads testnet/mainnet via `KASPA_NODE_URL` |

Live testnet check: `python3 backend/scripts/kaspa_live_check.py` (escrow wallet had **100,000 KAS** on tn10).

## Test suite (run before submit)

```bash
cd backend && python3 -m pytest tests/ -v
```

| Suite | Tests |
|-------|-------|
| Smoke | auth, tenant isolation, email verify |
| E2E | full grant → escrow → milestone submit → approve release |
| Stress | 100 health checks, 20 concurrent signups, 30 parallel list requests |


- `OPENAI_API_KEY` ✅
- `ASI_ONE_API_KEY` ✅
- `AGENTVERSE_API_KEY` ✅
- `KASPA_*` testnet ✅
- Agent addresses ✅
