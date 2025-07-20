"use client";

import type React from "react";
import FuturisticBackground from "@/components/FuturisticBackground";
import { HunterNavbar } from "@/components/hunter-navbar";
import { HunterSidebar } from "./hunter-sidebar";
import { useState } from "react";

interface HunterLayoutProps {
  children: React.ReactNode;
}

export function HunterLayout({ children }: HunterLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div className="min-h-screen relative">
      <FuturisticBackground />

      <div className="flex">
        <HunterSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          <HunterNavbar />

          <main className="p-8 relative z-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
