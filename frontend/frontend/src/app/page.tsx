"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import { Zap } from "lucide-react";
import FuturisticBackground from "@/components/FuturisticBackground";

export default function Home() {
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <FuturisticBackground />

      <div className="text-center space-y-12 z-10 px-4">
        <div className="space-y-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-blue to-neon-green flex items-center justify-center">
                <Zap className="w-8 h-8 text-black" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-neon-blue to-neon-green rounded-xl opacity-20 blur-lg"></div>
            </div>
            <div className="flex flex-col items-start">
              <h1 className="text-7xl font-bold tracking-tight bg-gradient-to-r from-neon-blue via-white to-neon-green bg-clip-text text-transparent">
                BountiFi
              </h1>
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Decentralized bounty management platform for DAOs and Web3 projects.
            Connect talent with opportunities in the decentralized ecosystem.
          </p>
        </div>

        <div className="flex gap-6 justify-center">
          <Button
            onClick={() => setAuthModal("login")}
            className="bg-neon-blue hover:bg-neon-blue/80 text-black font-semibold px-12 py-4 text-lg neon-glow transition-all duration-300 hover:scale-105"
          >
            Login
          </Button>
          <Button
            onClick={() => setAuthModal("signup")}
            variant="outline"
            className="border-2 border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black px-12 py-4 text-lg transition-all duration-300 hover:scale-105"
          >
            Sign Up
          </Button>
        </div>
      </div>

      <AuthModal
        type={authModal}
        isOpen={!!authModal}
        onClose={() => setAuthModal(null)}
      />
    </div>
  );
}
