"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { OrgLayout } from "@/components/org-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDownLeft,
  Search,
  Download,
  ExternalLink,
  Copy,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock transaction data
const transactions = [
  {
    id: "1",
    type: "funding",
    bountyTitle: "Smart Contract Audit for DeFi Protocol",
    transactionHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    time: "2024-01-15T10:30:00Z",
    status: "completed",
    amount: "$2,500",
    bountyId: "bounty_001",
    network: "sepolia",
  },
  {
    id: "2",
    type: "funding",
    bountyTitle: "Frontend Development for NFT Marketplace",
    transactionHash: "0x9876543210fedcba0987654321fedcba09876543",
    time: "2024-01-14T15:45:00Z",
    status: "pending",
    amount: "$1,800",
    bountyId: "bounty_002",
    network: "goerli",
  },
  {
    id: "3",
    type: "funding",
    bountyTitle: "Bug Bounty: Critical Security Vulnerability",
    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef12",
    time: "2024-01-13T09:15:00Z",
    status: "completed",
    amount: "$5,000",
    bountyId: "bounty_003",
    network: "sepolia",
  },
  {
    id: "4",
    type: "funding",
    bountyTitle: "Mobile App UI/UX Design",
    transactionHash: "0x567890abcdef1234567890abcdef1234567890ab",
    time: "2024-01-12T14:20:00Z",
    status: "failed",
    amount: "$750",
    bountyId: "bounty_004",
    network: "mumbai",
  },
  {
    id: "5",
    type: "funding",
    bountyTitle: "Blockchain Integration for E-commerce",
    transactionHash: "0xfedcba0987654321fedcba0987654321fedcba09",
    time: "2024-01-11T11:00:00Z",
    status: "completed",
    amount: "$3,200",
    bountyId: "bounty_005",
    network: "sepolia",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-neon-green/20 text-neon-green border-neon-green/30";
    case "pending":
      return "bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30";
    case "failed":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-muted/20 text-muted-foreground border-border";
  }
};

const getTypeIcon = (type: string) => {
  return <ArrowDownLeft className="w-4 h-4 text-neon-green" />;
};

const formatTime = (timeString: string) => {
  const date = new Date(timeString);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
};

const truncateHash = (hash: string) => {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

const getTestnetExplorerUrl = (network: string, hash: string) => {
  const explorers = {
    sepolia: `https://sepolia.etherscan.io/tx/${hash}`,
    goerli: `https://goerli.etherscan.io/tx/${hash}`,
    mumbai: `https://mumbai.polygonscan.com/tx/${hash}`,
  };
  return (
    explorers[network as keyof typeof explorers] ||
    `https://etherscan.io/tx/${hash}`
  );
};

const getBountyTestnetUrl = (network: string, bountyId: string) => {
  return `https://${network}.bountifi.app/bounty/${bountyId}`;
};

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.bountyTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.transactionHash
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <OrgLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-neon-blue mb-2">
            Transaction History
          </h1>
          <p className="text-muted-foreground">
            Track all your bountifi transactions
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by bounty title or transaction hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/50 border-border"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-card/50 border-border">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-background bg-transparent"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Transactions Table */}
        <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="text-foreground font-semibold">
                  Type
                </TableHead>
                <TableHead className="text-foreground font-semibold">
                  Bounty Title
                </TableHead>
                <TableHead className="text-foreground font-semibold">
                  Transaction Hash
                </TableHead>
                <TableHead className="text-foreground font-semibold">
                  Network
                </TableHead>
                <TableHead className="text-foreground font-semibold">
                  Time
                </TableHead>
                <TableHead className="text-foreground font-semibold">
                  Amount
                </TableHead>
                <TableHead className="text-foreground font-semibold">
                  Status
                </TableHead>
                <TableHead className="text-foreground font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => {
                const { date, time } = formatTime(transaction.time);
                return (
                  <TableRow
                    key={transaction.id}
                    className="border-border hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(transaction.type)}
                        <span className="font-medium">Funding Bounty</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <p className="font-medium truncate">
                          {transaction.bountyTitle}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm font-mono bg-muted/50 px-2 py-1 rounded">
                          {truncateHash(transaction.transactionHash)}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-neon-blue/10"
                          onClick={() =>
                            copyToClipboard(transaction.transactionHash)
                          }
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="capitalize bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                      >
                        {transaction.network}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{date}</p>
                        <p className="text-muted-foreground">{time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono font-semibold text-neon-green">
                        {transaction.amount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize",
                          getStatusColor(transaction.status)
                        )}
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-neon-blue/10"
                          onClick={() =>
                            window.open(
                              getTestnetExplorerUrl(
                                transaction.network,
                                transaction.transactionHash
                              ),
                              "_blank"
                            )
                          }
                          title="View on Explorer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-neon-green/10"
                          onClick={() =>
                            window.open(
                              getBountyTestnetUrl(
                                transaction.network,
                                transaction.bountyId
                              ),
                              "_blank"
                            )
                          }
                          title="View Bounty on Testnet"
                        >
                          <Target className="w-4 h-4 text-neon-green" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No transactions found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </OrgLayout>
  );
}
