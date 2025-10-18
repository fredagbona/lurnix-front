import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services";
import { authKeys } from "@/hooks/use-auth";
import { useLanguage, type SupportedLocale } from "@/components/providers/language-provider";

export function useUpdateLanguagePreference() {
  const queryClient = useQueryClient();
  const { setLanguage } = useLanguage();

  return useMutation({
    mutationFn: async (language: SupportedLocale) => {
      await userService.updateLanguage({ language });
      return language;
    },
    onSuccess: (language) => {
      setLanguage(language);
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
}
