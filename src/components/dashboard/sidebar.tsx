"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookOpen, Settings, CreditCard, Zap, Target, TrendingUp } from "lucide-react";

export default function Sidebar() {
  const t = useTranslations("Dashboard.nav");
  const pathname = usePathname();
  const router = useRouter();

  const nav = useMemo(
    () => [
      { href: "/dashboard", label: t("dashboard", { default: "Dashboard" }), icon: Home },
      { href: "/objectives", label: t("learning", { default: "Learning" }), icon: Target },
      { href: "/skills", label: t("skills", { default: "Skills" }), icon: TrendingUp },
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

  const handleLanguageChange = (locale: string) => {
    const currentPath = pathname || "";
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}/, "");
    router.push(`/${locale}${pathWithoutLocale}`);
  };

  return (
    <aside
      className="hidden md:flex w-64 shrink-0 flex-col bg-card/60 border-r border-border h-screen sticky top-0"
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
                "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active 
                  ? "bg-muted text-foreground" 
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              <IconComponent className={cn(
                "h-5 w-5 transition-colors",
                active ? "text-purple-600 dark:text-purple-400" : ""
              )} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
