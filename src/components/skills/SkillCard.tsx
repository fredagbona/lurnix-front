"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertCircle, Trophy, Target } from "lucide-react";
import type { UserSkill } from "@/models/learning";
import { cn } from "@/lib/utils";

interface SkillCardProps {
  skill: UserSkill;
  onClick?: () => void;
}

const statusConfig = {
  not_started: {
    label: "Not Started",
    color: "text-gray-600",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    icon: "⚪",
  },
  struggling: {
    label: "Struggling",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    icon: "🔴",
  },
  learning: {
    label: "Learning",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    icon: "🟡",
  },
  practicing: {
    label: "Practicing",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    icon: "🟡",
  },
  proficient: {
    label: "Proficient",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    icon: "🟢",
  },
  mastered: {
    label: "Mastered",
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    icon: "🏆",
  },
};

export function SkillCard({ skill, onClick }: SkillCardProps) {
  const statusInfo = statusConfig[skill.status];

  return (
    <Card
      className={cn(
        "p-4 transition-all hover:shadow-md",
        onClick && "cursor-pointer",
        skill.needsReview && "border-l-4 border-l-orange-500",
      )}
      onClick={onClick}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{skill.skillName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={statusInfo.bgColor + " " + statusInfo.color}>
                {statusInfo.icon} {statusInfo.label}
              </Badge>
              {skill.needsReview && (
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Review
                </Badge>
              )}
            </div>
          </div>
          {skill.status === "mastered" && <Trophy className="h-5 w-5 text-amber-600" />}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Level</span>
            <span className="font-semibold">{skill.level}/100</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300",
                skill.level >= 90
                  ? "bg-amber-600"
                  : skill.level >= 70
                    ? "bg-green-600"
                    : skill.level >= 40
                      ? "bg-yellow-600"
                      : "bg-red-600",
              )}
              style={{ width: `${skill.level}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            <span>Success: {Math.round(skill.successRate * 100)}%</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>Practice: {skill.practiceCount}x</span>
          </div>
        </div>

        {/* Dates */}
        {skill.masteredAt && (
          <p className="text-xs text-muted-foreground">
            Mastered: {new Date(skill.masteredAt).toLocaleDateString()}
          </p>
        )}
        {skill.nextReviewAt && !skill.masteredAt && (
          <p className="text-xs text-muted-foreground">
            Next review: {new Date(skill.nextReviewAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </Card>
  );
}
