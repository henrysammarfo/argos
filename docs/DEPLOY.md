# ARGOS production deployment

**Goal:** Vercel frontend + backend live 24/7 **without paying Render**.

| Resource | URL |
| -------- | --- |
| Live app | https://argos-lac.vercel.app |
| Pitch deck | https://gamma.app/docs/ARGOS-3lwcurv75qoj6k2 |
| GitHub | https://github.com/henrysammarfo/argos |

| Layer | Free option | Cost |
| ----- | ----------- | ---- |
| **Frontend** | [Vercel](https://vercel.com) Hobby | $0 |
| **PostgreSQL** | [Neon](https://neon.tech) free tier | $0 |
| **API + uAgents** | **Option A** Azure VM, **Option B** Oracle, or **Option C** Fly.io | $0 or low |

---

## Architecture

```
Users → Vercel (your-app.vercel.app)
          ↓ VITE_API_BASE_URL
        API (Fly.io or VPS :8000)
          ↓ DATABASE_URL
        Neon Postgres (free)

Agents worker (same VPS or 2nd Fly app) → Agentverse mailbox 24/7
```

---

## Option A — Azure VM (shared with Veil/Magmos)

If you already have an Azure VM (e.g. `51.103.219.168`), deploy ARGOS in **`~/argos` only** on port **8000**. Veil keeps `8080`/`8787`; Magmos keeps `8081`/`8788`.

### 1. Open NSG port 8000

Azure Portal → VM → Networking → add inbound rule: **TCP 8000** from `Any` (demo) or your IP.

### 2. Deploy from your machine

```bash
# backend/.env must have OPENAI, Kaspa, Agentverse keys
export ARGOS_SSH_KEY=/path/to/veil-azure-key.pem
export ARGOS_VM_IP=51.103.219.168
chmod +x scripts/deploy-azure-vm.sh
./scripts/deploy-azure-vm.sh
```

Uses `docker-compose.azure.yml` (Postgres + API + agents in Docker). **Does not touch** `~/veil` or `~/magmoslabs-app`.

### 3. Verify

```bash
curl http://YOUR_VM_IP:8000/api/health/ready
curl http://YOUR_VM_IP:8000/api/health
```

### 4. Vercel frontend → see [Vercel deploy](#vercel-frontend-deploy) below. Then update CORS on VM:

```bash
ssh -i veil-azure-key.pem azureuser@YOUR_VM_IP
cd ~/argos
nano .env.production   # CORS_ORIGINS=https://your-app.vercel.app
docker compose -f docker-compose.azure.yml up -d
```

---

## Option B — Fully free 24/7 (Oracle VM)

**Vercel + Neon + Oracle Cloud Always Free VM**

Oracle gives a forever-free ARM VM (24 GB RAM). You run API + agents with Docker — no sleep, no monthly bill.

### 1. Neon Postgres (free)

1. Sign up at [neon.tech](https://neon.tech)
2. Create project → copy **connection string** (use `?sslmode=require`)
3. Save as `DATABASE_URL` for later

### 2. Oracle Cloud VM (free)

1. [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/) → create account
2. Create **Ampere A1** VM (Ubuntu 22.04, 2 OCPU / 12 GB is enough)
3. Open ingress port **8000** in the VCN security list (or use Cloudflare Tunnel below)
4. SSH in and install Docker:

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# log out and back in
```

5. Clone repo and configure:

```bash
git clone https://github.com/henrysammarfo/argos.git
cd argos
cp .env.production.example .env.production
nano .env.production   # fill DATABASE_URL, JWT_SECRET, OPENAI_API_KEY, Kaspa, agents
```

6. Start API + agents:

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml logs -f
```

7. Verify:

```bash
curl http://YOUR_VM_IP:8000/api/health/ready
```

**Optional — HTTPS without opening port 8000:** [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) (free) gives you `https://api.yourdomain.com` → localhost:8000.

### 3. Vercel frontend

1. [vercel.com/new](https://vercel.com/new) → import repo
2. Set:

| Name | Value |
| ---- | ----- |
| `VITE_API_BASE_URL` | `http://YOUR_VM_IP:8000/api` or `https://api.yourdomain.com/api` |

3. Deploy → copy Vercel URL

4. Update `.env.production` on the VM:

```
CORS_ORIGINS=https://your-app.vercel.app
FRONTEND_URL=https://your-app.vercel.app
```

```bash
docker compose -f docker-compose.prod.yml up -d
```

---

## Vercel frontend deploy

1. Go to [vercel.com/new](https://vercel.com/new) → **Import** `henrysammarfo/argos`
2. Branch: `main` (after merge) or `cursor/argos-full-production-fb4a` for preview
3. Framework: **TanStack Start** (auto-detected from `vercel.json`)
4. **Environment variables** (Production):

| Name | Value |
| ---- | ----- |
| `VITE_API_BASE_URL` | `/api` on Vercel (rewrites to Azure). Local: `http://localhost:8000/api` |
| `VITE_USE_MOCK` | `false` |

5. Deploy → copy your Vercel URL (e.g. `https://argos-xxx.vercel.app`)
6. Update VM `.env.production`: `CORS_ORIGINS` and `FRONTEND_URL` = that URL (no trailing slash)
7. Redeploy API container: `docker compose -f docker-compose.azure.yml up -d`

**Build settings** (usually auto):

- Install: `bun install --frozen-lockfile`
- Build: `bun run build`
- Output: handled by Nitro Vercel preset (`vite.config.ts`)

---

## Option C — Fly.io + Neon (easier CLI, small cost possible)

Fly may charge a few dollars/month depending on usage; still much cheaper than Render Starter × 3.

### 1. Neon — same as Option A

### 2. Fly API

```bash
# Install: https://fly.io/docs/hands-on/install-flyctl/
fly auth login

# Create apps (once)
fly apps create argos-api
fly apps create argos-agents

# Secrets for API
fly secrets set -a argos-api \
  ENV=production \
  DATABASE_URL='postgresql://...neon...?sslmode=require' \
  JWT_SECRET='...' \
  OPENAI_API_KEY='...' \
  CORS_ORIGINS='https://your-app.vercel.app' \
  FRONTEND_URL='https://your-app.vercel.app' \
  KASPA_NODE_URL='https://api-tn10.kaspa.org' \
  KASPA_NETWORK='kaspatest' \
  # ... plus Kaspa + agent addresses

fly deploy -c backend/fly.toml

# Agents worker (same secrets minus CORS if you prefer)
fly secrets set -a argos-agents \
  ENV=production \
  DATABASE_URL='...' \
  OPENAI_API_KEY='...' \
  AGENTVERSE_API_KEY='...' \
  ORCHESTRATOR_ADDRESS='...' \
  # ... all agent addresses

fly deploy -c backend/fly.agents.toml
```

API URL: `https://argos-api.fly.dev`

### 3. Vercel

Set `VITE_API_BASE_URL=https://argos-api.fly.dev/api`

---

## Option D — Render (paid)

Render **free tier sleeps**; **Starter is ~$7/mo per service**. Only use if you want zero DevOps.

See `render.yaml` in the repo. Expect ~$21/mo for API + worker + DB on Starter plans.

---

## Required env vars (all options)

| Variable | Notes |
| -------- | ----- |
| `ENV` | `production` |
| `DATABASE_URL` | Neon connection string |
| `JWT_SECRET` | `openssl rand -hex 32` |
| `OPENAI_API_KEY` | Required |
| `CORS_ORIGINS` | Exact Vercel URL, no trailing slash |
| `FRONTEND_URL` | Same Vercel URL |
| `KASPA_*` | Testnet keys from `backend/.env.example` |
| `AGENTVERSE_*` + `*_ADDRESS` | After `python3 agents/register_agentverse.py` |

---

## Register agents (one-time)

```bash
cd backend
python3 agents/register_agentverse.py
# Paste addresses into .env.production or fly secrets
# Restart agents: docker compose restart agents  OR  fly deploy -c backend/fly.agents.toml
```

---

## Smoke test

1. `https://YOUR-APP.vercel.app/signup`
2. New round → proposals → Run evaluation
3. `/app/agents` — 6 agents online
4. Escrow → tn10 explorer link

---

## Cost comparison

| Stack | 24/7? | Typical cost |
| ----- | ----- | ------------ |
| **Vercel + Neon + Oracle VM** | Yes | **$0** |
| **Vercel + Neon + Fly.io** | Yes | **$0–5/mo** |
| **Vercel + Render Starter × 3** | Yes | **~$21/mo** |

Vercel cannot run Python API or uAgent mailboxes — keep those on a VM or Fly.

See [SUBMISSION_STATUS.md](./SUBMISSION_STATUS.md) for hackathon demo checklist.
