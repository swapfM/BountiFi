"use client";

import { useEffect, useState } from "react";
import { OrgLayout } from "@/components/org-layout";
import { BountyCard } from "@/components/bounty-card";
import { CreateBountyModal } from "@/components/create-bounty-modal";
import { EditBountyModal } from "@/components/edit-bounty-modal";
import { useGetOrgBounties } from "@/hooks/useGetOrgBounties";
import { useAuth } from "@/context/AuthContext";
import { useLoader } from "@/hooks/useLoader";
import { BountyStatus } from "@/types/AuthTypes";
import { useMarkRefund } from "@/hooks/useMarkRefund";

interface bountySummary {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  payoutAmount: number;
  payoutCurrency: string;
  status: BountyStatus;
  deadline: Date;
  refund?: boolean;
}

export default function OrgDashboard() {
  const [createBountyOpen, setCreateBountyOpen] = useState(false);
  const [editBounty, setEditBounty] = useState<bountySummary | null>(null);
  const { accessToken: token } = useAuth();
  const [mockBounties, setMockBounties] = useState<bountySummary[]>([]);
  const { Loader, loading, setLoading } = useLoader({
    text: "Loading Bounties...",
    variant: "full-screen",
    color: "blue",
  });
  const { mutate } = useMarkRefund();

  const { data } = useGetOrgBounties(token ?? "");

  useEffect(() => {
    if (data) {
      setMockBounties(data);
      setLoading(false);
    }
  }, [data, setLoading]);
  if (loading) {
    return <Loader />;
  }

  const handleRefundBounty = (bounty_id: number) => {
    mutate({ token: token ?? "", bounty_id: bounty_id });
  };

  return (
    <OrgLayout onCreateBounty={() => setCreateBountyOpen(true)}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-neon-blue mb-2">
              My Bounties
            </h1>
            <p className="text-muted-foreground">
              Manage and track your active bounty campaigns
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-neon-green">
              {mockBounties.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Bounties</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBounties.map((bounty) => (
            <BountyCard
              key={bounty.id}
              bounty={bounty}
              userType="ORGANIZATION"
              onEdit={() => setEditBounty(bounty)}
              onRefund={() => handleRefundBounty(bounty.id)}
            />
          ))}
        </div>
      </div>

      <CreateBountyModal
        isOpen={createBountyOpen}
        onClose={() => setCreateBountyOpen(false)}
      />
      {editBounty && (
        <EditBountyModal
          bounty={editBounty}
          isOpen={true}
          onClose={() => setEditBounty(null)}
        />
      )}
    </OrgLayout>
  );
}
