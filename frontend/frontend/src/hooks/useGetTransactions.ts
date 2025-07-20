import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import camelcaseKeys from "camelcase-keys";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

const fetchTransactions = async (token: string) => {
  const URL = `${BASE_URL}/api/organization/transactions`;
  const response = await axios.get(URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return camelcaseKeys(response.data, { deep: true });
};

export const useGetTransactions = (token: string) => {
  return useQuery({
    queryKey: ["get-transactions"],
    queryFn: () => fetchTransactions(token),
    enabled: !!token,
  });
};
