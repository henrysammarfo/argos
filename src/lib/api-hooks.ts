import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./api";
import { getApiBaseUrl } from "./api-config";

/** Default polling when data is idle — keeps API load low at scale. */
const IDLE_REFETCH_MS = 30_000;
/** Faster polling only while an evaluation run is active. */
const ACTIVE_REFETCH_MS = 5_000;
const EVAL_STATUS_POLL_MS = 3_000;

const queryDefaults = {
  retry: 2,
  refetchIntervalInBackground: false,
  refetchOnWindowFocus: true,
} as const;

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: api.getDashboardStats,
    refetchInterval: IDLE_REFETCH_MS,
    ...queryDefaults,
  });
}

export function useDashboardActivity() {
  return useQuery({
    queryKey: ["dashboard-activity"],
    queryFn: api.getDashboardActivity,
    refetchInterval: IDLE_REFETCH_MS,
    ...queryDefaults,
  });
}

export function useEvaluations() {
  return useQuery({
    queryKey: ["evaluations"],
    queryFn: api.listEvaluations,
    refetchInterval: IDLE_REFETCH_MS,
    ...queryDefaults,
  });
}

export function useEvaluation(id: string) {
  return useQuery({
    queryKey: ["evaluation", id],
    queryFn: () => api.getEvaluation(id),
    enabled: !!id,
    refetchInterval: IDLE_REFETCH_MS,
    ...queryDefaults,
  });
}

export function useEvaluationStatus(id: string, poll = false) {
  return useQuery({
    queryKey: ["evaluation-status", id],
    queryFn: () => api.getEvaluationStatus(id),
    enabled: !!id,
    refetchInterval: poll ? EVAL_STATUS_POLL_MS : IDLE_REFETCH_MS,
    ...queryDefaults,
  });
}

export function useEvaluationResults(id: string) {
  return useQuery({
    queryKey: ["evaluation-results", id],
    queryFn: () => api.getEvaluationResults(id),
    enabled: !!id,
    refetchInterval: IDLE_REFETCH_MS,
    ...queryDefaults,
  });
}

export function useCreateEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createEvaluation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["evaluations"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useRunEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.runEvaluation,
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: ["evaluation-status", id] });
      qc.invalidateQueries({ queryKey: ["evaluation-results", id] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useProposal(id: string) {
  return useQuery({
    queryKey: ["proposal", id],
    queryFn: () => api.getProposal(id),
    enabled: !!id,
    refetchInterval: IDLE_REFETCH_MS,
    ...queryDefaults,
  });
}

export function useApproveScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      proposalId,
      dimension,
      evaluator,
    }: {
      proposalId: string;
      dimension: string;
      evaluator?: string;
    }) => api.approveScore(proposalId, dimension, evaluator),
    onSuccess: (_d, { proposalId }) => {
      qc.invalidateQueries({ queryKey: ["proposal", proposalId] });
      qc.invalidateQueries({ queryKey: ["audit-trail", proposalId] });
      qc.invalidateQueries({ queryKey: ["dashboard-activity"] });
    },
  });
}

export function useOverrideScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      proposalId,
      ...data
    }: {
      proposalId: string;
      dimension: string;
      new_score: number;
      reason: string;
      evaluator?: string;
    }) => api.overrideScore(proposalId, data),
    onSuccess: (_d, { proposalId }) => {
      qc.invalidateQueries({ queryKey: ["proposal", proposalId] });
      qc.invalidateQueries({ queryKey: ["audit-trail", proposalId] });
      qc.invalidateQueries({ queryKey: ["evaluation-results"] });
      qc.invalidateQueries({ queryKey: ["dashboard-activity"] });
    },
  });
}

export function usePublicStats() {
  return useQuery({
    queryKey: ["public-stats"],
    queryFn: api.getPublicStats,
    refetchInterval: IDLE_REFETCH_MS,
    ...queryDefaults,
  });
}

export function usePublicEscrowPreview() {
  return useQuery({
    queryKey: ["public-escrow-preview"],
    queryFn: api.getPublicEscrowPreview,
    refetchInterval: IDLE_REFETCH_MS,
    ...queryDefaults,
  });
}

export function useAgents() {
  return useQuery({
    queryKey: ["agents"],
    queryFn: api.getAgents,
    refetchInterval: IDLE_REFETCH_MS,
    ...queryDefaults,
  });
}

/** @deprecated use useAgents */
export function useAgentAddresses() {
  return useAgents();
}

export function useEscrows(evaluationId?: string) {
  return useQuery({
    queryKey: ["escrows", evaluationId],
    queryFn: () => api.listEscrows(evaluationId),
    refetchInterval: IDLE_REFETCH_MS,
    ...queryDefaults,
  });
}

export function useCreateEscrow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createEscrow,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["escrows"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useCreateProposalsBatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createProposalsBatch,
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["evaluation-results", vars.evaluation_id] });
      qc.invalidateQueries({ queryKey: ["evaluation-status", vars.evaluation_id] });
      qc.invalidateQueries({ queryKey: ["evaluations"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useSubmitMilestone() {
  return useMutation({ mutationFn: api.submitMilestone });
}

export function useApproveMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => api.approveMilestone(id, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["escrows"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      qc.invalidateQueries({ queryKey: ["dashboard-activity"] });
    },
  });
}

export function useHealthDb() {
  return useQuery({
    queryKey: ["health-db"],
    queryFn: async () => {
      const res = await fetch(
        `${getApiBaseUrl()}/health/db`,
      );
      if (!res.ok) throw new Error("Database unreachable");
      return res.json();
    },
    refetchInterval: 60_000,
    ...queryDefaults,
  });
}

export function useHealthKaspa() {
  return useQuery({
    queryKey: ["health-kaspa"],
    queryFn: async () => {
      const res = await fetch(
        `${getApiBaseUrl()}/health/kaspa`,
      );
      if (!res.ok) throw new Error("Kaspa node unreachable");
      return res.json();
    },
    refetchInterval: 60_000,
    ...queryDefaults,
  });
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ["health"],
    queryFn: api.checkHealth,
    refetchInterval: 60_000,
    ...queryDefaults,
  });
}

export { ACTIVE_REFETCH_MS };
