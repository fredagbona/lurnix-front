"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Circle,
  ArrowRight,
  Gauge,
  Target,
  Heart,
  Wrench,
  Plus,
  User,
  Clock,
  Zap,
  AlertCircle,
} from "lucide-react";
import { useLearnerProfile } from "@/hooks";
import { ObjectivesList, CreateObjectiveModal } from "@/components/learning";

export default function DashboardPage() {
  const t = useTranslations("Dashboard.page");
  const { data: learnerProfile, isLoading, error } = useLearnerProfile();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const hasCompletedProfileTest = !!learnerProfile?.data;

  return (
    <div className="space-y-6">
      {/* Onboarding Section */}
      {!hasCompletedProfileTest && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex md:flex-row flex-col md:items-center justify-between">
            <div className="md:mb-0 mb-4">
              <h2 className="text-lg font-semibold">
                {t("onboarding.title", { default: "Complete Your Profile" })}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t("onboarding.subtitle", {
                  default: "Take our profile test to get personalized recommendations",
                })}
              </p>
            </div>
            <Link href="/profile-test">
              <Button className="flex items-center gap-2">
                {t("onboarding.start_test", { default: "Start Profile Test" })}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              {hasCompletedProfileTest ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span
                className={`text-sm ${hasCompletedProfileTest ? "text-green-600" : "text-muted-foreground"}`}
              >
                {t("onboarding.profile_test", { default: "Complete Profile Test" })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Circle className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {t("onboarding.personalized_roadmap", {
                  default: "Get Personalized Learning Roadmap",
                })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Circle className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {t("onboarding.start_learning", { default: "Start Your Learning Journey" })}
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Learner Profile Section */}
      {hasCompletedProfileTest && learnerProfile?.data?.rawSnapshot && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Learning Profile Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Learning Profile</h2>
              </div>
              <Link href="/profile-test">
                <Button variant="outline" size="sm">
                  Retake Test
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {/* Profile Type */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Profile Type</p>
                <Badge className="text-base px-3 py-1">
                  {learnerProfile.data.rawSnapshot.profileRecommendation?.key.replace(/_/g, " ")}
                </Badge>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="font-medium capitalize">{learnerProfile.data.rawSnapshot.level}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Style</p>
                  <p className="font-medium capitalize">{learnerProfile.data.rawSnapshot.style}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time / day</p>
                  <p className="font-medium">{learnerProfile.data.rawSnapshot.timePerDay} mins</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resilience</p>
                  <p className="font-medium capitalize">
                    {learnerProfile.data.rawSnapshot.resilience?.replace(/_/g, " ")}
                  </p>
                </div>
              </div>

              {/* Learning Preferences */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Learning Preferences</p>
                {[
                  ["Visual", Math.round(learnerProfile.data.rawSnapshot.visual * 100)],
                  ["Reading", Math.round(learnerProfile.data.rawSnapshot.reading * 100)],
                  ["Hands-on", Math.round(learnerProfile.data.rawSnapshot.handsOn * 100)],
                ].map(([label, value]) => (
                  <div key={label as string} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Tech Interests & Traits */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Interests & Traits</h2>
            </div>

            <div className="space-y-6">
              {/* Tech Affinity */}
              <div>
                <p className="text-sm font-medium mb-3">Tech Interests</p>
                <div className="flex flex-wrap gap-2">
                  {learnerProfile.data.rawSnapshot.preferredStack?.map(
                    (tech: string, index: number) => (
                      <Badge key={index} variant="secondary" className="capitalize">
                        {tech.replace(/_/g, " ")}
                      </Badge>
                    ),
                  )}
                </div>
              </div>

              {/* Top Traits */}
              <div>
                <p className="text-sm font-medium mb-3">Top Traits</p>
                <div className="space-y-2">
                  {learnerProfile.data.rawSnapshot.topTraits
                    ?.slice(0, 5)
                    .map((trait: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{trait.trait.replace(/_/g, " ")}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 rounded-full bg-muted">
                            <div
                              className="h-2 rounded-full bg-primary"
                              style={{ width: `${(trait.score / 12) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8 text-right">
                            {trait.score}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Motivation */}
              {learnerProfile.data.rawSnapshot.motivations && (
                <div>
                  <p className="text-sm font-medium mb-3">Motivation</p>
                  <div className="flex flex-wrap gap-2">
                    {learnerProfile.data.rawSnapshot.motivations
                      .filter((m: any) => m.score > 0)
                      .map((motivation: any, index: number) => (
                        <Badge
                          key={index}
                          className="bg-pink-100 text-pink-700 dark:bg-pink-900/20 capitalize"
                        >
                          {motivation.trait.replace(/_/g, " ")}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}

              {/* Goal */}
              {learnerProfile.data.rawSnapshot.goal && (
                <div>
                  <p className="text-sm font-medium mb-2">Primary Goal</p>
                  <p className="text-sm capitalize">
                    {learnerProfile.data.rawSnapshot.goal.replace(/_/g, " ")}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Learning Objectives Section */}
      {hasCompletedProfileTest && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Your Learning Objectives</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Track your progress and manage your learning goals
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Objective
            </Button>
          </div>
          <ObjectivesList limit={3} onCreateClick={() => setShowCreateModal(true)} />
        </section>
      )}

      {/* Create Objective Modal */}
      <CreateObjectiveModal open={showCreateModal} onOpenChange={setShowCreateModal} />

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t("enrollment", { default: "Enrollment" })}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400">
              +12%
            </span>
          </div>
          <div className="mt-4 text-3xl font-semibold tracking-tight">78k+</div>
          <button className="mt-4 inline-flex h-9 items-center justify-center rounded-md border border-input px-3 text-sm hover:bg-accent">
            {t("view_details", { default: "View details" })}
          </button>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t("total_lessons", { default: "Total Lesson" })}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400">
              +52%
            </span>
          </div>
          <div className="mt-4 text-3xl font-semibold tracking-tight">78+</div>
          <button className="mt-4 inline-flex h-9 items-center justify-center rounded-md border border-input px-3 text-sm hover:bg-accent">
            {t("view_details", { default: "View details" })}
          </button>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t("certificate", { default: "Certificate" })}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400">
              +25%
            </span>
          </div>
          <div className="mt-4 text-3xl font-semibold tracking-tight">50k+</div>
          <button className="mt-4 inline-flex h-9 items-center justify-center rounded-md border border-input px-3 text-sm hover:bg-accent">
            {t("view_details", { default: "View details" })}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">
              {t("learning_tracking", { default: "Learning Tracking" })}
            </h2>
            <span className="text-xs text-muted-foreground">
              {t("this_year", { default: "This Year" })}
            </span>
          </div>
          <div className="mt-6 h-40 rounded-md bg-muted" aria-hidden />
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-medium">Calendar</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-input p-3">
              <div className="text-sm font-medium">Education festival event 2025</div>
              <div className="text-xs text-muted-foreground">09:00 AM · 02:00 PM</div>
            </div>
            <div className="rounded-lg border border-input p-3">
              <div className="text-sm font-medium">Music 1-14 session</div>
              <div className="text-xs text-muted-foreground">09:00 AM · 02:00 PM</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">
              {t("continue_learning", { default: "Continue Learning" })}
            </h2>
            <div className="relative w-64 max-w-[60vw]">
              <input
                aria-label="Search"
                placeholder={t("search", { default: "Search course or community" })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {[
              "UX Research",
              "Advance Graphic Design",
              "User Interface Design",
              "Video Editing - Pixel Edit",
            ].map((title, idx) => (
              <div
                key={title}
                className="rounded-lg border border-input p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block h-9 w-9 rounded-md"
                    style={{ background: `hsl(var(--chart-${(idx % 5) + 1}))` }}
                  />
                  <div>
                    <div className="text-sm font-medium">{title}</div>
                    <div className="text-xs text-muted-foreground">
                      {idx === 0
                        ? "Advance · 2h 50m"
                        : idx === 1
                          ? "Advance · 2h 55m"
                          : idx === 2
                            ? "Basic · 8h 50m"
                            : "Epic · 40h 50m"}
                    </div>
                  </div>
                </div>
                <span className="text-xs rounded-full bg-muted px-2 py-1">
                  {idx === 3
                    ? "Completed"
                    : idx === 2
                      ? "Almost Completed"
                      : idx === 1
                        ? "Newly Added"
                        : "In-Progress"}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="text-xs font-medium tracking-wider text-muted-foreground">ASSESSMENT</div>
          <div className="mt-2 text-2xl font-display">Law and UX Design Assessment</div>
          <div className="mt-1 text-sm text-muted-foreground">Intermediate · 30 Question</div>
          <button className="mt-6 inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm hover:bg-accent">
            {t("start_assessment", { default: "Start assessment" })}
          </button>
        </div>
      </div> */}
    </div>
  );
}
