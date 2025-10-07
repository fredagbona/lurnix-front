"use client";

import { useState } from "react";
import { useObjectives } from "@/hooks";
import { ObjectiveCard } from "./ObjectiveCard";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Plus, Filter, Target } from "lucide-react";
import type { ObjectiveStatus } from "@/models/learning";

interface ObjectivesListProps {
  limit?: number;
  onCreateClick?: () => void;
}

export function ObjectivesList({ limit, onCreateClick }: ObjectivesListProps) {
  const { data, isLoading, error } = useObjectives();
  const [statusFilter, setStatusFilter] = useState<ObjectiveStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"recent" | "progress" | "priority">("recent");
  
  const objectives = data?.objectives || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-sm text-destructive">Failed to load objectives. Please try again.</p>
      </div>
    );
  }

  if (!objectives || objectives.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center">
        <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Objectives Yet</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Create your first learning objective to get started on your journey.
        </p>
        {onCreateClick && (
          <Button onClick={onCreateClick}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Objective
          </Button>
        )}
      </div>
    );
  }

  // Filter objectives
  let filteredObjectives = objectives;
  if (statusFilter !== "all") {
    filteredObjectives = objectives.filter((obj) => {
      // Treat "active" and "in_progress" as the same
      if (statusFilter === "in_progress") {
        return obj.status === "in_progress" || obj.status === "active";
      }
      return obj.status === statusFilter;
    });
  }

  // Sort objectives
  const sortedObjectives = [...filteredObjectives].sort((a, b) => {
    switch (sortBy) {
      case "progress":
        return b.progressPercentage - a.progressPercentage;
      case "priority":
        return b.priority - a.priority;
      case "recent":
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  // Apply limit if specified
  const displayObjectives = limit ? sortedObjectives.slice(0, limit) : sortedObjectives;

  return (
    <div className="space-y-6">
      {/* Filters */}
      {!limit && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All ({objectives.length})
              </Button>
              <Button
                variant={statusFilter === "in_progress" || statusFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("in_progress")}
              >
                Active ({objectives.filter((o) => o.status === "in_progress" || o.status === "active").length})
              </Button>
              <Button
                variant={statusFilter === "todo" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("todo")}
              >
                To Do ({objectives.filter((o) => o.status === "todo").length})
              </Button>
              <Button
                variant={statusFilter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("completed")}
              >
                Completed ({objectives.filter((o) => o.status === "completed").length})
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="recent">Recent</option>
              <option value="progress">Progress</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      )}

      {/* Objectives Grid */}
      {displayObjectives.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No objectives match the selected filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayObjectives.map((objective) => (
            <ObjectiveCard key={objective.id} objective={objective} />
          ))}
        </div>
      )}

      {/* Show More Link */}
      {limit && sortedObjectives.length > limit && (
        <div className="text-center">
          <Button variant="outline" asChild>
            <a href="/objectives">
              View All {sortedObjectives.length} Objectives
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
