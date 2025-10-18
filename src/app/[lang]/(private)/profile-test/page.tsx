"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useProfileQuizList, useProfileQuiz } from "@/hooks";
import type { AdaptiveQuizAnswerSubmission, AdaptiveQuizQuestion } from "@/models/quiz";
import { learningQuizService } from "@/services/quizService";

function isArrayAnswer(value: unknown): value is string[] {
  return Array.isArray(value);
}

export default function ProfileTestPage() {
  const t = useTranslations("ProfileTest");
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: profileQuizzes, isLoading: isListing, error: listError } = useProfileQuizList();
  const activeQuizId = useMemo(() => profileQuizzes?.[0]?.id, [profileQuizzes]);
  const { data: quizData, isLoading: isFetching, error: quizError } = useProfileQuiz(activeQuizId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missingAnswers, setMissingAnswers] = useState<string[]>([]);
  const [startTime] = useState(() => Date.now());

  // Reset navigation and responses when quiz changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setResponses({});
    setMissingAnswers([]);
    setError(null);
  }, [quizData?.id]);

  const orderedQuestions = useMemo(() => {
    if (!quizData) return [] as AdaptiveQuizQuestion[];
    return [...quizData.questions]
      .map((question) => ({
        ...question,
        prompt: question.prompt ?? question.question ?? "",
      }))
      .sort((a, b) => {
        const aOrder = a.sortOrder ?? 0;
        const bOrder = b.sortOrder ?? 0;
        return aOrder - bOrder;
      });
  }, [quizData]);

  const questionLookup = useMemo(() => {
    if (!orderedQuestions.length) {
      return {} as Record<string, string>;
    }
    return orderedQuestions.reduce<Record<string, string>>((acc, question) => {
      acc[question.id] = question.prompt;
      return acc;
    }, {});
  }, [orderedQuestions]);

  const currentQuestion = orderedQuestions[currentQuestionIndex];
  const totalQuestions = orderedQuestions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleResponse = (questionId: string, value: string | string[]) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    if (missingAnswers.length) {
      setMissingAnswers((prev) => prev.filter((id) => id !== questionId));
    }
  };

  const validateAnswer = (question: AdaptiveQuizQuestion, value: string | string[] | undefined) => {
    if (!question.required) {
      return true;
    }

    if (value === undefined || value === null) {
      return false;
    }

    if (isArrayAnswer(value)) {
      return value.length > 0;
    }

    const trimmed = typeof value === "string" ? value.trim() : "";

    if (question.type === "numeric") {
      return trimmed.length > 0 && !Number.isNaN(Number(trimmed));
    }

    return trimmed.length > 0;
  };

  const handleNext = () => {
    if (!orderedQuestions.length) return;
    if (currentQuestionIndex < orderedQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quizData) return;

    const unansweredRequired = orderedQuestions
      .filter((question) => !validateAnswer(question, responses[question.id]))
      .map((question) => question.id);

    if (unansweredRequired.length) {
      setMissingAnswers(unansweredRequired);
      setError("Please answer all required questions before submitting.");
      toast.error("Missing answers", {
        description: unansweredRequired.map((id) => questionLookup[id] ?? id).join(", "),
      });
      return;
    }

    setSubmitting(true);
    setError(null);
    setMissingAnswers([]);

    try {
      const formattedAnswers = orderedQuestions.reduce<AdaptiveQuizAnswerSubmission[]>(
        (acc, question) => {
          const value = responses[question.id];

          if (value === undefined || value === null) {
            return acc;
          }

          if (isArrayAnswer(value)) {
            if (value.length) {
              acc.push({ questionId: question.id, optionIds: value });
            }
            return acc;
          }

          const trimmed = typeof value === "string" ? value.trim() : "";

          if (!trimmed) {
            return acc;
          }

          if (question.type === "single_choice" || question.type === "multiple_choice") {
            acc.push({ questionId: question.id, optionId: trimmed });
            return acc;
          }

          if (question.type === "numeric") {
            const numericValue = Number(trimmed);
            acc.push({ questionId: question.id, value: numericValue });
            return acc;
          }

          if (question.type === "boolean") {
            acc.push({ questionId: question.id, value: trimmed === "true" });
            return acc;
          }

          acc.push({ questionId: question.id, value: trimmed });
          return acc;
        },
        [],
      );

      const timeSpent = Math.max(1, Math.floor((Date.now() - startTime) / 1000));

      const submission = {
        answers: formattedAnswers,
        timeSpent,
      };

      await learningQuizService.submitAdaptiveQuiz(quizData.id, submission);
      queryClient.invalidateQueries({ queryKey: ["learnerProfile"] });

      toast.success("Profile quiz submitted");
      router.push("/profile-test/success");
    } catch (err: any) {
      console.error("Quiz submission error:", err);

      if (err?.response?.status === 401) {
        router.push("/login");
        return;
      }

      const apiError = err?.response?.data;
      const missing = apiError?.error?.missingAnswers as string[] | undefined;

      if (Array.isArray(missing) && missing.length) {
        setMissingAnswers(missing);
        toast.error("Missing answers", {
          description: missing.map((id) => questionLookup[id] ?? id).join(", "),
        });
      } else {
        toast.error("Failed to submit quiz", {
          description: "Please try again.",
        });
      }

      setError("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionInput = (
    question: AdaptiveQuizQuestion,
    answer: string | string[] | undefined,
  ) => {
    switch (question.type) {
      case "single_choice":
      case "multiple_choice":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => {
              const isSelected = answer === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleResponse(question.id, option.id)}
                  className={cn(
                    "w-full text-left p-3 sm:p-4 rounded-lg border transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/50 hover:bg-muted/50",
                  )}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className={cn(
                        "w-4 h-4 flex-shrink-0 rounded-full border-2 flex items-center justify-center",
                        isSelected ? "border-primary" : "border-muted-foreground",
                      )}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <span className="text-sm sm:text-base font-medium flex-1">{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        );

      case "multi_select":
      case "multiple_select":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => {
              const selected = Array.isArray(answer) ? answer.includes(option.id) : false;
              const selectedValues = Array.isArray(answer) ? answer : [];
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    const nextValues = selected
                      ? selectedValues.filter((id) => id !== option.id)
                      : [...selectedValues, option.id];
                    handleResponse(question.id, nextValues);
                  }}
                  className={cn(
                    "w-full text-left p-3 sm:p-4 rounded-lg border transition-colors",
                    selected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/50 hover:bg-muted/50",
                  )}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className={cn(
                        "w-4 h-4 flex-shrink-0 rounded border-2 flex items-center justify-center",
                        selected ? "border-primary bg-primary" : "border-muted-foreground",
                      )}
                    >
                      {selected && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm sm:text-base font-medium flex-1">{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        );

      case "boolean":
        return (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {["true", "false"].map((value) => {
              const isSelected = answer === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleResponse(question.id, value)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 p-3 sm:p-4 rounded-lg border transition-colors",
                    isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
                  )}
                >
                  <span className="text-sm sm:text-base font-medium">
                    {value === "true" ? "True" : "False"}
                  </span>
                </button>
              );
            })}
          </div>
        );

      case "numeric":
        return (
          <Input
            type="number"
            value={typeof answer === "string" ? answer : ""}
            onChange={(event) => handleResponse(question.id, event.target.value)}
            placeholder="Enter a number"
            className="w-full"
          />
        );

      case "short_answer":
      case "text":
        return (
          <Input
            type="text"
            value={typeof answer === "string" ? answer : ""}
            onChange={(event) => handleResponse(question.id, event.target.value)}
            placeholder="Type your answer"
            className="w-full"
          />
        );

      case "textarea":
        return (
          <Textarea
            value={typeof answer === "string" ? answer : ""}
            onChange={(event) => handleResponse(question.id, event.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            className="w-full resize-none"
          />
        );

      default:
        return <p className="text-sm text-muted-foreground">Unsupported question type</p>;
    }
  };

  const listErrorMessage = listError instanceof Error ? listError.message : undefined;
  const quizErrorMessage = quizError instanceof Error ? quizError.message : undefined;
  const combinedError = error ?? listErrorMessage ?? quizErrorMessage ?? null;
  const isLoading = isListing || (activeQuizId ? isFetching : false);

  if (isLoading) {
    return <Loader message={t("loading", { default: "Loading quiz..." })} />;
  }

  if (combinedError || !quizData || orderedQuestions.length === 0 || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">{combinedError ?? "Quiz unavailable"}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const currentAnswer = responses[currentQuestion.id];
  const canProceed = validateAnswer(currentQuestion, currentAnswer);

  const progressPercent = totalQuestions ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 px-3 sm:px-4">
      <header className="text-center space-y-2 sm:space-y-3">
        <h1 className="text-xl sm:text-2xl font-bold">{quizData.title}</h1>
        {quizData.description && (
          <p className="text-sm sm:text-base text-muted-foreground">{quizData.description}</p>
        )}

        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-0 text-xs sm:text-sm text-muted-foreground">
            <span>
              {t("question_progress", {
                default: "Question {current} of {total}",
                current: currentQuestionIndex + 1,
                total: totalQuestions,
              })}
            </span>
            {quizData.passingScore ? (
              <span className="text-center sm:text-left">
                Passing score: {quizData.passingScore}%
              </span>
            ) : null}
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 sm:h-2">
            <div
              className="bg-primary h-1.5 sm:h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      <section className="bg-card rounded-lg border p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-semibold">{currentQuestion.prompt}</h2>
          {currentQuestion.description && (
            <p className="text-sm text-muted-foreground">{currentQuestion.description}</p>
          )}
          {currentQuestion.required ? (
            <p className="text-xs text-muted-foreground">This question is required.</p>
          ) : null}
        </div>

        <div className="space-y-3">{renderQuestionInput(currentQuestion, currentAnswer)}</div>

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0 pt-4">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentQuestionIndex === 0}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {t("previous", { default: "Previous" })}
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={submitting || !canProceed}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {submitting ? (
                <>
                  <Loader size="sm" message="" className="min-h-0" />
                  {t("submitting", { default: "Submitting..." })}
                </>
              ) : (
                <>
                  {t("submit", { default: "Submit Test" })}
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {t("next", { default: "Next" })}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </section>

      {(error || missingAnswers.length > 0) && (
        <div className="text-center space-y-2">
          {error && <p className="text-destructive">{error}</p>}
          {missingAnswers.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <p>{t("missing_answers", { default: "Questions needing answers:" })}</p>
              <ul className="mt-1 space-y-1">
                {missingAnswers.map((id) => (
                  <li key={id} className="text-xs">
                    • {questionLookup[id] ?? id}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
