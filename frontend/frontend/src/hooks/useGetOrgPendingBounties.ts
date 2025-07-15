import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import camelcaseKeys from "camelcase-keys";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

const fetchOrgPendingBounties = async (token: string) => {
  const response = await axios.get(
    `${BASE_URL}/api/organization/pending_submissions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return camelcaseKeys(response.data, { deep: true });
};

export const useGetOrgPendingBounties = (token: string) => {
  return useQuery({
    queryKey: ["get-org=pending-bounties"],
    queryFn: () => fetchOrgPendingBounties(token),
    enabled: !!token,
  });
};
