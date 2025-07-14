import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import camelcaseKeys from "camelcase-keys";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

const fetchOrgBountyDetails = async (token: string, id: number) => {
  const response = await axios.get(
    `${BASE_URL}/api/organization/bounty/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return camelcaseKeys(response.data, { deep: true });
};

export const useGetOrgBountyDetails = (token: string, id: number) => {
  return useQuery({
    queryKey: ["get-org-bounty-details"],
    queryFn: () => fetchOrgBountyDetails(token, id),
    enabled: !!token,
  });
};
