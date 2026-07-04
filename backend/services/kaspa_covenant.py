"""Kaspa SilverScript milestone covenant for ARGOS grant escrow."""

from __future__ import annotations

import hashlib
from pathlib import Path

COVENANT_DIR = Path(__file__).resolve().parent.parent / "kaspa" / "covenant"
DEFAULT_SCRIPT = COVENANT_DIR / "escrow-milestone.sil"
ARGOS_README = COVENANT_DIR / "README.md"


def load_covenant_source(script_path: Path | None = None) -> str:
    path = script_path or DEFAULT_SCRIPT
    if not path.is_file():
        return ""
    return path.read_text(encoding="utf-8")


def covenant_script_hash(source: str | None = None) -> str:
    text = source if source is not None else load_covenant_source()
    if not text:
        return ""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def covenant_summary(milestone_count: int | None = None) -> dict:
    """
    ARGOS maps OpenSilver MilestoneEscrow roles to grant funding:
      buyer   → program admin (funder / refund on dispute)
      seller  → grantee (milestone payouts)
      arbiter → ARGOS admin + Milestone agent (human approve + AI verify off-chain)
    """
    source = load_covenant_source()
    return {
        "type": "silverscript_milestone_covenant",
        "language": "SilverScript",
        "compile_target": "testnet-12",
        "live_runtime": "testnet-10 (REST + kaspa SDK sends; covenant deploy on TN12)",
        "script_file": "backend/kaspa/covenant/escrow-milestone.sil",
        "script_sha256": covenant_script_hash(source),
        "contract": "MilestoneEscrow",
        "source_repo": "https://github.com/trillskillz/OpenSilver (escrow-milestone.sil)",
        "entrypoints": [
            "approve_milestone",
            "final_release",
            "dispute_refund",
            "timeout_reclaim",
        ],
        "argos_role_mapping": {
            "buyer": "program_admin_kas_address (grant funder)",
            "seller": "grantee_kas_address",
            "arbiter": "PROGRAM_ADMIN + Milestone agent verification hash",
        },
        "milestone_count": milestone_count,
        "off_chain": [
            "Milestone agent verifies deliverables (OpenAI)",
            "Human committee approves release in ARGOS UI",
            "Backend signs arbiter release tx when both pass",
        ],
        "on_chain": [
            "Funds locked in covenant UTXO (TN12)",
            "approve_milestone increments completed_milestones",
            "final_release pays grantee when all milestones complete",
            "dispute_refund returns to funder with arbiter + buyer sig",
        ],
        "docs": "docs/KASPA_COVENANT.md",
    }


def covenant_deposit_note(milestone_count: int) -> str:
    summary = covenant_summary(milestone_count)
    return (
        f"SilverScript MilestoneEscrow covenant ({summary['compile_target']}). "
        f"{milestone_count} milestones · arbiter-gated releases · "
        f"script sha256 {summary['script_sha256'][:16]}…"
    )
