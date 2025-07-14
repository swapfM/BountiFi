"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/components/ui/use-toast";

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

interface EditBountyModalProps {
  bounty: BountyDetails;
  isOpen: boolean;
  onClose: () => void;
}

const techOptions = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Solidity",
  "Web3.js",
  "Ethers.js",
  "Hardhat",
  "Foundry",
  "OpenZeppelin",
  "Chainlink",
  "Node.js",
  "Python",
  "Rust",
];

const currencyOptions = ["BDAG", "ETH"];

export function EditBountyModal({
  bounty,
  isOpen,
  onClose,
}: EditBountyModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: [] as string[],
    payoutAmount: null as number | null,
    payoutCurrency: "BDAG",
    deadline: null as Date | null,
    codebaseLink: "",
    websiteLink: "",
    githubIssueLink: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (bounty) {
      setFormData({
        title: bounty.title || "",
        description: bounty.description || "",
        techStack: bounty.techStack || [],
        payoutAmount: bounty.payoutAmount || null,
        payoutCurrency: bounty.payoutCurrency?.includes("ETH") ? "ETH" : "BDAG",
        deadline: bounty.deadline ? new Date(bounty.deadline) : null,
        codebaseLink: bounty.codebaseLink || "",
        websiteLink: bounty.websiteLink || "",
        githubIssueLink: bounty.githubIssueLink || "",
      });
    }
  }, [bounty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Bounty Updated Successfully",
      description: "Your bounty has been updated with the new information.",
      variant: "success",
    });

    setLoading(false);
    onClose();
  };

  if (!bounty) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl bg-card/90 backdrop-blur-sm border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-neon-blue">
            Edit Bounty
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Bounty Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="bg-input border-border focus:border-neon-blue focus:ring-neon-blue/20"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description *
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
                className="bg-input border-border focus:border-neon-blue focus:ring-neon-blue/20 min-h-[120px]"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label className="text-sm font-medium">Tech Stack *</Label>
              <MultiSelect
                options={techOptions}
                selected={formData.techStack}
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, techStack: selected }))
                }
                placeholder="Select technologies..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payoutAmount" className="text-sm font-medium">
                Payout Amount *
              </Label>
              <Input
                id="payoutAmount"
                type="number"
                value={formData.payoutAmount ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    payoutAmount:
                      e.target.value === "" ? null : Number(e.target.value),
                  }))
                }
                className="bg-input border-border focus:border-neon-blue focus:ring-neon-blue/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Currency *</Label>
              <Select
                value={formData.payoutCurrency}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, payoutCurrency: value }))
                }
              >
                <SelectTrigger className="bg-input border-border focus:border-neon-blue">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {currencyOptions.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Deadline *</Label>
              <DatePicker
                date={formData.deadline}
                onDateChange={(date) =>
                  setFormData((prev) => ({ ...prev, deadline: date }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codebaseUrl" className="text-sm font-medium">
                Codebase URL
              </Label>
              <Input
                id="codebaseUrl"
                type="url"
                value={formData.codebaseLink}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    codebaseUrl: e.target.value,
                  }))
                }
                className="bg-input border-border focus:border-neon-blue focus:ring-neon-blue/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="externalWebsite" className="text-sm font-medium">
                External Website
              </Label>
              <Input
                id="externalWebsite"
                type="url"
                value={formData.websiteLink}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    externalWebsite: e.target.value,
                  }))
                }
                className="bg-input border-border focus:border-neon-blue focus:ring-neon-blue/20"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="githubIssueLink" className="text-sm font-medium">
                GitHub Issue Link
              </Label>
              <Input
                id="githubIssueLink"
                type="url"
                value={formData.githubIssueLink}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    githubIssueLink: e.target.value,
                  }))
                }
                className="bg-input border-border focus:border-neon-blue focus:ring-neon-blue/20"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
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
              className="bg-neon-blue hover:bg-neon-blue/80 text-black font-semibold neon-glow px-8"
            >
              {loading ? "Updating..." : "Update Bounty"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
