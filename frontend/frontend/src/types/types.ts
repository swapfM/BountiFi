export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  email: string;
  password: string;
  name: string;
  user_type: "HUNTER" | "ORGANIZATION";
};

export type BountyStatus =
  | "UNFUNDED"
  | "OPEN"
  | "ASSIGNED"
  | "IN_REVIEW"
  | "COMPLETED"
  | "EXPIRED";

export type bountySummary = {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  payoutAmount: number;
  payoutCurrency: string;
  status: BountyStatus;
  deadline: Date;
  refund?: boolean;
};
