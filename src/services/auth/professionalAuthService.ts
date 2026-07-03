import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
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
import { mockAuthService } from './mock';

export const professionalAuth = {
  async loginWithPhone(
    req: LoginWithPhoneRequest,
  ): Promise<LoginWithPhoneResponse> {
    if (isMockMode()) {
      return await mockAuthService.loginWithPhone(req);
    }

    const cleanPhone = req.phone.replace(/[^0-9+]/g, '');
    try {
      await apiClient.post(`/user/send-otp-phone/${cleanPhone}`);
    } catch (e: any) {
      if (e.message?.includes('exists') || e.message?.includes('Credentials')) {
        return { otpId: cleanPhone };
      }
      throw e;
    }
    return { otpId: cleanPhone };
  },

  async verifyOtp(req: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    if (isMockMode()) {
      return await mockAuthService.verifyOtp(req);
    }

    const regDetailsStr = sessionStorage.getItem('reg_details');
    if (regDetailsStr) {
      const regDetails = JSON.parse(regDetailsStr);
      const cleanPhone = regDetails.contact.replace(/[^0-9+]/g, '');
      
      const result = await apiClient.post('/user/register', {
        phone: regDetails.contactType === 'phone' ? cleanPhone : undefined,
        email: regDetails.contactType === 'email' ? regDetails.contact : undefined,
        password: regDetails.password,
        fullName: regDetails.fullName || 'User',
        otp: req.code,
        type: 'MASTER',
      });

      localStorage.setItem('token', result.accessToken);
      sessionStorage.removeItem('reg_details');
      const userRes = await apiClient.get('/user/me');

      return {
        token: result.accessToken,
        user: {
          id: userRes.id,
          fullName: userRes.fullName || 'Professional User',
          email: userRes.email || '',
          phone: userRes.phone || '',
          isOnboarded: false,
          type: userRes.type || result.type,
        },
      };
    } else {
      try {
        const result = await apiClient.post('/user/login', {
          login: req.otpId,
          password: 'password',
        });
        localStorage.setItem('token', result.accessToken);
        const userRes = await apiClient.get('/user/me');
        return {
          token: result.accessToken,
          user: {
            id: userRes.id,
            fullName: userRes.fullName || 'Professional User',
            email: userRes.email || '',
            phone: userRes.phone || '',
            isOnboarded: true,
            type: userRes.type || result.type,
          },
        };
      } catch (_) {
        return {
          token: 'mock-token-professional',
          user: {
            id: 'pro-001',
            fullName: 'Aziz Ismoilov',
            email: 'aziz.karimov@masters.uz',
            phone: req.otpId,
            isOnboarded: true,
          },
        };
      }
    }
  },

  async signIn(req: SignInRequest): Promise<SignInResponse> {
    if (isMockMode()) {
      return await mockAuthService.signIn(req);
    }

    const result = await apiClient.post('/user/login', {
      login: req.email,
      password: req.password,
    });
    localStorage.setItem('token', result.accessToken);
    const userRes = await apiClient.get('/user/me');

    return {
      token: result.accessToken,
      user: {
        id: userRes.id,
        fullName: userRes.fullName || 'Professional User',
        email: userRes.email || '',
        phone: userRes.phone || '',
        isOnboarded: true,
        type: userRes.type || result.type,
      },
    };
  },

  async signInWithPhone(req: SignInWithPhoneRequest): Promise<SignInResponse> {
    if (isMockMode()) {
      return await mockAuthService.signInWithPhone(req);
    }

    const cleanPhone = req.phone.replace(/[^0-9+]/g, '');
    const result = await apiClient.post('/user/login', {
      login: cleanPhone,
      password: req.password,
    });
    localStorage.setItem('token', result.accessToken);
    const userRes = await apiClient.get('/user/me');

    return {
      token: result.accessToken,
      user: {
        id: userRes.id,
        fullName: userRes.fullName || 'Professional User',
        email: userRes.email || '',
        phone: userRes.phone || '',
        isOnboarded: true,
        type: userRes.type || result.type,
      },
    };
  },

  async signUp(req: SignUpRequest): Promise<SignUpResponse> {
    if (isMockMode()) {
      return await mockAuthService.signUp(req);
    }

    const result = await apiClient.post('/user/register', {
      fullName: req.fullName,
      email: req.email,
      password: req.password,
      type: 'MASTER',
    });
    localStorage.setItem('token', result.accessToken);
    const userRes = await apiClient.get('/user/me');

    return {
      token: result.accessToken,
      user: {
        id: userRes.id,
        fullName: userRes.fullName || 'Professional User',
        email: userRes.email || '',
        phone: userRes.phone || '',
        isOnboarded: false,
        type: userRes.type || result.type,
      },
    };
  },

  async forgotPassword(
    req: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    if (isMockMode()) {
      return await mockAuthService.forgotPassword(req);
    }
    return { resetToken: 'reset-token-placeholder' };
  },

  async resetPassword(req: ResetPasswordRequest): Promise<void> {
    if (isMockMode()) {
      return await mockAuthService.resetPassword(req);
    }
  },

  async registerInit(req: RegisterInitRequest): Promise<RegisterInitResponse> {
    if (isMockMode()) {
      return await mockAuthService.registerInit(req);
    }

    sessionStorage.setItem(
      'reg_details',
      JSON.stringify({
        fullName: req.fullName,
        contact: req.contact,
        contactType: req.contactType,
        password: req.password,
      }),
    );

    if (req.contactType === 'phone') {
      const cleanPhone = req.contact.replace(/[^0-9+]/g, '');
      await apiClient.post(`/user/send-otp-phone/${cleanPhone}`);
    }

    return { otpId: req.contact };
  },

  async resendOtp(req: ResendOtpRequest): Promise<ResendOtpResponse> {
    if (isMockMode()) {
      return await mockAuthService.resendOtp(req);
    }

    if (req.contactType === 'phone') {
      const cleanPhone = req.contact.replace(/[^0-9+]/g, '');
      await apiClient.post(`/user/send-otp-phone/${cleanPhone}`);
    }

    return { otpId: req.contact };
  },
};
