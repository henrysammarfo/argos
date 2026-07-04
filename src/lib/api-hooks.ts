import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./api";

export function useEvaluations() {
  return useQuery({
    queryKey: ["evaluations"],
    queryFn: api.listEvaluations,
    retry: 1,
  });
}

export function useEvaluation(id: string) {
  return useQuery({
    queryKey: ["evaluation", id],
    queryFn: () => api.getEvaluation(id),
    enabled: !!id,
  });
}

export function useEvaluationStatus(id: string, poll = false) {
  return useQuery({
    queryKey: ["evaluation-status", id],
    queryFn: () => api.getEvaluationStatus(id),
    enabled: !!id,
    refetchInterval: poll ? 2000 : false,
  });
}

export function useEvaluationResults(id: string) {
  return useQuery({
    queryKey: ["evaluation-results", id],
    queryFn: () => api.getEvaluationResults(id),
    enabled: !!id,
  });
}

export function useCreateEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createEvaluation,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["evaluations"] }),
  });
}

export function useRunEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.runEvaluation,
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: ["evaluation-status", id] });
      qc.invalidateQueries({ queryKey: ["evaluation-results", id] });
    },
  });
}

export function useProposal(id: string) {
  return useQuery({
    queryKey: ["proposal", id],
    queryFn: () => api.getProposal(id),
    enabled: !!id,
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
      qc.invalidateQueries({ queryKey: ["evaluation-results"] });
    },
  });
}

export function useAgentAddresses() {
  return useQuery({
    queryKey: ["agents"],
    queryFn: api.getAgentAddresses,
    retry: 1,
  });
}

export function useEscrows(evaluationId?: string) {
  return useQuery({
    queryKey: ["escrows", evaluationId],
    queryFn: () => api.listEscrows(evaluationId),
    retry: 1,
  });
}

export function useCreateEscrow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createEscrow,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["escrows"] }),
  });
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ["health"],
    queryFn: api.checkHealth,
    retry: 1,
    staleTime: 30_000,
  });
}
