"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useObjective, useGenerateSprint, useGenerationStatus } from "@/hooks";
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
} from "lucide-react";
import { SprintCard } from "@/components/learning/SprintCard";
import { toast } from "sonner";

export default function ObjectiveDetailsPage() {
  const params = useParams();
  const objectiveId = params.objectiveId as string;

  const {
    data: objective,
    isLoading,
    error,
    refetch: refetchObjective,
  } = useObjective(objectiveId);
  const generateSprint = useGenerateSprint();
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
        <p className="text-sm text-destructive">Failed to load objective. Please try again.</p>
        <Link href="/objectives">
          <Button variant="outline" className="mt-4">
            Back to Objectives
          </Button>
        </Link>
      </div>
    );
  }

  const handleGenerateSprint = async () => {
    if (!objective.limits.canGenerateSprint) {
      toast.error("Cannot generate sprint", {
        description: objective.limits.reason || "Sprint generation limit reached",
      });
      return;
    }

    try {
      await generateSprint.mutateAsync(objectiveId);
      toast.success("Sprint generated successfully!", {
        description: "Your next learning sprint is ready.",
      });
    } catch (error: any) {
      toast.error("Failed to generate sprint", {
        description: error.message || "Please try again.",
      });
    }
  };

  const statusConfig: Record<string, { label: string; className: string }> = {
    todo: { label: "To Do", className: "bg-gray-100 text-gray-700" },
    in_progress: { label: "In Progress", className: "bg-blue-100 text-blue-700" },
    active: { label: "Active", className: "bg-blue-100 text-blue-700" },
    completed: { label: "Completed", className: "bg-green-100 text-green-700" },
  };

  const statusInfo = statusConfig[objective.status] || statusConfig.todo;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/objectives">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
            <span className="text-sm text-muted-foreground">{"⭐".repeat(objective.priority)}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{objective.title}</h1>
          {objective.description && (
            <p className="text-muted-foreground mt-2">{objective.description}</p>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-2xl font-bold">{Math.round(objective.progressPercentage)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Sprints</p>
              <p className="text-2xl font-bold">
                {objective.progress.sprintsDone} / {objective.totalSprints}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Days</p>
              <p className="text-2xl font-bold">{objective.completedDays}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Current Day</p>
              <p className="text-2xl font-bold">{objective.currentDay}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Overall Progress</h2>
            <span className="text-2xl font-bold">{Math.round(objective.progressPercentage)}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${objective.progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {objective.progress.sprintsDone} of {objective.totalSprints} sprints completed
          </p>
        </div>
      </Card>

      {/* Success Criteria */}
      {objective.successCriteria.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-3">Success Criteria</h2>
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
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-3">Required Skills</h2>
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
      {objective.currentSprint && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Current Sprint</h2>
          </div>
          <SprintCard sprint={objective.currentSprint} objectiveId={objectiveId} />
        </div>
      )}

      {/* Generate Next Sprint */}
      {!objective.currentSprint && objective.status !== "completed" && (
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Ready for Your Next Sprint?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Generate your next learning sprint to continue your progress
          </p>

          {/* Generation Status Indicator */}
          {generationStatus && (
            <div className="mb-4 p-3 rounded-lg bg-muted/50 text-sm">
              <div className="flex items-center justify-center gap-2">
                {generationStatus.objectiveCompleted ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">Objective Completed!</span>
                  </>
                ) : generationStatus.canGenerate ? (
                  <>
                    <RefreshCw className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-600">
                      Ready to generate Day {generationStatus.nextSprintDay}
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

          <div className="flex gap-2 justify-center">
            <Button
              onClick={handleGenerateSprint}
              disabled={generateSprint.isPending || !objective.limits.canGenerateSprint}
              size="lg"
            >
              {generateSprint.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </div>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  Generate Next Sprint
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
        <Card className="p-6 text-center bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertCircle className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
              Objective Completed!
            </h3>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300">
            Congratulations! You've successfully completed this learning objective.
          </p>
        </Card>
      )}

      {/* Past Sprints */}
      {objective.pastSprints.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Past Sprints</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {objective.pastSprints.map((sprint) => (
              <SprintCard key={sprint.id} sprint={sprint} objectiveId={objectiveId} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
