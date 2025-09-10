// Types pour les services utilisateur
export interface UserProfile {
  id: string;
  username: string;
  fullname: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: UserProfile;
  };
  timestamp: string;
}

export interface UpdateProfileData {
  username: string;
  fullname: string;
  email: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountData {
  password: string;
}
