import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

interface SolutionPayload {
  bountyId: number;
  solutionLink: string;
  description: string;
}

const postSubmitSolution = async (token: string, payload: SolutionPayload) => {
  const response = await axios.post(
    `${BASE_URL}/api/hunter/submit_solution`,
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

export const useHunterSubmitSolution = () => {
  return useMutation({
    mutationFn: ({
      token,
      payload,
    }: {
      token: string;
      payload: SolutionPayload;
    }) => postSubmitSolution(token, payload),
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success(data.message || "Successfully submitted solution");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    },
    onError: (error: AxiosError) => {
      toast.error(error.response?.status || "Network/server error occurred");
    },
  });
};
