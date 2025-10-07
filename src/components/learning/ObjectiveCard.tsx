"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Calendar, TrendingUp, Gauge, ArrowRight } from "lucide-react";
import type { Objective } from "@/models/learning";
import { cn } from "@/lib/utils";

interface ObjectiveCardProps {
  objective: Objective;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  todo: {
    label: "To Do",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  active: {
    label: "Active",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
};

const difficultyConfig: Record<string, { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "text-green-600" },
  easy: { label: "Easy", color: "text-green-600" },
  intermediate: { label: "Intermediate", color: "text-yellow-600" },
  medium: { label: "Medium", color: "text-yellow-600" },
  advanced: { label: "Advanced", color: "text-red-600" },
  hard: { label: "Hard", color: "text-red-600" },
};

export function ObjectiveCard({ objective }: ObjectiveCardProps) {
  const statusInfo = statusConfig[objective.status] || statusConfig.todo;
  const priorityStars = "⭐".repeat(objective.priority);

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">{objective.title}</h3>
            {objective.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {objective.description}
              </p>
            )}
          </div>
          <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
        </div>

        {/* Priority */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Priority:</span>
          <span>{priorityStars}</span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(objective.progressPercentage)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${objective.progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {objective.progress.sprintsDone} / {objective.totalSprints} sprints
            </span>
            <span>{objective.completedDays} days completed</span>
          </div>
        </div>

        {/* Current Sprint */}
        {objective.currentSprint && (
          <div className="rounded-lg border border-border bg-card/50 p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Gauge className="h-4 w-4 text-primary" />
              <span>Current Sprint</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{objective.currentSprint.title}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span
                  className={cn(
                    "font-medium",
                    difficultyConfig[objective.currentSprint.difficulty]?.color,
                  )}
                >
                  {difficultyConfig[objective.currentSprint.difficulty]?.label}
                  {objective.currentSprint.difficultyScore && (
                    <span> ({objective.currentSprint.difficultyScore}/100)</span>
                  )}
                </span>
                <span>•</span>
                <span>Day {objective.currentDay}</span>
              </div>
            </div>
          </div>
        )}

        {/* Estimated Completion */}
        {objective.estimatedTotalDays && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Est. {objective.estimatedTotalDays} days
              {objective.estimatedTotalWeeks.min && objective.estimatedTotalWeeks.max && (
                <span>
                  {" "}
                  ({objective.estimatedTotalWeeks.min}-{objective.estimatedTotalWeeks.max} weeks)
                </span>
              )}
            </span>
          </div>
        )}

        {/* Passion Tags */}
        {objective.passionTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {objective.passionTags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {objective.passionTags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{objective.passionTags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Button */}
        <Link href={`/objectives/${objective.id}`} className="block">
          <Button className="w-full" variant="outline">
            View Details
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
