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
  SignInRequest,
  SignInResponse,
  SignInWithPhoneRequest,
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

  async signInWithPhone(_req: SignInWithPhoneRequest): Promise<SignInResponse> {
    await delay();
    return {
      token: 'mock-token-professional',
      user: {
        id: 'pro-001',
        fullName: 'Aziz Ismoilov',
        email: 'aziz.karimov@masters.uz',
        phone: _req.phone,
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

  async registerInit(_req: RegisterInitRequest): Promise<RegisterInitResponse> {
    await delay();
    return { otpId: 'mock-otp-id-register' };
  },

  async resendOtp(_req: ResendOtpRequest): Promise<ResendOtpResponse> {
    await delay();
    return { otpId: 'mock-otp-id-resend' };
  },
};
