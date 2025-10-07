"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  TrendingUp,
  Clock,
  Target,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import type { QuizAttempt } from "@/models/quiz";
import { cn } from "@/lib/utils";

interface QuizResultsProps {
  attempt: QuizAttempt;
  passingScore: number;
  onContinue: () => void;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function QuizResults({
  attempt,
  passingScore,
  onContinue,
  onRetry,
  showRetry = false,
}: QuizResultsProps) {
  const passed = attempt.passed;
  const scorePercentage = attempt.score;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Result Header */}
      <Card
        className={cn(
          "p-8 text-center",
          passed
            ? "border-2 border-green-500 bg-green-50/50 dark:bg-green-900/10"
            : "border-2 border-red-500 bg-red-50/50 dark:bg-red-900/10",
        )}
      >
        <div className="mb-4">
          {passed ? (
            <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
          ) : (
            <XCircle className="h-16 w-16 mx-auto text-red-600" />
          )}
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {passed ? "Quiz Passed! 🎉" : "Quiz Not Passed"}
        </h1>
        <p className="text-muted-foreground">
          {passed
            ? "Great work! You've demonstrated your understanding."
            : "Keep practicing and try again when you're ready."}
        </p>
      </Card>

      {/* Score Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Your Score</h2>
          <Badge
            className={cn(
              "text-lg px-4 py-1",
              passed
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-red-100 text-red-700 border-red-200",
            )}
          >
            {scorePercentage}%
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
            <Target className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Correct Answers</p>
              <p className="text-lg font-semibold">
                {attempt.correctAnswers} / {attempt.totalQuestions}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Time Taken</p>
              <p className="text-lg font-semibold">{formatTime(attempt.timeSpent)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Attempts Left</p>
              <p className="text-lg font-semibold">{attempt.attemptsRemaining}</p>
            </div>
          </div>
        </div>

        {/* Passing Score Indicator */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Passing Score: {passingScore}%</span>
            <span className="font-medium">Your Score: {scorePercentage}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden relative">
            <div
              className={cn(
                "h-full transition-all duration-500",
                passed ? "bg-green-600" : "bg-red-600",
              )}
              style={{ width: `${scorePercentage}%` }}
            />
            <div
              className="absolute top-0 h-full w-0.5 bg-yellow-500"
              style={{ left: `${passingScore}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Skill Performance */}
      {Object.keys(attempt.skillScores).length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Skill Performance</h2>
          </div>
          <div className="space-y-3">
            {Object.entries(attempt.skillScores).map(([skillId, score]) => (
              <div key={skillId} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{skillId}</span>
                  <span
                    className={cn(
                      "font-semibold",
                      score >= 80
                        ? "text-green-600"
                        : score >= 60
                          ? "text-yellow-600"
                          : "text-red-600",
                    )}
                  >
                    {score}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      score >= 80
                        ? "bg-green-600"
                        : score >= 60
                          ? "bg-yellow-600"
                          : "bg-red-600",
                    )}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Weak Areas */}
      {attempt.weakAreas.length > 0 && (
        <Card className="p-6 border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10">
          <h2 className="text-xl font-semibold mb-3">Areas to Review</h2>
          <ul className="space-y-2">
            {attempt.weakAreas.map((area, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-yellow-600 mt-1">⚠️</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Recommendations */}
      {attempt.recommendations.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">Recommendations</h2>
          <ul className="space-y-2">
            {attempt.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-1">💡</span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {!passed && showRetry && attempt.attemptsRemaining > 0 && onRetry && (
          <Button onClick={onRetry} variant="outline" size="lg">
            Try Again ({attempt.attemptsRemaining} attempts left)
          </Button>
        )}
        {passed && (
          <Button onClick={onContinue} size="lg" className="min-w-[200px]">
            Continue
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        )}
        {!passed && attempt.attemptsRemaining === 0 && (
          <Button onClick={onContinue} variant="outline" size="lg">
            Back to Sprint
          </Button>
        )}
      </div>
    </div>
  );
}
