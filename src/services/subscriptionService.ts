import { apiClient } from "./api";
import type { CurrentSubscriptionResponse, PlansResponse, Plan } from "@/models/subscription";

export const subscriptionService = {
  async getCurrent() {
    const response = await apiClient.get<CurrentSubscriptionResponse>("/subscriptions/current");
    return response.data;
  },

  async getPlans() {
    const response = await apiClient.get<PlansResponse>("/plans");
    return response.data;
  },

  async getPlanPricing(planType: string) {
    const response = await apiClient.get<{ success: boolean; data: Plan }>(
      `/plans/${planType}/pricing`,
    );
    return response.data;
  },
};
