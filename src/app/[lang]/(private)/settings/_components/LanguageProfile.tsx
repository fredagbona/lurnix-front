"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { userService } from "@/services";
import type { UpdateLanguageData } from "@/models";
import { toast } from "sonner";

export function LanguageProfile() {
  const t = useTranslations("Settings");

  const [formData, setFormData] = useState<UpdateLanguageData>({ language: "en" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.updateLanguage(formData);
      toast.success(t("language.success"));
    } catch {
      toast.error(t("language.error"));
    } finally {
      setLoading(false);
    }
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
          value={formData.language}
          onChange={(e) => setFormData({ language: e.target.value })}
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={t("language.select")}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? t("language.loading") : t("language.submit")}
      </Button>
    </form>
  );
}
