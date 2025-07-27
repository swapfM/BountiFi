import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

interface fundPayload {
  transactionHash: string;
  bountyId: number;
}

const postFundBounty = async (token: string, payload: fundPayload) => {
  const response = await axios.post(
    `${BASE_URL}/api/organization/fund_bounty`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const useOrgFundBounty = () => {
  return useMutation({
    mutationFn: ({ token, payload }: { token: string; payload: fundPayload }) =>
      postFundBounty(token, payload),

    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success(data.message || "Successfully funded bounty");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    },
    onError: (error: AxiosError) => {
      toast.error(error.response?.status || "Network/server error occurred");
    },
  });
};
