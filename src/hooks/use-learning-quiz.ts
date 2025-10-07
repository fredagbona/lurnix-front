/**
 * Learning Quiz Hooks
 * React Query hooks for managing learning quizzes
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { learningQuizService } from "@/services/quizService";
import type { SubmitQuizInput } from "@/models/quiz";

// ============================================================================
// QUERY KEYS
// ============================================================================

export const learningQuizKeys = {
  all: ["learningQuizzes"] as const,
  details: () => [...learningQuizKeys.all, "detail"] as const,
  detail: (id: string) => [...learningQuizKeys.details(), id] as const,
  attempts: (id: string) => [...learningQuizKeys.detail(id), "attempts"] as const,
  attempt: (quizId: string, attemptId: string) =>
    [...learningQuizKeys.attempts(quizId), attemptId] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook to fetch a learning quiz by ID
 */
export function useLearningQuiz(quizId: string | undefined) {
  return useQuery({
    queryKey: learningQuizKeys.detail(quizId!),
    queryFn: () => learningQuizService.getQuiz(quizId!),
    enabled: !!quizId,
    select: (data) => data.data.quiz,
  });
}

/**
 * Hook to fetch quiz attempts history
 */
export function useQuizAttempts(quizId: string | undefined) {
  return useQuery({
    queryKey: learningQuizKeys.attempts(quizId!),
    queryFn: () => learningQuizService.getQuizAttempts(quizId!),
    enabled: !!quizId,
    select: (data) => data.data,
  });
}

/**
 * Hook to fetch a specific quiz attempt
 */
export function useQuizAttempt(quizId: string | undefined, attemptId: string | undefined) {
  return useQuery({
    queryKey: learningQuizKeys.attempt(quizId!, attemptId!),
    queryFn: () => learningQuizService.getQuizAttempt(quizId!, attemptId!),
    enabled: !!quizId && !!attemptId,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook to submit quiz answers
 */
export function useSubmitQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, submission }: { quizId: string; submission: SubmitQuizInput }) =>
      learningQuizService.submitQuiz(quizId, submission),
    onSuccess: (response, variables) => {
      // Invalidate quiz attempts to refetch
      queryClient.invalidateQueries({ queryKey: learningQuizKeys.attempts(variables.quizId) });

      // Invalidate quiz to update attempts used
      queryClient.invalidateQueries({ queryKey: learningQuizKeys.detail(variables.quizId) });
    },
  });
}
