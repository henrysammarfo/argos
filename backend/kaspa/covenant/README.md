# ARGOS Kaspa SilverScript covenant

Grant milestone escrow uses **SilverScript** `MilestoneEscrow` (from [OpenSilver](https://github.com/trillskillz/OpenSilver)).

## Role mapping

| Covenant role | ARGOS role |
|---------------|------------|
| `buyer` | Program admin / funder (`PROGRAM_ADMIN_ADDRESS`) |
| `seller` | Grantee (`grantee_kas_address`) |
| `arbiter` | ARGOS admin + Milestone agent (off-chain verify → on-chain sig) |

## Entrypoints

- **`approve_milestone`** — increment completed milestone (arbiter + seller sig)
- **`final_release`** — pay grantee when all milestones complete
- **`dispute_refund`** — return funds to funder (arbiter + buyer sig)
- **`timeout_reclaim`** — buyer reclaim after timeout

## Networks

| Layer | Network |
|-------|---------|
| SilverScript compile | **Testnet-12** (KIP-20 covenants) |
| ARGOS live demo | **Testnet-10** (REST API + SDK sends today) |

Compile on TN12:

```bash
git clone https://github.com/kaspanet/silverscript
cd silverscript && cargo test -p silverscript-lang
# compile escrow-milestone.sil → deploy covenant address on TN12
```

## API

- `GET /api/public/covenant` — metadata for judges
- `GET /api/public/covenant/source` — full `.sil` source
- Escrow create response includes `covenant` block

## Flow

1. Committee selects winner → ARGOS creates escrow record + covenant metadata
2. Funder deposits KAS to escrow address
3. Grantee submits milestone report → Milestone agent verifies (off-chain)
4. Human approves in UI → backend signs release (TN10 today; covenant spend on TN12)
