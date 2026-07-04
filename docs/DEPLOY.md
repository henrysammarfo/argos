# ARGOS production deployment

**Recommended stack (24/7 live):**

| Layer | Platform | Why |
| ----- | -------- | --- |
| **Frontend** | [Vercel](https://vercel.com) | TanStack Start + Nitro (SSR, auto-scaling, always reachable) |
| **API + Postgres** | [Render](https://render.com) | Docker FastAPI, managed PostgreSQL, health checks |
| **Fetch.ai agents** | Render **Background Worker** | Mailbox agents must run continuously |

> **Important:** Render’s free tier sleeps after ~15 minutes of idle traffic. For a hackathon demo that must stay live 24/7, use the **Starter** plan ($7/mo per service) for the API and the agents worker.

---

## Architecture

```
Users → Vercel (argos.vercel.app)
          ↓ VITE_API_BASE_URL
        Render Web Service (argos-api.onrender.com)
          ↓
        Render PostgreSQL
          
Render Worker (argos-agents) → Agentverse mailbox 24/7
```

---

## Step 1 — Backend on Render

### Option A: Blueprint (fastest)

1. Push this repo to GitHub.
2. Go to [Render Dashboard → Blueprints](https://dashboard.render.com/blueprints).
3. Connect the repo and apply `render.yaml`.
4. When prompted, set **secret** env vars (see table below).

### Option B: Manual

1. **New PostgreSQL** → name `argos-db`, copy **Internal Database URL**.
2. **New Web Service** → Docker, root `backend/`, Dockerfile `backend/Dockerfile`.
   - Health check path: `/api/health/ready`
   - Plan: **Starter** (24/7)
3. **New Background Worker** → same Docker image, start command:
   ```bash
   python agents/run_mailbox_agents.py
   ```
   - Plan: **Starter** (24/7)

### Required API env vars (Render → argos-api → Environment)

| Variable | Example / notes |
| -------- | --------------- |
| `ENV` | `production` |
| `DATABASE_URL` | From Render Postgres (Internal URL) |
| `JWT_SECRET` | `openssl rand -hex 32` |
| `OPENAI_API_KEY` | From OpenAI dashboard |
| `CORS_ORIGINS` | `https://YOUR-APP.vercel.app` (comma-separated if multiple) |
| `FRONTEND_URL` | `https://YOUR-APP.vercel.app` |
| `KASPA_NODE_URL` | `https://api-tn10.kaspa.org` |
| `KASPA_NETWORK` | `kaspatest` |
| `ESCROW_WALLET_ADDRESS` | Your tn10 escrow address |
| `PROGRAM_ADMIN_ADDRESS` | Admin Kaspa address |
| `KASPA_PRIVATE_KEY` | Server-side release signing (never expose to frontend) |
| `AGENTVERSE_API_KEY` | For agent registration |
| `ORCHESTRATOR_ADDRESS` | After `register_agentverse.py` |
| `INTAKE_ADDRESS` | … |
| `TECHNICAL_ADDRESS` | … |
| `IMPACT_ADDRESS` | … |
| `TEAM_ADDRESS` | … |
| `MILESTONE_ADDRESS` | … |

Copy the same agent + Kaspa vars to the **argos-agents** worker.

After deploy, verify:

```bash
curl https://argos-api.onrender.com/api/health/ready
curl https://argos-api.onrender.com/api/health
```

---

## Step 2 — Frontend on Vercel

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset should auto-detect **TanStack Start** (we pin Nitro `preset: "vercel"` in `vite.config.ts`).
3. Set environment variable:

   | Name | Value |
   | ---- | ----- |
   | `VITE_API_BASE_URL` | `https://argos-api.onrender.com/api` |

4. Deploy. Copy your production URL (e.g. `https://argos-xxx.vercel.app`).

5. **Go back to Render** and update `CORS_ORIGINS` + `FRONTEND_URL` with the Vercel URL, then redeploy the API.

---

## Step 3 — Register agents (one-time)

From your machine (with `backend/.env` filled):

```bash
cd backend
python3 agents/register_agentverse.py
# Paste printed ORCHESTRATOR_ADDRESS etc. into Render env for API + worker
```

Restart the **argos-agents** worker after updating addresses.

---

## Step 4 — Smoke test live stack

1. Open `https://YOUR-APP.vercel.app/signup` → create account.
2. Console → New round → add proposals → **Run evaluation**.
3. Dashboard → GCC + FET panels load (proves API + auth).
4. `/app/agents` → all 6 agents **online** (proves worker + env addresses).
5. Escrow → create → tn10 explorer link works.

---

## Custom domain (optional)

| Platform | Setting |
| -------- | ------- |
| Vercel | Project → Domains → add `app.yourdomain.com` |
| Render | Web Service → Custom Domain → `api.yourdomain.com` |

Update `VITE_API_BASE_URL`, `CORS_ORIGINS`, and `FRONTEND_URL` to match.

---

## Alternatives

| If you prefer… | Use for backend |
| -------------- | --------------- |
| **Railway** | One project: API + Postgres + worker (similar Docker setup) |
| **Fly.io** | `docker compose` on a single VM — good if you want API + agents + DB together |
| **Neon Postgres** | Replace Render DB; keep `DATABASE_URL` pointing to Neon |

Vercel cannot run the Python API or long-lived uAgent processes — keep those on Render/Railway/Fly.

---

## Keep-alive checklist

- [ ] Render API: **Starter** plan (not Free)
- [ ] Render agents worker: **Starter** plan
- [ ] `VITE_API_BASE_URL` points to live API `/api` suffix
- [ ] `CORS_ORIGINS` includes exact Vercel URL (no trailing slash)
- [ ] `/api/health/ready` returns 200
- [ ] Agents worker logs show 6 processes running

See also [docs/SUBMISSION_STATUS.md](./SUBMISSION_STATUS.md) for hackathon demo URLs.
