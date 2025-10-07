/**
 * Skills Hooks
 * React Query hooks for managing skills and performance
 */

import { useQuery } from "@tanstack/react-query";
import { skillsService, performanceService } from "@/services";

// ============================================================================
// QUERY KEYS
// ============================================================================

export const skillsKeys = {
  all: ["skills"] as const,
  maps: () => [...skillsKeys.all, "map"] as const,
  map: (userId: string, objectiveId?: string) =>
    [...skillsKeys.maps(), userId, objectiveId] as const,
  userSkills: (objectiveId?: string) => [...skillsKeys.all, "user", objectiveId] as const,
  detail: (skillId: string) => [...skillsKeys.all, "detail", skillId] as const,
};

export const performanceKeys = {
  all: ["performance"] as const,
  objective: (objectiveId: string) => [...performanceKeys.all, "objective", objectiveId] as const,
  user: () => [...performanceKeys.all, "user"] as const,
};

// ============================================================================
// SKILLS QUERIES
// ============================================================================

/**
 * Hook to fetch skill map for a specific user and objective
 */
export function useSkillMap(userId: string, objectiveId?: string) {
  return useQuery({
    queryKey: skillsKeys.map(userId, objectiveId),
    queryFn: () => skillsService.getSkillMap(userId, objectiveId),
    select: (data) => data.data.skillMap,
  });
}

/**
 * Hook to fetch current user's skills
 */
export function useUserSkills(objectiveId?: string) {
  return useQuery({
    queryKey: skillsKeys.userSkills(objectiveId),
    queryFn: () => skillsService.getUserSkills(objectiveId),
    select: (data) => data.data.skillMap,
  });
}

/**
 * Hook to fetch details for a specific skill
 */
export function useSkillDetails(skillId: string | undefined) {
  return useQuery({
    queryKey: skillsKeys.detail(skillId!),
    queryFn: () => skillsService.getSkillDetails(skillId!),
    enabled: !!skillId,
  });
}

// ============================================================================
// PERFORMANCE QUERIES
// ============================================================================

/**
 * Hook to fetch performance analytics for an objective
 */
export function useObjectivePerformance(objectiveId: string | undefined) {
  return useQuery({
    queryKey: performanceKeys.objective(objectiveId!),
    queryFn: () => performanceService.getObjectivePerformance(objectiveId!),
    enabled: !!objectiveId,
    select: (data) => data.data.performance,
  });
}

/**
 * Hook to fetch overall user performance
 */
export function useUserPerformance() {
  return useQuery({
    queryKey: performanceKeys.user(),
    queryFn: () => performanceService.getUserPerformance(),
    select: (data) => data.data.performance,
  });
}
