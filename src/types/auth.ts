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
