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

function delay(ms = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockAuthService = {
  async loginWithPhone(
    _req: LoginWithPhoneRequest,
  ): Promise<LoginWithPhoneResponse> {
    await delay();
    return { otpId: 'mock-otp-id-123' };
  },

  async verifyOtp(_req: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    await delay();
    return {
      token: 'mock-token-professional',
      user: {
        id: 'pro-001',
        fullName: 'Aziz Ismoilov',
        email: 'aziz.karimov@masters.uz',
        phone: '+998 90 123 45 67',
        isOnboarded: false,
      },
    };
  },

  async signIn(_req: SignInRequest): Promise<SignInResponse> {
    await delay();
    return {
      token: 'mock-token-professional',
      user: {
        id: 'pro-001',
        fullName: 'Aziz Ismoilov',
        email: 'aziz.karimov@masters.uz',
        phone: '+998 90 123 45 67',
        isOnboarded: false,
      },
    };
  },

  async signUp(_req: SignUpRequest): Promise<SignUpResponse> {
    await delay();
    return {
      token: 'mock-token-professional',
      user: {
        id: 'pro-001',
        fullName: _req.fullName,
        email: _req.email,
        phone: '+998 90 123 45 67',
        isOnboarded: false,
      },
    };
  },

  async forgotPassword(
    _req: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    await delay();
    return { resetToken: 'mock-reset-token-456' };
  },

  async resetPassword(_req: ResetPasswordRequest): Promise<void> {
    await delay();
  },
};
