"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { userService } from "@/services";
import { toast } from "sonner";

export function DeleteAccount() {
  const t = useTranslations("Settings");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.deleteAccount({ password });
      toast.success(t("account.success"));
    } catch {
      toast.error(t("account.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-lg font-medium text-destructive">{t("account.title")}</h2>
      <p className="text-sm text-muted-foreground">{t("account.warning")}</p>
      <PasswordInput
        id="deletePassword"
        label={t("account.password")}
        value={password}
        onChange={setPassword}
        required
      />
      <Button type="submit" disabled={loading} variant="destructive">
        {loading ? t("account.loading") : t("account.submit")}
      </Button>
    </form>
  );
}
