import { useWriteContract } from "wagmi";
import { abi, contractAddress } from "@/constants";
import { parseEther } from "viem";

export function useFundBounty() {
  const { writeContractAsync, isPending, error } = useWriteContract();

  const fund = async (bountyId: number, payoutAmount: number) => {
    try {
      await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: "fundBounty",
        args: [bountyId],
        value: parseEther(payoutAmount.toString()),
        gas: BigInt(1000000),
      });
    } catch (err) {
      console.error("Failed to fund bounty:", err);
    }
  };

  return { fund, isPending, error };
}
