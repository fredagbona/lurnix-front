"use client";

import { PropsWithChildren } from "react";
import { useTranslations } from "next-intl";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";

export default function PrivateLayout({ children }: PropsWithChildren) {
  const t = useTranslations("Dashboard.nav");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />

        <div className="flex-1 min-w-0">
          <Header />

          <main className="p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
