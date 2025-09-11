import { useQuery } from "@tanstack/react-query";
import { authCookies } from "@/lib/cookies-client";
import { useCurrentUser } from "./use-auth";

// Hook pour vérifier l'état d'authentification
export const useAuthState = () => {
  const { data: user, isLoading, error } = useCurrentUser();

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user && authCookies.isAuthenticated(),
    isUnauthenticated: !user && !isLoading,
  };
};

// Hook pour vérifier si l'utilisateur est connecté (simple)
export const useIsAuthenticated = () => {
  return authCookies.isAuthenticated();
};
