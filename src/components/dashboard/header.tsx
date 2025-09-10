"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { userService } from "@/services";
import { UserProfile } from "@/models";

export default function Header() {
  const t = useTranslations("Dashboard.nav");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await userService.getProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-input hover:bg-accent"
            aria-label="Open navigation"
          >
            ☰
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input hover:bg-accent"
            aria-label="Notifications"
          >
            🔔
          </button>
          <div className="flex items-center gap-2 rounded-full border border-input px-2 py-1">
            <span className="inline-block h-6 w-6 rounded-full bg-muted" aria-hidden />
            <span className="text-sm">
              {loading ? "Loading..." : profile?.fullname || profile?.username || "User"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
