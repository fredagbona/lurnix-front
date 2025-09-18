import { apiClient } from "./api";
import { authCookies } from "@/lib/cookies-client";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ApiAuthResponse,
  User,
  PasswordResetRequest,
  PasswordResetConfirm,
} from "@/models";

// Service d'authentification
export const authService = {
  // Connexion
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiAuthResponse>("/auth/login", credentials);
    return response.data;
  },

  // Inscription
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiAuthResponse>("/auth/register", data);
    return response.data;
  },

  // Déconnexion
  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      // Ignorer les erreurs côté serveur pour garantir la déconnexion côté client
    } finally {
      authCookies.clearToken();
    }
  },

  // Récupérer l'utilisateur actuel
  async getCurrentUser(): Promise<User | null> {
    const token = authCookies.getToken();
    if (!token) return null;

    try {
      const response = await apiClient.get<{ success: boolean; data: User }>("/auth/me");
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // Demander une réinitialisation de mot de passe
  async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    // TODO: Remplacer par l'appel API réel
    // return apiClient.post("/auth/password-reset", data);

    // Simulation temporaire
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(`Password reset email sent to: ${data.email}`);
  },

  // Confirmer la réinitialisation de mot de passe
  async confirmPasswordReset(data: PasswordResetConfirm): Promise<void> {
    // TODO: Remplacer par l'appel API réel
    // return apiClient.post("/auth/password-reset/confirm", data);

    // Simulation temporaire
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Password reset confirmed");
  },

  // Vérifier si l'email est disponible
  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    // TODO: Remplacer par l'appel API réel
    // return apiClient.get(`/auth/check-email?email=${encodeURIComponent(email)}`);

    // Simulation temporaire
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { available: true };
  },

  // Vérifier si le nom d'utilisateur est disponible
  async checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
    // TODO: Remplacer par l'appel API réel
    // return apiClient.get(`/auth/check-username?username=${encodeURIComponent(username)}`);

    // Simulation temporaire
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { available: true };
  },

  // Vérifier l'email avec un token
  async verifyEmail(token: string): Promise<void> {
    await apiClient.get(`/auth/verify-email/${token}`, {
      skipAuth: true,
    });
  },

  // Renvoyer l'email de vérification
  async resendVerification(email: string): Promise<void> {
    await apiClient.post(`/auth/resend-verification`, { email }, { skipAuth: true });
  },

  // Mot de passe oublié: envoyer le lien de réinitialisation
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(`/auth/forgot-password`, { email }, { skipAuth: true });
  },
};
