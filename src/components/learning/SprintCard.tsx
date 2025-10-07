"use client";

import Link from "next/link";
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
} from "lucide-react";
import type { Sprint } from "@/models/learning";
import { cn } from "@/lib/utils";

interface SprintCardProps {
  sprint: Sprint;
  objectiveId: string;
  showActions?: boolean;
}

const difficultyConfig: Record<
  string,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  beginner: {
    label: "Beginner",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  easy: {
    label: "Easy",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  intermediate: {
    label: "Intermediate",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  medium: {
    label: "Medium",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  advanced: {
    label: "Advanced",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
  hard: {
    label: "Hard",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
};

const statusConfig: Record<string, { label: string; className: string }> = {
  not_started: {
    label: "Not Started",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  planned: {
    label: "Planned",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
};

export function SprintCard({ sprint, objectiveId, showActions = true }: SprintCardProps) {
  const difficultyInfo = difficultyConfig[sprint.difficulty] || difficultyConfig.beginner;
  const statusInfo = statusConfig[sprint.status] || statusConfig.not_started;
  const hasPreSprintQuiz = sprint.quizzes?.some((q) => q.type === "pre_sprint");
  const hasPostSprintQuiz = sprint.quizzes?.some((q) => q.type === "post_sprint");

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
                  Day {sprint.dayNumber}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold line-clamp-2">{sprint.title}</h3>
            {sprint.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {sprint.description}
              </p>
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
              {sprint.lengthDays} {sprint.lengthDays === 1 ? "day" : "days"} •{" "}
              {sprint.totalEstimatedHours}h
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
                +{sprint.targetSkills.length - 4} more
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
                <span>Readiness Quiz Required</span>
              </div>
            )}
            {hasPostSprintQuiz && (
              <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md px-3 py-2">
                <CheckCircle className="h-4 w-4" />
                <span>Validation Quiz Available</span>
              </div>
            )}
          </div>
        )}

        {/* Progress (if in progress) */}
        {sprint.status === "in_progress" && sprint.progress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {sprint.progress.completedTasks} / {sprint.microTasks.length} tasks
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

        {/* Score (if completed) */}
        {sprint.status === "completed" && sprint.score !== null && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Score:</span>
            <span className="font-semibold text-green-600">{sprint.score}/100</span>
          </div>
        )}

        {/* Review Sprint Badge */}
        {sprint.isReviewSprint && (
          <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-3">
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <RotateCw className="h-4 w-4" />
              <span className="font-medium">Review Sprint</span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Reinforce previously learned skills
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            {(sprint.status === "not_started" || sprint.status === "planned") && (
              <Link href={`/objectives/${objectiveId}/sprints/${sprint.id}`} className="flex-1">
                <Button className="w-full" variant={hasPreSprintQuiz ? "outline" : "default"}>
                  {hasPreSprintQuiz ? (
                    <>
                      <FileQuestion className="h-4 w-4 mr-2" />
                      Take Quiz First
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Sprint
                    </>
                  )}
                </Button>
              </Link>
            )}

            {sprint.status === "in_progress" && (
              <Link href={`/objectives/${objectiveId}/sprints/${sprint.id}`} className="flex-1">
                <Button className="w-full">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Continue Sprint
                </Button>
              </Link>
            )}

            {sprint.status === "completed" && (
              <Link href={`/objectives/${objectiveId}/sprints/${sprint.id}`} className="flex-1">
                <Button className="w-full" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
