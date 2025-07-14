"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Trophy, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export function HunterNavbar() {
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("bountifi_user");
    router.push("/");
  };

  return (
    <nav className="h-16 border-b border-border bg-card/30 backdrop-blur-sm flex items-center justify-between px-8 relative z-10">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-br from-neon-green to-neon-blue rounded-md opacity-20 blur-sm"></div>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
            BountiFi
          </span>
          <span className="text-xs text-muted-foreground font-mono tracking-wider">
            v2.0
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm">
          <Trophy className="w-4 h-4 text-neon-yellow" />
          <span className="text-muted-foreground">Rank:</span>
          <span className="text-neon-yellow font-semibold">Hunter</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-neon-green/30 hover:border-neon-green/50 transition-colors">
                <AvatarFallback className="bg-neon-green/20 text-neon-green font-semibold">
                  H
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-card/90 backdrop-blur-sm border-border"
            align="end"
          >
            <DropdownMenuItem className="hover:bg-muted/50 focus:bg-muted/50">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted/50 focus:bg-muted/50">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-muted/50 focus:bg-muted/50 text-red-400"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
