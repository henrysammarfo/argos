"""Kaspa network helpers and explorer URLs."""

import os

KASPA_NODE = os.getenv("KASPA_NODE_URL", "https://api.kaspa.org")
KASPA_NETWORK = os.getenv("KASPA_NETWORK", "mainnet")


def sdk_network_id() -> str:
    """Map env KASPA_NETWORK to kaspa Python SDK NetworkId string."""
    net = KASPA_NETWORK.lower()
    if net in ("kaspatest", "testnet", "tn10", "testnet-10"):
        return "testnet-10"
    if net.startswith("testnet"):
        return net if "-" in net else "testnet-10"
    return "mainnet"


def is_testnet() -> bool:
    return sdk_network_id().startswith("testnet")


def explorer_address_url(address: str) -> str:
    if is_testnet() or address.startswith("kaspatest:"):
        return f"https://explorer-tn10.kaspa.org/addresses/{address}"
    return f"https://explorer.kaspa.org/addresses/{address}"


def explorer_tx_url(tx_hash: str) -> str:
    if is_testnet():
        return f"https://explorer-tn10.kaspa.org/txs/{tx_hash}"
    return f"https://explorer.kaspa.org/txs/{tx_hash}"


def deposit_instructions(amount_kas: float, escrow_address: str) -> str:
    net = "Kaspa testnet (tn10)" if is_testnet() else "Kaspa mainnet"
    return (
        f"Deposit {amount_kas:,.4f} KAS to activate escrow on {net}.\n"
        f"Address: {escrow_address}\n"
        f"Explorer: {explorer_address_url(escrow_address)}"
    )
