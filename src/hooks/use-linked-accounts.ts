import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services";
import type { OAuthProvider, UnlinkProviderRequest } from "@/models";

// Query keys
export const linkedAccountsKeys = {
  all: ["linkedAccounts"] as const,
  list: () => [...linkedAccountsKeys.all, "list"] as const,
};

// Hook to fetch linked accounts
export const useLinkedAccounts = () => {
  return useQuery({
    queryKey: linkedAccountsKeys.list(),
    queryFn: authService.getLinkedAccounts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to unlink a provider
export const useUnlinkProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ provider, data }: { provider: OAuthProvider; data?: UnlinkProviderRequest }) =>
      authService.unlinkProvider(provider, data),
    onSuccess: () => {
      // Invalidate linked accounts query to refetch
      queryClient.invalidateQueries({ queryKey: linkedAccountsKeys.all });
    },
    onError: (error) => {
      console.error("Failed to unlink provider:", error);
    },
  });
};
