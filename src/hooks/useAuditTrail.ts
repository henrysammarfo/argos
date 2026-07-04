import { useQuery } from "@tanstack/react-query";
import { getAuditTrail } from "@/lib/api";

export function useAuditTrail(proposalId: string | undefined) {
  return useQuery({
    queryKey: ["audit-trail", proposalId],
    queryFn: () => getAuditTrail(proposalId!),
    enabled: !!proposalId,
    staleTime: 15_000,
  });
}
