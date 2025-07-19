// hooks/useLoader.ts
import { useState } from "react";
import FuturisticLoader from "@/components/FuturisticLoader";

export function useLoader({
  text = "Loading...",
  variant = "full-screen",
  color = "blue",
}: {
  text?: string;
  variant?: "full-screen" | "inline";
  color?: "blue" | "green" | "yellow";
} = {}) {
  const [loading, setLoading] = useState(true);

  const Loader = () =>
    loading ? (
      <FuturisticLoader text={text} variant={variant} color={color} />
    ) : null;

  return { loading, setLoading, Loader };
}
