#!/usr/bin/env bash
# Deploy ARGOS API + agents to Azure VM in ~/argos only.
# Does NOT modify ~/veil or ~/magmoslabs-app.
set -euo pipefail

VM_IP="${ARGOS_VM_IP:-51.103.219.168}"
VM_USER="${ARGOS_VM_USER:-azureuser}"
SSH_KEY="${ARGOS_SSH_KEY:-$HOME/.ssh/veil-azure-key.pem}"
BRANCH="${ARGOS_BRANCH:-cursor/argos-full-production-fb4a}"
REPO="${ARGOS_REPO:-https://github.com/henrysammarfo/argos.git}"

if [[ ! -f "$SSH_KEY" ]]; then
  echo "SSH key not found: $SSH_KEY"
  exit 1
fi

if [[ ! -f backend/.env ]]; then
  echo "Missing backend/.env — copy backend/.env.example and fill secrets first."
  exit 1
fi

JWT_SECRET="$(openssl rand -hex 32)"
POSTGRES_PASSWORD="$(openssl rand -hex 16)"

# shellcheck disable=SC1091
source backend/.env

CORS="${CORS_ORIGINS:-http://localhost:5173}"
FRONTEND="${FRONTEND_URL:-http://localhost:5173}"

echo "Deploying ARGOS to ${VM_USER}@${VM_IP} (branch ${BRANCH})…"

ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "${VM_USER}@${VM_IP}" bash -s <<REMOTE
set -euo pipefail
mkdir -p ~/argos
cd ~/argos
if [[ -d .git ]]; then
  git fetch origin ${BRANCH}
  git checkout ${BRANCH} 2>/dev/null || git checkout -b ${BRANCH} origin/${BRANCH}
  git pull origin ${BRANCH}
else
  git clone -b ${BRANCH} ${REPO} .
fi
REMOTE

# Write production env locally, upload (never commit)
ENV_FILE="$(mktemp)"
trap 'rm -f "$ENV_FILE"' EXIT

cat >"$ENV_FILE" <<EOF
ENV=production
DATABASE_URL=postgresql://argos:${POSTGRES_PASSWORD}@postgres:5432/argos
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRE_HOURS=168
OPENAI_API_KEY=${OPENAI_API_KEY}
OPENAI_MODEL=${OPENAI_MODEL:-gpt-4o}
ASI_ONE_API_KEY=${ASI_ONE_API_KEY:-}
AGENTVERSE_API_KEY=${AGENTVERSE_API_KEY:-}
KASPA_NODE_URL=${KASPA_NODE_URL:-https://api-tn10.kaspa.org}
KASPA_NETWORK=${KASPA_NETWORK:-kaspatest}
KASPA_PRIVATE_KEY=${KASPA_PRIVATE_KEY:-}
ESCROW_WALLET_ADDRESS=${ESCROW_WALLET_ADDRESS:-}
PROGRAM_ADMIN_ADDRESS=${PROGRAM_ADMIN_ADDRESS:-}
KASPA_SIMULATION=false
CORS_ORIGINS=${CORS}
FRONTEND_URL=${FRONTEND}
ORCHESTRATOR_ADDRESS=${ORCHESTRATOR_ADDRESS:-}
INTAKE_ADDRESS=${INTAKE_ADDRESS:-}
TECHNICAL_ADDRESS=${TECHNICAL_ADDRESS:-}
IMPACT_ADDRESS=${IMPACT_ADDRESS:-}
TEAM_ADDRESS=${TEAM_ADDRESS:-}
MILESTONE_ADDRESS=${MILESTONE_ADDRESS:-}
WEB_CONCURRENCY=2
EVAL_CONCURRENCY=5
FET_PER_AGENT_CALL=0.01
EOF

scp -i "$SSH_KEY" -o StrictHostKeyChecking=no "$ENV_FILE" "${VM_USER}@${VM_IP}:~/argos/.env.production"

ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "${VM_USER}@${VM_IP}" bash -s <<REMOTE
set -euo pipefail
cd ~/argos
export POSTGRES_PASSWORD='${POSTGRES_PASSWORD}'
docker compose -f docker-compose.azure.yml up -d --build
sleep 8
docker compose -f docker-compose.azure.yml ps
curl -sf http://127.0.0.1:8000/api/health/ready && echo " — API ready"
curl -sf http://127.0.0.1:8000/api/health && echo " — API health"
docker compose -f docker-compose.azure.yml logs agents --tail 20
REMOTE

echo ""
echo "Done. VM local API: http://${VM_IP}:8000/api"
echo "Open Azure NSG port 8000 if public curl fails."
echo "After Vercel deploy, set CORS_ORIGINS + FRONTEND_URL in ~/argos/.env.production and rerun:"
echo "  docker compose -f docker-compose.azure.yml up -d"
