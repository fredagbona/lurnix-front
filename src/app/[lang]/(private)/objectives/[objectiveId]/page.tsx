"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  useObjective,
  useGenerateSprint,
  useGenerationStatus,
  useCompleteObjective,
} from "@/hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";
import {
  ArrowLeft,
  Plus,
  Target,
  TrendingUp,
  Calendar,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { SprintCard } from "@/components/learning/SprintCard";
import { CompleteObjectiveDialog } from "@/components/objectives/CompleteObjectiveDialog";
import { toast } from "sonner";
import type { Sprint } from "@/models/learning";

export default function ObjectiveDetailsPage() {
  const t = useTranslations("ObjectiveDetails");
  const params = useParams();
  const objectiveId = params.objectiveId as string;
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  const {
    data: objective,
    isLoading,
    error,
    refetch: refetchObjective,
  } = useObjective(objectiveId);
  const generateSprint = useGenerateSprint();
  const completeObjective = useCompleteObjective();
  const { data: generationStatus, refetch: refetchGenerationStatus } = useGenerationStatus(
    objectiveId,
    false,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (error || !objective) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-sm text-destructive">{t("loadError")}</p>
        <Link href="/objectives">
          <Button variant="outline" className="mt-4">
            {t("backButton")}
          </Button>
        </Link>
      </div>
    );
  }

  const isSprintComplete = (sprint: Sprint | null | undefined) => {
    if (!sprint) return false;
    const status = typeof sprint.status === "string" ? sprint.status.toLowerCase() : "";
    return Boolean(sprint.completedAt) || status === "reviewed" || status === "completed";
  };

  const currentSprint = isSprintComplete(objective.currentSprint) ? null : objective.currentSprint;

  const pastSprints: Sprint[] = [...objective.pastSprints];
  if (objective.currentSprint && isSprintComplete(objective.currentSprint)) {
    const alreadyPresent = pastSprints.some((sprint) => sprint.id === objective.currentSprint?.id);
    if (!alreadyPresent) {
      pastSprints.unshift(objective.currentSprint);
    }
  }

  const handleGenerateSprint = async () => {
    if (!objective.limits.canGenerateSprint) {
      toast.error(t("generateError"), {
        description: objective.limits.reason || t("limitReached"),
      });
      return;
    }

    try {
      await generateSprint.mutateAsync(objectiveId);
      toast.success(t("generateSuccess"), {
        description: t("sprintReady"),
      });
    } catch (error: any) {
      toast.error(t("generateFailed"), {
        description: error.message || t("tryAgain"),
      });
    }
  };

  const statusConfig: Record<string, { label: string; className: string }> = {
    todo: { label: t("status.todo"), className: "bg-gray-100 text-gray-700" },
    in_progress: { label: t("status.inProgress"), className: "bg-blue-100 text-blue-700" },
    active: { label: t("status.active"), className: "bg-blue-100 text-blue-700" },
    completed: { label: t("status.completed"), className: "bg-green-100 text-green-700" },
  };

  const statusInfo = statusConfig[objective.status] || statusConfig.todo;

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-0">
      {/* Header */}
      <div className="flex items-start gap-2 sm:gap-4">
        <Link href="/objectives">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-2">
              <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
              <span className="text-sm text-muted-foreground">
                {"⭐".repeat(objective.priority)}
              </span>
            </div>
            {objective.status !== "completed" && (
              <Button
                onClick={() => setShowCompleteDialog(true)}
                variant="default"
                size="sm"
                className="w-full sm:w-auto"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {t("markAsComplete")}
              </Button>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mt-2">
            {objective.title}
          </h1>
          {objective.description && (
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
              {objective.description}
            </p>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">{t("stats.progress")}</p>
              <p className="text-lg sm:text-2xl font-bold">
                {Math.round(objective.progressPercentage)}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">{t("stats.sprints")}</p>
              <p className="text-lg sm:text-2xl font-bold">
                {objective.progress.sprintsDone} / {objective.totalSprints}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">{t("stats.days")}</p>
              <p className="text-lg sm:text-2xl font-bold">{objective.completedDays}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">{t("stats.currentDay")}</p>
              <p className="text-lg sm:text-2xl font-bold">{objective.currentDay}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="p-4 sm:p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold">{t("overallProgress")}</h2>
            <span className="text-xl sm:text-2xl font-bold">
              {Math.round(objective.progressPercentage)}%
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${objective.progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {t("sprintsCompleted", {
              done: objective.progress.sprintsDone,
              total: objective.totalSprints,
            })}
          </p>
        </div>
      </Card>

      {/* Success Criteria */}
      {objective.successCriteria.length > 0 && (
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3">{t("successCriteria")}</h2>
          <ul className="space-y-2">
            {objective.successCriteria.map((criterion, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground">•</span>
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Required Skills */}
      {objective.requiredSkills.length > 0 && (
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3">{t("requiredSkills")}</h2>
          <div className="flex flex-wrap gap-2">
            {objective.requiredSkills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Current Sprint */}
      {currentSprint && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold">{t("currentSprint")}</h2>
          </div>
          <SprintCard sprint={currentSprint} objectiveId={objectiveId} />
        </div>
      )}

      {/* Generate Next Sprint */}
      {!currentSprint && objective.status !== "completed" && (
        <Card className="p-4 sm:p-6 text-center">
          <h3 className="text-base sm:text-lg font-semibold mb-2">{t("readyForNext")}</h3>
          <p className="text-sm text-muted-foreground mb-4">{t("generateDescription")}</p>

          {/* Generation Status Indicator */}
          {generationStatus && (
            <div className="mb-4 p-3 rounded-lg bg-muted/50 text-sm">
              <div className="flex items-center justify-center gap-2">
                {generationStatus.objectiveCompleted ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">{t("objectiveCompleted")}</span>
                  </>
                ) : generationStatus.canGenerate ? (
                  <>
                    <RefreshCw className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-600">
                      {t("readyToGenerate", { day: generationStatus.nextSprintDay })}
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="text-amber-600">{generationStatus.reason}</span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              onClick={handleGenerateSprint}
              disabled={generateSprint.isPending || !objective.limits.canGenerateSprint}
              size="lg"
              className="w-full sm:w-auto"
            >
              {generateSprint.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t("generating")}
                </div>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  {t("generateButton")}
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                refetchObjective();
                refetchGenerationStatus();
              }}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
          {!objective.limits.canGenerateSprint && (
            <p className="text-sm text-destructive mt-2">{objective.limits.reason}</p>
          )}
        </Card>
      )}

      {/* Objective Completed */}
      {objective.status === "completed" && (
        <Card className="p-4 sm:p-6 text-center bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertCircle className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
              {t("completedTitle")}
            </h3>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300">{t("completedMessage")}</p>
        </Card>
      )}

      {/* Past Sprints */}
      {pastSprints.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">{t("pastSprints")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {pastSprints.map((sprint) => (
              <SprintCard key={sprint.id} sprint={sprint} objectiveId={objectiveId} />
            ))}
          </div>
        </div>
      )}

      {/* Complete Objective Dialog */}
      <CompleteObjectiveDialog
        open={showCompleteDialog}
        onOpenChange={setShowCompleteDialog}
        objectiveId={objectiveId}
        objectiveTitle={objective.title}
      />
    </div>
  );
}
