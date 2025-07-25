import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

const postMarkRefund = async (token: string, bounty_id: number) => {
  console.log(token, bounty_id);
  const response = await axios.post(
    `${BASE_URL}/api/organization/mark_refunded/${bounty_id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const useMarkRefund = () => {
  return useMutation({
    mutationFn: ({ token, bounty_id }: { token: string; bounty_id: number }) =>
      postMarkRefund(token, bounty_id),
  });
};
