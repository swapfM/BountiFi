import { useWriteContract } from "wagmi";
import { BOUNTY_ESCROW_ABI, BOUNTY_ESCROW_CONTRACT_ADDRESS } from "@/constants";

export function useAssignHunter() {
  const { writeContract, isPending, error, data } = useWriteContract();

  const assign = (bountyId: number) => {
    if (!bountyId) {
      throw new Error("Invalid bounty ID");
    }

    writeContract({
      address: BOUNTY_ESCROW_CONTRACT_ADDRESS,
      abi: BOUNTY_ESCROW_ABI,
      functionName: "assignHunter",
      args: [bountyId],
      gas: BigInt(1000000),
    });
  };

  return { assign, isPending, error, data };
}
