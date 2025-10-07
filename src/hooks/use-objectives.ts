/**
 * Objectives Hooks
 * React Query hooks for managing objectives
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { objectivesService } from "@/services";
import type {
  CreateObjectiveInput,
  UpdateObjectiveInput,
  ObjectivesResponse,
  ObjectiveResponse,
} from "@/models/learning";

// ============================================================================
// QUERY KEYS
// ============================================================================

export const objectivesKeys = {
  all: ["objectives"] as const,
  lists: () => [...objectivesKeys.all, "list"] as const,
  list: (filters?: Record<string, any>) => [...objectivesKeys.lists(), filters] as const,
  details: () => [...objectivesKeys.all, "detail"] as const,
  detail: (id: string) => [...objectivesKeys.details(), id] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook to fetch all objectives
 */
export function useObjectives() {
  return useQuery({
    queryKey: objectivesKeys.lists(),
    queryFn: () => objectivesService.getObjectives(),
    select: (data) => ({
      objectives: data.data.objectives || [],
      planLimits: data.data.planLimits,
    }),
  });
}

/**
 * Hook to fetch a single objective by ID
 */
export function useObjective(objectiveId: string | undefined) {
  return useQuery({
    queryKey: objectivesKeys.detail(objectiveId!),
    queryFn: () => objectivesService.getObjective(objectiveId!),
    enabled: !!objectiveId, // Only run query if objectiveId exists
    select: (data) => data.data.objective, // Extract the objective from response
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook to create a new objective
 */
export function useCreateObjective() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateObjectiveInput) => objectivesService.createObjective(data),
    onSuccess: (response) => {
      // Invalidate objectives list to refetch
      queryClient.invalidateQueries({ queryKey: objectivesKeys.lists() });
      
      // Optionally set the new objective in cache
      queryClient.setQueryData(
        objectivesKeys.detail(response.data.objective.id),
        response
      );
    },
  });
}

/**
 * Hook to update an existing objective
 */
export function useUpdateObjective() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateObjectiveInput }) =>
      objectivesService.updateObjective(id, data),
    onSuccess: (response, variables) => {
      // Invalidate the specific objective
      queryClient.invalidateQueries({ queryKey: objectivesKeys.detail(variables.id) });
      
      // Invalidate objectives list
      queryClient.invalidateQueries({ queryKey: objectivesKeys.lists() });
    },
  });
}

/**
 * Hook to delete an objective
 */
export function useDeleteObjective() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (objectiveId: string) => objectivesService.deleteObjective(objectiveId),
    onSuccess: (_, objectiveId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: objectivesKeys.detail(objectiveId) });
      
      // Invalidate objectives list
      queryClient.invalidateQueries({ queryKey: objectivesKeys.lists() });
    },
  });
}

/**
 * Hook to generate next sprint for an objective
 */
export function useGenerateSprint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (objectiveId: string) => objectivesService.generateSprint(objectiveId),
    onSuccess: (response, objectiveId) => {
      // Invalidate the objective to refetch with new sprint
      queryClient.invalidateQueries({ queryKey: objectivesKeys.detail(objectiveId) });
      
      // Invalidate objectives list
      queryClient.invalidateQueries({ queryKey: objectivesKeys.lists() });
    },
  });
}
