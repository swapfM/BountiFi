"use client";

import { useEffect, useState } from "react";
import { HunterLayout } from "@/components/hunter-layout";
import { BountyCard } from "@/components/bounty-card";
import { FilterBar } from "@/components/filter-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetOpenBounties } from "@/hooks/useGetOpenBounties";
import { useAuth } from "@/context/AuthContext";

interface bountySummary {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  payoutAmount: number;
  payoutCurrency: string;
  status: string;
  deadline: Date;
  orgName?: string;
  orgLogo?: string;
  isNew?: boolean;

  codebaseUrl?: string;
  externalWebsite?: string;
  githubIssueLink?: string;
}

const mockAvailableBounties = [
  {
    id: "1",
    title: "Build NFT Marketplace Frontend",
    orgName: "CryptoDAO",
    orgLogo: "C",
    techStack: ["React", "Next.js", "Ethers.js", "IPFS"],
    payout: "4000 USDC",
    deadline: "2024-02-18",
    status: "open" as const,
    isNew: true,
    description:
      "Create a responsive NFT marketplace with advanced filtering and real-time updates. The platform should support multiple blockchain networks and provide seamless user experience for buying, selling, and trading NFTs.",
    codebaseUrl: "https://github.com/cryptodao/nft-marketplace",
    externalWebsite: "https://cryptodao.org",
    githubIssueLink: "https://github.com/cryptodao/nft-marketplace/issues/42",
  },
  {
    id: "2",
    title: "Smart Contract Security Review",
    orgName: "DeFi Protocol",
    orgLogo: "D",
    techStack: ["Solidity", "Slither", "Mythril", "Foundry"],
    payout: "6000 USDC",
    deadline: "2024-02-25",
    status: "open" as const,
    isNew: false,
    description:
      "Comprehensive security audit of DeFi lending protocol smart contracts. Review includes vulnerability assessment, gas optimization, and best practices implementation.",
    codebaseUrl: "https://github.com/defiprotocol/lending-contracts",
    externalWebsite: "https://defiprotocol.finance",
    githubIssueLink:
      "https://github.com/defiprotocol/lending-contracts/issues/18",
  },
  {
    id: "3",
    title: "Integrate Chainlink Oracles",
    orgName: "Web3 Startup",
    orgLogo: "W",
    techStack: ["Solidity", "Chainlink", "Hardhat", "JavaScript"],
    payout: "3500 USDC",
    deadline: "2024-02-12",
    status: "open" as const,
    isNew: true,
    description:
      "Implement price feeds and external data integration using Chainlink oracles. The integration should be robust, secure, and handle edge cases gracefully.",
    codebaseUrl: "https://github.com/web3startup/oracle-integration",
    externalWebsite: "https://web3startup.io",
    githubIssueLink:
      "https://github.com/web3startup/oracle-integration/issues/29",
  },
];

const initialMyTasks = [
  {
    id: "4",
    title: "Optimize Gas Usage in DEX",
    orgName: "DeFi Exchange",
    orgLogo: "D",
    techStack: ["Solidity", "Assembly", "Foundry"],
    payout: "2500 USDC",
    deadline: "2024-02-08",
    status: "in-progress" as const,
    isNew: false,
    description:
      "Reduce gas costs in core DEX functions through assembly optimizations and storage layout improvements.",
    codebaseUrl: "https://github.com/defiexchange/dex-contracts",
    externalWebsite: "https://defiexchange.com",
    githubIssueLink: "https://github.com/defiexchange/dex-contracts/issues/67",
  },
];

export default function HunterDashboard() {
  const [filters, setFilters] = useState({
    techStack: [] as string[],
    minReward: 0,
    maxReward: 10000,
    newOnly: false,
  });

  const [claimedBountyIds, setClaimedBountyIds] = useState<string[]>([]);
  const [myTasks, setMyTasks] = useState(initialMyTasks);

  const handleClaimBounty = (bountyId: string) => {
    // Find the bounty in available bounties
    const bountyToClaim = mockAvailableBounties.find((b) => b.id === bountyId);
    if (bountyToClaim) {
      // Add to claimed bounties
      setClaimedBountyIds((prev) => [...prev, bountyId]);

      // Add to my tasks with in-progress status
      const claimedBounty = {
        ...bountyToClaim,
        status: "in-progress" as const,
      };
      setMyTasks((prev) => [...prev, claimedBounty]);
    }
  };

  // Filter available bounties to exclude claimed ones
  //   const availableBounties = mockAvailableBounties.filter(
  //     (bounty) => !claimedBountyIds.includes(bounty.id)
  //   );

  //   const filteredBounties = availableBounties.filter((bounty) => {
  //     if (filters.newOnly && !bounty.isNew) return false;
  //     if (filters.techStack.length > 0) {
  //       const hasMatchingTech = bounty.techStack.some((tech) =>
  //         filters.techStack.includes(tech)
  //       );
  //       if (!hasMatchingTech) return false;
  //     }
  //     const payout = Number.parseInt(bounty.payout.replace(/[^\d]/g, ""));
  //     if (payout < filters.minReward || payout > filters.maxReward) return false;
  //     return true;
  //   });
  const { accessToken } = useAuth();

  console.log(accessToken);
  const [openBounties, setOpenBounties] = useState<bountySummary[]>([]);

  const { data } = useGetOpenBounties(accessToken ?? "");

  useEffect(() => {
    if (data) {
      setOpenBounties(data);
    }
  }, [data]);

  return (
    <HunterLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-neon-green mb-2">
            Bounty Dashboard
          </h1>
          <p className="text-muted-foreground">
            Discover opportunities and manage your active tasks
          </p>
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="bg-card/50 border border-border">
            <TabsTrigger
              value="available"
              className="data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green"
            >
              Available Bounties ({openBounties.length})
            </TabsTrigger>
            <TabsTrigger
              value="my-tasks"
              className="data-[state=active]:bg-neon-blue/20 data-[state=active]:text-neon-blue"
            >
              My Tasks ({myTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            <FilterBar filters={filters} onFiltersChange={setFilters} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {openBounties.map((bounty) => (
                <BountyCard
                  key={bounty.id}
                  bounty={bounty}
                  userType="HUNTER"
                  onClaim={() => handleClaimBounty(bounty.id)}
                />
              ))}
            </div>

            {openBounties.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No Bounties Found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters to see more opportunities.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-tasks" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myTasks.map((bounty) => (
                <BountyCard
                  key={bounty.id}
                  bounty={bounty}
                  userType="HUNTER"
                  showSubmit
                />
              ))}
            </div>

            {myTasks.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">No Active Tasks</h3>
                <p className="text-muted-foreground">
                  Claim bounties from the Available tab to start working on
                  them.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </HunterLayout>
  );
}
