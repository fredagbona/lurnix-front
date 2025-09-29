"use client";

import { useQuery } from "@tanstack/react-query";
import { subscriptionService } from "@/services";
import type { CurrentSubscription, Plan } from "@/models/subscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { useTranslations } from "next-intl";

const SubscriptionPage = () => {
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
      <div className="mx-auto max-w-3xl p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">{t("error.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t("error.subtitle")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("current.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentSubscription ? (
            <div className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">{t("current.statusLabel")}</div>
              <div className="text-base font-medium capitalize">{currentSubscription.status}</div>
              <div className="text-sm text-muted-foreground">{t("current.planLabel")}</div>
              <div className="text-base font-medium">{currentSubscription.plan.name}</div>
              <div className="text-sm text-muted-foreground">{t("current.cycleLabel")}</div>
              <div className="text-base font-medium capitalize">
                {currentSubscription.tier?.billingCycle
                  ? currentSubscription.tier.billingCycle.replace("_", " ")
                  : t("current.unavailable")}
              </div>
              {currentSubscription.currentPeriodEnd ? (
                <div className="text-sm text-muted-foreground">
                  {t("current.renewsOn")}{" "}
                  {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">{t("current.none")}</div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans?.map((plan) => (
          <Card key={plan.planType}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">{plan.description}</p>
              <ul className="mb-4 list-disc space-y-1 pl-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-sm">
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="space-y-1 text-sm">
                {plan.tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div className="capitalize">{tier.billingCycle.replace("_", " ")}</div>
                    <div className="font-semibold">${tier.pricePerPeriod}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;
