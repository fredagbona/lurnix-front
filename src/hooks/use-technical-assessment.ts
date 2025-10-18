import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { technicalAssessmentService } from "@/services";
import type {
  TechnicalAssessmentResponse,
  TechnicalAssessmentSubmitInput,
  TechnicalAssessmentSubmitResponse,
} from "@/models";

const technicalAssessmentKeys = {
  all: ["technicalAssessment"] as const,
};

export function useTechnicalAssessment() {
  return useQuery<TechnicalAssessmentResponse>({
    queryKey: technicalAssessmentKeys.all,
    queryFn: () => technicalAssessmentService.getAssessment(),
  });
}

export function useSubmitTechnicalAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TechnicalAssessmentSubmitInput) =>
      technicalAssessmentService.submitAssessment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: technicalAssessmentKeys.all });
      queryClient.invalidateQueries({ queryKey: ["learnerProfile"] });
    },
  });
}
