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
  Share2,
  ListTodo,
  Activity,
  Layers,
  Anchor,
  Flame,
  MessageSquare,
} from "lucide-react";
import { useLearnerProfile } from "@/hooks";
import { ObjectivesList, CreateObjectiveModal } from "@/components/learning";

export default function DashboardPage() {
  const t = useTranslations("Dashboard.page");
  const { data: learnerProfile, isLoading, error } = useLearnerProfile();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const hasCompletedProfileTest = !!learnerProfile?.data;
  const snapshot = learnerProfile?.data?.rawSnapshot;
  const availability = learnerProfile?.data?.availability;
  const supportChannels: string[] = Array.isArray(availability?.supportChannels)
    ? availability.supportChannels
    : Array.isArray(snapshot?.supportChannels)
    ? snapshot.supportChannels
    : [];
  const preferredStack = Array.isArray(snapshot?.preferredStack) ? snapshot.preferredStack : [];
  const motivations = Array.isArray(snapshot?.motivations) ? snapshot.motivations : [];
  const topTraits = Array.isArray(snapshot?.topTraits) ? snapshot.topTraits.slice(0, 4) : [];
  const maxTraitScore = topTraits.reduce((max, trait) => {
    const value = Number(trait?.score ?? 0);
    return value > max ? value : max;
  }, 0) || 1;

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
      {hasCompletedProfileTest && snapshot && (
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
          {/* Overview */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Your Learning Profile</h2>
              </div>
              <Link href="/profile-test">
                <Button variant="outline" size="sm">
                  Retake Test
                </Button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border/60 p-3 space-y-1">
                <p className="text-xs text-muted-foreground">Profile Type</p>
                <p className="text-base font-semibold capitalize">
                  {snapshot.profileRecommendation?.key.replace(/_/g, " ")}
                </p>
              </div>
              <div className="rounded-lg border border-border/60 p-3 space-y-1">
                <p className="text-xs text-muted-foreground">Level</p>
                <p className="text-base font-semibold capitalize">{snapshot.level}</p>
              </div>
              <div className="rounded-lg border border-border/60 p-3 space-y-1">
                <p className="text-xs text-muted-foreground">Style</p>
                <p className="text-base font-semibold capitalize">{snapshot.style}</p>
              </div>
              <div className="rounded-lg border border-border/60 p-3 space-y-1">
                <p className="text-xs text-muted-foreground">Daily Focus</p>
                <p className="text-base font-semibold">{snapshot.timePerDay} mins</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Learning Preferences</p>
              </div>
              {[
                ["Visual", Math.round(Number(snapshot.visual || 0) * 100)],
                ["Reading", Math.round(Number(snapshot.reading || 0) * 100)],
                ["Hands-on", Math.round(Number(snapshot.handsOn || 0) * 100)],
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
          </Card>

          {/* Availability & Cadence */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Availability & Rhythm</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3 rounded-lg border border-border/60 p-3">
                <Gauge className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Weekly Hours</p>
                  <p className="text-muted-foreground">
                    {availability?.hoursPerWeek ?? "—"} hrs · {availability?.timePerDayMinutes ?? 0} mins/day
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border/60 p-3">
                <Layers className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Weekly Rhythm</p>
                  <p className="text-muted-foreground capitalize">
                    {availability?.weeklyRhythm?.replace(/_/g, " ") || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border/60 p-3">
                <Flame className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Energy Peak</p>
                  <p className="text-muted-foreground capitalize">
                    {availability?.energyPeak?.replace(/_/g, " ") || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border/60 p-3">
                <ListTodo className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Focus Preference</p>
                  <p className="text-muted-foreground capitalize">
                    {availability?.focusPreference?.replace(/_/g, " ") || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border/60 p-3">
                <Anchor className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Context Switching</p>
                  <p className="text-muted-foreground capitalize">
                    {availability?.contextSwitch?.replace(/_/g, " ") || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border/60 p-3">
                <MessageSquare className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Note & Review</p>
                  <p className="text-muted-foreground capitalize">
                    {availability?.noteStyle?.replace(/_/g, " ") || "—"} ·
                    {" "}
                    {availability?.reviewCadence?.replace(/_/g, " ") || "—"}
                  </p>
                </div>
              </div>
            </div>

            {supportChannels.length ? (
              <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Share2 className="h-4 w-4 text-primary" />
                  <p className="font-semibold">Support Channels</p>
                </div>
                <p className="text-muted-foreground">
                  You prefer {supportChannels.map((channel) => channel.replace(/_/g, " ")).join(" • ")}. Share progress there to stay accountable.
                </p>
              </div>
            ) : null}
          </Card>

          {/* Interests & Traits */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Motivation & Stack</h2>
            </div>

            <div className="space-y-4 text-sm">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Preferred Stack</p>
                <div className="flex flex-wrap gap-2">
                  {preferredStack.length
                    ? preferredStack.map((tech: string) => (
                        <Badge key={tech} variant="secondary" className="capitalize">
                          {tech.replace(/_/g, " ")}
                        </Badge>
                      ))
                    : <span className="text-muted-foreground">No stack preferences yet</span>}
                </div>
              </div>

              {motivations.length ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Top Motivators</p>
                  <div className="flex flex-wrap gap-2">
                    {motivations
                      .filter((item: any) => item.score > 0)
                      .slice(0, 4)
                      .map((motivation: any) => (
                        <Badge key={motivation.trait} className="capitalize">
                          {motivation.trait.replace(/_/g, " ")}
                        </Badge>
                      ))}
                  </div>
                </div>
              ) : null}

              {topTraits.length ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Signature Traits</p>
                  <div className="space-y-2">
                    {topTraits.map((trait: any) => {
                      const progress = Math.min(
                        100,
                        Math.round((Number(trait?.score ?? 0) / maxTraitScore) * 100),
                      );
                      return (
                        <div key={trait.trait} className="flex items-center gap-4">
                          <span className="flex-1 capitalize">{trait.trait.replace(/_/g, " ")}</span>
                          <div className="ml-auto flex min-w-[150px] items-center gap-3">
                            <div className="relative h-2 flex-1 rounded-full bg-muted">
                              <div
                                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="w-8 text-right text-xs text-muted-foreground">
                              {trait.score}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {snapshot.goal && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Primary Goal</p>
                  <p className="font-medium capitalize">
                    {snapshot.goal.replace(/_/g, " ")}
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
