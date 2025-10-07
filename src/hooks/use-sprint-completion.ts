/**
 * Sprint Completion Hook
 * Handles the complete flow of sprint completion with proper synchronization
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useCompleteSprint, useGenerationStatus } from "@/hooks";
import { objectivesKeys } from "./use-objectives";
import { sprintsKeys } from "./use-sprints";
import type { CompleteSprintInput, CompleteSprintResponse } from "@/models/learning";
import { toast } from "sonner";

interface UseSprintCompletionOptions {
  objectiveId: string;
  sprintId: string;
  onSuccess?: (response: CompleteSprintResponse) => void;
  onError?: (error: Error) => void;
}

export function useSprintCompletion({
  objectiveId,
  sprintId,
  onSuccess,
  onError,
}: UseSprintCompletionOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const completeSprint = useCompleteSprint();
  const { refetch: refetchGenerationStatus } = useGenerationStatus(objectiveId, false);

  const [isCompleting, setIsCompleting] = useState(false);
  const [completionResult, setCompletionResult] = useState<CompleteSprintResponse["data"] | null>(
    null,
  );

  const complete = useCallback(
    async (data: CompleteSprintInput) => {
      setIsCompleting(true);
      setCompletionResult(null);

      try {
        // Step 1: Complete the sprint
        const response = await completeSprint.mutateAsync({ sprintId, data });
        setCompletionResult(response.data);

        // Step 2: Show detailed success message
        const messages: string[] = [];

        if (response.data.nextSprintGenerated && response.data.nextSprint) {
          messages.push(
            `Next sprint (Day ${response.data.nextSprint.dayNumber}) generated automatically!`,
          );
        }

        if (response.data.brainAdaptive?.skillsUpdated?.length > 0) {
          const skillCount = response.data.brainAdaptive.skillsUpdated.length;
          messages.push(`${skillCount} skill${skillCount > 1 ? "s" : ""} updated`);
        }

        if (response.data.brainAdaptive?.performanceAnalysis) {
          const analysis = response.data.brainAdaptive.performanceAnalysis;
          if (analysis.recommendedAction === "speed_up") {
            messages.push("Great performance! Difficulty increased");
          } else if (analysis.recommendedAction === "slow_down") {
            messages.push("Taking it easier - difficulty adjusted");
          }
        }

        toast.success("Sprint completed! 🎉", {
          description: messages.join(" • ") || "Great work! Check out your progress.",
          duration: 5000,
        });

        // Step 3: Verify generation status
        await new Promise((resolve) => setTimeout(resolve, 500));
        await refetchGenerationStatus();

        // Step 4: Invalidate all related queries to force fresh data
        queryClient.invalidateQueries({ queryKey: sprintsKeys.detail(sprintId) });
        queryClient.invalidateQueries({ queryKey: objectivesKeys.detail(objectiveId) });
        queryClient.invalidateQueries({ queryKey: objectivesKeys.all });

        // Step 5: Wait for cache invalidation to propagate
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Step 6: Call success callback
        if (onSuccess) {
          onSuccess(response);
        }

        // Step 7: Navigate back to objective
        router.push(`/objectives/${objectiveId}`);
        router.refresh();

        return response;
      } catch (error: any) {
        console.error("Sprint completion error:", error);

        toast.error("Failed to complete sprint", {
          description: error.message || "Please try again or contact support.",
        });

        if (onError) {
          onError(error);
        }

        throw error;
      } finally {
        setIsCompleting(false);
      }
    },
    [
      sprintId,
      objectiveId,
      completeSprint,
      refetchGenerationStatus,
      queryClient,
      router,
      onSuccess,
      onError,
    ],
  );

  return {
    complete,
    isCompleting,
    completionResult,
    isPending: completeSprint.isPending,
  };
}
