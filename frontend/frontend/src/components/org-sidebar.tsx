"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Target,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Zap,
  BadgeDollarSign,
} from "lucide-react";

interface OrgSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: Target, label: "My Bounties", href: "/org/dashboard" },
  { icon: FileCheck, label: "Review Submissions", href: "/org/review" },
  { icon: BadgeDollarSign, label: "Transactions", href: "/org/transactions" },
];

export function OrgSidebar({ collapsed, onToggle }: OrgSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-card/80 backdrop-blur-sm border-r border-border z-20 transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-md bg-gradient-to-br from-neon-blue to-neon-green flex items-center justify-center">
                    <Zap className="w-4 h-4 text-black" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-neon-blue to-neon-green rounded-md opacity-20 blur-sm"></div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-neon-blue to-neon-green bg-clip-text text-transparent">
                    BountiFi
                  </span>
                </div>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8 hover:bg-neon-blue/10"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30 neon-glow"
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                    collapsed && "justify-center"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive && "text-neon-blue"
                    )}
                  />
                  {!collapsed && (
                    <span className="font-medium truncate">{item.label}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {collapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="fixed left-4 top-4 z-30 h-8 w-8 bg-card/80 backdrop-blur-sm border border-border hover:bg-neon-blue/10"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}
