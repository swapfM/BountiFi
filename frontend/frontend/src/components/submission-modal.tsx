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

interface SubmissionModalProps {
  bounty: any;
  isOpen: boolean;
  onClose: () => void;
}

export function SubmissionModal({
  bounty,
  isOpen,
  onClose,
}: SubmissionModalProps) {
  const [formData, setFormData] = useState({
    prUrl: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    onClose();

    setFormData({
      prUrl: "",
      notes: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-card/90 backdrop-blur-sm border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neon-green">
            Submit Solution
          </DialogTitle>
          <p className="text-muted-foreground">{bounty?.title}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prUrl" className="text-sm font-medium">
              GitHub Pull Request URL *
            </Label>
            <Input
              id="prUrl"
              type="url"
              value={formData.prUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, prUrl: e.target.value }))
              }
              className="bg-input border-border focus:border-neon-green focus:ring-neon-green/20"
              placeholder="https://github.com/org/project/pull/123"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Submission Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
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
