import { apiClient } from "./api";
import type { QuizResponse, QuizSubmission, QuizSubmissionResponse } from "@/models";

export const quizService = {
  // Get quiz questions
  async getQuiz(): Promise<QuizResponse> {
    return await apiClient.get<QuizResponse>("/quiz");
  },

  // Submit quiz responses
  async submitQuiz(submission: QuizSubmission): Promise<QuizSubmissionResponse> {
    return await apiClient.post<QuizSubmissionResponse>("/quiz/submit", submission);
  },

  // Get AI roadmap profile (computed + inputs)
  async getRoadmapProfile(): Promise<any> {
    return await apiClient.get<any>("/ai/roadmap/profile");
  },
};
