import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

interface SolutionPayload {
  bountyId: number;
  solutionLink: string;
  description: string;
}

const postSubmitSolution = async (token: string, payload: SolutionPayload) => {
  console.log(payload);
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
  });
};
