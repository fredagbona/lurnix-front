/**
 * Learner Profile Hook
 * React Query hook for managing learner profile from AI
 */

import { useQuery } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/services/api";

export interface LearnerAvailability {
  hoursPerWeek: number | null;
  timePerDayMinutes?: number | null;
  timeCommitment?: string | null;
  weeklyRhythm?: string | null;
  focusPreference?:
    | {
        dominant?: string | null;
        label?: string | null;
      }
    | string
    | null;
  energyPeak?: string | null;
  contextSwitch?: string | null;
  preferredSessionLength?: string | null;
  noteStyle?: string | null;
  reviewCadence?: string | null;
  supportChannels?: string[];
}

export interface LearnerProfileSnapshot {
  quizId?: string;
  quizType?: string;
  attemptId?: string;
  attemptNumber?: number;
  attemptsAllowed?: number;
  score?: number;
  passed?: boolean;
  timeSpent?: number;
  skillScores?: Array<{ id: string; name?: string; score?: number }>;
  strengths?: string[];
  gaps?: string[];
  focusAreas?: string[];
  recommendations?: string[];
  goal?: string;
  level?: string;
  style?: string;
  profileType?: string;
  dailyFocus?: string;
  visual?: number;
  handsOn?: number;
  reading?: number;
  topTraits?: Array<{ score: number; trait: string }>;
  dimensions?: any;
  resilience?: string;
  timePerDay?: number;
  motivations?: Array<{ score: number; trait: string }>;
  traitScores?: Record<string, number>;
  techAffinity?: Array<{ score: number; trait: string }>;
  preferredStack?: string[];
  problemApproach?: string;
  supportChannels?: string[];
  learningPreferences?: {
    label?: string;
    scores?: Record<string, number>;
    dominant?: string;
  };
  technicalAssessment?: {
    score?: {
      overall?: string;
      score?: number;
      breakdown?: Record<string, number>;
      flags?: Record<string, boolean>;
      assessedAt?: string;
      version?: number;
    };
    answers?: Record<string, any>;
    version?: number;
    assessedAt?: string;
  };
  profileRecommendation?: {
    key: string;
    score?: number;
    nameKey?: string;
    summaryKey?: string;
  };
}

export interface TechnicalLevel {
  overall: string | null;
  score: number | null;
  breakdown: Record<string, number>;
  flags: Record<string, boolean>;
  assessedAt?: string | null;
  version?: number | null;
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
  dailyFocus?: string | null;
  style?: string | null;
  level?: string | null;
  profileType?: string | null;
  technicalLevel?: TechnicalLevel | null;
  assessmentVersion?: string | null;
  assessmentCompletedAt?: string | null;
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
  return useQuery<LearnerProfileResponse | null>({
    queryKey: ["learnerProfile"],
    queryFn: async () => {
      try {
        const response = await apiClient.get<LearnerProfileResponse>("/ai/profile");
        return response;
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        throw error;
      }
    },
    retry: false, // Don't retry if profile doesn't exist
  });
}
