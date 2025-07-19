import { useWriteContract } from "wagmi";
import { abi, contractAddress } from "@/constants";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

export function useApproveSubmission() {
  const { writeContractAsync, isPending, error } = useWriteContract();

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
        address: contractAddress,
        abi,
        functionName: "approveSolution",
        args: [bountyId],
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

      if (txHash) {
        try {
          await axios.post(
            `${BASE_URL}/api/organization/create_transaction`,
            {
              bountyTitle,
              transactionHash: txHash,
              transactionType: "RECEIVE_PAYOUT",
              transactionStatus: "FAILED",
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

  return { approve, isPending, error };
}
