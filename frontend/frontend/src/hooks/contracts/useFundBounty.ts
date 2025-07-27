import { useWriteContract } from "wagmi";
import { BOUNTY_ESCROW_ABI, BOUNTY_ESCROW_CONTRACT_ADDRESS } from "@/constants";
import { parseEther } from "viem";

export function useFundBounty() {
  const { writeContractAsync } = useWriteContract();

  const fund = async (bountyId: number, payoutAmount: number) => {
    try {
      const txHash = await writeContractAsync({
        address: BOUNTY_ESCROW_CONTRACT_ADDRESS,
        abi: BOUNTY_ESCROW_ABI,
        functionName: "fundBounty",
        args: [bountyId],
        value: parseEther(payoutAmount.toString()),
        gas: BigInt(1_000_000),
      });

      return txHash;
    } catch (err) {
      console.error("Transaction failed", err);
      throw err;
    }
  };

  return { fund };
}
