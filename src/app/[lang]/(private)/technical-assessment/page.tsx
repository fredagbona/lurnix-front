"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/ui/loader";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTechnicalAssessment, useSubmitTechnicalAssessment } from "@/hooks";
import type {
  TechnicalAssessmentAnswerPrimitive,
  TechnicalAssessmentQuestion,
  TechnicalAssessmentOption,
  TechnicalAssessmentChecklistItem,
  TechnicalAssessmentSubmitInput,
} from "@/models";

type TechnicalAssessmentAnswerValue =
  | TechnicalAssessmentAnswerPrimitive
  | TechnicalAssessmentOption
  | TechnicalAssessmentChecklistItem;

export default function TechnicalAssessmentPage() {
  const t = useTranslations("TechnicalAssessment");
  const router = useRouter();

  const { data, isLoading, error } = useTechnicalAssessment();
  const submitAssessment = useSubmitTechnicalAssessment();

  const questions = useMemo<TechnicalAssessmentQuestion[]>(() => data?.questions ?? [], [data]);
  const [answers, setAnswers] = useState<
    Record<string, TechnicalAssessmentAnswerValue | TechnicalAssessmentAnswerValue[]>
  >({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleAnswerChange = (
    question: TechnicalAssessmentQuestion,
    value: TechnicalAssessmentAnswerValue | TechnicalAssessmentAnswerValue[],
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: value,
    }));
    if (validationErrors.length) {
      setValidationErrors((prev) => prev.filter((id) => id !== question.id));
    }
  };

  function normalizeAnswerPrimitive(
    value: TechnicalAssessmentAnswerValue,
  ): TechnicalAssessmentAnswerPrimitive | null {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value === "object" && "id" in value) {
      return value.id;
    }

    if (typeof value === "object" && "value" in value) {
      const nested = value.value;
      if (typeof nested === "string" || typeof nested === "number" || typeof nested === "boolean") {
        return nested;
      }
      return null;
    }

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return value;
    }

    return null;
  }

  function isOptionSelected(
    value: TechnicalAssessmentAnswerValue | TechnicalAssessmentAnswerValue[] | undefined,
    option: TechnicalAssessmentOption,
  ): boolean {
    const optionValue = normalizeAnswerPrimitive(option);
    if (optionValue === null) {
      return false;
    }

    if (Array.isArray(value)) {
      return value.some((item) => normalizeAnswerPrimitive(item) === optionValue);
    }

    if (!value) return false;
    return normalizeAnswerPrimitive(value) === optionValue;
  }

  function isChecklistSelected(
    value: TechnicalAssessmentAnswerValue | TechnicalAssessmentAnswerValue[],
    item: TechnicalAssessmentChecklistItem,
  ): boolean {
    if (!Array.isArray(value)) {
      return false;
    }

    return value.some((value) => normalizeAnswerPrimitive(value) === item.id);
  }

  function normalizePayloadValue(
    question: TechnicalAssessmentQuestion,
    value: TechnicalAssessmentAnswerValue | TechnicalAssessmentAnswerValue[],
  ): TechnicalAssessmentAnswerPrimitive | TechnicalAssessmentAnswerPrimitive[] | null {
    if (Array.isArray(value)) {
      const normalized = value
        .map((item) => normalizeAnswerPrimitive(item))
        .filter((item): item is TechnicalAssessmentAnswerPrimitive => item !== null);
      return normalized.length ? normalized : null;
    }

    if (question.type === "numeric") {
      const numericValue = Number(value);
      return Number.isNaN(numericValue) ? null : numericValue;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed ? trimmed : null;
    }

    if (typeof value === "boolean") {
      return value;
    }

    return normalizeAnswerPrimitive(value);
  }

  const toggleMultiSelect = (
    question: TechnicalAssessmentQuestion,
    optionValue: TechnicalAssessmentAnswerValue,
  ) => {
    const currentValue = answers[question.id];
    const nextValues = Array.isArray(currentValue) ? [...currentValue] : [];
    const normalizedOption = normalizeAnswerPrimitive(optionValue);
    const index = nextValues.findIndex(
      (stored) => normalizeAnswerPrimitive(stored) === normalizedOption,
    );

    if (index >= 0) {
      nextValues.splice(index, 1);
    } else {
      nextValues.push(optionValue);
    }
    handleAnswerChange(question, nextValues);
  };

  const validateRequired = (question: TechnicalAssessmentQuestion): boolean => {
    if (!question.required) return true;
    const value = answers[question.id];

    if (value === undefined || value === null) {
      return false;
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (question.type === "numeric") {
      const numericValue = Number(value);
      return !Number.isNaN(numericValue);
    }

    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!data) return;

    const missing = questions
      .filter((question) => !validateRequired(question))
      .map((question) => question.id);

    if (missing.length) {
      setValidationErrors(missing);
      toast.error(t("missingRequired", { default: "Please answer all required questions." }));
      return;
    }

    const payloadAnswers: TechnicalAssessmentSubmitInput["answers"] = questions.reduce<
      Record<string, TechnicalAssessmentAnswerPrimitive | TechnicalAssessmentAnswerPrimitive[]>
    >((acc, question) => {
      const rawValue = answers[question.id];
      if (rawValue === undefined || rawValue === null || rawValue === "") {
        return acc;
      }

      const normalizedValue = normalizePayloadValue(question, rawValue);
      if (normalizedValue === null) {
        return acc;
      }

      acc[question.id] = normalizedValue;
      return acc;
    }, {});

    try {
      await submitAssessment.mutateAsync({
        version: data.version,
        answers: payloadAnswers,
      });

      toast.success(t("submitted", { default: "Technical assessment submitted" }));
      router.push("/dashboard?onboarding=technical-assessment");
    } catch (err) {
      console.error("Technical assessment submission failed", err);
      toast.error(t("submitError", { default: "Failed to submit assessment. Please try again." }));
    }
  };

  const renderQuestionInput = (question: TechnicalAssessmentQuestion) => {
    const value = answers[question.id];
    const hasError = validationErrors.includes(question.id);

    switch (question.type) {
      case "single":
      case "single_choice":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => {
              const selected = isOptionSelected(value, option);
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => handleAnswerChange(question, option.value)}
                  className={cn(
                    "w-full text-left p-3 sm:p-4 rounded-lg border transition-colors",
                    selected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/50 hover:bg-muted/50",
                  )}
                >
                  <div className="flex-1 space-y-1">
                    <span className="text-sm sm:text-base font-medium">
                      {option.label ?? String(option.value)}
                    </span>
                    {option.helperText ? (
                      <p className="text-xs text-muted-foreground">{option.helperText}</p>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        );

      case "multi-select":
      case "multi_select":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => {
              const selected = isOptionSelected(value, option);
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => toggleMultiSelect(question, option.value)}
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
                    <div className="flex-1 space-y-1">
                      <span className="text-sm sm:text-base font-medium">
                        {option.label ?? String(option.value)}
                      </span>
                      {option.helperText ? (
                        <p className="text-xs text-muted-foreground">{option.helperText}</p>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        );

      case "checklist":
        return (
          <div className="space-y-3">
            {question.items?.map((item) => {
              const selected = isChecklistSelected(value, item);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleMultiSelect(question, item.id)}
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
                    <div className="flex-1 space-y-1">
                      <span className="text-sm sm:text-base font-medium">{item.label}</span>
                      {item.helperText ? (
                        <p className="text-xs text-muted-foreground">{item.helperText}</p>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        );

      case "numeric":
        return (
          <Input
            type="number"
            value={typeof value === "number" || typeof value === "string" ? value : ""}
            onChange={(event) => handleAnswerChange(question, event.target.value)}
            placeholder={t("numericPlaceholder", { default: "Enter a number" })}
            className={cn(hasError && "border-destructive")}
          />
        );

      default:
        return (
          <Textarea
            value={typeof value === "string" ? value : ""}
            onChange={(event) => handleAnswerChange(question, event.target.value)}
            placeholder={t("textPlaceholder", { default: "Type your response" })}
            rows={4}
            className={cn("w-full resize-none", hasError && "border-destructive")}
          />
        );
    }
  };

  if (isLoading) {
    return <Loader message={t("loading", { default: "Loading technical assessment..." })} />;
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-3 sm:px-4">
        <Card className="max-w-lg w-full p-4 sm:p-6 text-center space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold">
            {t("loadErrorTitle", { default: "Assessment unavailable" })}
          </h2>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : t("loadError", { default: "We couldn't load your assessment." })}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            {t("reload", { default: "Try again" })}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 px-3 sm:px-4">
      <header className="space-y-2 text-center">
        <h1 className="text-xl sm:text-2xl font-bold">
          {data.title ?? t("title", { default: "Technical Assessment" })}
        </h1>
        {data.description && (
          <p className="text-sm sm:text-base text-muted-foreground">{data.description}</p>
        )}
      </header>

      <div className="space-y-4 sm:space-y-6">
        {questions.map((question) => (
          <Card key={question.id} className="p-4 sm:p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <h2 className="text-base sm:text-lg font-semibold">{question.prompt}</h2>
                {question.required ? (
                  <span className="text-xs text-muted-foreground">
                    {t("required", { default: "Required" })}
                  </span>
                ) : null}
              </div>
              {question.description ? (
                <p className="text-sm text-muted-foreground">{question.description}</p>
              ) : null}
              {validationErrors.includes(question.id) ? (
                <p className="text-xs text-destructive">
                  {t("requiredError", { default: "This question is required." })}
                </p>
              ) : null}
            </div>

            {renderQuestionInput(question)}
          </Card>
        ))}
      </div>

      <footer className="flex justify-end pb-4">
        <Button
          onClick={handleSubmit}
          disabled={submitAssessment.isPending}
          className="w-full sm:w-auto"
        >
          {submitAssessment.isPending ? (
            <>
              <Loader size="sm" message="" className="min-h-0" />
              {t("submitting", { default: "Submitting..." })}
            </>
          ) : (
            t("submit", { default: "Submit assessment" })
          )}
        </Button>
      </footer>
    </div>
  );
}
