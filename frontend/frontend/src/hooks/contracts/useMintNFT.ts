import { useWriteContract } from "wagmi";
import {
  BOUNTIFI_BADGE_CONTRACT_ADDRESS,
  BOUNTIFI_BADGE_ABI,
} from "@/constants";

const tokenURI = process.env.NEXT_PUBLIC_NFT_TOKEN_URI;

export function useMintNFT() {
  const { writeContractAsync, isPending, error } = useWriteContract();

  const mintNFT = async () => {
    let txHash: `0x${string}` | null = null;
    try {
      txHash = await writeContractAsync({
        address: BOUNTIFI_BADGE_CONTRACT_ADDRESS,
        abi: BOUNTIFI_BADGE_ABI,
        functionName: "safeMint",
        args: [tokenURI],
        gas: BigInt(1_000_000),
      });

      return txHash;
    } catch (err) {
      throw err;
    }
  };

  return { mintNFT, isPending, error };
}
