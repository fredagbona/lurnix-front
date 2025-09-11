// Quiz models and interfaces
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
  type: "single" | "multi" | "rank";
  sortOrder: number;
  options: QuizOption[];
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
  responses: {
    [questionId: string]: string | string[] | number[];
  };
}

export interface QuizSubmissionResponse {
  success: boolean;
  message: string;
  data?: any;
  timestamp: string;
}
