import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services";

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onError: (error) => {
      console.error("Email verification failed:", error);
    },
  });
};
