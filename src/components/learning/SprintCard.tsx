"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Gauge,
  Calendar,
  FileQuestion,
  CheckCircle,
  Play,
  ArrowRight,
  RotateCw,
  Link as LinkIcon,
} from "lucide-react";
import type { Sprint } from "@/models/learning";
import { cn } from "@/lib/utils";

interface SprintCardProps {
  sprint: Sprint;
  objectiveId: string;
  showActions?: boolean;
}

export function SprintCard({ sprint, objectiveId, showActions = true }: SprintCardProps) {
  const t = useTranslations("SprintCard");

  const difficultyConfig: Record<
    string,
    { label: string; color: string; bgColor: string; borderColor: string }
  > = {
    beginner: {
      label: t("difficulty.beginner"),
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    easy: {
      label: t("difficulty.easy"),
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    intermediate: {
      label: t("difficulty.intermediate"),
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
    medium: {
      label: t("difficulty.medium"),
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
    advanced: {
      label: t("difficulty.advanced"),
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
    },
    hard: {
      label: t("difficulty.hard"),
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
    },
  };

  type SprintVisualStatus = "not_started" | "planned" | "in_progress" | "completed";

  const statusConfig: Record<SprintVisualStatus, { label: string; className: string }> = {
    not_started: {
      label: t("status.notStarted"),
      className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    },
    planned: {
      label: t("status.planned"),
      className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    },
    in_progress: {
      label: t("status.inProgress"),
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    },
    completed: {
      label: t("status.completed"),
      className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    },
  };

  const rawStatus = typeof sprint.status === "string" ? sprint.status.toLowerCase() : "not_started";
  const rawCompletedAt = (sprint as any).completedAt ?? (sprint as any).completed_at ?? null;
  const totalTasks = sprint.microTasks?.length ?? 0;
  const completedTasks = sprint.progress?.completedTasks ?? 0;
  const completionPercentage =
    sprint.completionPercentage ?? sprint.progress?.completionPercentage ?? null;

  const isCompleted =
    Boolean(rawCompletedAt) ||
    (typeof completionPercentage === "number" && completionPercentage >= 100) ||
    rawStatus === "reviewed" ||
    rawStatus === "completed";

  const visualStatus: SprintVisualStatus = isCompleted
    ? "completed"
    : rawStatus === "in_progress" || rawStatus === "submitted"
      ? "in_progress"
      : rawStatus === "planned"
        ? "planned"
        : "not_started";

  const canStart = visualStatus === "not_started" || visualStatus === "planned";
  const canContinue = visualStatus === "in_progress";
  const canViewDetails = visualStatus === "completed";

  const difficultyInfo = difficultyConfig[sprint.difficulty] || difficultyConfig.beginner;
  const statusInfo = statusConfig[visualStatus];
  const hasPreSprintQuiz = sprint.quizzes?.some((q) => q.type === "pre_sprint");
  const hasPostSprintQuiz = sprint.quizzes?.some((q) => q.type === "post_sprint");
  const evidenceCount = sprint.evidence?.artifacts?.length ?? 0;
  const progressValue =
    typeof completionPercentage === "number"
      ? Math.min(100, Math.max(0, Math.round(completionPercentage)))
      : totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

  return (
    <Card
      className={cn(
        "p-6 transition-all hover:shadow-lg",
        sprint.isReviewSprint && "border-l-4 border-l-blue-500",
      )}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {sprint.isReviewSprint && <RotateCw className="h-4 w-4 text-blue-600" />}
              {sprint.dayNumber && (
                <span className="text-sm font-medium text-muted-foreground">
                  {t("day", { number: sprint.dayNumber })}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold line-clamp-2">{sprint.title}</h3>
            {sprint.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {sprint.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                <LinkIcon className="h-3 w-3" />
                {evidenceCount > 0 ? t("linksAdded", { count: evidenceCount }) : t("noLinks")}
              </span>
              {isCompleted ? (
                <span>
                  {rawCompletedAt
                    ? t("completedOn", { date: new Date(rawCompletedAt).toLocaleDateString() })
                    : t("completed")}
                </span>
              ) : (
                <span>{t("progress", { value: progressValue })}</span>
              )}
            </div>
            {isCompleted && (
              <div className="mt-3 text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">{t("nextSteps.title")}</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>{t("nextSteps.share")}</li>
                  <li>{t("nextSteps.reflect")}</li>
                </ul>
              </div>
            )}
          </div>
          <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
        </div>

        {/* Difficulty & Duration */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Gauge className={cn("h-4 w-4", difficultyInfo.color)} />
            <span className={difficultyInfo.color}>
              {difficultyInfo.label}
              {sprint.difficultyScore && <span> ({sprint.difficultyScore}/100)</span>}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {t("duration", { days: sprint.lengthDays, hours: sprint.totalEstimatedHours })}
            </span>
          </div>
        </div>

        {/* Skills Tags */}
        {sprint.targetSkills && sprint.targetSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sprint.targetSkills.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {sprint.targetSkills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                {t("moreSkills", { count: sprint.targetSkills.length - 4 })}
              </Badge>
            )}
          </div>
        )}

        {/* Quiz Requirements */}
        {(hasPreSprintQuiz || hasPostSprintQuiz) && (
          <div className="space-y-2">
            {hasPreSprintQuiz && (
              <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-md px-3 py-2">
                <FileQuestion className="h-4 w-4" />
                <span>{t("readinessQuiz")}</span>
              </div>
            )}
            {hasPostSprintQuiz && (
              <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md px-3 py-2">
                <CheckCircle className="h-4 w-4" />
                <span>{t("validationQuiz")}</span>
              </div>
            )}
          </div>
        )}

        {/* Progress (if in progress) */}
        {canContinue && sprint.progress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("progressLabel")}</span>
              <span className="font-medium">
                {t("tasksCompleted", {
                  completed: sprint.progress.completedTasks,
                  total: sprint.microTasks.length,
                })}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                  width: `${(sprint.progress.completedTasks / sprint.microTasks.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Review Sprint Badge */}
        {sprint.isReviewSprint && (
          <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-3">
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <RotateCw className="h-4 w-4" />
              <span className="font-medium">{t("reviewSprint")}</span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{t("reviewSprintDesc")}</p>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            {canStart && (
              <Link href={`/objectives/${objectiveId}/sprints/${sprint.id}`} className="flex-1">
                <Button className="w-full" variant={hasPreSprintQuiz ? "outline" : "default"}>
                  {hasPreSprintQuiz ? (
                    <>
                      <FileQuestion className="h-4 w-4 mr-2" />
                      {t("takeQuizFirst")}
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      {t("startSprint")}
                    </>
                  )}
                </Button>
              </Link>
            )}

            {canContinue && (
              <Link href={`/objectives/${objectiveId}/sprints/${sprint.id}`} className="flex-1">
                <Button className="w-full">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  {t("continueSprint")}
                </Button>
              </Link>
            )}

            {canViewDetails && (
              <Link href={`/objectives/${objectiveId}/sprints/${sprint.id}`} className="flex-1">
                <Button className="w-full" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t("viewDetails")}
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
