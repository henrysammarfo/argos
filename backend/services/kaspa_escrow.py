"""
Kaspa milestone-based grant escrow.
Uses Kaspa REST API for reads; kaspa SDK for sends when configured.
"""

import logging
import os
from typing import Any, Optional

import httpx

logger = logging.getLogger(__name__)

KASPA_NODE = os.getenv("KASPA_NODE_URL", "https://api.kaspa.org")
KASPA_NETWORK = os.getenv("KASPA_NETWORK", "mainnet")


async def get_balance(address: str) -> float:
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.get(f"{KASPA_NODE}/addresses/{address}/balance")
        r.raise_for_status()
        data = r.json()
        return data.get("balance", 0) / 1e8


async def get_transaction(tx_hash: str) -> dict[str, Any]:
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.get(f"{KASPA_NODE}/transactions/{tx_hash}")
        r.raise_for_status()
        return r.json()


async def verify_deposit(escrow_address: str, expected_amount_kas: float) -> dict[str, Any]:
    actual = await get_balance(escrow_address)
    tolerance = expected_amount_kas * 0.01
    verified = actual >= (expected_amount_kas - tolerance)

    deposit_tx = None
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            r = await client.get(
                f"{KASPA_NODE}/addresses/{escrow_address}/transactions?limit=10"
            )
            if r.status_code == 200:
                txs = r.json()
                if txs:
                    deposit_tx = txs[0].get("transaction_id")
    except Exception as e:
        logger.warning("Could not fetch deposit tx: %s", e)

    return {
        "verified": verified,
        "actual_balance_kas": actual,
        "expected_kas": expected_amount_kas,
        "deposit_tx": deposit_tx,
    }


async def send_kaspa(
    from_address: str,
    to_address: str,
    amount_kas: float,
    note: Optional[str] = None,
) -> str:
    """Send KAS via SDK (seed or private key)."""
    seed = os.getenv("KASPA_SEED_PHRASE", "")
    private_key = os.getenv("KASPA_PRIVATE_KEY", "")

    if not seed and not private_key:
        raise RuntimeError(
            "Kaspa send requires KASPA_SEED_PHRASE or KASPA_PRIVATE_KEY"
        )

    return await _send_via_sdk(from_address, to_address, amount_kas, note)


async def _send_via_sdk(
    from_address: str,
    to_address: str,
    amount_kas: float,
    note: Optional[str],
) -> str:
    """Send using kaspa Python SDK."""
    import asyncio

    def _sync_send() -> str:
        try:
            from kaspa import Resolver, Wallet  # type: ignore
        except ImportError:
            raise RuntimeError("kaspa package not installed — pip install kaspa")

        network_id = KASPA_NETWORK if KASPA_NETWORK != "kaspatest" else "testnet"
        wallet = Wallet(resolver=Resolver(), network_id=network_id)

        seed = os.getenv("KASPA_SEED_PHRASE", "")
        private_key = os.getenv("KASPA_PRIVATE_KEY", "")

        if seed:
            wallet.create_or_load_wallet(seed=seed)
        elif private_key:
            wallet.create_or_load_wallet(private_key=private_key)
        else:
            raise RuntimeError("No Kaspa credentials configured")

        sompi = int(amount_kas * 1e8)
        tx_id = wallet.send(to_address, sompi)
        return str(tx_id)

    return await asyncio.to_thread(_sync_send)


def calculate_milestone_amounts(
    total_kas: float, milestones: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    result = []
    for m in milestones:
        amount = total_kas * (m["percent"] / 100)
        result.append(
            {
                **m,
                "kas_amount": round(amount, 8),
                "status": "locked",
                "release_tx": None,
            }
        )
    return result


async def release_milestone(
    escrow_id: str,
    milestone_index: int,
    grantee_address: str,
    kas_amount: float,
    escrow_address: str,
) -> str:
    note = f"ARGOS Grant #{escrow_id} Milestone {milestone_index + 1}"
    return await send_kaspa(escrow_address, grantee_address, kas_amount, note)


async def return_to_admin(
    escrow_id: str,
    milestone_index: int,
    admin_address: str,
    kas_amount: float,
    escrow_address: str,
    reason: str,
) -> str:
    note = f"ARGOS Grant #{escrow_id} Milestone {milestone_index + 1} RETURNED: {reason}"
    return await send_kaspa(escrow_address, admin_address, kas_amount, note)
