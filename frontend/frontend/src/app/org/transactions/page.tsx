"use client";

import { useEffect, useState } from "react";

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
  Search,
  ExternalLink,
  Copy,
  ArrowUpRight,
  HandCoins,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetTransactions } from "@/hooks/useGetTransactions";
import { useAuth } from "@/context/AuthContext";
import { useLoader } from "@/hooks/useLoader";

interface Transaction {
  id: number;
  userId: number;
  createdAt: string;
  transactionStatus: string;
  transactionType: string;
  transactionHash: string;
  bountyTitle: string;
  amount: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "SUCCESS":
      return "bg-neon-green/20 text-neon-green border-neon-green/30";

    case "FAILED":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-muted/20 text-muted-foreground border-border";
  }
};

const getTypeIcon = (type: string) => {
  if (type == "FUND_BOUNTY")
    return <ArrowUpRight className="w-4 h-4 text-neon-green" />;
  else return <HandCoins className="w-4 h-4 text-neon-green" />;
};

const getTypeText = (type: string) => {
  if (type == "FUND_BOUNTY") return "Funding Bounty";
  else return "Refund";
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

const getTestnetExplorerUrl = (hash: string) => {
  return `https://primordial.bdagscan.com/tx/${hash}?chain=EVM`;
};

export default function TransactionsPage() {
  const { accessToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: transactions = [] } = useGetTransactions(accessToken ?? "");
  const { Loader, loading, setLoading } = useLoader({
    text: "Loading...",
    variant: "full-screen",
  });
  const filteredTransactions = transactions.filter(
    (transaction: Transaction) => {
      const matchesSearch =
        transaction.bountyTitle
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.transactionHash
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        transaction.transactionStatus === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    if (transactions) {
      setLoading(false);
    }
  }, [transactions, setLoading]);

  if (loading) {
    return <Loader />;
  }

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
              <SelectItem value="SUCCESS">Success</SelectItem>

              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
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
              {filteredTransactions.map((transaction: Transaction) => {
                const { date, time } = formatTime(transaction.createdAt);
                return (
                  <TableRow
                    key={transaction.id}
                    className="border-border hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(transaction.transactionType)}
                        <span className="font-medium">
                          {getTypeText(transaction.transactionType)}
                        </span>
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
                        {"BDAG"}
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
                        {" BDAG"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize",
                          getStatusColor(transaction.transactionStatus)
                        )}
                      >
                        {transaction.transactionStatus}
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
                                transaction.transactionHash
                              ),
                              "_blank"
                            )
                          }
                          title="View on Explorer"
                        >
                          <ExternalLink className="w-4 h-4" />
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
