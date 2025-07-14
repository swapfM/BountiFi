import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import camelcaseKeys from "camelcase-keys";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

const fetchOrgBounties = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/api/hunter/open_bounties`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return camelcaseKeys(response.data, { deep: true });
};

export const useGetOpenBounties = (token: string) => {
  return useQuery({
    queryKey: ["get-open-bounties"],
    queryFn: () => fetchOrgBounties(token),
    enabled: !!token,
  });
};
