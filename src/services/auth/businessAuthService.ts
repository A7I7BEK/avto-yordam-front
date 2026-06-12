import { isMockMode } from '@/config';
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginWithPhoneRequest,
  LoginWithPhoneResponse,
  ResetPasswordRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '@/types/auth';
import { mockBusinessAuthService } from './businessMock';

export const businessAuth = {
  async loginWithPhone(
    req: LoginWithPhoneRequest,
  ): Promise<LoginWithPhoneResponse> {
    if (isMockMode()) {
      return await mockBusinessAuthService.loginWithPhone(req);
    }
    throw new Error('API not implemented');
  },

  async verifyOtp(req: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    if (isMockMode()) {
      return await mockBusinessAuthService.verifyOtp(req);
    }
    throw new Error('API not implemented');
  },

  async signIn(req: {
    email: string;
    password: string;
  }): Promise<VerifyOtpResponse> {
    if (isMockMode()) {
      return await mockBusinessAuthService.signIn(req);
    }
    throw new Error('API not implemented');
  },

  async signUp(req: {
    orgName: string;
    adminEmail: string;
    password: string;
  }): Promise<VerifyOtpResponse> {
    if (isMockMode()) {
      return await mockBusinessAuthService.signUp(req);
    }
    throw new Error('API not implemented');
  },

  async forgotPassword(
    req: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    if (isMockMode()) {
      return await mockBusinessAuthService.forgotPassword(req);
    }
    throw new Error('API not implemented');
  },

  async resetPassword(req: ResetPasswordRequest): Promise<void> {
    if (isMockMode()) {
      return await mockBusinessAuthService.resetPassword(req);
    }
    throw new Error('API not implemented');
  },
};
