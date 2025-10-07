"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, AlertCircle, Target } from "lucide-react";
import type { SkillMap } from "@/models/learning";

interface SkillProgressWidgetProps {
  skillMap: SkillMap;
  objectiveId?: string;
}

export function SkillProgressWidget({ skillMap, objectiveId }: SkillProgressWidgetProps) {
  const masteredCount = skillMap.masteredSkills.length;
  const proficientCount = skillMap.skills.filter((s) => s.status === "proficient").length;
  const practicingCount = skillMap.inProgress.length;
  const strugglingCount = skillMap.strugglingAreas.length;

  const skillsNeedingReview = skillMap.skills.filter((s) => s.needsReview);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Your Skills</h3>
          <Target className="h-5 w-5 text-primary" />
        </div>

        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold text-lg">{skillMap.overallProgress}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
              style={{ width: `${skillMap.overallProgress}%` }}
            />
          </div>
        </div>

        {/* Skills Breakdown */}
        <div className="space-y-2">
          {masteredCount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-600" />
                <span>Mastered</span>
              </div>
              <span className="font-semibold text-amber-600">{masteredCount}</span>
            </div>
          )}

          {proficientCount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-600">🟢</span>
                <span>Proficient</span>
              </div>
              <span className="font-semibold text-green-600">{proficientCount}</span>
            </div>
          )}

          {practicingCount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-yellow-600">🟡</span>
                <span>Practicing</span>
              </div>
              <span className="font-semibold text-yellow-600">{practicingCount}</span>
            </div>
          )}

          {strugglingCount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-red-600">🔴</span>
                <span>Struggling</span>
              </div>
              <span className="font-semibold text-red-600">{strugglingCount}</span>
            </div>
          )}
        </div>

        {/* Review Alert */}
        {skillsNeedingReview.length > 0 && (
          <div className="rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 p-3">
            <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">
                {skillsNeedingReview.length} skill{skillsNeedingReview.length > 1 ? "s" : ""} need
                review
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link href={objectiveId ? `/skills?objectiveId=${objectiveId}` : "/skills"}>
          <Button variant="outline" className="w-full">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Skill Map
          </Button>
        </Link>
      </div>
    </Card>
  );
}
