import { apiClient } from "./api";
import type {
  UserProfile,
  ProfileResponse,
  UpdateProfileData,
  UpdatePasswordData,
  DeleteAccountData,
} from "@/models/user";

// Service utilisateur
export const userService = {
  // Récupérer le profil utilisateur
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<ProfileResponse>("/users/profile");
    return response.data.user;
  },

  // Mettre à jour le profil utilisateur
  async updateProfile(data: UpdateProfileData): Promise<void> {
    await apiClient.put("/users/profile", data);
  },

  // Mettre à jour le mot de passe
  async updatePassword(data: UpdatePasswordData): Promise<void> {
    await apiClient.post("/users/password", data);
  },

  // Supprimer le compte
  async deleteAccount(data: DeleteAccountData): Promise<void> {
    await apiClient.delete("/users/account", { data });
  },
};
