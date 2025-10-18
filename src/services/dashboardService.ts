import { apiClient } from "./api";

export interface DashboardOnboardingStep {
  id: string;
  title: string;
  description: string;
  actionLabel?: string | null;
  href?: string | null;
  completed: boolean;
  required: boolean;
}

export interface DashboardOnboardingResponse {
  success: boolean;
  data: {
    steps: DashboardOnboardingStep[];
    hasBlockingStep: boolean;
  };
}

export const dashboardService = {
  async getOnboardingStatus(): Promise<DashboardOnboardingResponse> {
    return apiClient.get<DashboardOnboardingResponse>("/dashboard/onboarding");
  },
};
