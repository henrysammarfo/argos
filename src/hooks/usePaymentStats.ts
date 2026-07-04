import { useQuery } from "@tanstack/react-query";
import { getPaymentStats, getPaymentLedger } from "@/lib/api";

export function usePaymentStats() {
  return useQuery({
    queryKey: ["payment-stats"],
    queryFn: getPaymentStats,
    staleTime: 30_000,
  });
}

export function usePaymentLedger(limit = 50) {
  return useQuery({
    queryKey: ["payment-ledger", limit],
    queryFn: () => getPaymentLedger(limit),
    staleTime: 30_000,
  });
}
