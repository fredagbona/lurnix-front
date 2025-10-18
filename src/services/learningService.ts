/**
 * Learning Service
 * API service for Objectives, Sprints, Skills, and Performance
 */

import { apiClient } from "./api";
import type {
  Objective,
  ObjectivesResponse,
  ObjectiveResponse,
  CreateObjectiveInput,
  UpdateObjectiveInput,
  Sprint,
  SprintResponse,
  CompleteSprintInput,
  CompleteSprintResponse,
  ReadinessResponse,
  ValidationResponse,
  SkillMapResponse,
  PerformanceResponse,
} from "@/models/learning";

// ============================================================================
// OBJECTIVES API
// ============================================================================

export const objectivesService = {
  /**
   * Get all objectives for the current user
   */
  async getObjectives(): Promise<ObjectivesResponse> {
    return apiClient.get<ObjectivesResponse>("/objectives");
  },

  /**
   * Get a single objective by ID
   */
  async getObjective(objectiveId: string): Promise<ObjectiveResponse> {
    return apiClient.get<ObjectiveResponse>(`/objectives/${objectiveId}`);
  },

  /**
   * Create a new objective
   */
  async createObjective(data: CreateObjectiveInput): Promise<ObjectiveResponse> {
    return apiClient.post<ObjectiveResponse>("/objectives", data);
  },

  /**
   * Update an existing objective
   */
  async updateObjective(
    objectiveId: string,
    data: UpdateObjectiveInput,
  ): Promise<ObjectiveResponse> {
    return apiClient.patch<ObjectiveResponse>(`/objectives/${objectiveId}`, data);
  },

  /**
   * Delete an objective
   */
  async deleteObjective(objectiveId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/objectives/${objectiveId}`);
  },

  /**
   * Generate next sprint for an objective
   */
  async generateSprint(objectiveId: string): Promise<SprintResponse> {
    return apiClient.post<SprintResponse>(`/objectives/${objectiveId}/sprints/generate`);
  },

  /**
   * Mark an objective as completed
   */
  async completeObjective(
    objectiveId: string,
    data?: { completionNotes?: string },
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      objectiveId: string;
      status: string;
      completedAt: string;
      totalDays: number;
      totalHours: number;
    };
    timestamp: string;
  }> {
    return apiClient.patch(`/objectives/${objectiveId}/complete`, data);
  },
};

// ============================================================================
// SPRINTS API
// ============================================================================

export const sprintsService = {
  /**
   * Get a single sprint by ID
   */
  async getSprint(objectiveId: string, sprintId: string): Promise<SprintResponse> {
    return apiClient.get<SprintResponse>(`/objectives/${objectiveId}/sprints/${sprintId}`);
  },

  /**
   * Start a sprint
   */
  async startSprint(objectiveId: string, sprintId: string): Promise<SprintResponse> {
    return apiClient.post<SprintResponse>(`/objectives/${objectiveId}/sprints/${sprintId}/start`);
  },

  /**
   * Complete a sprint
   */
  async completeSprint(
    sprintId: string,
    data: CompleteSprintInput,
  ): Promise<CompleteSprintResponse> {
    return apiClient.post<CompleteSprintResponse>(`/sprints/${sprintId}/complete`, data);
  },

  /**
   * Check if user is ready to start a sprint (pre-sprint quiz check)
   */
  async getSprintReadiness(objectiveId: string, sprintId: string): Promise<ReadinessResponse> {
    return apiClient.get<ReadinessResponse>(
      `/objectives/${objectiveId}/sprints/${sprintId}/readiness`,
    );
  },

  /**
   * Check if user can progress after completing sprint (post-sprint quiz check)
   */
  async getSprintValidation(objectiveId: string, sprintId: string): Promise<ValidationResponse> {
    return apiClient.get<ValidationResponse>(
      `/objectives/${objectiveId}/sprints/${sprintId}/validation`,
    );
  },

  /**
   * Update sprint progress (for tracking task completion)
   */
  async updateSprintProgress(
    objectiveId: string,
    sprintId: string,
    data: { completedTasks: number; totalTasks: number },
  ): Promise<SprintResponse> {
    return apiClient.patch<SprintResponse>(
      `/objectives/${objectiveId}/sprints/${sprintId}/progress`,
      data,
    );
  },

  /**
   * Submit sprint evidence (links + self-evaluation)
   */
  async submitSprintEvidence(
    objectiveId: string,
    sprintId: string,
    data: {
      artifacts: {
        artifactId?: string;
        projectId?: string;
        type: string;
        title?: string;
        url: string;
        notes?: string;
        status?: string;
      }[];
      selfEvaluation?: {
        confidence?: number | null;
        reflection?: string | null;
      } | null;
      markSubmitted?: boolean;
    },
  ): Promise<SprintResponse> {
    return apiClient.post<SprintResponse>(
      `/objectives/${objectiveId}/sprints/${sprintId}/evidence`,
      data,
    );
  },

  /**
   * Check sprint completion status
   */
  async getSprintCompletionStatus(sprintId: string): Promise<{
    success: boolean;
    data: {
      isCompleted: boolean;
      completedAt: string | null;
      canComplete: boolean;
      reason: string | null;
    };
  }> {
    return apiClient.get(`/sprints/${sprintId}/completion-status`);
  },

  /**
   * Check generation status for an objective
   */
  async getGenerationStatus(objectiveId: string): Promise<{
    success: boolean;
    data: {
      canGenerate: boolean;
      reason: string | null;
      currentSprintId: string | null;
      nextSprintDay: number | null;
      objectiveCompleted: boolean;
    };
  }> {
    return apiClient.get(`/objectives/${objectiveId}/sprints/generation-status`);
  },

  /**
   * Manually generate next sprint (if auto-generation failed)
   */
  async generateNextSprint(
    objectiveId: string,
    options?: { force?: boolean },
  ): Promise<SprintResponse> {
    return apiClient.post<SprintResponse>(
      `/objectives/${objectiveId}/sprints/generate-next`,
      options,
    );
  },
};

// ============================================================================
// SKILLS API
// ============================================================================

export const skillsService = {
  /**
   * Get user's skill map for a specific objective
   */
  async getSkillMap(userId: string, objectiveId?: string): Promise<SkillMapResponse> {
    const params = objectiveId ? { objectiveId } : undefined;
    return apiClient.get<SkillMapResponse>(`/users/${userId}/skills`, { params });
  },

  /**
   * Get all skills for the current user
   */
  async getUserSkills(objectiveId?: string): Promise<SkillMapResponse> {
    const params = objectiveId ? { objectiveId } : undefined;
    return apiClient.get<SkillMapResponse>("/users/me/skills", { params });
  },

  /**
   * Get details for a specific skill
   */
  async getSkillDetails(skillId: string): Promise<any> {
    return apiClient.get(`/skills/${skillId}`);
  },
};

// ============================================================================
// PERFORMANCE API
// ============================================================================

export const performanceService = {
  /**
   * Get performance analytics for an objective
   */
  async getObjectivePerformance(objectiveId: string): Promise<PerformanceResponse> {
    return apiClient.get<PerformanceResponse>(`/objectives/${objectiveId}/performance`);
  },

  /**
   * Get overall user performance
   */
  async getUserPerformance(): Promise<PerformanceResponse> {
    return apiClient.get<PerformanceResponse>("/users/me/performance");
  },
};

// ============================================================================
// COMBINED EXPORT
// ============================================================================

export const learningService = {
  objectives: objectivesService,
  sprints: sprintsService,
  skills: skillsService,
  performance: performanceService,
};
