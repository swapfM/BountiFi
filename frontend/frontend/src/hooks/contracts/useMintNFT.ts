import { useWriteContract } from "wagmi";
import {
  BOUNTIFI_BADGE_CONTRACT_ADDRESS,
  BOUNTIFI_BADGE_ABI,
} from "@/constants";

export function useMintNFT() {
  const { writeContractAsync, isPending, error } = useWriteContract();

  const mintNFT = async (recipient: `0x${string}`, tokenURI: string) => {
    let txHash: `0x${string}` | null = null;

    console.log("Minting NFT for:", recipient, "with URI:", tokenURI);
    try {
      txHash = await writeContractAsync({
        address: BOUNTIFI_BADGE_CONTRACT_ADDRESS,
        abi: BOUNTIFI_BADGE_ABI,
        functionName: "safeMint",
        args: [tokenURI],
        gas: BigInt(1_000_000),
      });

      console.log("Submitted tx:", txHash);
      return txHash;
    } catch (err) {
      console.error("Minting error:", err);
      throw err;
    }
  };

  return { mintNFT, isPending, error };
}
