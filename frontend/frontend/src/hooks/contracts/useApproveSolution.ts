import { useWriteContract } from "wagmi";
import { abi, contractAddress } from "@/constants";

export function useApproveSolution() {
  const { writeContract, isPending, error, data } = useWriteContract();

  const approve = (bountyId: number) => {
    if (!bountyId) {
      throw new Error("Invalid bounty ID");
    }

    writeContract({
      address: contractAddress,
      abi,
      functionName: "approveSolution",
      args: [bountyId],
      gas: BigInt(1000000),
    });
  };

  return { approve, isPending, error, data };
}
