"use client";

import { PropsWithChildren, useState } from "react";
import { useTranslations } from "next-intl";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";

export default function PrivateLayout({ children }: PropsWithChildren) {
  const t = useTranslations("Dashboard.nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleOpenMenu = () => setMobileOpen(true);
  const handleCloseMenu = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen">
        <Sidebar mobileOpen={mobileOpen} onClose={handleCloseMenu} />
        <div className="flex-1 min-w-0 flex flex-col">
          <Header onMenuClick={handleOpenMenu} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
