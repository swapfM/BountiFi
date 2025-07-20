"use client";

import { Zap } from "lucide-react";

interface FuturisticLoaderProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  text?: string;
  variant?: "full-screen" | "inline";
  color?: "blue" | "green" | "yellow";
}

export default function FuturisticLoader({
  size = "md",
  showText = true,
  text = "Loading...",
  variant = "full-screen",
  color = "blue",
}: FuturisticLoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  };

  const colorClasses = {
    blue: {
      text: "text-neon-blue",
      bg: "bg-neon-blue",
      border: "border-neon-blue",
      glow: "neon-glow",
    },
    green: {
      text: "text-neon-green",
      bg: "bg-neon-green",
      border: "border-neon-green",
      glow: "neon-glow-green",
    },
    yellow: {
      text: "text-neon-yellow",
      bg: "bg-neon-yellow",
      border: "border-neon-yellow",
      glow: "neon-glow-yellow",
    },
  };

  if (variant === "full-screen") {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="futuristic-bg">
          <div className="gradient-overlay"></div>
          <div className="geometric-grid"></div>
          <div className="floating-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <div className="connection-lines">
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
        </div>

        <div className="text-center space-y-8 z-10">
          <div className="relative flex items-center justify-center">
            <div className="relative">
              <div
                className={`w-20 h-20 rounded-xl bg-gradient-to-br from-neon-blue to-neon-green flex items-center justify-center animate-pulse ${colorClasses[color].glow}`}
              >
                <Zap className="w-10 h-10 text-background animate-bounce" />
              </div>
              <div
                className={`absolute -inset-3 bg-gradient-to-br from-neon-blue to-neon-green rounded-xl opacity-20 blur-lg animate-pulse`}
              ></div>
            </div>
          </div>

          {/* Loading text */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-neon-blue via-foreground to-neon-green bg-clip-text text-transparent">
              BountiFi
            </h2>
            <p
              className={`${colorClasses[color].text} text-lg font-medium animate-pulse`}
            >
              {text}
            </p>

            {/* Loading dots */}
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-neon-yellow rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Inline variant
  return (
    <div className="flex items-center justify-center space-x-3">
      <div className="relative">
        {/* Spinning outer ring */}
        <div className={`${sizeClasses[size]} relative`}>
          <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-neon-blue to-neon-green animate-spin">
            <div className="absolute inset-0.5 bg-background rounded-full"></div>
          </div>

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`${sizeClasses[size]} rounded-lg bg-gradient-to-br from-neon-blue to-neon-green flex items-center justify-center ${colorClasses[color].glow}`}
            >
              <Zap
                className={`${iconSizes[size]} text-background animate-pulse`}
              />
            </div>
          </div>

          {/* Glow effect */}
          <div
            className={`absolute -inset-1 bg-gradient-to-br from-neon-blue to-neon-green rounded-full opacity-20 blur-md animate-pulse`}
          ></div>
        </div>
      </div>

      {showText && (
        <span
          className={`${textSizes[size]} font-medium bg-gradient-to-r from-neon-blue to-neon-green bg-clip-text text-transparent animate-pulse`}
        >
          {text}
        </span>
      )}
    </div>
  );
}
