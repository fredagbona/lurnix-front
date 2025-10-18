"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  AlertTriangle,
  Anchor,
  ArrowRight,
  Brain,
  CheckCircle,
  Clock,
  Flame,
  Gauge,
  Layers,
  ListTodo,
  MessageSquare,
  Plus,
  Share2,
  Target,
  User,
  Zap,
} from "lucide-react";
import { useLearnerProfile } from "@/hooks/use-learner-profile";
import {
  useDashboardOnboarding,
  type DashboardOnboardingStep,
} from "@/hooks/use-dashboard-onboarding";
import { useObjectives } from "@/hooks/use-objectives";
import { useCurrentUser } from "@/hooks";

type TraitScore = { trait: string; score?: number | null };
type Motivator = { trait: string; score?: number | null };
type SkillScore = { id: string; name?: string | null; score?: number | null };
type TechAffinity = { trait: string; score: number };

type NullableRecord = Record<string, number> | null | undefined;

type NullableStringArray = Array<string | null | undefined> | null | undefined;

type NullableObjectArray<T> = Array<T | null | undefined> | null | undefined;

type SnapshotType = {
  visual?: number | null;
  reading?: number | null;
  handsOn?: number | null;
  timePerDay?: number | null;
};

function coerceStringArray(source: NullableStringArray): string[] {
  if (!Array.isArray(source)) {
    return [];
  }
  return source.filter((item): item is string => typeof item === "string" && item.length > 0);
}

function coerceObjectArray<T>(source: NullableObjectArray<T>): T[] {
  if (!Array.isArray(source)) {
    return [];
  }
  return source.filter((item): item is T => !!item);
}

function formatLabel(value?: string | { label?: string | null } | null): string {
  if (!value) return "Not set";
  if (typeof value === "object" && "label" in value) {
    return value.label?.replace(/_/g, " ") ?? "Not set";
  }
  if (typeof value === "string") {
    return value.replace(/_/g, " ");
  }
  return "Not set";
}

function formatMinutes(value?: number | null): string {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "—";
  }
  return `${value} mins`;
}

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const { data: currentUser } = useCurrentUser();
  const {
    data: learnerProfileResponse,
    isLoading: profileLoading,
    error: profileError,
  } = useLearnerProfile();
  const {
    steps: onboardingSteps,
    isLoading: onboardingLoading,
    error: onboardingError,
  } = useDashboardOnboarding();
  const { data: objectivesData } = useObjectives();

  const userName = currentUser?.fullname || currentUser?.username || "";

  const learnerProfile = learnerProfileResponse?.data ?? null;
  const snapshot = learnerProfile?.rawSnapshot ?? null;

  const fallbackSteps = useMemo<DashboardOnboardingStep[]>(() => {
    const hasProfile = Boolean(learnerProfile);
    const hasTechnical = Boolean(
      learnerProfile?.rawSnapshot?.technicalAssessment?.score ||
        (learnerProfile?.technicalLevel &&
          learnerProfile?.assessmentVersion &&
          learnerProfile?.assessmentCompletedAt),
    );
    const hasObjectives =
      Array.isArray(objectivesData?.objectives) && objectivesData.objectives.length > 0;

    return [
      {
        id: "profile_quiz",
        title: "Complete the learner profile test",
        description: "Take the AI-powered assessment to unlock tailored insights.",
        actionLabel: hasProfile ? "Retake test" : "Start assessment",
        href: "/profile-test",
        completed: hasProfile,
        required: true,
      },
      {
        id: "technical_assessment",
        title: "Take the technical assessment",
        description: "Help us calibrate your skill map with your technical experience.",
        actionLabel: hasTechnical ? "Retake test" : "Begin assessment",
        href: "/technical-assessment",
        completed: hasTechnical,
        required: true,
      },
      {
        id: "objectives",
        title: "Create your objectives",
        description: "Define the outcomes you want so we can recommend the right roadmap.",
        actionLabel: hasObjectives ? "View objectives" : "Create objectives",
        href: "/objectives",
        completed: hasObjectives,
        required: true,
      },
    ];
  }, [learnerProfile, objectivesData]);

  const stepsSource = onboardingSteps.length ? onboardingSteps : fallbackSteps;
  const firstPendingStep = stepsSource.find((step) => !step.completed);
  const shouldShowOnboarding = stepsSource.some((step) => !step.completed);

  const availability = learnerProfile?.availability ?? null;
  const availabilityHours = learnerProfile?.hoursPerWeek ?? availability?.hoursPerWeek ?? null;
  const timePerDayMinutes = availability?.timePerDayMinutes ?? snapshot?.timePerDay ?? null;
  const timeCommitment = availability?.timeCommitment ?? null;
  const weeklyRhythm = formatLabel(availability?.weeklyRhythm);
  const energyPeak = formatLabel(availability?.energyPeak);
  const focusPreference = formatLabel(availability?.focusPreference);
  const contextSwitch = formatLabel(availability?.contextSwitch);
  const noteStyle = formatLabel(availability?.noteStyle);
  const reviewCadence = formatLabel(availability?.reviewCadence);
  const technicalLevel = learnerProfile?.technicalLevel ?? null;

  const supportChannels = coerceStringArray(
    Array.isArray(availability?.supportChannels)
      ? availability?.supportChannels
      : (snapshot?.supportChannels ?? null),
  );

  const strengths = coerceStringArray(learnerProfile?.strengths);
  const gaps = coerceStringArray(learnerProfile?.gaps);
  const passionTags = coerceStringArray(learnerProfile?.passionTags);
  const blockers = coerceStringArray(learnerProfile?.blockers);
  const goals = coerceStringArray(learnerProfile?.goals);

  const focusAreas = coerceStringArray(snapshot?.focusAreas);
  const recommendations = coerceStringArray(snapshot?.recommendations);
  const preferredStack = coerceStringArray(snapshot?.preferredStack);
  const snapshotStrengths = coerceStringArray(snapshot?.strengths);
  const snapshotGaps = coerceStringArray(snapshot?.gaps);

  const motivations = coerceObjectArray<Motivator>(snapshot?.motivations);
  const topTraits = coerceObjectArray<TraitScore>(snapshot?.topTraits).slice(0, 4);
  const skillScores = coerceObjectArray<SkillScore>(snapshot?.skillScores);
  const techAffinity = coerceObjectArray<TechAffinity>(snapshot?.techAffinity);
  const traitScores = (snapshot?.traitScores as NullableRecord) ?? null;

  const problemApproach = snapshot?.problemApproach ?? null;
  const resilience = snapshot?.resilience ?? null;
  const profileRecommendation = snapshot?.profileRecommendation ?? null;

  const uniqueStrengths = Array.from(new Set([...strengths, ...snapshotStrengths]));
  const uniqueGaps = Array.from(new Set([...gaps, ...snapshotGaps]));

  const learningSnapshot: SnapshotType | null = snapshot ? snapshot : null;

  const learningPreferences = [
    { label: "Visual", value: Number(learningSnapshot?.visual ?? 0) },
    { label: "Reading", value: Number(learningSnapshot?.reading ?? 0) },
    { label: "Hands-on", value: Number(learningSnapshot?.handsOn ?? 0) },
  ];

  const traitMax =
    topTraits.reduce((max, trait) => Math.max(max, Number(trait?.score ?? 0)), 0) || 1;

  const quizScore = typeof snapshot?.score === "number" ? snapshot.score : null;
  const quizPassed = typeof snapshot?.passed === "boolean" ? snapshot.passed : null;
  const quizTimeSpent = typeof snapshot?.timeSpent === "number" ? snapshot.timeSpent : null;
  const quizAttemptNumber =
    typeof snapshot?.attemptNumber === "number" ? snapshot.attemptNumber : null;
  const quizAttemptsAllowed =
    typeof snapshot?.attemptsAllowed === "number" ? snapshot.attemptsAllowed : null;

  const getStepHref = (step: DashboardOnboardingStep) => {
    if (step.href) return step.href;
    const normalized = step.id.toLowerCase();
    if (normalized.includes("technical")) return "/technical-assessment";
    if (normalized.includes("objective")) return "/profile-objectives";
    if (normalized.includes("profile")) return "/profile-test";
    return "/dashboard";
  };

  if (profileLoading || onboardingLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            Loading your dashboard...
          </div>
        </Card>
      </div>
    );
  }

  if (profileError || onboardingError) {
    const message =
      profileError instanceof Error
        ? profileError.message
        : onboardingError instanceof Error
          ? onboardingError.message
          : "Something went wrong while fetching your data.";

    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <p className="text-sm text-muted-foreground">{message}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const hasProfile = Boolean(learnerProfile);
  const hasSnapshot = Boolean(snapshot);
  const hasTechnicalLevel = Boolean(technicalLevel);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative p-6 md:p-8">
          {shouldShowOnboarding ? (
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold">
                <span className="inline-block mr-2">🎉</span>
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {t("welcome.onboarding.title", { name: userName })}
                </span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                {t("welcome.onboarding.subtitle")}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold">
                {t("welcome.active.title", { name: userName })}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                {t("welcome.active.subtitle")}
              </p>
            </div>
          )}
        </div>
      </Card>

      {shouldShowOnboarding ? (
        <Card className="p-4 sm:p-6 space-y-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                {t("onboarding.title", { default: "Kickstart your learning journey" })}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("onboarding.description", {
                  default: "Complete each step to unlock your personalized roadmap.",
                })}
              </p>
            </div>
            {firstPendingStep ? (
              <Link href={getStepHref(firstPendingStep)} className="w-full md:w-auto">
                <Button className="flex items-center gap-2 w-full md:w-auto justify-center">
                  {firstPendingStep.actionLabel ??
                    t("onboarding.continue", { default: "Continue" })}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : null}
          </div>

          <div className="space-y-3">
            {stepsSource.map((step, index) => {
              const isCompleted = Boolean(step.completed);
              const isCurrent = !isCompleted && firstPendingStep?.id === step.id;
              const href = getStepHref(step);
              const actionLabel = step.actionLabel ?? (isCurrent ? "Continue" : "View");
              const isProfileOrTechnical =
                step.id === "profile_quiz" || step.id === "technical_assessment";

              return (
                <div
                  key={step.id}
                  className={`rounded-lg border transition-all ${
                    isCompleted
                      ? "border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/30 dark:bg-emerald-950/10"
                      : isCurrent
                        ? "border-primary/60 bg-primary/5"
                        : "border-border/60 bg-card"
                  }`}
                >
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                            isCompleted
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : isCurrent
                                ? "border-primary bg-primary text-white"
                                : "border-muted-foreground/30 bg-muted text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <span className="text-sm font-semibold">{index + 1}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <h3 className="font-semibold text-sm sm:text-base">{step.title}</h3>
                            {isCompleted && (
                              <Badge
                                variant="secondary"
                                className="self-start bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50"
                              >
                                ✓ {t("onboarding.completed", { default: "Completed" })}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Link href={href} className="inline-flex">
                            <Button
                              size="sm"
                              variant={isCompleted ? "outline" : isCurrent ? "default" : "outline"}
                              className={
                                isCompleted
                                  ? "border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/20"
                                  : ""
                              }
                            >
                              {actionLabel}
                            </Button>
                          </Link>
                          {isCompleted && !isProfileOrTechnical && (
                            <span className="text-xs text-muted-foreground">•</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : null}

      {hasProfile && hasSnapshot ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6">
          <Card className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">
                {t("profile.title", { default: "AI Profile Overview" })}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {t("profile.profileType", { default: "Profile Type" })}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {snapshot?.profileType ?? learnerProfile?.profileType ?? "—"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t("profile.level", { default: "Level" })}
                    </p>
                    <p className="font-semibold capitalize">
                      {learnerProfile?.level ?? snapshot?.level ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t("profile.style", { default: "Style" })}
                    </p>
                    <p className="font-semibold capitalize">
                      {learnerProfile?.style ?? snapshot?.style ?? "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border/60 p-3 sm:p-4 space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {t("profile.dailyFocus", { default: "Daily Focus" })}
                </p>
                <p className="text-base font-semibold">
                  {snapshot?.dailyFocus ??
                    learnerProfile?.dailyFocus ??
                    formatMinutes(timePerDayMinutes)}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border/60 p-3 sm:p-4 space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">
                  {t("profile.learningPreferences", { default: "Learning Preferences" })}
                  {snapshot?.learningPreferences?.dominant && (
                    <span className="ml-2 text-xs font-normal text-muted-foreground capitalize">
                      ({snapshot.learningPreferences.dominant.replace(/_/g, " ")})
                    </span>
                  )}
                </p>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                {snapshot?.learningPreferences?.scores
                  ? Object.entries(snapshot.learningPreferences.scores).map(([key, value]) => {
                      const percentage = Math.round(Math.min(Math.max(Number(value), 0), 100));
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground capitalize">{key}</span>
                            <span className="font-medium">{percentage}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/60"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  : learningPreferences.map(({ label, value }) => {
                      const percentage = Math.round(Math.min(Math.max(value * 100, 0), 100));
                      return (
                        <div key={label} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{label}</span>
                            <span className="font-medium">{percentage}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/60"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>

            {goals.length ? (
              <div className="rounded-lg border border-border/60 p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <p className="font-semibold">
                    {t("profile.whatDrivesYou", { default: "What Drives You" })}
                  </p>
                </div>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  {goals.map((goal, index) => (
                    <li key={`${goal}-${index}`} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Card>

          <Card className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">
                {t("availability.title", { default: "Availability & Rhythm" })}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
              {timeCommitment ? (
                <div className="flex items-start gap-3 rounded-lg border border-border/60 p-3">
                  <Gauge className="h-4 w-4 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">
                      {t("availability.timeCommitment", { default: "Time Commitment" })}
                    </p>
                    <p className="text-muted-foreground capitalize">{timeCommitment}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 sm:gap-3 rounded-lg border border-border/60 p-2.5 sm:p-3">
                  <Gauge className="h-4 w-4 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">
                      {t("availability.weeklyHours", { default: "Weekly Hours" })}
                    </p>
                    <p className="text-muted-foreground">
                      {availabilityHours ?? "—"} hrs · {timePerDayMinutes ?? "—"} mins/day
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2 sm:gap-3 rounded-lg border border-border/60 p-2.5 sm:p-3">
                <Layers className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="font-semibold">
                    {t("availability.weeklyRhythm", { default: "Weekly Rhythm" })}
                  </p>
                  <p className="text-muted-foreground capitalize">{weeklyRhythm}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 rounded-lg border border-border/60 p-2.5 sm:p-3">
                <Flame className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="font-semibold">
                    {t("availability.energyPeak", { default: "Energy Peak" })}
                  </p>
                  <p className="text-muted-foreground capitalize">{energyPeak}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 rounded-lg border border-border/60 p-2.5 sm:p-3">
                <Anchor className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="font-semibold">
                    {t("availability.contextSwitching", { default: "Context Switching" })}
                  </p>
                  <p className="text-muted-foreground capitalize">{contextSwitch}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 rounded-lg border border-border/60 p-2.5 sm:p-3">
                <MessageSquare className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="font-semibold">
                    {t("availability.noteReview", { default: "Note & Review" })}
                  </p>
                  <p className="text-muted-foreground capitalize">
                    {noteStyle} · {reviewCadence}
                  </p>
                </div>
              </div>
            </div>

            {supportChannels.length ? (
              <div className="rounded-lg border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Share2 className="h-5 w-5 text-primary" />
                  <p className="font-semibold text-base">
                    {t("availability.supportChannels", { default: "Preferred Support Channels" })}
                  </p>
                </div>
                <ul className="space-y-1.5 sm:space-y-2">
                  {supportChannels.map((channel, index) => (
                    <li key={`${channel}-${index}`} className="flex items-start gap-3 text-sm">
                      <span className="text-primary mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-foreground">{channel.replace(/_/g, " ")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Card>

          <Card className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">
                {t("insights.title", { default: "AI Profile Insights" })}
              </h2>
            </div>

            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
              {uniqueStrengths.length ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {t("insights.strengths", { default: "Strengths" })}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {uniqueStrengths.map((item) => (
                      <Badge key={item} variant="secondary" className="capitalize">
                        {item.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              {uniqueGaps.length ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {t("insights.gaps", { default: "Gaps" })}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {uniqueGaps.map((item) => (
                      <Badge key={item} className="capitalize">
                        {item.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              {passionTags.length ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {t("insights.passions", { default: "Passions" })}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {passionTags.map((item) => (
                      <Badge key={item} variant="outline" className="capitalize">
                        {item.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              {blockers.length ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    {t("insights.blockers", { default: "Blockers" })}
                  </p>
                  <div className="space-y-2">
                    {blockers.map((item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className="rounded-lg border border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20 p-2.5 sm:p-3 text-xs sm:text-sm"
                      >
                        <p className="text-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {preferredStack.length ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {t("insights.preferredStack", { default: "Preferred Stack" })}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {preferredStack.map((item) => (
                      <Badge key={item} variant="secondary" className="capitalize">
                        {item.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              {motivations.length ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {t("insights.topMotivators", { default: "Top Motivators" })}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {motivations
                      .filter((item) => Number(item?.score ?? 0) > 0)
                      .slice(0, 4)
                      .map((item) => (
                        <Badge key={item.trait} className="capitalize">
                          {item.trait.replace(/_/g, " ")}
                        </Badge>
                      ))}
                  </div>
                </div>
              ) : null}

              {topTraits.length ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Signature Traits
                  </p>
                  <div className="space-y-1.5 sm:space-y-2">
                    {topTraits.map((trait) => {
                      const rawScore = Number(trait?.score ?? 0);
                      const progress = Math.round((rawScore / traitMax) * 100);
                      return (
                        <div key={trait.trait} className="flex items-center gap-2 sm:gap-4">
                          <span className="flex-1 capitalize text-xs sm:text-sm">
                            {trait.trait.replace(/_/g, " ")}
                          </span>
                          <div className="flex min-w-[100px] sm:min-w-[150px] items-center gap-2 sm:gap-3">
                            <div className="relative h-2 flex-1 rounded-full bg-muted">
                              <div
                                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                            <span className="w-8 sm:w-10 text-right text-[10px] sm:text-xs text-muted-foreground">
                              {rawScore.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {techAffinity.length ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Tech Affinity
                  </p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {techAffinity.map((item, index) => (
                      <li key={`${item.trait}-${index}`}>
                        {item.trait.replace(/_/g, " ")} · {item.score}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {traitScores ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Trait Scores
                  </p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {Object.entries(traitScores).map(([key, value]) => (
                      <li key={key}>
                        {key.replace(/_/g, " ")} · {value}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {problemApproach ? (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Problem Approach
                  </p>
                  <p className="text-sm text-muted-foreground">{problemApproach}</p>
                </div>
              ) : null}

              {resilience ? (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Resilience
                  </p>
                  <p className="text-sm text-muted-foreground">{resilience}</p>
                </div>
              ) : null}

              {hasTechnicalLevel && technicalLevel ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Technical Assessment
                  </p>
                  <div className="rounded-lg border border-border/60 p-2.5 sm:p-3 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Overall Level</span>
                      <Badge variant="secondary" className="capitalize">
                        {technicalLevel.overall ?? "—"}
                      </Badge>
                    </div>
                    {technicalLevel.score !== null && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Score</span>
                        <span className="text-muted-foreground">
                          {technicalLevel.score.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {Object.keys(technicalLevel.breakdown).length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Breakdown</p>
                        {Object.entries(technicalLevel.breakdown).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground capitalize">
                              {key.replace(/_/g, " ")}
                            </span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {Object.keys(technicalLevel.flags).length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Readiness Flags</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(technicalLevel.flags)
                            .filter(([, value]) => value)
                            .map(([key]) => (
                              <Badge key={key} variant="outline" className="text-xs">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}
                    {technicalLevel.assessedAt && (
                      <p className="text-xs text-muted-foreground">
                        Assessed: {new Date(technicalLevel.assessedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
