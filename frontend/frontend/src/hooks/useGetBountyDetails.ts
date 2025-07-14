import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import camelcaseKeys from "camelcase-keys";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

const fetchBountyDetails = async (
  token: string,
  id: number,
  userType: string
) => {
  const URL =
    userType == "HUNTER"
      ? `${BASE_URL}/api/hunter/bounty/${id}`
      : `${BASE_URL}/api/organization/bounty/${id}`;
  const response = await axios.get(URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return camelcaseKeys(response.data, { deep: true });
};

export const useGetBountyDetails = (
  token: string,
  id: number,
  userType: string
) => {
  return useQuery({
    queryKey: ["get-bounty-details"],
    queryFn: () => fetchBountyDetails(token, id, userType),
    enabled: !!token,
  });
};
