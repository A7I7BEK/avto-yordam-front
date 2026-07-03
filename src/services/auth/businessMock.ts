import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginWithPhoneRequest,
  LoginWithPhoneResponse,
  RegisterInitRequest,
  RegisterInitResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  ResetPasswordRequest,
  SignInResponse,
  SignInWithPhoneRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '@/types/auth';

function delay(ms = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockBusinessAuthService = {
  async loginWithPhone(
    _req: LoginWithPhoneRequest,
  ): Promise<LoginWithPhoneResponse> {
    await delay();
    return { otpId: 'mock-biz-otp-id-789' };
  },

  async verifyOtp(_req: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    await delay();
    return {
      token: 'mock-token-business',
      user: {
        id: 'biz-001',
        fullName: 'Rustam Karimov',
        email: 'admin@yourgarage.uz',
        phone: '+998 90 555 12 34',
        isOnboarded: false,
      },
    };
  },

  async signIn(_req: {
    email: string;
    password: string;
  }): Promise<VerifyOtpResponse> {
    await delay();
    return {
      token: 'mock-token-business',
      user: {
        id: 'biz-001',
        fullName: 'Rustam Karimov',
        email: 'admin@yourgarage.uz',
        phone: '+998 90 555 12 34',
        isOnboarded: false,
      },
    };
  },

  async signInWithPhone(_req: SignInWithPhoneRequest): Promise<SignInResponse> {
    await delay();
    return {
      token: 'mock-token-business',
      user: {
        id: 'biz-001',
        fullName: 'Rustam Karimov',
        email: 'admin@yourgarage.uz',
        phone: _req.phone,
        isOnboarded: false,
      },
    };
  },

  async signUp(_req: {
    orgName: string;
    adminEmail: string;
    password: string;
  }): Promise<VerifyOtpResponse> {
    await delay();
    return {
      token: 'mock-token-business',
      user: {
        id: 'biz-001',
        fullName: 'Rustam Karimov',
        email: _req.adminEmail,
        phone: '+998 90 555 12 34',
        isOnboarded: false,
      },
    };
  },

  async forgotPassword(
    _req: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    await delay();
    return { resetToken: 'mock-biz-reset-token-101' };
  },

  async resetPassword(_req: ResetPasswordRequest): Promise<void> {
    await delay();
  },

  async registerInit(_req: RegisterInitRequest): Promise<RegisterInitResponse> {
    await delay();
    return { otpId: 'mock-biz-otp-id-register' };
  },

  async resendOtp(_req: ResendOtpRequest): Promise<ResendOtpResponse> {
    await delay();
    return { otpId: 'mock-biz-otp-id-resend' };
  },
};
