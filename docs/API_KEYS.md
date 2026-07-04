# ARGOS — How to Get Every API Key

Step-by-step instructions for every credential ARGOS needs. None of these are optional for a **fully live** demo — mock mode only kicks in when `OPENAI_API_KEY` is missing.

---

## 1. OpenAI API Key (required for live AI scoring)

**Used for:** Proposal evaluation, structure extraction, milestone verification, comparison narrative.

### Steps

1. Go to [https://platform.openai.com/signup](https://platform.openai.com/signup) and create an account (or sign in).
2. Open [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys).
3. Click **Create new secret key**.
4. Name it `argos-hackathon` and copy the key immediately (starts with `sk-proj-...` or `sk-...`).
5. Add billing at [https://platform.openai.com/settings/organization/billing](https://platform.openai.com/settings/organization/billing) — evaluation of 10 proposals costs roughly $0.50–2.00 on `gpt-4o`.
6. Set in backend `.env`:
   ```bash
   OPENAI_API_KEY=sk-proj-xxxxxxxx
   OPENAI_MODEL=gpt-4o
   ```

### Verify

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

---

## 2. JWT secret (required for auth)

**Used for:** Email/password signup, login, and protecting all API mutations via Bearer token.

### Steps

1. Generate a strong random string:
   ```bash
   openssl rand -hex 32
   ```
2. Set in backend `.env`:
   ```bash
   JWT_SECRET=your_generated_hex_string
   JWT_EXPIRE_HOURS=168
   ```

The frontend stores the JWT from `/api/auth/login` or `/api/auth/register` in sessionStorage and sends `Authorization: Bearer <token>` on every request.

Optional SMTP for email verification codes:

```bash
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@yourdomain.com
SMTP_TLS=true
```

---

## 3. ASI:One API Key (Fetch.ai bounty — strongly recommended)

**Used for:** ASI:One chat discovery demo; judges query your orchestrator agent in natural language.

### Steps

1. Go to [https://asi1.ai](https://asi1.ai) and sign up.
2. Navigate to API keys / developer settings.
3. Create an API key.
4. Set in backend `.env`:
   ```bash
   ASI_ONE_API_KEY=your_asi_one_key
   ```

### Register orchestrator on Agentverse

1. Run `python backend/agents/orchestrator.py` — copy the printed address (`agent1q...`).
2. Go to [https://agentverse.ai](https://agentverse.ai) → **Launch an Agent** → connect via mailbox.
3. Enable **Chat Protocol** on the agent profile.
4. Tags: `grant-evaluation`, `procurement`, `enterprise`
5. Test in ASI:One: _"I need help evaluating grant proposals for our research program"_

---

## 4. Agentverse (Fetch.ai — 6 agents)

**Used for:** Registering all 6 uAgents for the Fetch.ai bounty.

### Steps

1. Sign up at [https://agentverse.ai](https://agentverse.ai).
2. Run each agent locally (or use mailbox mode):
   ```bash
   python backend/agents/orchestrator.py    # :8010
   python backend/agents/intake_agent.py    # :8011
   python backend/agents/technical_agent.py # :8012
   python backend/agents/impact_agent.py    # :8013
   python backend/agents/team_agent.py      # :8014
   python backend/agents/milestone_agent.py # :8015
   ```
3. Run `python backend/agents/print_addresses.py` to get all addresses.
4. Register each on Agentverse with Chat Protocol enabled.
5. Paste addresses into backend `.env`:
   ```bash
   ORCHESTRATOR_ADDRESS=agent1q...
   INTAKE_ADDRESS=agent1q...
   TECHNICAL_ADDRESS=agent1q...
   IMPACT_ADDRESS=agent1q...
   TEAM_ADDRESS=agent1q...
   MILESTONE_ADDRESS=agent1q...
   ```

Optional: `AGENTVERSE_API_KEY` if using hosted Agentverse APIs.

---

## 5. Kaspa Wallet (Kaspa bounty)

**Used for:** Milestone escrow deposits, balance verification, fund releases.

### Steps — Mainnet (balance verification)

1. Install [Kaspium wallet](https://kaspium.io/) or use Kaspa CLI.
2. Create a new wallet and **save the 24-word seed phrase offline**.
3. Copy your receive address (starts with `kaspa:`).
4. Set in backend `.env`:
   ```bash
   KASPA_NODE_URL=https://api.kaspa.org
   KASPA_NETWORK=mainnet
   KASPA_SEED_PHRASE="word1 word2 ... word24"
   ESCROW_WALLET_ADDRESS=kaspa:qr...
   PROGRAM_ADMIN_ADDRESS=kaspa:qr...
   ```

### Steps — Testnet TN12 (covenant scripts)

1. Use TN12 testnet faucet for test KAS.
2. Set `KASPA_NETWORK=testnet-12`.
3. Install `kaspa` from TN12 branch: [kaspanet/kaspa-python-sdk/tree/tn12](https://github.com/kaspanet/kaspa-python-sdk/tree/tn12)

### Simulation mode (no wallet yet)

```bash
KASPA_SIMULATION=true
```

Releases return `sim_tx_*` hashes — label clearly in demo if using this.

### Verify balance (no auth needed)

```bash
curl https://api.kaspa.org/addresses/kaspa:YOUR_ADDRESS/balance
```

---

## 6. PostgreSQL Database

**Used for:** Evaluations, proposals, scores, audit trail, escrows.

### Local (Docker)

```bash
docker compose up db -d
```

Set:

```bash
DATABASE_URL=postgresql://argos:password@localhost:5432/argos
```

### SQLite (dev only)

```bash
DATABASE_URL=sqlite:///./argos.db
```

### Production (Railway / Neon / Supabase)

1. Create PostgreSQL instance.
2. Copy connection string into `DATABASE_URL`.

---

## 7. Frontend environment

Create `.env` in project root:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

Sign up at `/signup` in the console — JWT auth is handled automatically (no admin key in frontend env).

For Lovable production, set `VITE_API_BASE_URL` to your deployed API URL.

---

## 8. CORS

Backend `.env`:

```bash
CORS_ORIGINS=http://localhost:5173,https://your-app.lovable.app
FRONTEND_URL=https://your-app.lovable.app
```

---

## Quick checklist

| Key        | Where to get it              | Env var                                |
| ---------- | ---------------------------- | -------------------------------------- |
| OpenAI     | platform.openai.com/api-keys | `OPENAI_API_KEY`                       |
| JWT        | `openssl rand -hex 32`       | `JWT_SECRET`                           |
| ASI:One    | asi1.ai                      | `ASI_ONE_API_KEY`                      |
| Agentverse | agentverse.ai (account)      | `AGENTVERSE_API_KEY` (optional)        |
| Kaspa seed | Kaspium wallet               | `KASPA_SEED_PHRASE`                    |
| Database   | Docker / Railway / Neon      | `DATABASE_URL`                         |

---

## Full `.env` template

See [backend/.env.example](../backend/.env.example) and [.env.example](../.env.example).
