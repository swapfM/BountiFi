import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

interface mintPayload {
  transactionHash: string;
}

const HunterMintNFT = async ({
  token,
  payload,
}: {
  token: string;
  payload: mintPayload;
}) => {
  const response = await axios.post(
    `${BASE_URL}/api/hunter/mint_nft`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useHunterMintNFT = () => {
  return useMutation({
    mutationFn: HunterMintNFT,
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success(data.message || "Successfully minted NFT");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    },
    onError: (error: AxiosError) => {
      toast.error(
        error.response?.statusText || "Network/server error occurred"
      );
    },
  });
};
