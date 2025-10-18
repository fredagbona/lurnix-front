"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookOpen, Settings, LogOut, Zap, Target, ChevronDown } from "lucide-react";
import { userService } from "@/services";
import { useLogout } from "@/hooks";
import { UserProfile } from "@/models";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const t = useTranslations("Dashboard.nav");
  const tHeader = useTranslations("Header");
  const pathname = usePathname();
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
        setShowLogoutModal(false);
        router.push("/auth/login");
      },
    });
  };

  const getUserInitials = (name: string | undefined) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const displayName = profile?.fullname || profile?.username || "User";
  const initials = getUserInitials(displayName);

  const nav = useMemo(
    () => [
      { href: "/dashboard", label: t("dashboard", { default: "Dashboard" }), icon: Home },
      { href: "/objectives", label: t("learning", { default: "Learning" }), icon: Target },
      { href: "/roadmap", label: t("roadmap", { default: "Roadmap" }), icon: BookOpen },
      { href: "/features", label: t("features", { default: "Features" }), icon: Zap },
      {
        href: "/settings",
        label: t("settings", { default: "Settings" }),
        icon: Settings,
      },
    ],
    [t],
  );

  return (
    <aside
      className="hidden md:flex w-64 shrink-0 flex-col bg-card/60 border-r border-border h-screen sticky top-0"
      role="navigation"
      aria-label="Sidebar"
    >
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <Image src="/assets/logo/lurnix-favicon.svg" alt="Lurnix" width={24} height={24} />
          <span className="font-semibold">Lurnix</span>
        </div>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname?.includes(item.href);
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-muted text-foreground"
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              <IconComponent
                className={cn(
                  "h-5 w-5 transition-colors",
                  active ? "text-purple-600 dark:text-purple-400" : "",
                )}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Menu at Bottom */}
      <div className="border-t border-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold flex-shrink-0">
                {loading ? "..." : initials}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium truncate">
                  {loading ? "Loading..." : displayName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{profile?.email || ""}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" side="top">
            <DropdownMenuLabel>{tHeader("myAccount", { default: "My Account" })}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="h-4 w-4 mr-2" />
              {tHeader("settings", { default: "Settings" })}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowLogoutModal(true)}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {tHeader("logout", { default: "Logout" })}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tHeader("logoutDialog.title", { default: "Logout" })}</DialogTitle>
            <DialogDescription>
              {tHeader("logoutDialog.description", { default: "Are you sure you want to logout?" })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
              disabled={logoutMutation.isPending}
            >
              {tHeader("logoutDialog.cancel", { default: "Cancel" })}
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {tHeader("logoutDialog.loggingOut", { default: "Logging out..." })}
                </div>
              ) : (
                tHeader("logoutDialog.confirm", { default: "Logout" })
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
