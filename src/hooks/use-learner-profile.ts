/**
 * Learner Profile Hook
 * React Query hook for managing learner profile from AI
 */

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";

export interface LearnerAvailability {
  hoursPerWeek: number | null;
  timePerDayMinutes?: number | null;
  weeklyRhythm?: string | null;
  focusPreference?: string | null;
  energyPeak?: string | null;
  contextSwitch?: string | null;
  preferredSessionLength?: string | null;
  noteStyle?: string | null;
  reviewCadence?: string | null;
  supportChannels?: string[];
}

export interface LearnerProfileSnapshot {
  goal: string;
  level: string;
  style: string;
  visual: number;
  handsOn: number;
  reading: number;
  topTraits: Array<{ score: number; trait: string }>;
  dimensions: any;
  resilience: string;
  timePerDay: number;
  motivations: Array<{ score: number; trait: string }>;
  traitScores: Record<string, number>;
  techAffinity: Array<{ score: number; trait: string }>;
  preferredStack: string[];
  problemApproach: string;
  supportChannels?: string[];
  profileRecommendation: {
    key: string;
    score: number;
    nameKey: string;
    summaryKey: string;
  };
}

export interface LearnerProfile {
  id: string;
  userId: string;
  source: "quiz" | "manual";
  hoursPerWeek: number | null;
  strengths: string[];
  gaps: string[];
  passionTags: string[];
  blockers: string[];
  goals: string[];
  availability: LearnerAvailability | null;
  rawSnapshot?: LearnerProfileSnapshot;
  createdAt: string;
  updatedAt: string;
}

export interface LearnerProfileResponse {
  success: boolean;
  data: LearnerProfile;
}

/**
 * Hook to fetch authenticated user's learner profile
 */
export function useLearnerProfile() {
  return useQuery({
    queryKey: ["learnerProfile"],
    queryFn: async () => {
      const response = await apiClient.get<LearnerProfileResponse>("/ai/profile");
      return response;
    },
    retry: false, // Don't retry if profile doesn't exist
  });
}
