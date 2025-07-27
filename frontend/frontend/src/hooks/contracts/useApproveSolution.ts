import { useWriteContract } from "wagmi";
import { BOUNTY_ESCROW_ABI, BOUNTY_ESCROW_CONTRACT_ADDRESS } from "@/constants";

export function useApproveSolution() {
  const { writeContractAsync } = useWriteContract();

  const approve = async (bountyId: number) => {
    try {
      const txHash = await writeContractAsync({
        address: BOUNTY_ESCROW_CONTRACT_ADDRESS,
        abi: BOUNTY_ESCROW_ABI,
        functionName: "approveSolution",
        args: [bountyId],
        gas: BigInt(1_000_000),
      });

      return txHash;
    } catch (err) {
      console.error("Transaction failed", err);
      throw err;
    }
  };

  return { approve };
}
