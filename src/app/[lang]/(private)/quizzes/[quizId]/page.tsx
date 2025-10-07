"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useLearningQuiz, useSubmitQuiz } from "@/hooks";
import { QuizInterface, QuizResults } from "@/components/quiz";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { QuizAnswer, QuizAttempt } from "@/models/quiz";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = params.quizId as string;
  
  // Get redirect URLs from query params
  const returnUrl = searchParams.get("returnUrl") || "/objectives";
  const sprintId = searchParams.get("sprintId");
  const objectiveId = searchParams.get("objectiveId");

  const { data: quiz, isLoading, error } = useLearningQuiz(quizId);
  const submitQuiz = useSubmitQuiz();

  const [quizResult, setQuizResult] = useState<QuizAttempt | null>(null);
  const [showResults, setShowResults] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center max-w-2xl mx-auto mt-8">
        <p className="text-sm text-destructive mb-4">Failed to load quiz. Please try again.</p>
        <Link href={returnUrl}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </Link>
      </div>
    );
  }

  const handleSubmitQuiz = async (answers: QuizAnswer[], timeSpent: number) => {
    try {
      const result = await submitQuiz.mutateAsync({
        quizId,
        submission: { answers, timeSpent },
      });

      setQuizResult(result.data.result);
      setShowResults(true);

      if (result.data.result.passed) {
        toast.success("Quiz passed! 🎉", {
          description: `You scored ${result.data.result.score}%`,
        });
      } else {
        toast.error("Quiz not passed", {
          description: `You scored ${result.data.result.score}%. Keep practicing!`,
        });
      }
    } catch (error: any) {
      toast.error("Failed to submit quiz", {
        description: error.message || "Please try again.",
      });
    }
  };

  const handleContinue = () => {
    if (quizResult?.passed) {
      // If passed, go to sprint or return URL
      if (sprintId && objectiveId) {
        router.push(`/objectives/${objectiveId}/sprints/${sprintId}`);
      } else {
        router.push(returnUrl);
      }
    } else {
      // If failed, go back
      router.push(returnUrl);
    }
  };

  const handleRetry = () => {
    setShowResults(false);
    setQuizResult(null);
  };

  if (showResults && quizResult) {
    return (
      <div className="py-8">
        <QuizResults
          attempt={quizResult}
          passingScore={quiz.passingScore}
          onContinue={handleContinue}
          onRetry={handleRetry}
          showRetry={quizResult.attemptsRemaining > 0}
        />
      </div>
    );
  }

  return (
    <div className="py-8">
      <QuizInterface
        quiz={quiz}
        onSubmit={handleSubmitQuiz}
        isSubmitting={submitQuiz.isPending}
      />
    </div>
  );
}
