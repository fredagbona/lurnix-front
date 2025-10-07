"use client";

import { useObjectives } from "@/hooks";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Target, TrendingUp, Calendar, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function RoadmapPage() {
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
        <p className="text-sm text-destructive">Failed to load roadmap. Please try again.</p>
      </div>
    );
  }

  const activeObjectives = objectives.filter((obj) => obj.status === "active" || obj.status === "in_progress");
  const completedObjectives = objectives.filter((obj) => obj.status === "completed");
  const todoObjectives = objectives.filter((obj) => obj.status === "todo");

  const totalSprints = objectives.reduce((sum, obj) => sum + obj.totalSprints, 0);
  const completedSprints = objectives.reduce((sum, obj) => sum + obj.progress.sprintsDone, 0);
  const totalDays = objectives.reduce((sum, obj) => sum + obj.completedDays, 0);
  const overallProgress = objectives.length > 0
    ? objectives.reduce((sum, obj) => sum + obj.progressPercentage, 0) / objectives.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Learning Roadmap</h1>
        <p className="text-muted-foreground mt-2">
          Track your learning journey and progress across all objectives
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Objectives</p>
              <p className="text-2xl font-bold">{objectives.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <p className="text-2xl font-bold">{Math.round(overallProgress)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Sprints</p>
              <p className="text-2xl font-bold">
                {completedSprints} / {totalSprints}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Days Completed</p>
              <p className="text-2xl font-bold">{totalDays}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Empty State */}
      {objectives.length === 0 && (
        <Card className="p-12 text-center">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Learning Objectives Yet</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Create your first learning objective to start building your roadmap
          </p>
          <Link href="/objectives">
            <Button>
              <Target className="h-4 w-4 mr-2" />
              Create Objective
            </Button>
          </Link>
        </Card>
      )}

      {/* Active Objectives */}
      {activeObjectives.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Active Objectives</h2>
          <div className="grid grid-cols-1 gap-4">
            {activeObjectives.map((objective) => (
              <Card key={objective.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold">{objective.title}</h3>
                      <Badge className="bg-blue-100 text-blue-700">Active</Badge>
                      <span className="text-sm text-muted-foreground">
                        {"⭐".repeat(objective.priority)}
                      </span>
                    </div>
                    
                    {objective.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {objective.description}
                      </p>
                    )}

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Progress</p>
                        <p className="font-medium">{Math.round(objective.progressPercentage)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sprints</p>
                        <p className="font-medium">
                          {objective.progress.sprintsDone} / {objective.totalSprints}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Days</p>
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
                          Current Sprint: Day {objective.currentSprint.dayNumber} • {objective.currentSprint.lengthDays} days
                        </span>
                      </div>
                    )}
                  </div>

                  <Link href={`/objectives/${objective.id}`}>
                    <Button>
                      View Details
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
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">To Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todoObjectives.map((objective) => (
              <Card key={objective.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{objective.title}</h3>
                    <Badge className="bg-gray-100 text-gray-700">To Do</Badge>
                  </div>
                  
                  {objective.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {objective.description}
                    </p>
                  )}

                  <Link href={`/objectives/${objective.id}`}>
                    <Button variant="outline" className="w-full">
                      Start Learning
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
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Completed</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {completedObjectives.map((objective) => (
              <Card key={objective.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{objective.title}</h3>
                    <Badge className="bg-green-100 text-green-700">Completed</Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>{objective.totalSprints} sprints • {objective.completedDays} days</p>
                  </div>

                  <Link href={`/objectives/${objective.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
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
