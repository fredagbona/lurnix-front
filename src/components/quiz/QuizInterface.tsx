"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuizQuestion } from "./QuizQuestion";
import { QuizTimer } from "./QuizTimer";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import type { LearningQuiz, QuizAnswer } from "@/models/quiz";
import { cn } from "@/lib/utils";

interface QuizInterfaceProps {
  quiz: LearningQuiz;
  onSubmit: (answers: QuizAnswer[], timeSpent: number) => void;
  isSubmitting?: boolean;
}

export function QuizInterface({ quiz, onSubmit, isSubmitting = false }: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string | string[]>>(new Map());
  const [startTime] = useState(Date.now());
  const [showConfirmation, setShowConfirmation] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const answeredCount = answers.size;
  const progress = (answeredCount / totalQuestions) * 100;

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers(new Map(answers.set(questionId, answer)));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleTimeUp = () => {
    handleSubmitQuiz();
  };

  const handleSubmitQuiz = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000); // in seconds
    const quizAnswers: QuizAnswer[] = Array.from(answers.entries()).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));
    onSubmit(quizAnswers, timeSpent);
  };

  const canSubmit = answeredCount === totalQuestions;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            {quiz.description && (
              <p className="text-sm text-muted-foreground mt-1">{quiz.description}</p>
            )}
          </div>
          {quiz.timeLimit && <QuizTimer timeLimit={quiz.timeLimit} onTimeUp={handleTimeUp} />}
        </div>

        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {answeredCount} / {totalQuestions} answered
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Quiz Info */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>Passing Score: {quiz.passingScore}%</span>
          <span>•</span>
          <span>
            Attempts: {quiz.attemptsUsed || 0} / {quiz.attemptsAllowed}
          </span>
        </div>
      </Card>

      {/* Question */}
      <QuizQuestion
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        answer={
          answers.get(currentQuestion.id) || (currentQuestion.type === "multiple_select" ? [] : "")
        }
        onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
      />

      {/* Question Navigation */}
      <Card className="p-4">
        <div className="flex items-center justify-between gap-4">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2 overflow-x-auto">
            {quiz.questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={cn(
                  "h-8 w-8 rounded-md border text-sm font-medium transition-colors",
                  index === currentQuestionIndex
                    ? "border-primary bg-primary text-primary-foreground"
                    : answers.has(q.id)
                      ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20"
                      : "border-border hover:bg-muted",
                )}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex < totalQuestions - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => setShowConfirmation(true)}
              disabled={!canSubmit || isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Quiz
                </>
              )}
            </Button>
          )}
        </div>
      </Card>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="p-6 max-w-md mx-4">
            <h2 className="text-xl font-bold mb-2">Submit Quiz?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              {canSubmit
                ? "You've answered all questions. Are you ready to submit?"
                : `You've only answered ${answeredCount} out of ${totalQuestions} questions. Unanswered questions will be marked as incorrect.`}
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                Review Answers
              </Button>
              <Button onClick={handleSubmitQuiz} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
