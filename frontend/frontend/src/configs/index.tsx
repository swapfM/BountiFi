"use client";
import { blockdagPrimordial } from "@/chains";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { createStorage, cookieStorage } from "wagmi";

import { Chain } from "viem";

const chains: readonly [Chain, ...Chain[]] = [blockdagPrimordial];

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

// const metadata = {
//   name: "Web3Modal",
//   description: "Web3Modal Example",
//   url: "https://web3modal.com", // origin must match your domain & subdomain
//   icons: ["https://avatars.githubusercontent.com/u/37784886"],
// };

// export const config = defaultWagmiConfig({
//   chains,
//   projectId,
//   metadata,
//   ssr: true,
//   storage: createStorage({
//     storage: cookieStorage,
//   }),
// });
export const config = defaultWagmiConfig({
  chains,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  metadata: {
    name: "BountiFi",
    description: "DApp using BlockDAG",
    url: "https://yourdomain.com",
    icons: ["https://yourdomain.com/logo.png"],
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
