"use client";

import { PropsWithChildren } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import MobileTabBar from "@/components/dashboard/mobile-tab-bar";
import Header from "@/components/dashboard/header";

export default function PrivateLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen">
        {/* Desktop Sidebar - hidden on mobile */}
        <Sidebar />
        
        <div className="flex-1 min-w-0 flex flex-col">
          <Header />
          
          {/* Main content with bottom padding on mobile for tab bar */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
            {children}
          </main>
        </div>
      </div>
      
      {/* Mobile Bottom Tab Bar - hidden on desktop */}
      <MobileTabBar />
    </div>
  );
}
