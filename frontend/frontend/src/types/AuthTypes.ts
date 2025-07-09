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
