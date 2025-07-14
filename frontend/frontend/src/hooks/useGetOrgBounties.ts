import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import camelcaseKeys from "camelcase-keys";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

const fetchOrgBounties = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/api/organization/bounties`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return camelcaseKeys(response.data, { deep: true });
};

export const useGetOrgBounties = (token: string) => {
  return useQuery({
    queryKey: ["get-org-bounties"],
    queryFn: () => fetchOrgBounties(token),
    enabled: !!token,
  });
};
