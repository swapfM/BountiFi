"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  ExternalLink,
  Github,
  Globe,
  Clock,
  Target,
  Code,
  FileText,
  HandCoins,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useGetBountyDetails } from "@/hooks/useGetBountyDetails";
import { useAuth } from "@/context/AuthContext";

interface BountyDetailsModalProps {
  bountyId: number;
  isOpen: boolean;
  onClose: () => void;
  onClaim?: (bountyId: string) => void;
  userType: "ORGANIZATION" | "HUNTER";
}

interface BountyDetails {
  id: number;
  title: string;
  orgName?: string;
  orgLogo?: string;
  techStack: string[];
  payoutAmount: number;
  payoutCurrency: string;
  deadline: Date;
  status: string;
  isNew?: boolean;
  description?: string;
  codebaseLink?: string;
  websiteLink?: string;
  githubIssueLink?: string;
}

export function BountyDetailsModal({
  bountyId,
  isOpen,
  onClose,
  onClaim,
  userType,
}: BountyDetailsModalProps) {
  const [bounty, setBounty] = useState<BountyDetails | null>(null);
  const { accessToken, userType: authUserType } = useAuth();

  const { data } = useGetBountyDetails(
    accessToken ?? "",
    bountyId ?? "",
    authUserType ?? ""
  );

  useEffect(() => {
    if (data) {
      setBounty(data);
    }
  }, [data]);

  if (!bounty) return null;

  const handleClaimBounty = () => {};

  const statusColors = {
    open: "bg-neon-green/20 text-neon-green border-neon-green/30",
    "in-progress": "bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30",
    completed: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  const daysUntilDeadline = Math.ceil(
    (new Date(bounty.deadline).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl bg-card/90 backdrop-blur-sm border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <DialogTitle className="text-2xl font-bold text-foreground">
                  {bounty.title}
                </DialogTitle>
                {bounty.isNew && (
                  <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                    NEW
                  </Badge>
                )}
              </div>

              {bounty.orgName && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center text-sm font-semibold text-neon-blue">
                    {bounty.orgLogo || bounty.orgName[0]}
                  </div>
                  <span className="text-lg text-muted-foreground">
                    {bounty.orgName}
                  </span>
                </div>
              )}
            </div>

            <Badge className={cn("text-sm", statusColors[bounty.status])}>
              {bounty.status.replace("-", " ").toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Paymentt Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/20 rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2 text-neon-green mb-2">
                <HandCoins className="w-5 h-5" />
                <span className="font-semibold">Payout</span>
              </div>
              <div className="text-2xl font-bold text-neon-green flex gap-2">
                <span>{bounty.payoutCurrency}</span>
                <span>{bounty.payoutAmount}</span>
              </div>
            </div>

            <div className="bg-muted/20 rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2 text-neon-yellow mb-2">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">Deadline</span>
              </div>
              <div className="text-lg font-semibold">
                {new Date(bounty.deadline).toLocaleDateString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {daysUntilDeadline > 0
                  ? `${daysUntilDeadline} days left`
                  : "Overdue"}
              </div>
            </div>

            <div className="bg-muted/20 rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2 text-neon-blue mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Status</span>
              </div>
              <div className="text-lg font-semibold capitalize">
                {bounty.status.replace("-", " ")}
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Description */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-neon-blue" />
              <h3 className="text-lg font-semibold">Description</h3>
            </div>
            <div className="bg-muted/20 rounded-lg p-4 border border-border">
              <p className="text-muted-foreground leading-relaxed">
                {bounty.description ||
                  "No description provided for this bounty."}
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-neon-green" />
              <h3 className="text-lg font-semibold">Required Tech Stack</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {bounty.techStack.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="bg-muted/50 hover:bg-muted text-sm px-3 py-1"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Links */}
          {(bounty.codebaseLink ||
            bounty.websiteLink ||
            bounty.githubIssueLink) && (
            <>
              <Separator className="bg-border" />
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <ExternalLink className="w-5 h-5 text-neon-yellow" />
                  <h3 className="text-lg font-semibold">Resources</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {bounty.codebaseLink && (
                    <a
                      href={bounty.codebaseLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 p-3 bg-muted/20 rounded-lg border border-border hover:border-neon-blue/50 transition-colors group"
                    >
                      <Github className="w-4 h-4 text-muted-foreground group-hover:text-neon-blue" />
                      <span className="text-sm group-hover:text-neon-blue">
                        Codebase
                      </span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-neon-blue ml-auto" />
                    </a>
                  )}

                  {bounty.websiteLink && (
                    <a
                      href={bounty.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 p-3 bg-muted/20 rounded-lg border border-border hover:border-neon-blue/50 transition-colors group"
                    >
                      <Globe className="w-4 h-4 text-muted-foreground group-hover:text-neon-blue" />
                      <span className="text-sm group-hover:text-neon-blue">
                        Website
                      </span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-neon-blue ml-auto" />
                    </a>
                  )}

                  {bounty.githubIssueLink && (
                    <a
                      href={bounty.githubIssueLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 p-3 bg-muted/20 rounded-lg border border-border hover:border-neon-blue/50 transition-colors group"
                    >
                      <Target className="w-4 h-4 text-muted-foreground group-hover:text-neon-blue" />
                      <span className="text-sm group-hover:text-neon-blue">
                        GitHub Issue
                      </span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-neon-blue ml-auto" />
                    </a>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-border hover:bg-muted bg-transparent"
            >
              Close
            </Button>

            {userType === "HUNTER" && bounty.status === "open" && onClaim && (
              <Button
                onClick={handleClaimBounty}
                className="bg-neon-green hover:bg-neon-green/80 text-black font-semibold neon-glow-green px-8"
              >
                Claim Bounty
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
