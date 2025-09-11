"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { userService, authService } from "@/services";
import { UserProfile } from "@/models";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Header() {
  const t = useTranslations("Dashboard.nav");
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

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

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await authService.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, redirect to login
      router.push("/login");
    } finally {
      setLogoutLoading(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
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
          <div className="flex items-center gap-2 rounded-full border border-input px-2 py-1">
            <span className="inline-block h-6 w-6 rounded-full bg-muted" aria-hidden />
            <span className="text-sm">
              {loading ? "Loading..." : profile?.fullname || profile?.username || "User"}
            </span>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input hover:bg-accent"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
