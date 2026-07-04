#!/usr/bin/env python3
"""Optional live Kaspa testnet checks (read-only + optional send dry-run)."""

import asyncio
import os
import sys

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.kaspa_escrow import get_balance, verify_deposit


async def main() -> int:
    addr = os.getenv("ESCROW_WALLET_ADDRESS", "")
    if not addr:
        print("SKIP: ESCROW_WALLET_ADDRESS not set")
        return 0

    print(f"Kaspa node: {os.getenv('KASPA_NODE_URL')}")
    print(f"Escrow address: {addr}")

    try:
        balance = await get_balance(addr)
        print(f"Balance: {balance} KAS")
    except Exception as e:
        print(f"Balance check FAILED: {e}")
        return 1

    check = await verify_deposit(addr, expected_amount_kas=0.0)
    print(f"Deposit verify (0 KAS expected): verified={check['verified']} actual={check['actual_balance_kas']}")
    if check.get("deposit_tx"):
        print(f"Latest tx: {check['deposit_tx']}")

    print("\nWallet model: NO browser wallet in ARGOS.")
    print("- Grantee sends KAS manually to escrow address (Kaspium / Kaspium testnet)")
    print("- Milestone 'Sign release' = committee approves in UI; backend signs with KASPA_PRIVATE_KEY")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
