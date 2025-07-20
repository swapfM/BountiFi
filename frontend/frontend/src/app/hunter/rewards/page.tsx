"use client";

import { useAccount } from "wagmi";
import { useMintNFT } from "@/hooks/contracts/useMintNFT";
import { useState } from "react";

export default function MintButton() {
  const { address, isConnected } = useAccount();
  const { mintNFT, isPending } = useMintNFT();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleMint = async () => {
    if (!isConnected || !address) {
      setError("Connect your wallet first.");
      return;
    }

    const tokenURI = "ipfs://QmfFY1WtAwyC9e7mm3bXkhHFpzuUewntf3MMEAk7fU5yci"; // Replace with actual metadata URI
    setError(null);
    setSuccess(null);

    try {
      const txHash = await mintNFT(address, tokenURI);
      setSuccess(`Minted successfully! Tx: ${txHash}`);
    } catch (err: any) {
      setError(err?.shortMessage || err.message || "Mint failed.");
    }
  };

  return (
    <div className="p-4">
      <w3m-button></w3m-button>
      <button
        onClick={handleMint}
        disabled={isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Minting..." : "Mint Badge NFT"}
      </button>

      {success && <p className="mt-2 text-green-600">{success}</p>}
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
}
