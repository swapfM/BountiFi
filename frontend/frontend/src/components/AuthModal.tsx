"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Building2, User } from "lucide-react";
import { loginUser, signupUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useLoader } from "@/hooks/useLoader";

interface AuthModalProps {
  type: "login" | "signup" | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ type, isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<
    "ORGANIZATION" | "HUNTER" | null
  >(null);
  const [loading, setLoading] = useState(false);
  const { Loader } = useLoader({
    text: type === "signup" ? "Creating account..." : "Signing in...",
    variant: "full-screen",
    color: type === "signup" ? "green" : "blue",
  });
  const router = useRouter();
  const { setName: setAuthName, setAccessToken, setUserType } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === "signup") {
        if (!selectedRole) {
          setLoading(false);
          return;
        }

        const response = await signupUser({
          email,
          password,
          name,
          user_type: selectedRole,
        });

        setAuthName(response.name);
        setUserType(response.user_type);
        setAccessToken(response.access_token);

        router.push(
          response.user_type === "ORGANIZATION"
            ? "/org/dashboard"
            : "/hunter/dashboard"
        );
      } else if (type === "login") {
        const response = await loginUser({ email, password });

        setAuthName(response.name);
        setUserType(response.user_type);
        setAccessToken(response.access_token);

        router.push(
          response.user_type === "ORGANIZATION"
            ? "/org/dashboard"
            : "/hunter/dashboard"
        );
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setSelectedRole(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!type) return null;
  if (loading) return <Loader />;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card/90 backdrop-blur-sm border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-neon-blue">
            {type === "login" ? "Welcome Back" : "Join BountiFi"}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-sm mt-1">
            {type === "login"
              ? "Enter your credentials to access your dashboard."
              : "Sign up to start earning or posting bounties."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-input border-border focus:border-neon-blue focus:ring-neon-blue/20 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>
          {type === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-input border-border focus:border-neon-blue focus:ring-neon-blue/20 transition-colors"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-input border-border focus:border-neon-blue focus:ring-neon-blue/20 transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          {type === "signup" && (
            <div className="space-y-4">
              <Label className="text-sm font-medium">Choose Your Role</Label>
              <div className="grid grid-cols-2 gap-4">
                <Card
                  className={cn(
                    "p-4 cursor-pointer transition-all duration-300 border-2 group hover:scale-105",
                    selectedRole === "ORGANIZATION"
                      ? "border-neon-blue neon-glow bg-card/80"
                      : "border-border hover:border-neon-blue/50 bg-card/40"
                  )}
                  onClick={() => setSelectedRole("ORGANIZATION")}
                >
                  <div className="space-y-3 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center group-hover:bg-neon-blue/30 transition-colors">
                      <Building2 className="w-6 h-6 text-neon-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Organization</h3>
                      <p className="text-xs text-muted-foreground">
                        Post bounties & manage projects
                      </p>
                    </div>
                  </div>
                </Card>

                <Card
                  className={cn(
                    "p-4 cursor-pointer transition-all duration-300 border-2 group hover:scale-105",
                    selectedRole === "HUNTER"
                      ? "border-neon-green neon-glow-green bg-card/80"
                      : "border-border hover:border-neon-green/50 bg-card/40"
                  )}
                  onClick={() => setSelectedRole("HUNTER")}
                >
                  <div className="space-y-3 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-neon-green/20 flex items-center justify-center group-hover:bg-neon-green/30 transition-colors">
                      <User className="w-6 h-6 text-neon-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Bounty Hunter</h3>
                      <p className="text-xs text-muted-foreground">
                        Solve challenges & earn rewards
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || (type === "signup" && !selectedRole)}
            className="w-full bg-neon-blue hover:bg-neon-blue/80 text-black font-semibold neon-glow py-3 transition-all duration-300 hover:scale-105"
          >
            {loading
              ? "Please wait..."
              : type === "login"
              ? "Sign In"
              : "Create Account"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
