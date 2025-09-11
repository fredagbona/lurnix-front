import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services";
import type { PasswordResetRequest, PasswordResetConfirm } from "@/models";

// Hook pour demander une réinitialisation de mot de passe
export const usePasswordReset = () => {
  return useMutation({
    mutationFn: authService.requestPasswordReset,
    onSuccess: () => {
      console.log("Password reset email sent successfully");
    },
    onError: (error) => {
      console.error("Password reset request failed:", error);
    },
  });
};

// Hook pour confirmer la réinitialisation de mot de passe
export const usePasswordResetConfirm = () => {
  return useMutation({
    mutationFn: authService.confirmPasswordReset,
    onSuccess: () => {
      console.log("Password reset confirmed successfully");
    },
    onError: (error) => {
      console.error("Password reset confirmation failed:", error);
    },
  });
};
