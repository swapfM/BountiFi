"use client";

import { useState } from "react";
import { OrgLayout } from "@/components/org-layout";
import { BountyCard } from "@/components/bounty-card";
import { CreateBountyModal } from "@/components/create-bounty-modal";
import { EditBountyModal } from "@/components/edit-bounty-modal";

const mockBounties = [
  {
    id: "1",
    title: "Implement Smart Contract Audit System",
    techStack: ["Solidity", "Hardhat", "OpenZeppelin", "Slither"],
    payout: "5000 USDC",
    deadline: "2024-02-15",
    status: "open" as const,
    description:
      "Build a comprehensive audit system for smart contracts with automated vulnerability detection.",
    githubIssueLink: "https://github.com/org/project/issues/123",
    codebaseUrl: "https://github.com/org/project",
    externalWebsite: "https://project.org",
  },
  {
    id: "2",
    title: "Build DeFi Dashboard UI",
    techStack: ["React", "TypeScript", "Web3.js", "Tailwind"],
    payout: "3000 USDC",
    deadline: "2024-02-20",
    status: "in-progress" as const,
    description:
      "Create a responsive dashboard for DeFi protocol with real-time data visualization.",
    githubIssueLink: "https://github.com/org/defi-ui/issues/45",
    codebaseUrl: "https://github.com/org/defi-ui",
    externalWebsite: "https://defi.project.org",
  },
  {
    id: "3",
    title: "Optimize Gas Usage in DEX",
    techStack: ["Solidity", "Foundry", "Assembly"],
    payout: "2000 USDC",
    deadline: "2024-02-10",
    status: "completed" as const,
    description:
      "Reduce gas costs in decentralized exchange smart contracts by 30%.",
    githubIssueLink: "https://github.com/org/dex/issues/67",
    codebaseUrl: "https://github.com/org/dex",
    externalWebsite: "https://dex.project.org",
  },
];

export default function OrgDashboard() {
  const [createBountyOpen, setCreateBountyOpen] = useState(false);
  const [editBounty, setEditBounty] = useState<(typeof mockBounties)[0] | null>(
    null
  );

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
              userType="org"
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
