import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import camelcaseKeys from "camelcase-keys";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

const fetchHunterSolutionCount = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/api/hunter/solution_count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return camelcaseKeys(response.data, { deep: true });
};

export const useGetHunterSolutionCount = (token: string) => {
  return useQuery({
    queryKey: ["get-solution-count"],
    queryFn: () => fetchHunterSolutionCount(token),
    enabled: !!token,
  });
};
