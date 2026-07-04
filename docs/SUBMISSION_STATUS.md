# ARGOS — Hackathon Submission Status

Last updated: 2026-07-04

## Ready for submission

| Track | Status | Notes |
|-------|--------|-------|
| **GitHub + docs** | ✅ | Live API, multi-tenant auth, docker-compose, CI |
| **Conduct (enterprise)** | ✅ | Full console: rounds, scoring, override, audit, Kaspa escrow |
| **Kaspa** | ✅ | Testnet keys configured; real balance + release flow |
| **Fetch.ai / Agentverse** | ✅ | **6/6 agents registered** with Chat Protocol + mailbox |
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
- [ ] **Live URL** (Lovable deploy + backend on docker compose / Railway)
- [ ] **ASI:One shared session URL** from browser chat after agents indexed
- [ ] Run Agentverse **agent evaluation** in dashboard (boosts ASI:One ranking)

## Keys configured (local `.env` — not in git)

- `OPENAI_API_KEY` ✅
- `ASI_ONE_API_KEY` ✅
- `AGENTVERSE_API_KEY` ✅
- `KASPA_*` testnet ✅
- Agent addresses ✅
