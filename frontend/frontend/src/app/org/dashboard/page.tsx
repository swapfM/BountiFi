"use client";

import { useEffect, useState } from "react";
import { OrgLayout } from "@/components/org-layout";
import { BountyCard } from "@/components/bounty-card";
import { CreateBountyModal } from "@/components/create-bounty-modal";
import { EditBountyModal } from "@/components/edit-bounty-modal";
import { useGetOrgBounties } from "@/hooks/useGetOrgBounties";
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
}

export default function OrgDashboard() {
  const [createBountyOpen, setCreateBountyOpen] = useState(false);
  const [editBounty, setEditBounty] = useState<bountySummary | null>(null);
  const { accessToken: token } = useAuth();
  const [mockBounties, setMockBounties] = useState<bountySummary[]>([]);

  const { data } = useGetOrgBounties(token ?? "");

  useEffect(() => {
    if (data) {
      setMockBounties(data);
    }
  }, [data]);
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
            />
          ))}
        </div>
      </div>

      <CreateBountyModal
        isOpen={createBountyOpen}
        onClose={() => setCreateBountyOpen(false)}
      />
      <EditBountyModal
        bounty={editBounty}
        isOpen={!!editBounty}
        onClose={() => setEditBounty(null)}
      />
    </OrgLayout>
  );
}
