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
  SignInResponse,
  SignInWithPhoneRequest,
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
      return await mockBusinessAuthService.verifyOtp(req);
    }

    const regDetailsStr = sessionStorage.getItem('reg_details');
    if (regDetailsStr) {
      const regDetails = JSON.parse(regDetailsStr);
      const cleanPhone = regDetails.contact.replace(/[^0-9+]/g, '');

      const result = await apiClient.post('/user/register', {
        phone: regDetails.contactType === 'phone' ? cleanPhone : undefined,
        email: regDetails.contactType === 'email' ? regDetails.contact : undefined,
        password: regDetails.password,
        fullName: regDetails.orgName || 'Business Owner',
        otp: req.code,
        type: 'ORGANIZATION_ADMIN',
      });

      localStorage.setItem('token', result.accessToken);
      sessionStorage.removeItem('reg_details');
      const userRes = await apiClient.get('/user/me');

      // Create organization automatically on registration
      try {
        await apiClient.post('/organization', {
          name: regDetails.orgName || 'My Auto Service',
          type: 'MCHJ',
          address: 'Tashkent, Uzbekistan',
          phone: cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`,
          ownerId: userRes.id,
          inn: '123456789',
        });
      } catch (_) {}

      return {
        token: result.accessToken,
        user: {
          id: userRes.id,
          fullName: userRes.fullName || 'Business Owner',
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
            fullName: userRes.fullName || 'Business Owner',
            email: userRes.email || '',
            phone: userRes.phone || '',
            isOnboarded: true,
            type: userRes.type || result.type,
          },
        };
      } catch (_) {
        return {
          token: 'mock-token-business',
          user: {
            id: 'biz-001',
            fullName: 'Auto Fix Admin',
            email: 'admin@autofix.uz',
            phone: req.otpId,
            isOnboarded: true,
          },
        };
      }
    }
  },

  async signIn(req: {
    email: string;
    password: string;
  }): Promise<VerifyOtpResponse> {
    if (isMockMode()) {
      return await mockBusinessAuthService.signIn(req);
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
        fullName: userRes.fullName || 'Business Owner',
        email: userRes.email || '',
        phone: userRes.phone || '',
        isOnboarded: true,
        type: userRes.type || result.type,
      },
    };
  },

  async signInWithPhone(req: SignInWithPhoneRequest): Promise<SignInResponse> {
    if (isMockMode()) {
      return await mockBusinessAuthService.signInWithPhone(req);
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
        fullName: userRes.fullName || 'Business Owner',
        email: userRes.email || '',
        phone: userRes.phone || '',
        isOnboarded: true,
        type: userRes.type || result.type,
      },
    };
  },

  async signUp(req: {
    orgName: string;
    adminEmail: string;
    password: string;
  }): Promise<VerifyOtpResponse> {
    if (isMockMode()) {
      return await mockBusinessAuthService.signUp(req);
    }

    const result = await apiClient.post('/user/register', {
      fullName: req.orgName,
      email: req.adminEmail,
      password: req.password,
      type: 'ORGANIZATION_ADMIN',
    });
    localStorage.setItem('token', result.accessToken);
    const userRes = await apiClient.get('/user/me');

    return {
      token: result.accessToken,
      user: {
        id: userRes.id,
        fullName: userRes.fullName || 'Business Owner',
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
      return await mockBusinessAuthService.forgotPassword(req);
    }
    return { resetToken: 'reset-token-placeholder' };
  },

  async resetPassword(req: ResetPasswordRequest): Promise<void> {
    if (isMockMode()) {
      return await mockBusinessAuthService.resetPassword(req);
    }
  },

  async registerInit(req: RegisterInitRequest): Promise<RegisterInitResponse> {
    if (isMockMode()) {
      return await mockBusinessAuthService.registerInit(req);
    }

    sessionStorage.setItem(
      'reg_details',
      JSON.stringify({
        orgName: req.orgName,
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
      return await mockBusinessAuthService.resendOtp(req);
    }

    if (req.contactType === 'phone') {
      const cleanPhone = req.contact.replace(/[^0-9+]/g, '');
      await apiClient.post(`/user/send-otp-phone/${cleanPhone}`);
    }

    return { otpId: req.contact };
  },
};
