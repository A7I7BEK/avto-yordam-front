import type { RouteRecordRaw } from 'vue-router';

export const accountSelectionRoutes: RouteRecordRaw[] = [
  {
    path: '/auth/account-type',
    name: 'account-type',
    component: () =>
      import('@/views/auth/account-selection/AccountTypeCenteredCards.vue'),
  },
];

// === Unified Auth Routes (new) ===
export const unifiedAuthRoutes: RouteRecordRaw[] = [
  {
    path: '/auth/login',
    name: 'auth-login',
    component: () => import('@/views/auth/Login.vue'),
  },
  {
    path: '/auth/register',
    name: 'auth-register',
    component: () => import('@/views/auth/Register.vue'),
  },
  {
    path: '/auth/verify',
    name: 'auth-verify',
    component: () => import('@/views/auth/OtpVerification.vue'),
  },
];

export const businessAuthRoutes: RouteRecordRaw[] = [
  {
    path: '/auth/business',
    name: 'business-auth',
    component: () => import('@/views/auth/business/LoginRegister.vue'),
  },
  {
    path: '/auth/business/phone',
    name: 'business-auth-phone',
    component: () => import('@/views/auth/business/PhoneNumber.vue'),
  },
  {
    path: '/auth/business/otp',
    name: 'business-auth-otp',
    component: () => import('@/views/auth/business/OtpVerification.vue'),
  },
  {
    path: '/auth/business/signin',
    name: 'business-auth-signin',
    component: () => import('@/views/auth/business/EmailSignIn.vue'),
  },
  {
    path: '/auth/business/signup',
    name: 'business-auth-signup',
    component: () => import('@/views/auth/business/EmailSignUp.vue'),
  },
  {
    path: '/auth/business/forgot-password',
    name: 'business-auth-forgot',
    component: () => import('@/views/auth/business/ForgotPassword.vue'),
  },
  {
    path: '/auth/business/reset-password',
    name: 'business-auth-reset',
    component: () => import('@/views/auth/business/SetNewPassword.vue'),
  },
];

export const professionalAuthRoutes: RouteRecordRaw[] = [
  {
    path: '/auth/professional',
    name: 'professional-auth',
    component: () => import('@/views/auth/professional/LoginRegister.vue'),
  },
  {
    path: '/auth/professional/phone',
    name: 'professional-auth-phone',
    component: () => import('@/views/auth/professional/PhoneNumber.vue'),
  },
  {
    path: '/auth/professional/otp',
    name: 'professional-auth-otp',
    component: () => import('@/views/auth/professional/OtpVerification.vue'),
  },
  {
    path: '/auth/professional/signin',
    name: 'professional-auth-signin',
    component: () => import('@/views/auth/professional/EmailSignIn.vue'),
  },
  {
    path: '/auth/professional/signup',
    name: 'professional-auth-signup',
    component: () => import('@/views/auth/professional/EmailSignUp.vue'),
  },
  {
    path: '/auth/professional/forgot-password',
    name: 'professional-auth-forgot',
    component: () => import('@/views/auth/professional/ForgotPassword.vue'),
  },
  {
    path: '/auth/professional/reset-password',
    name: 'professional-auth-reset',
    component: () => import('@/views/auth/professional/SetNewPassword.vue'),
  },
];

export const businessOnboardingRoutes: RouteRecordRaw[] = [
  {
    path: '/onboarding/business',
    name: 'business-onboarding',
    redirect: '/onboarding/business/org-type',
  },
  {
    path: '/onboarding/business/org-type',
    name: 'business-onboarding-step1',
    component: () => import('@/views/onboarding/business/OrgType.vue'),
  },
  {
    path: '/onboarding/business/bank-account',
    name: 'business-onboarding-step2',
    component: () => import('@/views/onboarding/business/BankAccount.vue'),
  },
];

export const professionalOnboardingRoutes: RouteRecordRaw[] = [
  {
    path: '/onboarding/professional',
    name: 'professional-onboarding',
    redirect: '/onboarding/professional/personal-info',
  },
  {
    path: '/onboarding/professional/personal-info',
    name: 'professional-onboarding-step1',
    component: () => import('@/views/onboarding/professional/PersonalInfo.vue'),
  },
  {
    path: '/onboarding/professional/professional-info',
    name: 'professional-onboarding-step2',
    component: () =>
      import('@/views/onboarding/professional/ProfessionalInfo.vue'),
  },
];
