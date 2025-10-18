"use client";

import { useTranslations } from "next-intl";
import { useObjectives } from "@/hooks";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Target, TrendingUp, Calendar, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function RoadmapPage() {
  const t = useTranslations("Roadmap");
  const { data, isLoading, error } = useObjectives();
  const objectives = data?.objectives || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-sm text-destructive">
          {t("error", { default: "Failed to load roadmap. Please try again." })}
        </p>
      </div>
    );
  }

  const activeObjectives = objectives.filter(
    (obj) => obj.status === "active" || obj.status === "in_progress",
  );
  const completedObjectives = objectives.filter((obj) => obj.status === "completed");
  const todoObjectives = objectives.filter((obj) => obj.status === "todo");

  const totalSprints = objectives.reduce((sum, obj) => sum + obj.totalSprints, 0);
  const completedSprints = objectives.reduce((sum, obj) => sum + obj.progress.sprintsDone, 0);
  const totalDays = objectives.reduce((sum, obj) => sum + obj.completedDays, 0);
  const overallProgress =
    objectives.length > 0
      ? objectives.reduce((sum, obj) => sum + obj.progressPercentage, 0) / objectives.length
      : 0;

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t("title", { default: "Learning Roadmap" })}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
          {t("description", {
            default: "Track your learning journey and progress across all objectives",
          })}
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t("stats.totalObjectives", { default: "Total Objectives" })}
              </p>
              <p className="text-lg sm:text-2xl font-bold">{objectives.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t("stats.overallProgress", { default: "Overall Progress" })}
              </p>
              <p className="text-lg sm:text-2xl font-bold">{Math.round(overallProgress)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t("stats.sprints", { default: "Sprints" })}
              </p>
              <p className="text-lg sm:text-2xl font-bold">
                {completedSprints} / {totalSprints}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t("stats.daysCompleted", { default: "Days Completed" })}
              </p>
              <p className="text-lg sm:text-2xl font-bold">{totalDays}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Empty State */}
      {objectives.length === 0 && (
        <Card className="p-6 sm:p-12 text-center">
          <Target className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            {t("empty.title", { default: "No Learning Objectives Yet" })}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {t("empty.description", {
              default: "Create your first learning objective to start building your roadmap",
            })}
          </p>
          <Link href="/objectives">
            <Button className="w-full sm:w-auto">
              <Target className="h-4 w-4 mr-2" />
              {t("empty.createButton", { default: "Create Objective" })}
            </Button>
          </Link>
        </Card>
      )}

      {/* Active Objectives */}
      {activeObjectives.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">
            {t("sections.active", { default: "Active Objectives" })}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {activeObjectives.map((objective) => (
              <Card key={objective.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 space-y-2 sm:space-y-3">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <h3 className="text-lg sm:text-xl font-semibold">{objective.title}</h3>
                      <Badge className="bg-blue-100 text-blue-700">
                        {t("status.active", { default: "Active" })}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {"⭐".repeat(objective.priority)}
                      </span>
                    </div>

                    {objective.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {objective.description}
                      </p>
                    )}

                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <p className="text-muted-foreground">
                          {t("card.progress", { default: "Progress" })}
                        </p>
                        <p className="font-medium">{Math.round(objective.progressPercentage)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          {t("card.sprints", { default: "Sprints" })}
                        </p>
                        <p className="font-medium">
                          {objective.progress.sprintsDone} / {objective.totalSprints}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          {t("card.days", { default: "Days" })}
                        </p>
                        <p className="font-medium">{objective.completedDays}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${objective.progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Current Sprint Info */}
                    {objective.currentSprint && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Zap className="h-4 w-4" />
                        <span>
                          {t("card.currentSprint", { default: "Current Sprint" })}:{" "}
                          {t("card.day", { default: "Day" })} {objective.currentSprint.dayNumber} •{" "}
                          {objective.currentSprint.lengthDays}{" "}
                          {t("card.daysUnit", { default: "days" })}
                        </span>
                      </div>
                    )}
                  </div>

                  <Link href={`/objectives/${objective.id}`} className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto">
                      {t("card.viewDetails", { default: "View Details" })}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* To Do Objectives */}
      {todoObjectives.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">
            {t("sections.todo", { default: "To Do" })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {todoObjectives.map((objective) => (
              <Card key={objective.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-semibold">{objective.title}</h3>
                    <Badge className="bg-gray-100 text-gray-700">
                      {t("status.todo", { default: "To Do" })}
                    </Badge>
                  </div>

                  {objective.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {objective.description}
                    </p>
                  )}

                  <Link href={`/objectives/${objective.id}`}>
                    <Button variant="outline" className="w-full">
                      {t("card.startLearning", { default: "Start Learning" })}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Objectives */}
      {completedObjectives.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">
            {t("sections.completed", { default: "Completed" })}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {completedObjectives.map((objective) => (
              <Card key={objective.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-semibold">{objective.title}</h3>
                    <Badge className="bg-green-100 text-green-700">
                      {t("status.completed", { default: "Completed" })}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>
                      {objective.totalSprints} {t("card.sprintsUnit", { default: "sprints" })} •{" "}
                      {objective.completedDays} {t("card.daysUnit", { default: "days" })}
                    </p>
                  </div>

                  <Link href={`/objectives/${objective.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      {t("card.viewDetails", { default: "View Details" })}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
