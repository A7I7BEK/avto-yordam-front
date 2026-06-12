import { isMockMode } from '@/config';
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginWithPhoneRequest,
  LoginWithPhoneResponse,
  ResetPasswordRequest,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '@/types/auth';
import { mockAuthService } from './mock';

export const professionalAuth = {
  async loginWithPhone(
    req: LoginWithPhoneRequest,
  ): Promise<LoginWithPhoneResponse> {
    if (isMockMode()) {
      return await mockAuthService.loginWithPhone(req);
    }
    throw new Error('API not implemented');
  },

  async verifyOtp(req: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    if (isMockMode()) {
      return await mockAuthService.verifyOtp(req);
    }
    throw new Error('API not implemented');
  },

  async signIn(req: SignInRequest): Promise<SignInResponse> {
    if (isMockMode()) {
      return await mockAuthService.signIn(req);
    }
    throw new Error('API not implemented');
  },

  async signUp(req: SignUpRequest): Promise<SignUpResponse> {
    if (isMockMode()) {
      return await mockAuthService.signUp(req);
    }
    throw new Error('API not implemented');
  },

  async forgotPassword(
    req: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    if (isMockMode()) {
      return await mockAuthService.forgotPassword(req);
    }
    throw new Error('API not implemented');
  },

  async resetPassword(req: ResetPasswordRequest): Promise<void> {
    if (isMockMode()) {
      return await mockAuthService.resetPassword(req);
    }
    throw new Error('API not implemented');
  },
};
