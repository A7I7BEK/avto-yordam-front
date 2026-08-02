export type UserRole =
  | 'owner'
  | 'admin'
  | 'receptionist'
  | 'master'
  | 'specialist';

export type OrderStatus =
  | 'new'
  | 'pending'
  | 'confirmed'
  | 'in-progress'
  | 'done'
  | 'cancelled'
  | 'auto-cancelled';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  isOnboarded: boolean;
  type?: string;
}

export interface BusinessAuthUser {
  id: string;
  orgName: string;
  adminEmail: string;
  phone: string;
  isOnboarded: boolean;
}

export interface LoginWithPhoneRequest {
  phone: string;
}

export interface LoginWithPhoneResponse {
  otpId: string;
}

export interface VerifyOtpRequest {
  otpId: string;
  code: string;
}

export interface VerifyOtpResponse {
  token: string;
  user: AuthUser;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInWithPhoneRequest {
  phone: string;
  password: string;
}

export interface SignInResponse {
  token: string;
  user: AuthUser;
}

export interface SignUpRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  token: string;
  user: AuthUser;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  resetToken: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface RegisterInitRequest {
  fullName?: string;
  orgName?: string;
  contact: string;
  contactType: 'email' | 'phone';
  password: string;
}

export interface RegisterInitResponse {
  otpId: string;
}

export interface ResendOtpRequest {
  contact: string;
  contactType: 'email' | 'phone';
}

export interface ResendOtpResponse {
  otpId: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  type: string;
}
