import { SignupPayload, LoginPayload } from "@/types/AuthTypes";
const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

export async function loginUser(payload: LoginPayload) {
  const res = await fetch(`${BASE_URL}/api/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.detail || "Login failed");
  }

  console.log("Login Success Response:", data);
  return data;
}

export async function signupUser(payload: SignupPayload) {
  const res = await fetch(`${BASE_URL}/api/user/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.detail || "Signup failed");
  }

  return res.json();
}
