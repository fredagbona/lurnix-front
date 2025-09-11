"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const t = useTranslations("Dashboard.page");

  // Mock onboarding status - in real app, this would come from user profile
  const hasCompletedProfileTest = false;

  return (
    <div className="space-y-6">
      {/* Onboarding Section */}
      {!hasCompletedProfileTest && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>
    </div>
  );
}
