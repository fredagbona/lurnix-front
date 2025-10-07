"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { LearningQuizQuestion } from "@/models/quiz";
import { cn } from "@/lib/utils";

interface QuizQuestionProps {
  question: LearningQuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  answer: string | string[];
  onAnswerChange: (answer: string | string[]) => void;
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  answer,
  onAnswerChange,
}: QuizQuestionProps) {
  const renderQuestionInput = () => {
    switch (question.type) {
      case "multiple_choice":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label
                key={option.id}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                  answer === option.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50",
                )}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.id}
                  checked={answer === option.id}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  className="mt-1"
                />
                <span className="flex-1">{option.text}</span>
              </label>
            ))}
          </div>
        );

      case "multiple_select":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => {
              const selectedAnswers = Array.isArray(answer) ? answer : [];
              const isSelected = selectedAnswers.includes(option.id);

              return (
                <label
                  key={option.id}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                    isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
                  )}
                >
                  <input
                    type="checkbox"
                    value={option.id}
                    checked={isSelected}
                    onChange={(e) => {
                      const newAnswers = isSelected
                        ? selectedAnswers.filter((a) => a !== option.id)
                        : [...selectedAnswers, option.id];
                      onAnswerChange(newAnswers);
                    }}
                    className="mt-1"
                  />
                  <span className="flex-1">{option.text}</span>
                </label>
              );
            })}
          </div>
        );

      case "true_false":
        return (
          <div className="flex gap-4">
            <label
              className={cn(
                "flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border cursor-pointer transition-colors",
                answer === "true"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <input
                type="radio"
                name={question.id}
                value="true"
                checked={answer === "true"}
                onChange={(e) => onAnswerChange(e.target.value)}
              />
              <span className="font-medium">True</span>
            </label>
            <label
              className={cn(
                "flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border cursor-pointer transition-colors",
                answer === "false"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <input
                type="radio"
                name={question.id}
                value="false"
                checked={answer === "false"}
                onChange={(e) => onAnswerChange(e.target.value)}
              />
              <span className="font-medium">False</span>
            </label>
          </div>
        );

      case "code_output":
        return (
          <div className="space-y-3">
            {question.codeTemplate && (
              <div className="rounded-lg bg-muted p-4 font-mono text-sm overflow-x-auto">
                <pre>{question.codeTemplate}</pre>
              </div>
            )}
            <Input
              type="text"
              value={answer as string}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Enter the output..."
              className="font-mono"
            />
          </div>
        );

      case "code_completion":
        return (
          <div className="space-y-3">
            {question.codeTemplate && (
              <div className="rounded-lg bg-muted p-4 font-mono text-sm overflow-x-auto">
                <pre>{question.codeTemplate}</pre>
              </div>
            )}
            <Textarea
              value={answer as string}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Complete the code..."
              rows={6}
              className="font-mono resize-none"
            />
          </div>
        );

      case "short_answer":
        return (
          <Textarea
            value={answer as string}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Type your answer..."
            rows={4}
            className="resize-none"
          />
        );

      default:
        return <p className="text-sm text-muted-foreground">Unknown question type</p>;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Question Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">
                Question {questionNumber} of {totalQuestions}
              </Badge>
              <Badge variant="secondary">{question.points} points</Badge>
            </div>
            <h3 className="text-lg font-semibold">{question.question}</h3>
          </div>
        </div>

        {/* Question Input */}
        <div className="pt-2">{renderQuestionInput()}</div>

        {/* Helper Text */}
        {question.type === "multiple_select" && (
          <p className="text-xs text-muted-foreground">Select all that apply</p>
        )}
      </div>
    </Card>
  );
}
