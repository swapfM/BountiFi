"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useHunterSubmitSolution } from "@/hooks/useHunterSubmitSolution";

import { DialogDescription } from "@radix-ui/react-dialog";

interface Bounty {
  id: number;
  title: string;
}

interface SubmissionModalProps {
  bounty: Bounty;
  isOpen: boolean;
  onClose: () => void;
}

export function SubmissionModal({
  bounty,
  isOpen,
  onClose,
}: SubmissionModalProps) {
  const [formData, setFormData] = useState({
    solutionLink: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAuth();
  const { mutate: submitSolution } = useHunterSubmitSolution();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      bountyId: bounty.id,
      solutionLink: formData.solutionLink,
      description: formData.description,
    };

    submitSolution(
      {
        token: accessToken ?? "",
        payload: payload,
      },
      {
        onSuccess: () => {
          setFormData({
            solutionLink: "",
            description: "",
          });
          onClose();
        },
        onError: (error) => {
          console.error("Submission failed:", error);
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-card/90 backdrop-blur-sm border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neon-green">
            Submit Solution
          </DialogTitle>
          <DialogDescription>Submit Your Solution</DialogDescription>
          <p className="text-muted-foreground">{bounty?.title}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="solutionLink" className="text-sm font-medium">
              GitHub Pull Request URL *
            </Label>
            <Input
              id="solutionLink"
              type="url"
              value={formData.solutionLink}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  solutionLink: e.target.value,
                }))
              }
              className="bg-input border-border focus:border-neon-green focus:ring-neon-green/20"
              placeholder="https://github.com/org/project/pull/123"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Submission description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="bg-input border-border focus:border-neon-green focus:ring-neon-green/20 min-h-[120px]"
              placeholder="Describe your solution, implementation details, and any additional notes..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border hover:bg-muted bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-neon-green hover:bg-neon-green/80 text-black font-semibold neon-glow-green px-8"
            >
              {loading ? "Submitting..." : "Submit Solution"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
