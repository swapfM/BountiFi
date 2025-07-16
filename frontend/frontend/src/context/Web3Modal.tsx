// "use client";

// import React, { ReactNode } from "react";
// import { config, projectId } from "@/configs";

// import { createWeb3Modal } from "@web3modal/wagmi/react";

// import { State, WagmiProvider } from "wagmi";

// // Setup queryClient

// if (!projectId) throw new Error("Project ID is not defined");

// // Create modal
// createWeb3Modal({
//   wagmiConfig: config,
//   projectId,
//   enableAnalytics: true, // Optional - defaults to your Cloud configuration
//   enableOnramp: true, // Optional - false as default
// });

// export default function Web3ModalProvider({
//   children,
//   initialState,
// }: {
//   children: ReactNode;
//   initialState?: State;
// }) {
//   return (
//     <WagmiProvider config={config} initialState={initialState}>
//       {children}
//     </WagmiProvider>
//   );
// }
// Web3ModalProvider.tsx
// Web3ModalProvider.tsx
"use client";

import { ReactNode } from "react";
import { config, projectId } from "@/configs";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { State, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

if (typeof window !== "undefined" && projectId) {
  createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: true,
    enableOnramp: true,
  });
}

export default function Web3ModalProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
