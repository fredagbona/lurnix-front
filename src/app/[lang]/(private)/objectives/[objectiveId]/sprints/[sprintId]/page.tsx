"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSprint, useUpdateSprintProgress, useSprintCompletion } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/ui/loader";
import { ArrowLeft, CheckCircle, Circle, Gauge, Calendar, Target } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function SprintDetailsPage() {
  const params = useParams();
  const objectiveId = params.objectiveId as string;
  const sprintId = params.sprintId as string;
  const { data: sprint, isLoading, error } = useSprint(objectiveId, sprintId);
  const updateProgress = useUpdateSprintProgress();
  const { complete, isCompleting } = useSprintCompletion({
    objectiveId,
    sprintId,
  });

  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [reflection, setReflection] = useState("");
  // Sync completed tasks from sprint data - MUST be before early returns
  useEffect(() => {
    if (
      sprint?.progress?.completedTasks &&
      sprint.progress.completedTasks > 0 &&
      sprint.microTasks
    ) {
      const completed = new Set<string>();
      sprint.microTasks.slice(0, sprint.progress.completedTasks).forEach((task) => {
        completed.add(task.id);
      });
      setCompletedTasks(completed);
    }
  }, [sprint]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (error || !sprint) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-sm text-destructive">Failed to load sprint. Please try again.</p>
        <Link href={`/objectives/${objectiveId}`}>
          <Button variant="outline" className="mt-4">
            Back to Objective
          </Button>
        </Link>
      </div>
    );
  }

  const rawStatus = typeof sprint.status === "string" ? sprint.status.toLowerCase() : "not_started";
  const rawCompletedAt = sprint.completedAt ?? (sprint as any).completed_at ?? null;
  const totalTasks = sprint.microTasks.length;
  const completedCount = completedTasks.size;
  const completionPercentage =
    sprint.completionPercentage ?? sprint.progress?.completionPercentage ?? null;
  const isCompleted =
    Boolean(rawCompletedAt) ||
    (typeof completionPercentage === "number" && completionPercentage >= 100) ||
    rawStatus === "reviewed" ||
    rawStatus === "completed";
  const progressPercentage =
    typeof completionPercentage === "number"
      ? completionPercentage
      : totalTasks > 0
      ? (completedCount / totalTasks) * 100
      : 0;

  const handleTaskToggle = (taskId: string) => {
    if (isCompleted) return;
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);

    // Update progress on server
    updateProgress.mutate({
      objectiveId,
      sprintId,
      data: {
        completedTasks: newCompleted.size,
        totalTasks,
      },
    });
  };

  const handleCompleteSprint = async () => {
    if (isCompleted) return;
    if (completedCount < totalTasks) {
      toast.error("Please complete all tasks before finishing the sprint");
      return;
    }

    if (!reflection.trim()) {
      toast.error("Please add a reflection before completing the sprint");
      return;
    }

    await complete({
      tasksCompleted: completedCount,
      totalTasks,
      hoursSpent: sprint.totalEstimatedHours,
      evidenceSubmitted: false,
      reflection: reflection.trim(),
    });
  };

  const difficultyConfig: Record<string, { label: string; color: string }> = {
    beginner: { label: "Beginner", color: "text-green-600" },
    easy: { label: "Easy", color: "text-green-600" },
    intermediate: { label: "Intermediate", color: "text-yellow-600" },
    medium: { label: "Medium", color: "text-yellow-600" },
    advanced: { label: "Advanced", color: "text-red-600" },
    hard: { label: "Hard", color: "text-red-600" },
  };

  const difficultyInfo = difficultyConfig[sprint.difficulty] || difficultyConfig.beginner;
  const completionDate = rawCompletedAt ? new Date(rawCompletedAt) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href={`/objectives/${objectiveId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{sprint.title}</h1>
          {sprint.description && <p className="text-muted-foreground mt-2">{sprint.description}</p>}
          <div className="flex items-center gap-4 mt-3 text-sm">
            <div className="flex items-center gap-2">
              <Gauge className={cn("h-4 w-4", difficultyInfo.color)} />
              <span className={difficultyInfo.color}>{difficultyInfo.label}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {sprint.lengthDays} {sprint.lengthDays === 1 ? "day" : "days"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>{sprint.totalEstimatedHours}h estimated</span>
            </div>
            {isCompleted && completionDate && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span>
                  Completed on {completionDate.toLocaleDateString()} at {" "}
                  {completionDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Adaptation Notes */}
      {sprint.adaptationNotes && (
        <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Personalized for You
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">{sprint.adaptationNotes}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Progress */}
      <Card className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Progress</h2>
            <span className="text-2xl font-bold">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {totalTasks} tasks completed
          </p>
        </div>
      </Card>

      {/* Tasks */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          Tasks ({completedCount}/{totalTasks})
        </h2>
        {isCompleted && (
          <p className="text-sm text-muted-foreground mb-4">
            This sprint is completed. Task progress is now read-only.
          </p>
        )}
        <div className="space-y-4">
          {sprint.microTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "border rounded-lg p-4 transition-colors",
                completedTasks.has(task.id) && "bg-muted/50 border-primary/50",
              )}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleTaskToggle(task.id)}
                  className="mt-1 flex-shrink-0"
                  disabled={isCompleted}
                  aria-disabled={isCompleted}
                >
                  {completedTasks.has(task.id) ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={cn(
                        "font-medium",
                        completedTasks.has(task.id) && "line-through text-muted-foreground",
                      )}
                    >
                      {task.title}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {task.estimatedMinutes} min
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{task.instructions}</p>

                  {/* Acceptance Criteria */}
                  {task.acceptanceTest && task.acceptanceTest.spec && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Acceptance Criteria:
                      </p>
                      <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                        {task.acceptanceTest.spec.map((criterion: string, index: number) => (
                          <li key={index}>{criterion}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Resources */}
                  {task.resources && task.resources.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Resources:</p>
                      <ul className="space-y-1">
                        {task.resources.map((resource: string, index: number) => (
                          <li key={index}>
                            <a
                              href={resource}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline break-all"
                            >
                              {resource}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Projects */}
      {sprint.projects && sprint.projects.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Projects</h2>
          <div className="space-y-4">
            {sprint.projects.map((project: any) => (
              <div key={project.id} className="border rounded-lg p-4 space-y-3">
                <div>
                  <h3 className="font-semibold mb-1">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.brief}</p>
                </div>

                {/* Requirements */}
                {project.requirements && project.requirements.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Requirements:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {project.requirements.map((req: string, index: number) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Acceptance Criteria */}
                {project.acceptanceCriteria && project.acceptanceCriteria.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Acceptance Criteria:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {project.acceptanceCriteria.map((criteria: string, index: number) => (
                        <li key={index}>{criteria}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Deliverables */}
                {project.deliverables && project.deliverables.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Deliverables:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {project.deliverables.map((deliverable: any, index: number) => (
                        <li key={index}>
                          <span className="font-medium">{deliverable.title}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            ({deliverable.type})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Evidence Rubric */}
                {project.evidenceRubric && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg space-y-2">
                    <p className="text-sm font-medium">Grading Rubric:</p>
                    <div className="space-y-1">
                      {project.evidenceRubric.dimensions.map((dimension: any, index: number) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span>{dimension.name}</span>
                          <span className="text-muted-foreground">
                            {(dimension.weight * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Pass threshold: {(project.evidenceRubric.passThreshold * 100).toFixed(0)}%
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tips */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-3">Tips</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li>Share your progress in Discord or the community to celebrate wins.</li>
          <li>Post demos or repositories when you&apos;re ready for feedback.</li>
          <li>Log blockers in your reflection so the next sprint can adapt.</li>
        </ul>
      </Card>

      {/* Reflection */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Reflection (Required)</h2>
        <p className="text-sm text-muted-foreground mb-4">
          What did you learn? What challenges did you face? How will you apply this knowledge?
        </p>
        <Textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Share your thoughts and learnings..."
          rows={6}
          className="resize-none"
          disabled={isCompleted}
          readOnly={isCompleted}
        />
        {isCompleted ? (
          <p className="text-xs text-muted-foreground mt-2">
            Reflection is locked because this sprint has been completed.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-2">
            This reflection will be included when you complete the sprint.
          </p>
        )}
      </Card>

      {/* Complete Button */}
      {!isCompleted && (
        <div className="flex justify-end gap-3 pb-8">
          <Link href={`/objectives/${objectiveId}`}>
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button
            onClick={handleCompleteSprint}
            disabled={isCompleting || completedCount < totalTasks || !reflection.trim()}
            size="lg"
          >
            {isCompleting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Completing...
              </div>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Complete Sprint
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default SprintDetailsPage;
