"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { Card } from "@/components/ui/card";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";

interface FilterBarProps {
  filters: {
    techStack: string[];
    minReward: number;
    maxReward: number;
    newOnly: boolean;
  };
  onFiltersChange: (filters: unknown) => void;
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

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const toggleTech = (tech: string) => {
    const newTechStack = filters.techStack.includes(tech)
      ? filters.techStack.filter((t) => t !== tech)
      : [...filters.techStack, tech];

    onFiltersChange({ ...filters, techStack: newTechStack });
  };

  const handleRewardChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      minReward: value[0],
      maxReward: value[1],
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      techStack: [],
      minReward: 0,
      maxReward: 10000,
      newOnly: false,
    });
  };

  const hasActiveFilters =
    filters.techStack.length > 0 ||
    filters.newOnly ||
    filters.minReward > 0 ||
    filters.maxReward < 10000;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="border-neon-green/30 text-neon-green hover:bg-neon-green/10 transition-all duration-300"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {showFilters ? (
            <ChevronUp className="w-4 h-4 ml-2" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-2" />
          )}
          {hasActiveFilters && (
            <Badge className="ml-2 bg-neon-green/20 text-neon-green border-neon-green/30 text-xs">
              {filters.techStack.length +
                (filters.newOnly ? 1 : 0) +
                (filters.minReward > 0 || filters.maxReward < 10000 ? 1 : 0)}
            </Badge>
          )}
        </Button>

        <div className="flex items-center space-x-3">
          <Toggle
            pressed={filters.newOnly}
            onPressedChange={(pressed) =>
              onFiltersChange({ ...filters, newOnly: pressed })
            }
            className="data-[state=on]:bg-neon-green/20 data-[state=on]:text-neon-green border border-transparent data-[state=on]:border-neon-green/30"
          >
            New Only
          </Toggle>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border space-y-6 transition-all duration-300">
          <div>
            <h3 className="text-sm font-medium mb-3 text-neon-green">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {techOptions.map((tech) => (
                <Badge
                  key={tech}
                  variant={
                    filters.techStack.includes(tech) ? "default" : "secondary"
                  }
                  className={`cursor-pointer transition-all duration-200 ${
                    filters.techStack.includes(tech)
                      ? "bg-neon-green/20 text-neon-green border-neon-green/30 neon-glow-green hover:bg-neon-green/30"
                      : "hover:bg-muted/70 hover:scale-105"
                  }`}
                  onClick={() => toggleTech(tech)}
                >
                  {tech}
                  {filters.techStack.includes(tech) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3 text-neon-green">
              Reward Range: ${filters.minReward} - ${filters.maxReward} USDC
            </h3>
            <div className="px-2">
              <Slider
                value={[filters.minReward, filters.maxReward]}
                onValueChange={handleRewardChange}
                max={10000}
                min={0}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>$0</span>
                <span>$10,000</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
