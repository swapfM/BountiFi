import { useWriteContract } from "wagmi";
import { BOUNTY_ESCROW_ABI, BOUNTY_ESCROW_CONTRACT_ADDRESS } from "@/constants";
import { toast } from "react-toastify";

export function useRefundBounty() {
  const { writeContractAsync } = useWriteContract();

  const refund = async (bountyId: number) => {
    try {
      const txHash = await writeContractAsync({
        address: BOUNTY_ESCROW_CONTRACT_ADDRESS,
        abi: BOUNTY_ESCROW_ABI,
        functionName: "refundBounty",
        args: [bountyId],
        gas: BigInt(1_000_000),
      });

      return txHash;
    } catch {
      toast.error("Transaction Failed");
    }
  };

  return { refund };
}
