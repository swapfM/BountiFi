import { useWriteContract } from "wagmi";
import { abi, contractAddress } from "@/constants";

export function useAssignHunter() {
  const { writeContract, isPending, error, data } = useWriteContract();

  const assign = (bountyId: number) => {
    if (!bountyId) {
      throw new Error("Invalid bounty ID");
    }

    writeContract({
      address: contractAddress,
      abi,
      functionName: "assignHunter",
      args: [bountyId],
    });
  };

  return { assign, isPending, error, data };
}
