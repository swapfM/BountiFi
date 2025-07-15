import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

const assignBountyToHunter = async ({
  token,
  bountyId,
}: {
  token: string;
  bountyId: number;
}) => {
  const response = await axios.get(
    `${BASE_URL}/api/hunter/assign_bounty/${bountyId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useHunterAssignBounty = () => {
  return useMutation({
    mutationFn: assignBountyToHunter,
  });
};
