// Subscription and Plans models

export type BillingCycle = "monthly" | "six_months" | "twelve_months";

export interface PlanTier {
  id: string;
  billingCycle: BillingCycle;
  pricePerPeriod: number;
  billingAmount: number;
  commitmentMonths: number;
  discountPercentage: number;
  stripePriceId: string | null;
  paddlePriceId: string | null;
  i18nKey: string;
}

export interface PlanLimits {
  // Using permissive typing to support different shapes per plan
  [key: string]: string | number | boolean;
}

export interface Plan {
  planType: string; // e.g., "free", "builder", "master"
  name: string;
  description: string;
  features: string[];
  limits: PlanLimits;
  tiers: PlanTier[];
  i18nKey: string;
}

export interface PlansResponse {
  success: boolean;
  data: Plan[];
}

export interface CurrentSubscriptionTierInfo {
  id: string;
  billingCycle: BillingCycle;
  pricePerPeriod: number;
  billingAmount: number;
  commitmentMonths: number;
  discountPercentage: number;
  stripePriceId: string | null;
  paddlePriceId: string | null;
  i18nKey: string;
}

export interface CurrentSubscriptionPlanInfo {
  planType: string;
  name: string;
  i18nKey?: string;
}

export interface CurrentSubscription {
  id: string;
  plan: CurrentSubscriptionPlanInfo;
  tier: CurrentSubscriptionTierInfo;
  status: "active" | "canceled" | "past_due" | "trialing" | "paused" | string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CurrentSubscriptionResponse {
  success: boolean;
  data: CurrentSubscription | null;
}
