"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { userService } from "@/services";
import type { UpdatePasswordData } from "@/models";
import { toast } from "sonner";

export function PasswordUpdateForm() {
  const t = useTranslations("Settings");

  const [formData, setFormData] = useState<UpdatePasswordData>({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.updatePassword(formData);
      toast.success(t("password.success"));
      setFormData({ currentPassword: "", newPassword: "" });
    } catch {
      toast.error(t("password.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-lg font-medium">{t("password.title")}</h2>
      <PasswordInput
        id="currentPassword"
        label={t("password.current")}
        value={formData.currentPassword}
        onChange={(value) => setFormData({ ...formData, currentPassword: value })}
        required
      />
      <PasswordInput
        id="newPassword"
        label={t("password.new")}
        value={formData.newPassword}
        onChange={(value) => setFormData({ ...formData, newPassword: value })}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? t("password.loading") : t("password.submit")}
      </Button>
    </form>
  );
}
