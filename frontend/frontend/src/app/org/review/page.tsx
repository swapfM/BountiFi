"use client";

import { useEffect, useState } from "react";
import { OrgLayout } from "@/components/org-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ReviewDrawer } from "@/components/review-drawer";
import { ExternalLink, User, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGetOrgPendingBounties } from "@/hooks/useGetOrgPendingBounties";

interface PendingSubmission {
  bountyId: number;

  bountyTitle: string;
  bountyDescription: string;
  solutionDescription: string;
  solutionLink: string;
  solutionId: number;
  hunterName: string;
  submittedAt: Date;
  solutionStatus: string;
}

export default function ReviewSubmissions() {
  const { accessToken } = useAuth();
  const { data } = useGetOrgPendingBounties(accessToken ?? "");

  const [pendingBounties, setPendingBounties] = useState<PendingSubmission[]>(
    []
  );

  const [selectedSubmission, setSelectedSubmission] =
    useState<PendingSubmission | null>(null);

  useEffect(() => {
    if (data) {
      setPendingBounties(data);
      console.log(data);
    }
  }, [data]);
  //   const [selectedSubmission, setSelectedSubmission] = useState<
  //     (typeof mockSubmissions)[0] | null
  //   >(null);

  //   const pendingBounties = mockSubmissions.filter(
  //     (s) => s.status === "pending"
  //   );

  //   const reviewedSubmissions = mockSubmissions.filter(
  //     (s) => s.status !== "pending"
  //   );

  return (
    <OrgLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-neon-blue mb-2">
            Review Submissions
          </h1>
          <p className="text-muted-foreground">
            Review and approve bounty submissions from hunters
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-neon-yellow">
              Pending Reviews
            </h2>
            <Badge className="bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30">
              {pendingBounties.length} pending
            </Badge>
          </div>

          <div className="space-y-4">
            {pendingBounties.map((submission) => (
              <Card
                key={submission.solutionId}
                className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-neon-yellow/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue font-semibold">
                        {submission.hunterName[0].toUpperCase()}
                      </div>

                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold">
                            {submission.bountyTitle}
                          </h3>
                          <Badge className="bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30">
                            {submission.solutionStatus}
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{submission.hunterName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(
                                submission.submittedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <a
                            href={submission.solutionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 hover:text-neon-blue transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>View Submission</span>
                          </a>
                        </div>

                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {submission.solutionDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setSelectedSubmission(submission)}
                    className="bg-neon-blue hover:bg-neon-blue/80 text-black font-semibold neon-glow"
                  >
                    Review
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Reviewed Submissions
        {reviewedSubmissions.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-muted-foreground">
              Recently Reviewed
            </h2>

            <div className="space-y-4">
              {reviewedSubmissions.map((submission) => (
                <Card
                  key={submission.id}
                  className="p-6 bg-card/30 backdrop-blur-sm border-border/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-muted-foreground">
                          {submission.bountyTitle}
                        </h3>
                        <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                          {submission.status}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{submission.hunterName}</span>
                        <span>
                          {new Date(
                            submission.submittedAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )} */}

        {pendingBounties.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Pending Reviews</h3>
            <p className="text-muted-foreground">
              All submissions have been reviewed. New submissions will appear
              here.
            </p>
          </div>
        )}
      </div>

      <ReviewDrawer
        submission={selectedSubmission}
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
      />
    </OrgLayout>
  );
}
