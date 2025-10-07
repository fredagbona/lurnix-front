"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Star, ArrowRight, Sparkles } from "lucide-react";
import type { BrainAdaptiveData, SkillUpdate } from "@/models/learning";
import { cn } from "@/lib/utils";

interface SprintCompletionProps {
  score: number;
  brainAdaptive: BrainAdaptiveData;
  nextSprintId?: string;
  onContinue: () => void;
}

const statusColors = {
  struggling: "text-red-600 bg-red-50 dark:bg-red-900/20",
  learning: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
  practicing: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
  proficient: "text-green-600 bg-green-50 dark:bg-green-900/20",
  mastered: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
  not_started: "text-gray-600 bg-gray-50 dark:bg-gray-900/20",
};

const statusEmojis = {
  struggling: "🔴",
  learning: "🟡",
  practicing: "🟡",
  proficient: "🟢",
  mastered: "🏆",
  not_started: "⚪",
};

export function SprintCompletion({
  score,
  brainAdaptive,
  nextSprintId,
  onContinue,
}: SprintCompletionProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Show confetti if any skill was mastered
    const hasMastery = brainAdaptive.skillsUpdated.some((skill) => skill.masteredNow);
    if (hasMastery) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [brainAdaptive.skillsUpdated]);

  const masteredSkills = brainAdaptive.skillsUpdated.filter((skill) => skill.masteredNow);
  const updatedSkills = brainAdaptive.skillsUpdated.filter((skill) => !skill.masteredNow);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Confetti Effect (simple CSS animation) */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}

      {/* Celebration Header */}
      <Card className="p-8 text-center bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="mb-4">
          <Sparkles className="h-16 w-16 mx-auto text-primary animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Sprint Completed! 🎉</h1>
        <p className="text-muted-foreground">Great work on completing this sprint</p>
      </Card>

      {/* Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Your Score</p>
              <p className="text-3xl font-bold">{score}/100</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Performance</p>
            <Badge
              variant="outline"
              className={cn(
                score >= 90
                  ? "bg-green-50 text-green-700 border-green-200"
                  : score >= 70
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200",
              )}
            >
              {score >= 90 ? "Excellent" : score >= 70 ? "Good" : "Keep Practicing"}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Mastered Skills */}
      {masteredSkills.length > 0 && (
        <Card className="p-6 border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-6 w-6 text-amber-600" />
            <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100">
              Skills Mastered! 🏆
            </h2>
          </div>
          <div className="space-y-3">
            {masteredSkills.map((skill) => (
              <SkillUpdateCard key={skill.skillId} skill={skill} isMastered />
            ))}
          </div>
        </Card>
      )}

      {/* Updated Skills */}
      {updatedSkills.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Skills Updated</h2>
          </div>
          <div className="space-y-3">
            {updatedSkills.map((skill) => (
              <SkillUpdateCard key={skill.skillId} skill={skill} />
            ))}
          </div>
        </Card>
      )}

      {/* Performance Analysis */}
      {brainAdaptive.performanceAnalysis && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Performance Analysis</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Average Score</span>
              <span className="font-semibold">
                {brainAdaptive.performanceAnalysis.averageScore.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Trend</span>
              <Badge variant="outline" className="capitalize">
                {brainAdaptive.performanceAnalysis.trend === "improving" && "📈 "}
                {brainAdaptive.performanceAnalysis.trend === "declining" && "📉 "}
                {brainAdaptive.performanceAnalysis.trend === "stable" && "➡️ "}
                {brainAdaptive.performanceAnalysis.trend}
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Notifications */}
      {brainAdaptive.notifications.length > 0 && (
        <div className="space-y-3">
          {brainAdaptive.notifications.map((notification, index) => (
            <Card
              key={index}
              className={cn(
                "p-4",
                notification.type === "difficulty_increased" && "border-l-4 border-l-blue-500",
                notification.type === "difficulty_decreased" && "border-l-4 border-l-yellow-500",
                notification.type === "review_needed" && "border-l-4 border-l-orange-500",
              )}
            >
              <p className="font-semibold">{notification.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-center pt-4">
        <Button onClick={onContinue} size="lg" className="min-w-[200px]">
          {nextSprintId ? "Continue to Next Sprint" : "Back to Objective"}
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function SkillUpdateCard({
  skill,
  isMastered = false,
}: {
  skill: SkillUpdate;
  isMastered?: boolean;
}) {
  const statusColor = statusColors[skill.newStatus];
  const statusEmoji = statusEmojis[skill.newStatus];

  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-all",
        isMastered && "bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold">{skill.skillName}</h3>
            {isMastered && <Trophy className="h-4 w-4 text-amber-600" />}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">Level:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono">{skill.previousLevel}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono font-semibold text-primary">{skill.newLevel}</span>
            </div>
          </div>
          {skill.statusChanged && (
            <div className="mt-2">
              <Badge className={statusColor}>
                {statusEmoji} {skill.newStatus.replace("_", " ")}
              </Badge>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            +{skill.newLevel - skill.previousLevel}
          </div>
        </div>
      </div>
    </div>
  );
}
