export interface FeatureCategory {
  value: string;
  translationKey: string;
}

export interface FeatureCategoriesResponse {
  success: boolean;
  data: FeatureCategory[];
  timestamp: string;
}

export interface FeatureRequest {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  status: "open" | "closed" | "merged" | "duplicate";
  votesCount: number;
  userVoted: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  mergedIntoId: string | null;
}

export interface FeaturesResponse {
  success: boolean;
  data: {
    items: FeatureRequest[];
  };
  timestamp: string;
}

export interface VoteResponse {
  success: boolean;
  data: {
    votesCount: number;
    userVoted: boolean;
  };
  timestamp: string;
}
