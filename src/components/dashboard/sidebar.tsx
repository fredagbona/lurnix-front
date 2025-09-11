"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookOpen, FolderOpen, Users, Settings, Globe } from "lucide-react";

type SidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const t = useTranslations("Dashboard.nav");
  const pathname = usePathname();
  const router = useRouter();

  const nav = useMemo(
    () => [
      { href: "/dashboard", label: t("dashboard", { default: "Dashboard" }), icon: Home },
      { href: "/roadmap", label: t("roadmap", { default: "Roadmap" }), icon: BookOpen },
      { href: "/resources", label: t("resources", { default: "Resources" }), icon: FolderOpen },
      {
        href: "/settings",
        label: t("settings", { default: "Settings" }),
        icon: Settings,
      },
    ],
    [t],
  );

  const handleLanguageChange = (locale: string) => {
    const currentPath = pathname || "";
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}/, "");
    router.push(`/${locale}${pathWithoutLocale}`);
  };

  const handleBackdropClick = () => {
    if (!mobileOpen) return;
    if (onClose) onClose();
  };

  const SidebarInner = (
    <aside
      className={cn(
        "w-64 shrink-0 flex-col bg-card/60 border-r border-border h-screen",
        mobileOpen ? "fixed inset-y-0 left-0 z-40 flex md:hidden" : "hidden md:flex sticky top-0",
      )}
      role="navigation"
      aria-label="Sidebar"
    >
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/assets/logo/lurnix-favicon.svg" alt="Lurnix" width={24} height={24} />
            <span className="font-semibold">Lurnix</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleLanguageChange("en")}
              className={cn(
                "px-2 py-1 text-xs rounded hover:bg-muted transition-colors",
                pathname?.startsWith("/en")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              EN
            </button>
            <button
              onClick={() => handleLanguageChange("fr")}
              className={cn(
                "px-2 py-1 text-xs rounded hover:bg-muted transition-colors",
                pathname?.startsWith("/fr")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              FR
            </button>
            {mobileOpen && (
              <button
                type="button"
                onClick={onClose}
                className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-accent"
                aria-label="Close navigation"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {nav.map((item) => {
          const active = pathname?.includes(item.href);
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2.5 text-lg transition-colors",
                active ? "bg-primary text-white" : "hover:bg-primary/10 hover:text-black",
              )}
              aria-current={active ? "page" : undefined}
              onClick={onClose}
            >
              <IconComponent className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );

  if (!mobileOpen) {
    return SidebarInner;
  }

  return (
    <div className="md:hidden">
      <div
        className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px]"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      {SidebarInner}
    </div>
  );
}
