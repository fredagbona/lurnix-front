"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { userService } from "@/services";
import type { UpdateProfileData } from "@/models";
import { toast } from "sonner";

export function UpdateProfileTab() {
  const t = useTranslations("Settings");

  const [formData, setFormData] = useState<UpdateProfileData>({
    username: "",
    fullname: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const loadProfile = async () => {
      try {
        const user = await userService.getProfile();
        if (isCancelled) return;
        setFormData({
          username: user.username ?? "",
          fullname: user.fullname ?? "",
          email: user.email ?? "",
        });
      } catch {
        // ignore prefill errors
      }
    };
    loadProfile();
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.updateProfile(formData);
      toast.success(t("profile.success"));
    } catch {
      toast.error(t("profile.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-lg font-medium">{t("profile.title")}</h2>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="username">
          {t("profile.username")}
        </label>
        <input
          id="username"
          type="text"
          required
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="fullname">
          {t("profile.fullname")}
        </label>
        <input
          id="fullname"
          type="text"
          required
          value={formData.fullname}
          onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="email">
          {t("profile.email")}
        </label>
        <input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? t("profile.loading") : t("profile.submit")}
      </Button>
    </form>
  );
}
