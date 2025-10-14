"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/ui/loader";
import { quizService } from "@/services";
import type { QuizResponse, QuizSubmission } from "@/models";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ProfileTestPage() {
  const t = useTranslations("ProfileTest");
  const router = useRouter();

  const [quizData, setQuizData] = useState<QuizResponse | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missingAnswers, setMissingAnswers] = useState<string[]>([]);

  const questionIndexByKey = useMemo(() => {
    if (!quizData) return {} as Record<string, { title: string }>;
    const lookup: Record<string, { title: string }> = {};
    for (const section of quizData.data.sections) {
      for (const question of section.questions) {
        lookup[question.key] = { title: question.title };
      }
    }
    return lookup;
  }, [quizData]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizService.getQuiz();
        setQuizData(data);
      } catch (err) {
        setError("Failed to load quiz questions");
        console.error("Quiz fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);

  const currentSection = quizData?.data.sections[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];
  const totalSections = quizData?.data.sections.length || 0;
  const totalQuestions = currentSection?.questions.length || 0;

  const handleResponse = (questionKey: string, value: string | string[]) => {
    setResponses((prev) => ({
      ...prev,
      [questionKey]: value,
    }));
    if (missingAnswers.length > 0) {
      setMissingAnswers((prev) => prev.filter((key) => key !== questionKey));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
      setCurrentQuestionIndex(
        (quizData?.data.sections[currentSectionIndex - 1]?.questions.length || 1) - 1,
      );
    }
  };

  const validateAnswer = (questionType: string, value: string | string[] | undefined) => {
    if (value === undefined) return false;
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (questionType === "text" || questionType === "textarea") {
        return trimmed.length > 0;
      }
      return trimmed.length > 0;
    }
    return false;
  };

  const handleSubmit = async () => {
    if (!quizData) return;

    const requiredKeys: string[] = [];
    for (const section of quizData.data.sections) {
      for (const question of section.questions) {
        const value = responses[question.key];
        if (!validateAnswer(question.type, value)) {
          requiredKeys.push(question.key);
        }
      }
    }

    if (requiredKeys.length > 0) {
      setMissingAnswers(requiredKeys);
      setError("Please answer all questions before submitting.");
      toast.error("Missing answers", {
        description: requiredKeys
          .map((key) => questionIndexByKey[key]?.title ?? key)
          .join(", "),
      });
      return;
    }

    setSubmitting(true);
    setError(null);
    setMissingAnswers([]);

    try {
      const answers: Record<string, string | string[]> = {};
      for (const section of quizData.data.sections) {
        for (const question of section.questions) {
          const value = responses[question.key];
          if (Array.isArray(value)) {
            answers[question.key] = value;
          } else if (typeof value === "string") {
            answers[question.key] = value.trim();
          }
        }
      }

      const submission: QuizSubmission = {
        version: quizData.data.version,
        answers,
      };

      const result = await quizService.submitQuiz(submission);
      if (result.data?.profile) {
        try {
          sessionStorage.setItem("learnerProfileSnapshot", JSON.stringify(result.data.profile));
        } catch (storageError) {
          console.warn("Unable to persist profile snapshot", storageError);
        }
      }
      router.push("/dashboard?onboarding=completed");
    } catch (err: any) {
      console.error("Quiz submission error:", err);

      if (err?.response?.status === 401) {
        router.push("/login");
        return;
      }

      const apiError = err?.response?.data;
      const missing = apiError?.error?.missingAnswers as string[] | undefined;
      if (Array.isArray(missing) && missing.length > 0) {
        setMissingAnswers(missing);
        toast.error("Missing answers", {
          description: missing
            .map((key) => questionIndexByKey[key]?.title ?? key)
            .join(", "),
        });
        setError("Some questions still need attention.");
      } else {
        setError("Failed to submit quiz. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isLastQuestion =
    currentSectionIndex === totalSections - 1 && currentQuestionIndex === totalQuestions - 1;

  const currentAnswer = currentQuestion ? responses[currentQuestion.key] : undefined;
  const canProceed = currentQuestion
    ? validateAnswer(currentQuestion.type, currentAnswer)
    : false;

  if (loading) {
    return <Loader message={t("loading", { default: "Loading quiz..." })} />;
  }

  if (error || !quizData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">{t("title", { default: "Profile Test" })}</h1>
        <p className="text-muted-foreground">
          {t("subtitle", { default: "Help us understand your learning style and preferences" })}
        </p>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {t("section_progress", {
                default: "Section {current} of {total}",
                current: currentSectionIndex + 1,
                total: totalSections,
              })}
            </span>
            <span>
              {t("question_progress", {
                default: "Question {current} of {total}",
                current: currentQuestionIndex + 1,
                total: totalQuestions,
              })}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentSectionIndex * totalQuestions + currentQuestionIndex + 1) /
                    (totalSections * totalQuestions)) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Section Info */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">{currentSection?.title}</h2>
        <p className="text-muted-foreground">{currentSection?.description}</p>
      </div>

      {/* Question */}
      {currentQuestion && (
        <div className="bg-card rounded-lg border p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">{currentQuestion.title}</h3>
            {currentQuestion.description && (
              <p className="text-muted-foreground">{currentQuestion.description}</p>
            )}
          </div>

          {/* Question Input */}
          <div className="space-y-3">
            {currentQuestion.type === "text" && (
              <Input
                type="text"
                placeholder="Enter your answer..."
                value={(currentAnswer as string) || ""}
                onChange={(e) => handleResponse(currentQuestion.key, e.target.value)}
                className="w-full"
              />
            )}
            {currentQuestion.type === "textarea" && (
              <Textarea
                value={(currentAnswer as string) || ""}
                onChange={(e) => handleResponse(currentQuestion.key, e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full resize-none"
              />
            )}
            {(currentQuestion.type === "single" || currentQuestion.type === "multi") &&
              currentQuestion.options?.map((option) => {
                const selectedValues = Array.isArray(currentAnswer) ? currentAnswer : [];
                const isSelected = currentQuestion.type === "multi"
                  ? selectedValues.includes(option.value)
                  : currentAnswer === option.value;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      if (currentQuestion.type === "multi") {
                        const nextValues = isSelected
                          ? selectedValues.filter((v) => v !== option.value)
                          : [...selectedValues, option.value];
                        handleResponse(currentQuestion.key, nextValues);
                      } else {
                        handleResponse(currentQuestion.key, option.value);
                      }
                    }}
                    className={cn(
                      "w-full text-left p-4 rounded-lg border transition-colors",
                      isSelected
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50 hover:bg-muted/50",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {currentQuestion.type === "multi" && (
                        <div
                          className={cn(
                            "w-4 h-4 rounded border-2 flex items-center justify-center",
                            isSelected ? "border-primary bg-primary" : "border-muted-foreground",
                          )}
                        >
                          {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                      )}
                      {currentQuestion.type === "single" && (
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                            isSelected ? "border-primary" : "border-muted-foreground",
                          )}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                      )}
                      <span className="font-medium flex-1">{option.label}</span>
                    </div>
                  </button>
                );
              })}
            {currentQuestion.type === "rank" && (
              <p className="text-sm text-muted-foreground">
                Ranking questions are not yet supported in this interface. Please contact support.
              </p>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("previous", { default: "Previous" })}
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed || submitting}
                className="flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader size="sm" message="" className="min-h-0" />
                    {t("submitting", { default: "Submitting..." })}
                  </>
                ) : (
                  <>
                    {t("submit", { default: "Submit Test" })}
                    <CheckCircle className="h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed}
                className="flex items-center gap-2"
              >
                {t("next", { default: "Next" })}
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

        </div>
      )}
      {(error || missingAnswers.length > 0) && (
        <div className="text-center space-y-2">
          {error && <p className="text-destructive">{error}</p>}
          {missingAnswers.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <p>Questions needing answers:</p>
              <ul className="mt-1 space-y-1">
                {missingAnswers.map((key) => (
                  <li key={key} className="text-xs">
                    • {questionIndexByKey[key]?.title ?? key}
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
