# ARGOS Hackathon Submission Checklist

## DoraHacks BUIDL — [Hackathon 2272](https://dorahacks.io/hackathon/2272)

- [ ] GitHub repo link (public, README with setup)
- [ ] Demo video (3 min, screen recording OK)
- [ ] Screenshot for thumbnail
- [ ] Optional live demo URL

## Conduct (Title Sponsor)

- [ ] Pitch: enterprise slow process → 8 hours with human control
- [ ] Demo: override one AI score with reason + audit trail
- [ ] Show before/after: 300 expert-hours vs 12 expert-hours

## Fetch.ai

- [ ] 6 agents registered on Agentverse
- [ ] Chat Protocol enabled (`publish_manifest=True`)
- [ ] ASI:One shared chat session URL pasted in submission
- [ ] Demo: natural language query → orchestrator responds

## Kaspa

- [ ] Real balance verification via api.kaspa.org
- [ ] Escrow address shown in UI with deposit instructions
- [ ] Milestone release flow (testnet or mainnet TX hash)
- [ ] No unlabeled mock transaction hashes

## GCC

- [ ] Emphasize rubric transparency + counterfactual impact scoring
- [ ] Public capital allocation metrics in UI

## Demo Flow (manual test script)

1. Create evaluation round with rubric + milestones
2. Upload 3+ text proposals
3. Run evaluation → watch progress bar
4. View ranked results with score breakdown
5. Click proposal → see reasoning → override one score
6. View audit trail
7. Select winner → create Kaspa escrow
8. Submit milestone report → AI verify → approve → release

## Environment Checklist

- [ ] `ANTHROPIC_API_KEY` set
- [ ] PostgreSQL running (or SQLite fallback)
- [ ] Backend deployed and reachable
- [ ] `VITE_API_BASE_URL` points to deployed API
- [ ] Agents running with Agentverse mailbox

## README Sections

- [ ] What ARGOS does (one paragraph)
- [ ] Architecture diagram
- [ ] Quick start (`docker compose up` or manual steps)
- [ ] API docs link (`/docs`)
- [ ] Agent addresses
- [ ] License
