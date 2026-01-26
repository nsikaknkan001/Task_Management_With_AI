export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  createdAt?: Date | string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface VerifyEmailRequest {
  email: string;
  verificationCode: string;
}

export interface ResendCodeRequest {
  email: string;
}