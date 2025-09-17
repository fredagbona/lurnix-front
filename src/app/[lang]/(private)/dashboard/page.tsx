"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ArrowRight, Gauge, Target, Heart, Wrench } from "lucide-react";
import { useRoadmapProfile } from "@/hooks";

export default function DashboardPage() {
  const t = useTranslations("Dashboard.page");
  const { data: roadmapProfile } = useRoadmapProfile();

  const hasCompletedProfileTest = !!roadmapProfile?.data;

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
      {hasCompletedProfileTest && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Learning Profile */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-semibold">Learning Profile</h3>
            </div>
            <dl className="grid grid-cols-2 gap-y-3 text-sm gap-2">
              <div className="col-span-1 flex items-center justify-between">
                <dt className="text-muted-foreground">Style</dt>
                <dd className="font-medium">{roadmapProfile.data.computedProfile.style}</dd>
              </div>
              <div className="col-span-1 flex items-center justify-between">
                <dt className="text-muted-foreground">Level</dt>
                <dd className="font-medium">{roadmapProfile.data.computedProfile.level}</dd>
              </div>
              <div className="col-span-2 flex items-center justify-between">
                <dt className="text-muted-foreground">Time / day</dt>
                <dd className="font-medium">
                  {roadmapProfile.data.computedProfile.timePerDay} mins
                </dd>
              </div>
            </dl>
            <div className="mt-4 space-y-3">
              {(
                [
                  ["Visual", Math.round(roadmapProfile.data.computedProfile.visual * 100)],
                  ["Reading", Math.round(roadmapProfile.data.computedProfile.reading * 100)],
                  ["Hands-on", Math.round(roadmapProfile.data.computedProfile.handsOn * 100)],
                ] as [string, number][]
              ).map(([label, value]) => (
                <div key={label} className="space-y-1">
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
            <div className="mt-4 text-sm">
              <span className="text-muted-foreground">Preferred stack: </span>
              <span className="font-medium">
                {roadmapProfile.data.computedProfile.preferredStack.join(", ")}
              </span>
            </div>
          </section>

          {/* Roadmap Inputs */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-semibold">Roadmap Inputs</h3>
            </div>
            <div className="space-y-6 text-sm">
              <div>
                <div className="mb-2 flex items-center gap-2 font-medium">
                  <Target className="h-4 w-4" />
                  Objectives
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">Top goal:</span>{" "}
                    {roadmapProfile.data.roadmapInput.objectives.topGoal}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Horizon:</span>{" "}
                    {roadmapProfile.data.roadmapInput.objectives.timeHorizon}
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Priority:</span>{" "}
                    {roadmapProfile.data.roadmapInput.objectives.priorityRank.join(", ")}
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2 font-medium">
                  <Heart className="h-4 w-4" />
                  Passions
                </div>
                <div>
                  <span className="text-muted-foreground">Areas:</span>{" "}
                  {roadmapProfile.data.roadmapInput.passions.ranked.join(", ")}
                </div>
                {roadmapProfile.data.roadmapInput.passions.notes && (
                  <div className="text-muted-foreground">
                    Notes: {roadmapProfile.data.roadmapInput.passions.notes}
                  </div>
                )}
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2 font-medium">
                  <Wrench className="h-4 w-4" />
                  Problem solving
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">Debug style:</span>{" "}
                    {roadmapProfile.data.roadmapInput.problemSolving.debugStyle}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Collaboration:</span>{" "}
                    {roadmapProfile.data.roadmapInput.problemSolving.collaboration}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">Experience:</span>{" "}
                  {roadmapProfile.data.roadmapInput.priorExperience}
                </div>
                <div>
                  <span className="text-muted-foreground">Time commitment:</span>{" "}
                  {roadmapProfile.data.roadmapInput.timeCommitmentMinsPerDay} mins/day
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

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
