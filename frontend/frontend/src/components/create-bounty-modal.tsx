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

interface CreateBountyModalProps {
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
  "Go",
  "Docker",
  "Kubernetes",
  "AWS",
  "IPFS",
  "GraphQL",
  "PostgreSQL",
  "MongoDB",
];

const currencyOptions = ["USDC", "ETH", "USDT", "DAI"];

export function CreateBountyModal({ isOpen, onClose }: CreateBountyModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: [] as string[],
    payoutAmount: "",
    payoutCurrency: "USDC",
    deadline: null as Date | null,
    codebaseUrl: "",
    externalWebsite: "",
    githubIssueLink: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // api call from heree
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "Bounty Created Successfully",
      description:
        "Your bounty has been posted and is now live for hunters to claim.",
      variant: "success",
    });

    setLoading(false);
    onClose();

    // Reset form
    setFormData({
      title: "",
      description: "",
      techStack: [],
      payoutAmount: "",
      payoutCurrency: "USDC",
      deadline: null,
      codebaseUrl: "",
      externalWebsite: "",
      githubIssueLink: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl bg-card/90 backdrop-blur-sm border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-neon-blue">
            Create New Bounty
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
                placeholder="e.g., Build DeFi Dashboard UI"
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
                placeholder="Describe the bounty requirements, deliverables, and acceptance criteria..."
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
                value={formData.payoutAmount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    payoutAmount: e.target.value,
                  }))
                }
                className="bg-input border-border focus:border-neon-blue focus:ring-neon-blue/20"
                placeholder="5000"
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
                value={formData.codebaseUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    codebaseUrl: e.target.value,
                  }))
                }
                className="bg-input border-border focus:border-neon-blue focus:ring-neon-blue/20"
                placeholder="https://github.com/org/project"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="externalWebsite" className="text-sm font-medium">
                External Website
              </Label>
              <Input
                id="externalWebsite"
                type="url"
                value={formData.externalWebsite}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    externalWebsite: e.target.value,
                  }))
                }
                className="bg-input border-border focus:border-neon-blue focus:ring-neon-blue/20"
                placeholder="https://project.org"
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
                placeholder="https://github.com/org/project/issues/123"
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
              {loading ? "Creating..." : "Create Bounty"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
