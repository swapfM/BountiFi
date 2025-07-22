import { useWriteContract, usePublicClient } from "wagmi";
import { BOUNTY_ESCROW_ABI, BOUNTY_ESCROW_CONTRACT_ADDRESS } from "@/constants";
import { parseEther } from "viem";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

export function useFundBounty() {
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const fund = async (
    bountyId: number,
    payoutAmount: number,
    bountyTitle: string,
    token: string
  ) => {
    let txHash: `0x${string}` | null = null;

    try {
      txHash = await writeContractAsync({
        address: BOUNTY_ESCROW_CONTRACT_ADDRESS,
        abi: BOUNTY_ESCROW_ABI,
        functionName: "fundBounty",
        args: [bountyId],
        value: parseEther(payoutAmount.toString()),
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
          transactionType: "FUND_BOUNTY",
          transactionStatus: "SUCCESS",
          payoutAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return receipt;
    } catch (err) {
      if (txHash) {
        try {
          await axios.post(
            `${BASE_URL}/api/organization/create_transaction`,
            {
              bountyTitle,
              transactionHash: txHash,
              transactionType: "FUND_BOUNTY",
              transactionStatus: "FAILED",
              payoutAmount,
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

  return { fund };
}
