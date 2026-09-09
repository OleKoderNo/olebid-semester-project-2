/** Required information for creating a student account. */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/** Basic account information returned after registration. */
export interface RegisteredUser {
  name: string;
  email: string;
}

/** Successful registration response. */
export interface RegisterResponse {
  data: RegisteredUser;
}

/** Credentials submitted when logging in. */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Account information and access token returned after login. */
export interface LoginUser extends RegisteredUser {
  accessToken: string;
}

/** Successful login response. */
export interface LoginResponse {
  data: LoginUser;
}

/** Account information retained between page loads. */
export interface AuthSession {
  name: string;
  email: string;
  accessToken: string;
}
