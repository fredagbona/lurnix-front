import { useQuery } from "@tanstack/react-query";
import { quizService } from "@/services";

export const roadmapProfileKeys = {
  all: ["roadmapProfile"] as const,
  detail: () => [...roadmapProfileKeys.all, "detail"] as const,
};

export const useRoadmapProfile = () => {
  return useQuery({
    queryKey: roadmapProfileKeys.detail(),
    queryFn: quizService.getRoadmapProfile,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
