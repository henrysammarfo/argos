# ARGOS Hackathon Submission Checklist

## DoraHacks BUIDL — [Hackathon 2272](https://dorahacks.io/hackathon/2272)

- [ ] GitHub repo link (public, README with setup)
- [ ] Demo video (3 min, screen recording OK)
- [ ] Screenshot for thumbnail
- [ ] Optional live demo URL

## Conduct (Title Sponsor)

- [x] Pitch: enterprise slow process → 8 hours with human control
- [x] Demo: override one AI score with reason + audit trail (proposal page sidebar)
- [ ] Show before/after: 300 expert-hours vs 12 expert-hours (in pitch deck)

## Fetch.ai

- [x] 6 agents registered on Agentverse
- [x] Chat Protocol enabled (`publish_manifest=True`)
- [x] FET payment ledger in dashboard + `/api/payments/stats`
- [ ] ASI:One shared chat session URL pasted in submission
- [ ] Demo: natural language query → orchestrator responds

## Kaspa

- [x] Real balance verification via Kaspa REST API (tn10 testnet)
- [x] Escrow address shown in UI with tn10 explorer links
- [x] Milestone release flow (backend signs with `KASPA_PRIVATE_KEY`)
- [x] SilverScript MilestoneEscrow covenant source + `/api/public/covenant`

## GCC

- [x] Rubric transparency + counterfactual impact scoring
- [x] Public capital allocation metrics in console overview (GCC panel)

## Demo Flow (manual test script)

1. `/signup` → create account
2. Create evaluation round with rubric + milestones
3. Upload 3+ text proposals
4. Run evaluation → watch progress bar
5. View ranked results with score breakdown
6. Click proposal → see reasoning → override one score
7. View audit trail (sidebar)
8. Select winner → create Kaspa escrow
9. Submit milestone report → AI verify → approve → release (tn10 explorer TX)

## Environment Checklist

- [ ] `OPENAI_API_KEY` set
- [ ] `JWT_SECRET` set (production)
- [ ] PostgreSQL running (or SQLite for local dev)
- [ ] Backend deployed and reachable (`/api/health/ready`)
- [ ] `VITE_API_BASE_URL` points to deployed API
- [ ] Agents running with Agentverse mailbox

## README Sections

- [x] What ARGOS does (one paragraph)
- [x] Architecture diagram
- [x] Quick start (`docker compose up` or manual steps)
- [x] API docs link (`/docs`)
- [x] Agent addresses
- [ ] License
