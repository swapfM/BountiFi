"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useOrgApproveSubmission } from "@/hooks/useOrgApproveSubmission";
import { useApproveSolution } from "@/hooks/contracts/useApproveSolution";

interface Submission {
  bountyId: number;
  hunterId: number;
  bountyTitle: string;
  payoutAmount: number;
  bountyDescription: string;
  solutionDescription: string;
  solutionLink: string;
  solutionId: number;
  hunterName: string;
  submittedAt: Date;
  solutionStatus: string;
}

interface ReviewDrawerProps {
  submission: Submission | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewDrawer({
  submission,
  isOpen,
  onClose,
}: ReviewDrawerProps) {
  const [reviewNotes, setReviewNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { accessToken } = useAuth();
  const { mutate: approveSubmission } = useOrgApproveSubmission();
  const { approve } = useApproveSolution();

  const handleApprove = async () => {
    if (!submission) return;
    setLoading(true);
    approve(
      submission.bountyId,
      submission.payoutAmount,
      submission.bountyTitle,
      submission.hunterId,
      accessToken ?? ""
    );
    approveSubmission({
      token: accessToken ?? "",
      submissionId: submission.solutionId,
    });

    setLoading(false);
    onClose();
  };

  const handleReject = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Submission Rejected",
      description:
        "The hunter has been notified and can resubmit with improvements.",
      variant: "destructive",
    });

    setLoading(false);
    onClose();
  };

  if (!submission) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl bg-card/90 backdrop-blur-sm border-border overflow-y-auto">
        <SheetHeader className="space-y-4 pb-6">
          <SheetTitle className="text-2xl font-bold text-neon-blue">
            Review Submission
          </SheetTitle>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{submission.bountyTitle}</h3>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green font-semibold">
                  {submission.hunterName[0].toUpperCase()}
                </div>
                <span>{submission.hunterName}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(submission.submittedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <Badge className="bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30 w-fit">
              {submission.solutionStatus}
            </Badge>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Submission Notes */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Hunter&apos;s Notes</Label>
            <div className="bg-muted/20 rounded-lg p-4 border border-border">
              <p className="text-sm leading-relaxed">
                {submission.solutionDescription}
              </p>
            </div>
          </div>

          {/* Review Notes */}
          <div className="space-y-3">
            <Label htmlFor="reviewNotes" className="text-sm font-medium">
              Review Notes (Optional)
            </Label>
            <Textarea
              id="reviewNotes"
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="bg-input border-border focus:border-neon-blue focus:ring-neon-blue/20 min-h-[100px]"
              placeholder="Add feedback or comments for the hunter..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 bg-neon-green hover:bg-neon-green/80 text-black font-semibold neon-glow-green"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {loading ? "Processing..." : "Approve & Release Payment"}
            </Button>

            <Button
              onClick={handleReject}
              disabled={loading}
              variant="outline"
              className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
            >
              <XCircle className="w-4 h-4 mr-2" />
              {loading ? "Processing..." : "Request Changes"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
