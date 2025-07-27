import { SignupPayload, LoginPayload } from "@/types/types";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_HOST;

export async function loginUser(payload: LoginPayload) {
  try {
    const res = await fetch(`${BASE_URL}/api/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.detail || "Login failed");
    }

    toast.success("Login successful!");
    return data;
  } catch (error: unknown) {
    toast.error("Login failed");
    throw error;
  }
}

export async function signupUser(payload: SignupPayload) {
  try {
    const res = await fetch(`${BASE_URL}/api/user/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.detail || "Signup failed");
    }

    toast.success("Signup successful!");
    return await res.json();
  } catch (error: unknown) {
    toast.error("Signup failed");
    throw error;
  }
}
