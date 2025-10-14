import { apiClient } from "./api";
import type {
  QuizResponse,
  QuizSubmission,
  QuizSubmissionResponse,
  LearningQuizResponse,
  QuizSubmitResponse,
  QuizAttemptsResponse,
  SubmitQuizInput,
} from "@/models/quiz";

// ============================================================================
// PROFILE QUIZ SERVICE (Existing)
// ============================================================================
export const quizService = {
  async getQuiz(version?: number): Promise<QuizResponse> {
    const query = typeof version === "number" ? `?version=${version}` : "";
    return apiClient.get<QuizResponse>(`/quiz${query}`);
  },

  async submitQuiz(submission: QuizSubmission): Promise<QuizSubmissionResponse> {
    return apiClient.post<QuizSubmissionResponse>("/quiz/submit", submission);
  },

  async getRoadmapProfile(): Promise<any> {
    return apiClient.get("/users/roadmap-profile");
  },
};

// ============================================================================
// LEARNING QUIZ SERVICE (New)
// ============================================================================
export const learningQuizService = {
  /**
   * Get a learning quiz by ID
   */
  async getQuiz(quizId: string): Promise<LearningQuizResponse> {
    return apiClient.get<LearningQuizResponse>(`/quizzes/${quizId}`);
  },

  /**
   * Submit quiz answers
   */
  async submitQuiz(quizId: string, submission: SubmitQuizInput): Promise<QuizSubmitResponse> {
    return apiClient.post<QuizSubmitResponse>(`/quizzes/${quizId}/submit`, submission);
  },

  /**
   * Get quiz attempts history
   */
  async getQuizAttempts(quizId: string): Promise<QuizAttemptsResponse> {
    return apiClient.get<QuizAttemptsResponse>(`/quizzes/${quizId}/attempts`);
  },

  /**
   * Get a specific quiz attempt
   */
  async getQuizAttempt(quizId: string, attemptId: string): Promise<any> {
    return apiClient.get(`/quizzes/${quizId}/attempts/${attemptId}`);
  },
};
