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
      txHash = await writeContractAsync({
        address: BOUNTY_ESCROW_CONTRACT_ADDRESS,
        abi: BOUNTY_ESCROW_ABI,
        functionName: "approveSolution",
        args: [bountyId],
        gas: BigInt(1_000_000),
      });

      if (!publicClient) {
        throw new Error("Public client is not available.");
      }
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

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
      throw error;

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
          throw logErr;
        }
      }

      throw err;
    }
  };

  return { approve, isPending, error };
}
