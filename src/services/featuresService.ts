import { apiClient } from "./api";
import type {
  FeatureCategoriesResponse,
  FeaturesResponse,
  VoteResponse,
  SubmitFeatureRequest,
  SubmitFeatureResponse,
} from "@/models";

export const featuresService = {
  /**
   * Récupère les catégories disponibles pour les features
   */
  async getCategories(): Promise<FeatureCategoriesResponse> {
    return apiClient.get<FeatureCategoriesResponse>("/features/categories");
  },

  /**
   * Récupère la liste des features
   */
  async getFeatures(): Promise<FeaturesResponse> {
    return apiClient.get<FeaturesResponse>("/features");
  },

  /**
   * Toggle un vote sur une feature (vote/unvote)
   */
  async toggleVote(featureId: string): Promise<VoteResponse> {
    return apiClient.post<VoteResponse>(`/features/${featureId}/votes`);
  },

  /**
   * Soumet une nouvelle feature
   */
  async submitFeature(data: SubmitFeatureRequest): Promise<SubmitFeatureResponse> {
    return apiClient.post<SubmitFeatureResponse>("/features", data);
  },
};
