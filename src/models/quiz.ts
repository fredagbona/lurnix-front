// Quiz models and interfaces

// ============================================================================
// PROFILE QUIZ (Existing - for roadmap profile)
// ============================================================================
export type ProfileQuizQuestionType = "single" | "multi" | "rank" | "text" | "textarea";

export interface QuizOption {
  id: string;
  label: string;
  value: string;
}

export interface QuizQuestion {
  id: string;
  key: string;
  title: string;
  titleKey?: string | null;
  description?: string | null;
  descriptionKey?: string | null;
  type: ProfileQuizQuestionType;
  sortOrder: number;
  weightCategory?: string | null;
  sectionId?: string;
  options?: QuizOption[];
  placeholder?: string;
}

export interface QuizSection {
  id: string;
  sortOrder: number;
  title: string;
  titleKey?: string | null;
  description?: string | null;
  descriptionKey?: string | null;
  questions: QuizQuestion[];
}

export interface QuizResponse {
  success: boolean;
  data: {
    version: number;
    sections: QuizSection[];
  };
  timestamp: string;
}

export interface QuizSubmission {
  version: number;
  answers: {
    [questionKey: string]: string | string[] | number;
  };
}

export interface ProfileAnswerValidationError {
  missingAnswers?: string[];
  message?: string;
}

export interface QuizSubmissionResponse {
  success: boolean;
  message: string;
  data?: {
    quizResultId: string;
    learnerProfileSnapshotId: string;
    profile: any;
  };
  timestamp: string;
  error?: ProfileAnswerValidationError;
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

// ============================================================================
// ADAPTIVE PROFILE QUIZ (New onboarding flow)
// ============================================================================

export type AdaptiveQuizQuestionType =
  | "single_choice"
  | "multi_select"
  | "numeric"
  | "short_answer"
  | "text"
  | "textarea"
  | "boolean"
  | "multiple_choice"
  | "multiple_select";

export interface AdaptiveQuizOption {
  id: string;
  text: string;
  isCorrect?: boolean | null;
}

export interface AdaptiveQuizConstraints {
  min?: number;
  max?: number;
  step?: number;
}

export interface AdaptiveQuizQuestion {
  id: string;
  type: AdaptiveQuizQuestionType;
  prompt: string;
  question?: string;
  description?: string | null;
  options?: AdaptiveQuizOption[];
  required?: boolean;
  sortOrder?: number | null;
  constraints?: AdaptiveQuizConstraints;
  allowMultiple?: boolean;
}

export interface AdaptiveQuiz {
  id: string;
  title: string;
  description?: string | null;
  passingScore?: number | null;
  timeLimit?: number | null;
  attemptsAllowed?: number | null;
  questions: AdaptiveQuizQuestion[];
}

export interface ProfileQuizListItem {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  passingScore?: number | null;
  timeLimit?: number | null;
  attemptsAllowed?: number | null;
  blocksProgression?: boolean;
  isRequired?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileQuizListResponse {
  success: boolean;
  data: {
    quizzes: ProfileQuizListItem[];
  };
}

export interface ProfileQuizResponse {
  success: boolean;
  data: {
    quiz: AdaptiveQuiz;
  };
}

export interface AdaptiveQuizAnswerSubmission {
  questionId: string;
  optionId?: string;
  optionIds?: string[];
  value?: string | number | boolean;
}

export interface AdaptiveQuizSubmission {
  answers: AdaptiveQuizAnswerSubmission[];
  timeSpent: number;
}

export interface AdaptiveQuizResult {
  attemptId: string;
  score: number | null;
  passed: boolean;
  signals: Record<string, unknown>;
}

export interface AdaptiveQuizSubmitResponse {
  success: boolean;
  data: {
    result: AdaptiveQuizResult;
  };
}

// ============================================================================
// TECHNICAL ASSESSMENT MODELS
// ============================================================================

export type TechnicalAssessmentQuestionType =
  | "single"
  | "single_choice"
  | "multi-select"
  | "multi_select"
  | "checklist"
  | "numeric";

export type TechnicalAssessmentAnswerPrimitive = string | number | boolean;

export interface TechnicalAssessmentOption {
  value: TechnicalAssessmentAnswerPrimitive;
  label?: string;
  helperText?: string;
}

export interface TechnicalAssessmentChecklistItem {
  id: string;
  label: string;
  helperText?: string;
}

export interface TechnicalAssessmentQuestion {
  id: string;
  type: TechnicalAssessmentQuestionType;
  prompt: string;
  description?: string;
  options?: TechnicalAssessmentOption[];
  items?: TechnicalAssessmentChecklistItem[];
  required?: boolean;
  constraints?: AdaptiveQuizConstraints;
}

export interface TechnicalAssessmentResponse {
  version: number;
  title?: string;
  description?: string;
  questions: TechnicalAssessmentQuestion[];
}

export interface TechnicalAssessmentSubmitInput {
  userId?: string;
  version?: number;
  answers: Record<
    string,
    TechnicalAssessmentAnswerPrimitive | TechnicalAssessmentAnswerPrimitive[]
  >;
}

export interface TechnicalAssessmentSubmitResponse {
  version: number;
  score?: {
    overall: string;
    score: number;
    breakdown: Record<string, number>;
    flags: Record<string, boolean>;
    assessedAt: string;
  };
  [key: string]: unknown;
}
