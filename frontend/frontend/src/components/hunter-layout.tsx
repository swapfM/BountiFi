"use client";

import type React from "react";
import FuturisticBackground from "@/components/FuturisticBackground";
import { HunterNavbar } from "@/components/hunter-navbar";

interface HunterLayoutProps {
  children: React.ReactNode;
}

export function HunterLayout({ children }: HunterLayoutProps) {
  return (
    <div className="min-h-screen relative">
      <FuturisticBackground />

      <div className="flex flex-col">
        <HunterNavbar />

        <main className="flex-1 p-8 relative z-10">{children}</main>
      </div>
    </div>
  );
}
