import { useWriteContract } from "wagmi";
import { BOUNTY_ESCROW_ABI, BOUNTY_ESCROW_CONTRACT_ADDRESS } from "@/constants";
import { parseEther } from "viem";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

export function useFundBounty() {
  const { writeContractAsync, isPending, error } = useWriteContract();

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

      console.log("Submitted tx:", txHash);

      const receipt = await waitWithRetry(txHash);
      console.log("Tx confirmed:", receipt);

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
      console.error("Funding error:", err);

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

  async function waitWithRetry(txHash: `0x${string}`) {
    const maxRetries = 10;
    const delay = 3000;
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        const res = await fetch(
          `https://api.primordial.bdagscan.com/v1/api/transaction/getTransactionDetails?txnHash=${txHash}&chain=EVM`
        );
        const json = await res.json();
        const result = json.data;

        if (res.ok && result?.status === "success") {
          return result;
        }
      } catch (err) {
        console.error("Polling error:", err);
      }

      attempts++;
      await new Promise((r) => setTimeout(r, delay));
    }

    throw new Error("Transaction not confirmed after max retries.");
  }

  return { fund, isPending, error };
}
