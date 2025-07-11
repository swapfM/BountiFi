"use client";

import type React from "react";
import { useState } from "react";
import FuturisticBackground from "@/components/FuturisticBackground";
import { OrgSidebar } from "@/components/org-sidebar";
import { OrgNavbar } from "@/components/org-navbar";

interface OrgLayoutProps {
  children: React.ReactNode;
  onCreateBounty?: () => void;
}

export function OrgLayout({ children, onCreateBounty }: OrgLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen relative">
      <FuturisticBackground />

      <div className="flex">
        <OrgSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          <OrgNavbar onCreateBounty={onCreateBounty} />

          <main className="p-8 relative z-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
