import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

interface assignPayload {
  transactionHash: string;
  bountyId: number;
}

const assignBountyToHunter = async ({
  token,
  payload,
}: {
  token: string;
  payload: assignPayload;
}) => {
  const response = await axios.post(
    `${BASE_URL}/api/hunter/assign_bounty`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useHunterAssignBounty = () => {
  return useMutation({
    mutationFn: assignBountyToHunter,
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success(data.message || "Success");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    },
    onError: (error: AxiosError) => {
      toast.error(error.response?.status || "Network/server error occurred");
    },
  });
};
