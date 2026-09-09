import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth";
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

/**
 * Logs in a registered user through the Noroff API.
 *
 * @param credentials - Student email and password.
 * @returns Account information and an access token.
 * @throws If login fails.
 */
export async function loginUser(
  credentials: LoginRequest,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: credentials.email.trim(),
      password: credentials.password,
    }),
  });

  return getJson<LoginResponse>(
    response,
    "Unable to log in. Please try again.",
  );
}
