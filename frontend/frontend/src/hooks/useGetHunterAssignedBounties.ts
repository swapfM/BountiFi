import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import camelcaseKeys from "camelcase-keys";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

const fetchHunterAssignedBounties = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/api/hunter/assigned_bounties`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return camelcaseKeys(response.data, { deep: true });
};

export const useGetHunterAssignedBounties = (token: string) => {
  return useQuery({
    queryKey: ["get-assigned-bounties"],
    queryFn: () => fetchHunterAssignedBounties(token),
    enabled: !!token,
  });
};
