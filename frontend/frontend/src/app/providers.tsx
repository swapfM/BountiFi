"use client";

import { AuthProvider } from "@/context/AuthContext";
import Web3ModalProvider from "@/context/Web3Modal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Web3ModalProvider>
      <AuthProvider>{children}</AuthProvider>
    </Web3ModalProvider>
  );
}
