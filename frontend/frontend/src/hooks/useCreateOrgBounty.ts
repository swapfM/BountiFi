import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

interface BountyPayload {
  title: string;
  description: string;
  techStack: string[];
  payoutAmount: number;
  payoutCurrency: string;
  deadline: Date;
  codebaseUrl?: string;
  externalWebsite?: string;
  githubIssueLink?: string;
}

const postCreateBounty = async (token: string, payload: BountyPayload) => {
  const response = await axios.post(
    `${BASE_URL}/api/organization/create_bounty`,
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

export const useCreateOrgBounty = () => {
  return useMutation({
    mutationFn: ({
      token,
      payload,
    }: {
      token: string;
      payload: BountyPayload;
    }) => postCreateBounty(token, payload),
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
