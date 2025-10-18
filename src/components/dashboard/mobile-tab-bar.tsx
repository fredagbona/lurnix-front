"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Target, TrendingUp, BookOpen, User } from "lucide-react";

/**
 * Mobile Bottom Tab Bar
 * Replaces sidebar navigation on mobile devices with a modern tab bar
 * Features:
 * - Active state with top indicator bar
 * - Icon animations and glow effects
 * - Smooth transitions
 * - Touch-friendly tap targets
 */
export default function MobileTabBar() {
  const t = useTranslations("Dashboard.nav");
  const pathname = usePathname();

  const tabs = useMemo(
    () => [
      {
        href: "/dashboard",
        label: t("dashboard", { default: "Home" }),
        icon: Home,
        shortLabel: "Home",
      },
      {
        href: "/objectives",
        label: t("learning", { default: "Learning" }),
        icon: Target,
        shortLabel: "Learn",
      },
      {
        href: "/roadmap",
        label: t("roadmap", { default: "Roadmap" }),
        icon: BookOpen,
        shortLabel: "Roadmap",
      },
      {
        href: "/settings",
        label: t("settings", { default: "Profile" }),
        icon: User,
        shortLabel: "Profile",
      },
    ],
    [t],
  );

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/50 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.3)]"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 px-1">
        {tabs.map((tab) => {
          const isActive = pathname?.includes(tab.href);
          const IconComponent = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full rounded-xl transition-all duration-300 relative group",
                "active:scale-95 touch-manipulation",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active top indicator bar with animation */}
              <div
                className={cn(
                  "absolute top-0 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all duration-300",
                  isActive ? "w-12 bg-primary opacity-100" : "w-0 bg-primary/0 opacity-0",
                )}
              />

              {/* Background highlight on active */}
              {isActive && <div className="absolute inset-0 bg-primary/5 rounded-xl" />}

              {/* Icon container with active state */}
              <div
                className={cn(
                  "relative transition-all duration-300 z-10",
                  isActive ? "scale-110 -translate-y-0.5" : "scale-100",
                )}
              >
                <IconComponent
                  className={cn(
                    "h-6 w-6 transition-all duration-300",
                    isActive &&
                      "drop-shadow-[0_0_12px_rgba(147,51,234,0.6)] dark:drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]",
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>

              {/* Label with active state */}
              <span
                className={cn(
                  "text-[10px] font-medium transition-all duration-300 z-10 leading-tight",
                  isActive
                    ? "text-primary font-bold scale-105"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              >
                {tab.shortLabel}
              </span>

              {/* Ripple effect on tap (visual feedback) */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-0 bg-primary/10 scale-0 rounded-full transition-transform duration-500",
                    "group-active:scale-150",
                  )}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Safe area spacer for devices with bottom notch */}
      <div className="h-safe-area-inset-bottom bg-card/95 backdrop-blur-xl" />
    </nav>
  );
}
