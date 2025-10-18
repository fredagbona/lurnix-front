"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { subscriptionService } from "@/services";
import type { CurrentSubscription, Plan } from "@/models/subscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import {
  UpdateProfileTab,
  PasswordUpdateForm,
  LanguageProfile,
  DeleteAccount,
  LinkedAccounts,
} from "./_components";

function SubscriptionTab() {
  const t = useTranslations("Subscription");
  const {
    data: currentSubscription,
    isLoading: isLoadingCurrent,
    error: errorCurrent,
  } = useQuery<CurrentSubscription | null>({
    queryKey: ["subscription", "current"],
    queryFn: () => subscriptionService.getCurrent(),
  });

  const {
    data: plans,
    isLoading: isLoadingPlans,
    error: errorPlans,
  } = useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: () => subscriptionService.getPlans(),
  });

  if (isLoadingCurrent || isLoadingPlans) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader />
      </div>
    );
  }

  if (errorCurrent || errorPlans) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">{t("error.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t("error.subtitle")}</p>
        </CardContent>
      </Card>
    );
  }

  const isCurrentPlan = (planType: string) => currentSubscription?.plan.planType === planType;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Current Subscription - Hero Card */}
      {currentSubscription && (
        <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 via-background to-background">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Current Plan</div>
                <CardTitle className="text-2xl sm:text-3xl">
                  {currentSubscription.plan.name}
                </CardTitle>
              </div>
              <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-semibold self-start sm:self-auto">
                {currentSubscription.status === "active" ? "✓ Active" : currentSubscription.status}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Billing Cycle</p>
                <p className="text-base sm:text-lg font-semibold capitalize">
                  {currentSubscription.tier?.billingCycle?.replace("_", " ") || "N/A"}
                </p>
              </div>
              {currentSubscription.currentPeriodEnd && (
                <div>
                  <p className="text-sm text-muted-foreground">Renews On</p>
                  <p className="text-base sm:text-lg font-semibold">
                    {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            {currentSubscription.tier?.pricePerPeriod !== undefined && (
              <div className="pt-4 border-t">
                <p className="text-xl sm:text-2xl font-bold">
                  ${currentSubscription.tier.pricePerPeriod}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{currentSubscription.tier.billingCycle?.replace("_", " ")}
                  </span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* No Subscription State */}
      {!currentSubscription && (
        <Card className="border-2 border-dashed">
          <CardContent className="py-12 text-center">
            <p className="text-lg font-semibold mb-2">No Active Subscription</p>
            <p className="text-sm text-muted-foreground">
              Choose a plan below to unlock premium features
            </p>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans?.map((plan) => {
            const isCurrent = isCurrentPlan(plan.planType);
            return (
              <Card
                key={plan.planType}
                className={
                  isCurrent
                    ? "border-2 border-primary shadow-lg relative overflow-hidden"
                    : "hover:shadow-md transition-shadow"
                }
              >
                {isCurrent && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                    CURRENT PLAN
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl sm:text-2xl">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Pricing */}
                  <div className="text-center py-3 sm:py-4">
                    {plan.tiers
                      .filter((tier) => tier.billingCycle === "monthly")
                      .map((tier) => (
                        <div key={tier.id} className="flex items-baseline justify-center gap-1">
                          <span className="text-3xl sm:text-4xl font-bold">
                            ${tier.pricePerPeriod}
                          </span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      ))}
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Features:</p>
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  {!isCurrent && (
                    <div className="pt-4 border-t">
                      <button className="w-full py-2.5 sm:py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm sm:text-base font-semibold hover:bg-primary/90 transition-colors">
                        Upgrade to {plan.name}
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const t = useTranslations("Settings");
  type SettingsTab =
    | "profile"
    | "password"
    | "language"
    | "subscription"
    | "linked_accounts"
    | "account";
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-0">
      <h1 className="text-xl sm:text-2xl font-display">{t("title")}</h1>
      <div className="border-b border-border overflow-x-auto">
        <nav className="flex space-x-4 sm:space-x-8 min-w-max">
          {[
            { id: "profile", label: t("tabs.profile") },
            { id: "password", label: t("tabs.password") },
            { id: "language", label: t("tabs.language") },
            { id: "subscription", label: t("tabs.subscription", { default: "Subscription" }) },
            { id: "linked_accounts", label: t("tabs.linked_accounts") },
            { id: "account", label: t("tabs.account") },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      {activeTab === "profile" && <UpdateProfileTab />}
      {activeTab === "password" && <PasswordUpdateForm />}
      {activeTab === "language" && <LanguageProfile />}
      {activeTab === "subscription" && <SubscriptionTab />}
      {activeTab === "linked_accounts" && <LinkedAccounts />}
      {activeTab === "account" && <DeleteAccount />}
    </div>
  );
}
