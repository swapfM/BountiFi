"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SubmissionModal } from "@/components/submission-modal";
import { BountyDetailsModal } from "@/components/bounty-details-modal";
import { Calendar, Edit, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

type BountyStatus = "OPEN" | "ASSIGNED" | "IN_REVIEW" | "COMPLETED";

interface BountyCardProps {
  bounty: {
    id: number;
    title: string;
    description: string;
    techStack: string[];
    payoutAmount: number;
    payoutCurrency: string;
    status: BountyStatus;
    deadline: Date;
    orgName?: string;
    orgLogo?: string;
    isNew?: boolean;

    codebaseUrl?: string;
    externalWebsite?: string;
    githubIssueLink?: string;
  };
  userType: "ORGANIZATION" | "HUNTER";
  showSubmit?: boolean;
  onEdit?: () => void;
  onClaim?: () => void;
}

export function BountyCard({
  bounty,
  userType,
  showSubmit,
  onEdit,
  onClaim,
}: BountyCardProps) {
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { toast } = useToast();

  const statusColors = {
    OPEN: "bg-neon-green/20 text-neon-green border-neon-green/30",
    ASSIGNED: "bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30",
    IN_REVIEW: "bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30",
    COMPLETED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  const accentColor = userType === "ORGANIZATION" ? "neon-blue" : "neon-green";
  const glowClass =
    userType === "ORGANIZATION" ? "neon-glow" : "neon-glow-green";

  function formatDeadline(date: Date | string) {
    //  “dd/MM/yyyy” date format for now
    return format(date, "dd/MM/yyyy");
  }

  const handleAssignBounty = () => {
    if (onClaim) {
      onClaim();
      toast({
        title: "Bounty Claimed Successfully! ",
        description: `You've claimed "${bounty.title}". Check your My Tasks tab to start working on it.`,
        variant: "success",
      });
    }
  };

  return (
    <>
      <Card
        className={cn(
          "bg-card/50 backdrop-blur-sm border-border hover:border-opacity-50 transition-all duration-300 group h-full",
          `hover:border-${accentColor}`,
          bounty.isNew &&
            userType === "HUNTER" &&
            "ring-1 ring-neon-green/30 neon-glow-green"
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-neon-blue transition-colors">
              {bounty.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              {bounty.isNew && userType === "HUNTER" && (
                <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 text-xs">
                  NEW
                </Badge>
              )}
              {
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDetailsOpen(true)}
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neon-blue/10"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              }
              {userType === "ORGANIZATION" && onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onEdit}
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {bounty.orgName && (
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="w-6 h-6 rounded-full bg-neon-blue/20 flex items-center justify-center text-xs font-semibold text-neon-blue mr-2">
                {bounty.orgLogo || bounty.orgName[0]}
              </div>
              <span>{bounty.orgName}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {bounty.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {bounty.description}
            </p>
          )}

          <div className="flex flex-wrap gap-1">
            {bounty.techStack.slice(0, 3).map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="text-xs bg-muted/50 hover:bg-muted"
              >
                {tech}
              </Badge>
            ))}
            {bounty.techStack.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-muted/50">
                +{bounty.techStack.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-neon-green gap-2">
              <span>{bounty.payoutCurrency}</span>
              <span className="font-semibold">{bounty.payoutAmount}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDeadline(bounty.deadline)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge className={cn("text-xs", statusColors[bounty.status])}>
              {bounty.status.replace("-", " ").toUpperCase()}
            </Badge>

            <div className="flex space-x-2">
              {/* Show View Details only for hunters viewing available bounties (not in My Tasks) */}
              {userType === "HUNTER" &&
                bounty.status === "OPEN" &&
                !showSubmit && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDetailsOpen(true)}
                      className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10"
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAssignBounty}
                      className={cn(
                        "bg-neon-green hover:bg-neon-green/80 text-black font-semibold",
                        glowClass
                      )}
                    >
                      Assign
                    </Button>
                  </>
                )}

              {userType == "HUNTER" && bounty.status === "ASSIGNED" && (
                <Button
                  size="sm"
                  onClick={() => setSubmissionOpen(true)}
                  className={cn(
                    "bg-neon-blue hover:bg-neon-blue/80 text-black font-semibold",
                    "neon-glow"
                  )}
                >
                  Submit Solution
                </Button>
              )}

              {/* For org cards, no action buttons in the bottom area */}
            </div>
          </div>
        </CardContent>
      </Card>

      <SubmissionModal
        bounty={bounty}
        isOpen={submissionOpen}
        onClose={() => setSubmissionOpen(false)}
      />
      <BountyDetailsModal
        bountyId={bounty.id}
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onClaim={onClaim}
        userType={userType}
      />
    </>
  );
}
