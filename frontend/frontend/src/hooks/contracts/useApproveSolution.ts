import { useWriteContract, usePublicClient } from "wagmi";
import { BOUNTY_ESCROW_ABI, BOUNTY_ESCROW_CONTRACT_ADDRESS } from "@/constants";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

export function useApproveSolution() {
  const { writeContractAsync, isPending, error } = useWriteContract();
  const publicClient = usePublicClient();

  const approve = async (
    bountyId: number,
    payoutAmount: number,
    bountyTitle: string,
    hunterId: number,
    token: string
  ) => {
    let txHash: `0x${string}` | null = null;

    try {
      // Send transaction
      txHash = await writeContractAsync({
        address: BOUNTY_ESCROW_CONTRACT_ADDRESS,
        abi: BOUNTY_ESCROW_ABI,
        functionName: "approveSolution",
        args: [bountyId],
        gas: BigInt(1_000_000),
      });

      console.log("Submitted tx:", txHash);

      // ✅ Wait for on-chain confirmation
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      console.log("Tx confirmed:", receipt);

      // Log success to backend
      await axios.post(
        `${BASE_URL}/api/organization/create_transaction`,
        {
          bountyTitle,
          transactionHash: txHash,
          transactionType: "RECEIVE_PAYOUT",
          transactionStatus: "SUCCESS",
          payoutAmount,
          hunterId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return receipt;
    } catch (err) {
      console.error("Approval error:", err);

      // Log failure if txHash exists
      if (txHash) {
        try {
          await axios.post(
            `${BASE_URL}/api/organization/create_transaction`,
            {
              bountyTitle,
              transactionHash: txHash,
              transactionType: "RECEIVE_PAYOUT",
              transactionStatus: "SUCCESS",
              payoutAmount,
              hunterId,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (logErr) {
          console.error("Failed to log failed txn to backend:", logErr);
        }
      }

      throw err;
    }
  };

  return { approve, isPending, error };
}
