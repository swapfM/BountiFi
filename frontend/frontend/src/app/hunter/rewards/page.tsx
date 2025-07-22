"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Award, Trophy, Zap, ExternalLink, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetHunterSolutionCount } from "@/hooks/useGetHunterSolutionCount";
import { useAuth } from "@/context/AuthContext";
import { HunterLayout } from "@/components/hunter-layout";
import { useMintNFT } from "@/hooks/contracts/useMintNFT";

const availableRewards = [
  {
    id: "1",
    title: "Elite Bounty Hunter",
    description: "Awarded for successful hunts on BountiFi",
    image: "/nft.png",
    requiredSolutions: 1,
  },
];

export default function RewardsPage() {
  const [approvedSolutionsCount, setApprovedSolutionsCount] =
    useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState<string | null>(null);
  const { accessToken } = useAuth();
  const { data } = useGetHunterSolutionCount(accessToken ?? "");
  const { mintNFT } = useMintNFT();

  useEffect(() => {
    if (data && typeof data.count === "number") {
      setApprovedSolutionsCount(data.count);
      setLoading(false);
    }
  }, [data]);

  const handleMintNFT = async (rewardId: string) => {
    setMinting(rewardId);
    try {
      // Simulate minting process
      mintNFT();
    } catch (error) {
      console.error("Minting failed:", error);
    } finally {
      setMinting(null);
    }
  };

  const canMintReward = (requiredSolutions: number) => {
    return approvedSolutionsCount >= requiredSolutions;
  };

  return (
    <HunterLayout>
      <div className="min-h-screen p-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-neon-green mb-2">Rewards</h1>
            <p className="text-muted-foreground">
              Mint exclusive NFT rewards based on your approved bounty solutions
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-neon-green/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-neon-green" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Approved Solutions
                  </p>
                  <p className="text-2xl font-bold text-neon-green">
                    {loading ? "..." : approvedSolutionsCount}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-neon-blue" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Available Rewards
                  </p>
                  <p className="text-2xl font-bold text-neon-blue">
                    {
                      availableRewards.filter((reward) =>
                        canMintReward(reward.requiredSolutions)
                      ).length
                    }
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-neon-yellow/20 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-neon-yellow" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Rewards</p>
                  <p className="text-2xl font-bold text-neon-yellow">
                    {availableRewards.length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-neon-yellow">
                Available NFT Rewards
              </h2>
              <Badge className="bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30">
                {availableRewards.length} rewards
              </Badge>
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableRewards.map((reward) => {
                const canMint = canMintReward(reward.requiredSolutions);
                const isMinting = minting === reward.id;

                return (
                  <Card
                    key={reward.id}
                    className={cn(
                      "p-6 bg-card/50 backdrop-blur-sm border-border transition-all duration-300",
                      canMint
                        ? "hover:border-neon-green/30 hover:shadow-lg hover:shadow-neon-green/10"
                        : "opacity-60"
                    )}
                  >
                    <div className="space-y-4">
                      {/* NFT Image */}
                      <div className="relative">
                        <img
                          src={reward.image || "/placeholder.svg"}
                          alt={reward.title}
                          className="w-full h-48 object-cover rounded-lg bg-muted/20"
                        />
                      </div>

                      {/* Reward Info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            {reward.title}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {reward.description}
                        </p>
                      </div>

                      {/* Requirements */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Required Solutions:
                        </span>
                        <span
                          className={cn(
                            "font-semibold",
                            canMint
                              ? "text-neon-green"
                              : "text-muted-foreground"
                          )}
                        >
                          {approvedSolutionsCount}/{reward.requiredSolutions}
                        </span>
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={() => handleMintNFT(reward.id)}
                        disabled={!canMint || isMinting || loading}
                        className={cn(
                          "w-full font-semibold transition-all duration-300",
                          canMint
                            ? "bg-neon-green hover:bg-neon-green/80 text-black neon-glow-green"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                      >
                        {isMinting ? (
                          <div className="flex items-center space-x-2">
                            <Zap className="w-4 h-4 animate-spin" />
                            <span>Minting...</span>
                          </div>
                        ) : canMint ? (
                          <div className="flex items-center space-x-2">
                            <Award className="w-4 h-4" />
                            <span>Mint NFT</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Trophy className="w-4 h-4" />
                            <span>Not Available</span>
                          </div>
                        )}
                      </Button>

                      {canMint && (
                        <a
                          href="#"
                          className="flex items-center justify-center space-x-1 text-sm text-neon-blue hover:text-neon-blue/80 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Preview on OpenSea</span>
                        </a>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Empty State */}
          {approvedSolutionsCount === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                No Approved Solutions Yet
              </h3>
              <p className="text-muted-foreground">
                Complete and get your bounty solutions approved to unlock NFT
                rewards.
              </p>
            </div>
          )}
        </div>
      </div>
    </HunterLayout>
  );
}
