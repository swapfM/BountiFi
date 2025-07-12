// hooks/useOrgBounties.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

const fetchOrgBounties = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/api/organization/bounties`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useGetOrgBounties = (token: string) => {
  return useQuery({
    queryKey: ["get-org-bounties"],
    queryFn: () => fetchOrgBounties(token),
    enabled: !!token,
  });
};
