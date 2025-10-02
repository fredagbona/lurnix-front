// Types pour l'authentification
export interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  avatar?: string;
  // OAuth fields
  googleId?: string;
  githubId?: string;
  providers?: string[]; // e.g., ['email', 'google', 'github']
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  fullname: string;
  email: string;
  password: string;
}

export interface UpdateLanguageData {
  language: string;
}

// OAuth Types
export type OAuthProvider = "google" | "github";

export interface LinkedAccount {
  provider: string;
  email?: string;
  connectedAt?: string;
}

export interface LinkedAccountsResponse {
  success: boolean;
  data: {
    providers: LinkedAccount[];
    hasPassword: boolean;
  };
  timestamp: string;
}

export interface UnlinkProviderRequest {
  password?: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

// Réponse complète de l'API
export interface ApiAuthResponse {
  success: boolean;
  message: string;
  data: AuthResponse;
  timestamp: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

// Types pour les erreurs d'API
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, any>;
}

// Types pour les réponses d'API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}
