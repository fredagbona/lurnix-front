"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { quizService } from "@/services";
import type { QuizResponse, QuizSubmission } from "@/models";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

export default function ProfileTestPage() {
  const t = useTranslations("ProfileTest");
  const router = useRouter();

  const [quizData, setQuizData] = useState<QuizResponse | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{
    [questionId: string]: string | string[] | number[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleResponse = (questionId: string, value: string | string[] | number[]) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
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

  const handleSubmit = async () => {
    if (!quizData) return;

    setSubmitting(true);
    setError(null);

    try {
      // Build answers object using question keys as required by API
      const answers: Record<string, string | string[] | number> = {};

      for (const section of quizData.data.sections) {
        for (const question of section.questions) {
          const value = responses[question.id];
          if (value === undefined) continue;
          // If an array of numbers sneaks in, keep it as is or coerce if single
          // API accepts string | string[] | number. We pass numbers only when not an array
          if (Array.isArray(value)) {
            answers[question.key] = value as string[];
          } else {
            answers[question.key] = value as string | number;
          }
        }
      }

      const submission: QuizSubmission = {
        version: quizData.data.version,
        answers,
      };

      await quizService.submitQuiz(submission);
      router.push("/dashboard?onboarding=completed");
    } catch (err) {
      setError("Failed to submit quiz. Please try again.");
      console.error("Quiz submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const isLastQuestion =
    currentSectionIndex === totalSections - 1 && currentQuestionIndex === totalQuestions - 1;
  // Questions spécifiques qui nécessitent une saisie de texte
  const isTextInputQuestion =
    !!currentQuestion &&
    currentSectionIndex === 2 && // Section 3
    (currentQuestionIndex === 4 || currentQuestionIndex === 6); // Question 5 et 7 (0-based index)

  const canProceed =
    currentQuestion &&
    responses[currentQuestion.id] !== undefined &&
    (isTextInputQuestion ? (responses[currentQuestion.id] as string)?.trim() !== "" : true);

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
            {isTextInputQuestion ? (
              <Input
                type="text"
                placeholder="Enter your answer..."
                value={(responses[currentQuestion.id] as string) || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleResponse(currentQuestion.id, e.target.value)
                }
                className="w-full"
              />
            ) : currentQuestion.options ? (
              currentQuestion.options.map((option) => {
                const isSelected =
                  responses[currentQuestion.id] === option.value ||
                  (Array.isArray(responses[currentQuestion.id]) &&
                    (responses[currentQuestion.id] as string[]).includes(option.value));

                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      if (currentQuestion.type === "multi") {
                        const currentValues = Array.isArray(responses[currentQuestion.id])
                          ? (responses[currentQuestion.id] as string[])
                          : [];
                        const newValues = currentValues.includes(option.value)
                          ? currentValues.filter((v) => v !== option.value)
                          : [...currentValues, option.value];
                        handleResponse(currentQuestion.id, newValues);
                      } else {
                        handleResponse(currentQuestion.id, option.value);
                      }
                    }}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {currentQuestion.type === "multi" && (
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                          }`}
                        >
                          {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                      )}
                      {currentQuestion.type === "single" && (
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                          )}
                        </div>
                      )}
                      <span className="font-medium flex-1">{option.label}</span>
                    </div>
                  </button>
                );
              })
            ) : null}
          </div>
        </div>
      )}

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
          <Button onClick={handleNext} disabled={!canProceed} className="flex items-center gap-2">
            {t("next", { default: "Next" })}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {error && (
        <div className="text-center">
          <p className="text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
