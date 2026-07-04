# Kaspa covenant integration (SilverScript)

ARGOS uses a **SilverScript milestone escrow covenant** — not a simple payment rail.

## Contract

File: [`backend/kaspa/covenant/escrow-milestone.sil`](../backend/kaspa/covenant/escrow-milestone.sil)

Based on OpenSilver `MilestoneEscrow` with ARGOS role mapping:

- **Buyer** = grant program funder (refund on dispute)
- **Seller** = grantee (milestone payouts)
- **Arbiter** = ARGOS admin + Milestone agent verification

## Why two testnets?

| | TN10 | TN12 |
|---|------|------|
| ARGOS live demo today | REST balance + SDK sends | — |
| SilverScript covenants | Not yet | **Required** |

Judges can verify:

1. **Source** — `GET /api/public/covenant/source` or GitHub
2. **Metadata** — `GET /api/public/covenant`
3. **Live flow** — deposit → milestone verify → human approve → release TX on explorer

## Compile & deploy (TN12)

```bash
git clone https://github.com/kaspanet/silverscript
cd silverscript
cargo test -p silverscript-lang

# Copy ARGOS covenant
cp /path/to/argos/backend/kaspa/covenant/escrow-milestone.sil .

# Deploy via SilverScript toolchain (see silverscript docs/TUTORIAL.md)
# Set KASPA_COVENANT_ADDRESS in backend .env.production
```

## Env vars

```env
KASPA_NETWORK=kaspatest
KASPA_NODE_URL=https://api-tn10.kaspa.org
KASPA_COVENANT_SCRIPT=backend/kaspa/covenant/escrow-milestone.sil
# After TN12 deploy:
# KASPA_COVENANT_ADDRESS=kaspatest:...
```

## Hackathon pitch line

> AI agents evaluate grants off-chain; **SilverScript covenants** lock milestone payments on Kaspa — funds only move when arbiter + grantee signatures satisfy the covenant state machine.
