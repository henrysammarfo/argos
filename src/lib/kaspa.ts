/** Kaspa testnet/mainnet explorer helpers (aligned with backend kaspa_network). */

export function kaspaExplorerAddressUrl(address: string, network = "kaspatest"): string {
  const base =
    network === "kaspatest" || network === "testnet-10"
      ? "https://explorer-tn10.kaspa.org/addresses"
      : "https://explorer.kaspa.org/addresses";
  return `${base}/${address}`;
}

export function kaspaExplorerTxUrl(txid: string, network = "kaspatest"): string {
  const base =
    network === "kaspatest" || network === "testnet-10"
      ? "https://explorer-tn10.kaspa.org/txs"
      : "https://explorer.kaspa.org/txs";
  return `${base}/${txid}`;
}
