import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useLearnerProfile } from "@/hooks/use-learner-profile";
import { useObjectives } from "@/hooks/use-objectives";

export interface DashboardOnboardingStep {
  id: string;
  title: string;
  description: string;
  actionLabel?: string;
  href?: string;
  completed: boolean;
  required: boolean;
}

export interface DashboardOnboardingData {
  steps: DashboardOnboardingStep[];
  hasBlockingStep: boolean;
  isLoading: boolean;
  error?: Error;
}

export function useDashboardOnboarding(): DashboardOnboardingData {
  const t = useTranslations("Dashboard.onboarding.steps");
  const {
    data: learnerProfileResponse,
    isLoading: profileLoading,
    error: profileError,
  } = useLearnerProfile();
  const {
    data: objectivesData,
    isLoading: objectivesLoading,
    error: objectivesError,
  } = useObjectives();

  const learnerProfile = learnerProfileResponse?.data;
  const objectives = objectivesData?.objectives ?? [];

  const steps = useMemo<DashboardOnboardingStep[]>(() => {
    const hasProfile = Boolean(learnerProfile);
    const hasTechnical = Boolean(
      learnerProfile?.rawSnapshot?.technicalAssessment?.score ||
        (learnerProfile?.technicalLevel &&
          learnerProfile?.assessmentVersion &&
          learnerProfile?.assessmentCompletedAt),
    );
    const hasObjectives = objectives.length > 0;

    return [
      {
        id: "profile_quiz",
        title: t("profile.title", { default: "Complete the learner profile test" }),
        description: t("profile.description", {
          default:
            "Take the AI-powered assessment to unlock tailored insights and recommendations.",
        }),
        actionLabel: hasProfile
          ? t("profile.retake", { default: "Retake test" })
          : t("profile.begin", { default: "Begin assessment" }),
        href: "/profile-test",
        completed: hasProfile,
        required: true,
      },
      {
        id: "technical_assessment",
        title: t("technical.title", { default: "Take the technical assessment" }),
        description: t("technical.description", {
          default: "Share your technical experience so we can calibrate your skill map.",
        }),
        actionLabel: hasTechnical
          ? t("technical.retake", { default: "Retake test" })
          : t("technical.begin", { default: "Begin technical assessment" }),
        href: "/technical-assessment",
        completed: hasTechnical,
        required: true,
      },
      {
        id: "objectives",
        title: t("objectives.title", { default: "Create your objectives" }),
        description: t("objectives.description", {
          default: "Define the outcomes you want so we can recommend the right roadmap.",
        }),
        actionLabel: hasObjectives
          ? t("objectives.view", { default: "View objectives" })
          : t("objectives.create", { default: "Create objectives" }),
        href: "/objectives",
        completed: hasObjectives,
        required: true,
      },
    ];
  }, [learnerProfile, objectives, t]);

  const hasBlockingStep = steps.some((step) => step.required && !step.completed);

  const error =
    (profileError as Error | undefined) || (objectivesError as Error | undefined) || undefined;

  return {
    steps,
    hasBlockingStep,
    isLoading: profileLoading || objectivesLoading,
    error,
  };
}
