import { useAccount, useConfig, useWriteContract } from "wagmi";
import { abi, contractAddress } from "@/constants";
import { parseEther } from "viem";

export function useFundBounty() {
  const config = useConfig();
  const { address } = useAccount();
  const { writeContract, isPending, error } = useWriteContract({ config });

  const fund = async (bountyId: number, payoutAmount: number) => {
    try {
      console.log(bountyId, payoutAmount);
      await writeContract({
        address: contractAddress,
        abi,
        functionName: "fundBounty",
        args: [bountyId],
        value: parseEther(payoutAmount.toString()),
        account: address,
      });
    } catch (err) {
      console.error("Error funding bounty:", err);
    }
  };

  return { fund, isPending, error };
}
