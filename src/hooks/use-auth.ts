import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services";
import { authCookies } from "@/lib/cookies-client";
import type { LoginCredentials, RegisterData, User } from "@/models";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

// Hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: authService.getCurrentUser,
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Store token in cookies
      authCookies.setToken(data.token);

      // Update cache
      queryClient.setQueryData(authKeys.user(), data.user);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      // Store token in cookies
      authCookies.setToken(data.token);

      // Update cache
      queryClient.setQueryData(authKeys.user(), data.user);
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Remove token from cookies
      authCookies.clearToken();

      // Clear cache
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
};

// Hooks supplémentaires pour la validation
export const useCheckEmailAvailability = () => {
  return useMutation({
    mutationFn: authService.checkEmailAvailability,
  });
};

export const useCheckUsernameAvailability = () => {
  return useMutation({
    mutationFn: authService.checkUsernameAvailability,
  });
};
