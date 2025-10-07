// Quiz models and interfaces

// ============================================================================
// PROFILE QUIZ (Existing - for roadmap profile)
// ============================================================================
export interface QuizOption {
  id: string;
  label: string;
  value: string;
}

export interface QuizQuestion {
  id: string;
  key: string;
  title: string;
  description: string;
  type: "single" | "multi" | "rank" | "text" | "textarea";
  sortOrder: number;
  options?: QuizOption[]; // Optional for text input questions
  placeholder?: string; // For text input questions
}

export interface QuizSection {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface QuizResponse {
  success: boolean;
  data: {
    version: number;
    sections: QuizSection[];
    questions: QuizQuestion[];
  };
  timestamp: string;
}

export interface QuizSubmission {
  version: number;
  answers: {
    [questionKey: string]: string | string[] | number;
  };
}

export interface QuizSubmissionResponse {
  success: boolean;
  message: string;
  data?: any;
  timestamp: string;
}

// ============================================================================
// LEARNING QUIZ (New - for sprint quizzes)
// ============================================================================

export type LearningQuizType = "pre_sprint" | "post_sprint";
export type QuestionType =
  | "multiple_choice"
  | "multiple_select"
  | "true_false"
  | "code_output"
  | "code_completion"
  | "short_answer";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface LearningQuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: QuestionOption[]; // For multiple choice/select
  codeTemplate?: string; // For code questions
  points: number;
  explanation?: string; // Shown after answering
}

export interface LearningQuiz {
  id: string;
  type: LearningQuizType;
  title: string;
  description: string;
  passingScore: number;
  timeLimit?: number; // in minutes
  attemptsAllowed: number;
  attemptsUsed?: number;
  questions: LearningQuizQuestion[];
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[]; // string for single, array for multiple select
}

export interface SubmitQuizInput {
  answers: QuizAnswer[];
  timeSpent: number; // in seconds
}

export interface QuizAttempt {
  attemptId: string;
  score: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  skillScores: Record<string, number>; // skillId -> score percentage
  weakAreas: string[]; // skill names
  recommendations: string[];
  attemptsRemaining: number;
  completedAt: string;
}

// API Response Types
export interface LearningQuizResponse {
  success: boolean;
  message: string;
  data: {
    quiz: LearningQuiz;
  };
}

export interface QuizSubmitResponse {
  success: boolean;
  message: string;
  data: {
    result: QuizAttempt;
  };
}

export interface QuizAttemptsResponse {
  success: boolean;
  message: string;
  data: {
    attempts: QuizAttempt[];
    bestScore: number;
    passed: boolean;
  };
}
