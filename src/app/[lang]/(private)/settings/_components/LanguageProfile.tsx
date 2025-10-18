"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/components/providers/language-provider";
import { useUpdateLanguagePreference } from "@/hooks/use-language-preference";

export function LanguageProfile() {
  const t = useTranslations("Settings");
  const { language, isLoading } = useLanguage();
  const updateLanguage = useUpdateLanguagePreference();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedLanguage === language) {
      toast.info(t("language.alreadySelected"));
      return;
    }

    updateLanguage.mutate(selectedLanguage, {
      onSuccess: () => {
        toast.success(t("language.success"));
      },
      onError: () => {
        toast.error(t("language.error"));
        setSelectedLanguage(language);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-lg font-medium">{t("language.title")}</h2>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="language">
          {t("language.select")}
        </label>
        <select
          id="language"
          required
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value as "en" | "fr")}
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={t("language.select")}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>
      <Button type="submit" disabled={isLoading || updateLanguage.isPending}>
        {updateLanguage.isPending ? t("language.loading") : t("language.submit")}
      </Button>
    </form>
  );
}
