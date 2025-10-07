"use client";

import { useEffect, useState } from "react";
import { useGenerationStatus } from "@/hooks";
import { Card } from "@/components/ui/card";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

interface SprintStatusMonitorProps {
  objectiveId: string;
  onStatusChange?: (status: {
    canGenerate: boolean;
    objectiveCompleted: boolean;
    currentSprintId: string | null;
  }) => void;
}

/**
 * Component that monitors sprint generation status and displays real-time updates
 * Useful for showing sync status after sprint completion
 */
export function SprintStatusMonitor({ objectiveId, onStatusChange }: SprintStatusMonitorProps) {
  const { data: status, isLoading, refetch } = useGenerationStatus(objectiveId, false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (status && onStatusChange) {
      onStatusChange({
        canGenerate: status.canGenerate,
        objectiveCompleted: status.objectiveCompleted,
        currentSprintId: status.currentSprintId,
      });
    }
  }, [status, onStatusChange]);

  useEffect(() => {
    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      refetch();
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading || !status) {
    return null;
  }

  return (
    <Card className="p-4 bg-muted/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {status.objectiveCompleted ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  Objective Complete
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  All sprints finished
                </p>
              </div>
            </>
          ) : status.canGenerate ? (
            <>
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Ready for Next Sprint
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Day {status.nextSprintDay} can be generated
                </p>
              </div>
            </>
          ) : status.currentSprintId ? (
            <>
              <RefreshCw className="h-5 w-5 text-amber-600 animate-spin" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  Sprint In Progress
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Complete current sprint to continue
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{status.reason || "Checking status..."}</p>
              </div>
            </>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          Updated {Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000)}s ago
        </div>
      </div>
    </Card>
  );
}
