"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { userService } from "@/services";
import { useLogout } from "@/hooks";
import { UserProfile } from "@/models";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type HeaderProps = {
  onMenuClick?: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const t = useTranslations("Dashboard.nav");
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const logoutMutation = useLogout();

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

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setShowLogoutModal(false);
        router.push("/auth/login");
      },
      onError: (error) => {
        console.error("Logout error:", error);
        // Even if logout fails, redirect to login
        setShowLogoutModal(false);
        router.push("/auth/login");
      },
    });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
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

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Déconnexion</DialogTitle>
            <DialogDescription>Êtes-vous sûr de vouloir vous déconnecter ?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
              disabled={logoutMutation.isPending}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Déconnexion...
                </div>
              ) : (
                "Se déconnecter"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
