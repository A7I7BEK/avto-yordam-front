# Professional Authentication Flow — Master Document

> **Target**: Vue 3 + TypeScript + Composition API + Vue Router
> **Design Source**: `masters-app-halo.pen` → `04-auth-onboarding-layouts` → `Professional · Authentication`
> **Output Folder**: `src/views/auth/professional/`

---

## Flow Overview

```
┌─────────────────────────────────┐
│  01 — Login/Register (Q8vgN3)   │  ← Entry point
│  [Phone] [Email] [Google][Apple]│
└──────┬──────────────┬───────────┘
       │              │
       ▼              ▼
┌──────────────┐  ┌──────────────────────────┐
│ 02 — Phone   │  │ 04 — Email Sign In (yp0mI)│
│ Number Entry │  │ [Sign In tab]              │
│ (oYuX8)      │  │ Email + Password           │
│ +998 ...     │  │                            │
└──────┬───────┘  └────┬──────────┬────────────┘
       │               │          │
       ▼               │          ▼
┌──────────────┐       │  ┌──────────────────────────┐
│ 03 — OTP     │       │  │ 05 — Email Sign Up (opm0A)│
│ Verification │       │  │ [Sign Up tab]              │
│ (zNECF)      │       │  │ Name + Email + Password    │
│ 6-digit code │       │  │ + Terms checkbox           │
└──────┬───────┘       │  └────────────────────────────┘
       │               │
       ▼               │
┌──────────────┐       │
│  ONBOARDING  │       │  (or skip to dashboard if
│  (next task) │       │   already onboarded)
└──────────────┘       │
                       │
            ┌──────────┘
            │ "Forgot password?"
            ▼
       ┌──────────────────────────┐
       │ 06 — Forgot Password     │
       │ (wFppT)                  │
       │ Email entry              │
       └──────────┬───────────────┘
                  │
                  ▼
       ┌──────────────────────────┐
       │ 07 — Set New Password    │
       │ (ehmqg)                  │
       │ New + Confirm password   │
       │ + Requirements checklist │
       └──────────────────────────┘
```

---

## Route Design

```typescript
// src/router/auth.routes.ts
export const professionalAuthRoutes = [
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
```

---

## Shared Design System (All Pages)

### Brand Element (reused on every page)

```
┌──────────────────────────┐
│ [👤 icon 36×36]  Professional │
│  purple bg          Inter 24px 600  │
│  rounded 10px       #2A2933         │
└──────────────────────────┘
```

### Card Container (shared across all pages)

| Property | Value |
|----------|-------|
| Border-radius | 40px (--radius-l) |
| Background | `#FFFFFF` (--card) |
| Border | 1px solid `#C5C5CB` (--border) |
| Box-shadow | `0 10px 8.75px rgba(0,0,0,0.039)` |
| Content gap | 22-24px (varies per page) |
| Padding | 32-40px (varies per page) |

### Page Layout (shared)

| Property | Value |
|----------|-------|
| Width | 1440px |
| Height | 900px |
| Background | `#FFFFFF` (--background) |
| Layout | flex column, justify-content: center, align-items: center |
| Padding | 48px (page-level) |

### Design Tokens

```css
--primary: #5749F4;
--primary-foreground: #FFFFFF;
--foreground: #2A2933;
--muted-foreground: #616167;
--border: #C5C5CB;
--accent: #F5F5F5;
--card: #FFFFFF;
--background: #FFFFFF;
--radius-l: 40px;
--radius-m: 24px;
--radius-pill: 999px;
--font-primary: Inter;
--font-secondary: Inter;
```

---

## Static Data Strategy

All API calls must be abstracted behind **service functions** with clear TypeScript interfaces. Use `import.meta.env.VITE_USE_MOCK` to switch between mock and real backends.

### Service Layer Pattern

```typescript
// src/services/auth/types.ts
export interface LoginWithPhoneRequest { phone: string; }
export interface LoginWithPhoneResponse { otpId: string; }
export interface VerifyOtpRequest { otpId: string; code: string; }
export interface VerifyOtpResponse { token: string; user: ProfessionalUser; }
export interface SignInRequest { email: string; password: string; }
export interface SignUpRequest { fullName: string; email: string; password: string; }
export interface ForgotPasswordRequest { email: string; }
export interface ResetPasswordRequest { token: string; newPassword: string; }
export interface ProfessionalUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  isOnboarded: boolean;
}
```

```typescript
// src/services/auth/professionalAuthService.ts
import { mockService } from './mock';
// import { apiService } from './api';

const service = import.meta.env.VITE_USE_MOCK === 'true' ? mockService : apiService;

export const professionalAuth = {
  loginWithPhone: (req: LoginWithPhoneRequest) => service.loginWithPhone(req),
  verifyOtp: (req: VerifyOtpRequest) => service.verifyOtp(req),
  signIn: (req: SignInRequest) => service.signIn(req),
  signUp: (req: SignUpRequest) => service.signUp(req),
  forgotPassword: (req: ForgotPasswordRequest) => service.forgotPassword(req),
  resetPassword: (req: ResetPasswordRequest) => service.resetPassword(req),
};
```

### Mock Service (example data)

```typescript
// src/services/auth/mock.ts
const MOCK_USER: ProfessionalUser = {
  id: 'pro-001',
  fullName: 'Aziz Karimov',
  email: 'aziz.karimov@masters.uz',
  phone: '+998 90 123 45 67',
  isOnboarded: false,
};

export const mockService = {
  loginWithPhone: async (req: LoginWithPhoneRequest) => {
    await delay(800);
    return { otpId: 'mock-otp-id' };
  },
  verifyOtp: async (req: VerifyOtpRequest) => {
    await delay(1200);
    return { token: 'mock-jwt-token', user: MOCK_USER };
  },
  signIn: async (req: SignInRequest) => {
    await delay(1000);
    return { token: 'mock-jwt-token', user: MOCK_USER };
  },
  signUp: async (req: SignUpRequest) => {
    await delay(1500);
    return { token: 'mock-jwt-token', user: { ...MOCK_USER, fullName: req.fullName, email: req.email } };
  },
  forgotPassword: async (req: ForgotPasswordRequest) => {
    await delay(1000);
    return { resetToken: 'mock-reset-token' };
  },
  resetPassword: async (req: ResetPasswordRequest) => {
    await delay(1000);
    return { success: true };
  },
};
```

---

## Navigation & State Management

Use Vue Router with **query params or route state** to pass data between pages.

| From | To | What to pass |
|------|-----|--------------|
| Login/Register | Phone Number | `{ flow: 'phone' }` |
| Login/Register | Email Sign In | `{ flow: 'email', tab: 'signin' }` |
| Login/Register | Email Sign Up | `{ flow: 'email', tab: 'signup' }` |
| Phone Number | OTP Verify | `{ phone: '+998 90 555 12 34', otpId: '...' }` |
| OTP Verify | Dashboard/Onboarding | After success, check `user.isOnboarded` |
| Email Sign In | Dashboard/Onboarding | After success |
| Email Sign In | Forgot Password | `{ email: '...' }` |
| Forgot Password | Set New Password | `{ resetToken: '...' }` |
| Email Sign Up | Dashboard/Onboarding | After success |

Use `useRoute()` and `useRouter()` for navigation. Pass data via `router.push({ name: '...', query: { ... } })`.

---

## Dependencies

```json
{
  "@lucide/vue": "latest",
  "vue-router": "latest"
}
```

### Icons Used (Lucide, all pages):

`UserRound`, `ArrowLeft`, `Phone`, `Mail`, `ChevronDown`, `ShieldCheck`, `MessageCircleMore`, `Timer`, `Eye`, `KeyRound`, `Lock`, `Check`, `Circle`

### Icons Used (Phosphor, Login page only):

`GoogleLogo`, `AppleLogo` (from `@phosphor-icons/vue` or use simple inline SVGs)

---

## Implementation Order for Agents

1. Create shared `AuthCard.vue` wrapper component (brand + card container)
2. Create shared `BackButton.vue` component
3. Create the service layer (`professionalAuthService.ts` + `mock.ts`)
4. Create auth routes file
5. Implement page 01 (Login/Register) — it's the entry point
6. Implement page 02 (Phone Number) — depends on 01 navigation
7. Implement page 03 (OTP Verify) — depends on 02 navigation
8. Implement page 04 (Email Sign In) — depends on 01 navigation
9. Implement page 05 (Email Sign Up) — accessible from 01 or 04 tabs
10. Implement page 06 (Forgot Password) — depends on 04 navigation
11. Implement page 07 (Set New Password) — depends on 06 navigation
12. Run `pnpm dlx ultracite fix`
