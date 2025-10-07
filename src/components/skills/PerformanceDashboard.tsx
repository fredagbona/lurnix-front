"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Gauge,
  Zap,
  Calendar,
  Target,
  Trophy,
  AlertCircle,
} from "lucide-react";
import type { Performance } from "@/models/learning";
import { cn } from "@/lib/utils";

interface PerformanceDashboardProps {
  performance: Performance;
  onPracticeSkill?: (skillName: string) => void;
}

export function PerformanceDashboard({ performance, onPracticeSkill }: PerformanceDashboardProps) {
  const trendIcons = {
    improving: <TrendingUp className="h-4 w-4 text-green-600" />,
    stable: <Minus className="h-4 w-4 text-blue-600" />,
    declining: <TrendingDown className="h-4 w-4 text-red-600" />,
  };

  const trendLabels = {
    improving: "Improving",
    stable: "Stable",
    declining: "Declining",
  };

  const trendColors = {
    improving: "text-green-600 bg-green-50 dark:bg-green-900/20",
    stable: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    declining: "text-red-600 bg-red-50 dark:bg-red-900/20",
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="text-2xl font-bold">{performance.averageScore.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Gauge className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Difficulty</p>
              <p className="text-2xl font-bold">{performance.currentDifficulty}/100</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Learning Pace</p>
              <p className="text-2xl font-bold">{performance.learningVelocity.toFixed(1)}x</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            {trendIcons[performance.trend]}
            <div>
              <p className="text-sm text-muted-foreground">Trend</p>
              <Badge className={trendColors[performance.trend]}>
                {trendLabels[performance.trend]}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Score Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Performance</h2>
        <div className="space-y-4">
          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-40">
            {performance.recentScores.map((score, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-32">
                  <div
                    className={cn(
                      "w-full rounded-t-md transition-all duration-300",
                      score >= 90 ? "bg-green-500" : score >= 70 ? "bg-blue-500" : "bg-yellow-500",
                    )}
                    style={{ height: `${(score / 100) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-medium">{score}%</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last {performance.recentScores.length} sprints</span>
            <span>Average: {performance.averageScore.toFixed(1)}%</span>
          </div>
        </div>
      </Card>

      {/* Estimated Completion */}
      {performance.estimatedCompletion && (
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Estimated Completion</p>
              <p className="text-lg font-semibold">
                {new Date(performance.estimatedCompletion).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Mastered Skills */}
      {performance.masteredSkills.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-amber-600" />
            <h2 className="text-xl font-semibold">Mastered Skills</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {performance.masteredSkills.map((skill, index) => (
              <Badge key={index} className="bg-amber-50 text-amber-700 border-amber-200">
                🏆 {skill}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Struggling Skills */}
      {performance.strugglingSkills.length > 0 && (
        <Card className="p-6 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h2 className="text-xl font-semibold text-red-900 dark:text-red-100">
              Skills Needing Practice
            </h2>
          </div>
          <div className="space-y-2">
            {performance.strugglingSkills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{skill}</span>
                {onPracticeSkill && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onPracticeSkill(skill)}
                    className="text-xs"
                  >
                    Practice Now
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recommended Action */}
      {performance.recommendedAction && (
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
          <h2 className="text-xl font-semibold mb-2">Recommendation</h2>
          <p className="text-sm text-muted-foreground">
            {performance.recommendedAction === "speed_up" &&
              "You're doing great! We recommend increasing the difficulty to challenge you more."}
            {performance.recommendedAction === "maintain" &&
              "Keep up the good work! Your current pace is optimal."}
            {performance.recommendedAction === "slow_down" &&
              "Let's focus on mastering the fundamentals before moving forward."}
          </p>
        </Card>
      )}
    </div>
  );
}
