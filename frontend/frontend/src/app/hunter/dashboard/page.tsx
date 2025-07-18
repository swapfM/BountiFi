"use client";

import { useEffect, useState } from "react";
import { HunterLayout } from "@/components/hunter-layout";
import { BountyCard } from "@/components/bounty-card";
import { FilterBar } from "@/components/filter-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetOpenBounties } from "@/hooks/useGetOpenBounties";
import { useHunterAssignBounty } from "@/hooks/useHunterAssignBounty";
import { useAuth } from "@/context/AuthContext";
import { useGetHunterAssignedBounties } from "@/hooks/useGetHunterAssignedBounties";
import { useAssignHunter } from "@/hooks/contracts/useAssignHunter";

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

export default function HunterDashboard() {
  const [openBounties, setOpenBounties] = useState<bountySummary[]>([]);
  const [myTasks, setMyTasks] = useState<bountySummary[]>([]);
  const { accessToken } = useAuth();
  const { assign } = useAssignHunter();
  const { mutate: claimBounty } = useHunterAssignBounty();

  const { data: openBountiesData } = useGetOpenBounties(accessToken ?? "");
  const { data: assignedBountiesData } = useGetHunterAssignedBounties(
    accessToken ?? ""
  );

  useEffect(() => {
    if (openBountiesData) {
      setOpenBounties(openBountiesData);
    }
  }, [openBountiesData]);

  useEffect(() => {
    if (assignedBountiesData) {
      setMyTasks(assignedBountiesData);
    }
  }, [assignedBountiesData]);

  const handleClaimBounty = (bountyId: number) => {
    claimBounty(
      { token: accessToken ?? "", bountyId },
      {
        onSuccess: () => {
          setOpenBounties((prev) => prev.filter((b) => b.id !== bountyId));
          assign(bountyId);

          const claimed = openBounties.find((b) => b.id === bountyId);
          if (claimed) {
            setMyTasks((prev) => [...prev, claimed]);
          }
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };

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
            {/* <FilterBar filters={filters} onFiltersChange={setFilters} /> */}

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
