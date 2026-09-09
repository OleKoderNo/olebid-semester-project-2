import type { RegisterRequest, RegisterResponse } from "../types/auth";
import { API_BASE, getJson } from "./client";

/**
 * Creates a student account through the Noroff API.
 *
 * @param account - Username, student email and password.
 * @returns The newly registered user's basic information.
 * @throws If registration fails.
 */
export async function registerUser(
  account: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: account.name.trim(),
      email: account.email.trim(),
      password: account.password,
    }),
  });

  return getJson<RegisterResponse>(
    response,
    "Unable to create your account. Please try again.",
  );
}
