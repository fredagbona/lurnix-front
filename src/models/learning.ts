/**
 * Learning System Models
 * Types for Objectives, Sprints, Skills, and Brain-Adaptive Learning System
 */

// ============================================================================
// OBJECTIVE TYPES
// ============================================================================

export type ObjectiveStatus = "todo" | "in_progress" | "active" | "completed";

export interface ObjectiveProgress {
  sprintsDone: number;
  sprintsPlanned: number;
  percent: number;
}

export interface ObjectiveLimits {
  canGenerateSprint: boolean;
  sprintsRemaining: number;
  reason: string | null;
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  passionTags: string[];
  priority: number; // 1-5
  status: ObjectiveStatus;
  estimatedTotalWeeks: {
    min: number | null;
    max: number | null;
  };
  estimatedTotalDays: number | null;
  estimatedDailyHours: number | null;
  currentDay: number;
  completedDays: number;
  progressPercentage: number;
  successCriteria: string[];
  requiredSkills: string[];
  currentSprintId: string | null;
  currentSprint: Sprint | null;
  pastSprints: Sprint[];
  progress: ObjectiveProgress;
  totalSprints: number;
  createdAt: string;
  updatedAt: string;
  limits: ObjectiveLimits;
}

export interface CreateObjectiveInput {
  title: string;
  description?: string;
  learnerProfileId?: string;
  successCriteria?: string[];
  requiredSkills?: string[];
  priority?: number; // 1-5, default: 3
}

export interface UpdateObjectiveInput {
  title?: string;
  description?: string;
  successCriteria?: string[];
  requiredSkills?: string[];
  priority?: number;
  status?: ObjectiveStatus;
}

// ============================================================================
// SPRINT TYPES
// ============================================================================

export type SprintStatus = "not_started" | "planned" | "in_progress" | "completed";
export type SprintDifficulty = "beginner" | "easy" | "intermediate" | "medium" | "advanced" | "hard";

export interface SprintProgress {
  completedTasks: number;
  completedDays: number;
  scoreEstimate: number | null;
}

export interface SprintEvidence {
  artifacts: string[];
  selfEvaluation: string | null;
}

export interface SprintReview {
  status: "not_requested" | "pending" | "completed";
  reviewedAt: string | null;
  score: number | null;
  summary: string | null;
  projectSummaries: string[];
  metadata: Record<string, any> | null;
}

export interface MicroTask {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  completed: boolean;
  estimatedMinutes: number;
  acceptanceTest?: {
    spec: string[];
  };
  resources?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  estimatedHours: number;
  completed: boolean;
}

export interface PortfolioCard {
  id: string;
  title: string;
  description: string;
  skills: string[];
  imageUrl?: string;
}

export interface Sprint {
  id: string;
  objectiveId: string;
  title: string;
  description: string;
  lengthDays: number;
  totalEstimatedHours: number;
  difficulty: SprintDifficulty;
  difficultyScore?: number; // 0-100
  status: SprintStatus;
  dayNumber?: number;
  projects: Project[];
  microTasks: MicroTask[];
  portfolioCards: PortfolioCard[];
  adaptationNotes: string | null;
  progress: SprintProgress;
  startedAt: string | null;
  completedAt: string | null;
  score: number | null;
  metadata: Record<string, any> | null;
  evidence: SprintEvidence;
  review: SprintReview;
  targetSkills?: string[];
  isReviewSprint?: boolean;
  quizzes?: QuizReference[];
}

export interface QuizReference {
  id: string;
  type: "pre_sprint" | "post_sprint";
  title: string;
  passingScore: number;
  attemptsAllowed: number;
}

export interface CompleteSprintInput {
  tasksCompleted: number;
  totalTasks: number;
  hoursSpent: number;
  evidenceSubmitted: boolean;
  reflection: string;
  artifacts?: string[];
}

// ============================================================================
// SKILL TYPES
// ============================================================================

export type SkillStatus = "not_started" | "struggling" | "learning" | "practicing" | "proficient" | "mastered";

export interface SkillUpdate {
  skillId: string;
  skillName: string;
  previousLevel: number;
  newLevel: number;
  statusChanged: boolean;
  newStatus: SkillStatus;
  masteredNow: boolean;
}

export interface UserSkill {
  skillId: string;
  skillName: string;
  level: number; // 0-100
  status: SkillStatus;
  successRate: number; // 0-1
  practiceCount: number;
  lastPracticedAt: string;
  nextReviewAt?: string;
  masteredAt?: string;
  needsReview: boolean;
}

export interface SkillMap {
  userId: string;
  skills: UserSkill[];
  masteredSkills: string[];
  strugglingAreas: string[];
  inProgress: string[];
  notStarted: string[];
  overallProgress: number; // 0-100
}

// ============================================================================
// BRAIN-ADAPTIVE TYPES
// ============================================================================

export type PerformanceTrend = "improving" | "stable" | "declining";
export type RecommendedAction = "speed_up" | "maintain" | "slow_down";

export interface PerformanceAnalysis {
  averageScore: number;
  trend: PerformanceTrend;
  recommendedAction: RecommendedAction;
}

export interface BrainAdaptiveData {
  skillsUpdated: SkillUpdate[];
  performanceAnalysis: PerformanceAnalysis;
  adaptationApplied: boolean;
  nextSprintAdjusted: boolean;
  reviewSprintNeeded: boolean;
  notifications: Notification[];
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export type NotificationType =
  | "sprint_completed"
  | "skill_mastered"
  | "difficulty_increased"
  | "difficulty_decreased"
  | "review_needed"
  | "quiz_passed"
  | "quiz_failed";

export interface Notification {
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// PERFORMANCE TYPES
// ============================================================================

export interface Performance {
  averageScore: number;
  trend: PerformanceTrend;
  recentScores: number[];
  consistentlyHigh: boolean;
  consistentlyLow: boolean;
  strugglingSkills: string[];
  masteredSkills: string[];
  recommendedAction: RecommendedAction;
  currentDifficulty: number; // 0-100
  learningVelocity: number; // multiplier, e.g., 1.0, 1.2, 0.8
  estimatedCompletion: string; // ISO date
}

// ============================================================================
// QUIZ TYPES (for readiness/validation)
// ============================================================================

export interface ReadinessCheck {
  canStart: boolean;
  reason: string | null;
  requiredQuiz: {
    id: string;
    title: string;
    passingScore: number;
    attemptsAllowed: number;
    attemptsUsed: number;
  } | null;
}

export interface ValidationCheck {
  canProgress: boolean;
  reason: string | null;
  quizScore: number | null;
  requiredScore: number;
  quiz: {
    id: string;
    title: string;
    passingScore: number;
  } | null;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================
// Note: ApiResponse is imported from auth.ts

export interface PlanLimits {
  planType: string;
  objectiveLimit: number;
  objectiveCount: number;
  remainingObjectives: number;
  canCreateObjective: boolean;
  gatingReason: string | null;
  gatingMessageKey: string | null;
  upgradePlanType: string | null;
}

export interface ObjectivesResponse {
  success: boolean;
  message: string;
  data: {
    objectives: Objective[];
    planLimits: PlanLimits;
  };
  timestamp: string;
}

export interface ObjectiveResponse {
  success: boolean;
  message: string;
  data: {
    objective: Objective;
    planLimits?: PlanLimits;
  };
  timestamp: string;
}

export interface SprintResponse {
  success: boolean;
  message: string;
  data: Sprint;
}

export interface CompleteSprintResponse {
  success: boolean;
  message: string;
  data: {
  sprintCompleted: boolean;
  dayCompleted: number;
  nextSprintGenerated: boolean;
  nextSprint: {
    id: string;
    dayNumber: number;
    lengthDays: number;
  } | null;
  progress: {
    currentDay: number;
    totalDays: number;
    progressPercentage: number;
  };
  brainAdaptive: BrainAdaptiveData;
  notifications: Notification[];
  };
}

export interface SkillMapResponse {
  success: boolean;
  message: string;
  data: {
    skillMap: SkillMap;
  };
}

export interface PerformanceResponse {
  success: boolean;
  message: string;
  data: {
    performance: Performance;
  };
}

export interface ReadinessResponse {
  success: boolean;
  message: string;
  data: ReadinessCheck;
}

export interface ValidationResponse {
  success: boolean;
  message: string;
  data: ValidationCheck;
}
