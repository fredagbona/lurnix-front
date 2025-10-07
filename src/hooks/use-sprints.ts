/**
 * Sprints Hooks
 * React Query hooks for managing sprints
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sprintsService } from "@/services";
import { objectivesKeys } from "./use-objectives";
import type {
  CompleteSprintInput,
  SprintResponse,
  CompleteSprintResponse,
} from "@/models/learning";

// ============================================================================
// QUERY KEYS
// ============================================================================

export const sprintsKeys = {
  all: ["sprints"] as const,
  details: () => [...sprintsKeys.all, "detail"] as const,
  detail: (id: string) => [...sprintsKeys.details(), id] as const,
  readiness: (id: string) => [...sprintsKeys.detail(id), "readiness"] as const,
  validation: (id: string) => [...sprintsKeys.detail(id), "validation"] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook to fetch a single sprint by ID
 */
export function useSprint(objectiveId: string | undefined, sprintId: string | undefined) {
  return useQuery({
    queryKey: sprintsKeys.detail(sprintId!),
    queryFn: () => sprintsService.getSprint(objectiveId!, sprintId!),
    enabled: !!objectiveId && !!sprintId,
    select: (data) => data.data,
  });
}

/**
 * Hook to check sprint readiness (pre-sprint quiz check)
 */
export function useSprintReadiness(objectiveId: string | undefined, sprintId: string | undefined) {
  return useQuery({
    queryKey: sprintsKeys.readiness(sprintId!),
    queryFn: () => sprintsService.getSprintReadiness(objectiveId!, sprintId!),
    enabled: !!objectiveId && !!sprintId,
    select: (data) => data.data,
  });
}

/**
 * Hook to check sprint validation (post-sprint quiz check)
 */
export function useSprintValidation(objectiveId: string | undefined, sprintId: string | undefined) {
  return useQuery({
    queryKey: sprintsKeys.validation(sprintId!),
    queryFn: () => sprintsService.getSprintValidation(objectiveId!, sprintId!),
    enabled: !!objectiveId && !!sprintId,
    select: (data) => data.data,
  });
}

/**
 * Hook to check sprint completion status
 */
export function useSprintCompletionStatus(sprintId: string | undefined) {
  return useQuery({
    queryKey: [...sprintsKeys.detail(sprintId!), "completion-status"],
    queryFn: () => sprintsService.getSprintCompletionStatus(sprintId!),
    enabled: !!sprintId,
    select: (data) => data.data,
  });
}

/**
 * Hook to check generation status for an objective
 */
export function useGenerationStatus(objectiveId: string | undefined, enablePolling = false) {
  return useQuery({
    queryKey: [...objectivesKeys.detail(objectiveId!), "generation-status"],
    queryFn: () => sprintsService.getGenerationStatus(objectiveId!),
    enabled: !!objectiveId,
    select: (data) => data.data,
    refetchInterval: enablePolling ? 3000 : false,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook to start a sprint
 */
export function useStartSprint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ objectiveId, sprintId }: { objectiveId: string; sprintId: string }) =>
      sprintsService.startSprint(objectiveId, sprintId),
    onSuccess: (response, variables) => {
      // Update sprint in cache
      queryClient.setQueryData(sprintsKeys.detail(variables.sprintId), response);

      // Invalidate related objective
      queryClient.invalidateQueries({
        queryKey: objectivesKeys.detail(variables.objectiveId),
      });
    },
  });
}

/**
 * Hook to complete a sprint
 */
export function useCompleteSprint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sprintId, data }: { sprintId: string; data: CompleteSprintInput }) =>
      sprintsService.completeSprint(sprintId, data),
    onSuccess: (response, variables) => {
      // Invalidate the completed sprint
      queryClient.invalidateQueries({ queryKey: sprintsKeys.detail(variables.sprintId) });

      // Invalidate ALL objectives queries to force refetch
      queryClient.invalidateQueries({ queryKey: objectivesKeys.all });
      queryClient.invalidateQueries({ queryKey: objectivesKeys.lists() });

      // Remove all objective detail caches to force fresh fetch
      queryClient.removeQueries({ queryKey: objectivesKeys.details() });
    },
  });
}

/**
 * Hook to update sprint progress
 */
export function useUpdateSprintProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      objectiveId,
      sprintId,
      data,
    }: {
      objectiveId: string;
      sprintId: string;
      data: { completedTasks: number; totalTasks: number };
    }) => sprintsService.updateSprintProgress(objectiveId, sprintId, data),
    onSuccess: (response, variables) => {
      // Optimistically update sprint in cache
      queryClient.setQueryData(sprintsKeys.detail(variables.sprintId), response);
    },
  });
}

/**
 * Hook to manually generate next sprint
 */
export function useGenerateNextSprint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ objectiveId, force }: { objectiveId: string; force?: boolean }) =>
      sprintsService.generateNextSprint(objectiveId, { force }),
    onSuccess: (response, variables) => {
      // Invalidate objective to refetch with new sprint
      queryClient.invalidateQueries({ queryKey: objectivesKeys.detail(variables.objectiveId) });
      queryClient.invalidateQueries({ queryKey: objectivesKeys.all });
    },
  });
}
