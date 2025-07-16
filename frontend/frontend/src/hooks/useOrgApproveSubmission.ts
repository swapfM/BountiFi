import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

const approveSubmission = async ({
  token,
  submissionId,
}: {
  token: string;
  submissionId: number;
}) => {
  const response = await axios.get(
    `${BASE_URL}/api/organization/approve_submission/${submissionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useOrgApproveSubmission = () => {
  return useMutation({
    mutationFn: approveSubmission,
  });
};
