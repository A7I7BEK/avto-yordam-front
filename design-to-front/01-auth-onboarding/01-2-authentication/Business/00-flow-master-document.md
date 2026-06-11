# Business Authentication Flow — Master Document

> **Target**: Vue 3 + TypeScript + Composition API + Vue Router
> **Design Source**: `masters-app-halo.pen` → `04-auth-onboarding-layouts` → `Organization · Authentication`
> **Output Folder**: `src/views/auth/business/`

---

## Business vs Professional — Key Differences

| Aspect | Professional | Business |
|--------|-------------|----------|
| Brand icon | `user-round` | `building-2` |
| Brand icon bg | `#5749F4` (purple) | `#2A2933` (dark) |
| Flow label | "Professional" | "Business" |
| Sign Up tab | "Sign up" | "Create workspace" |
| Sign In title | "Welcome back" | "Welcome back, admin" |
| Sign In subtitle | "Your next job is waiting..." | "Sign in to manage your team and bookings" |
| Sign Up title | "Create your profile" | "Set up your shop" |
| Sign Up subtitle | "join thousands of masters earning..." | "Create your workspace and invite your team" |
| Sign Up fields | Full name, Email, Password | Organization name, Admin email, Password, Confirm password |
| Phone title | "What's your number?" | "Enter your business phone" |
| Phone subtitle | "We'll send a verification code..." | "We'll send a verification code to your admin number" |
| OTP title | "Almost there..." | "Verify your workspace" |
| OTP timer icon | `timer` | `clock` |
| Forgot title | "Forgot your password?" | "Reset your workspace password" |
| Forgot subtitle | "Happens to the best of us..." | "Enter your admin email and we'll send..." |
| Set password subtitle | "keep your master profile and earnings safe" | "protects your workspace, team, and customer data" |
| Password requirements | 3 items | 4 items (+ "Different from last 3 passwords") |
| Switch link text | "Switch to Organization" | "Switch to Master" |
| Switch link | "Are you an organization?" | "Are you a master?" |
| Card width (sign up) | 460px | 480px |
| Card padding (sign up) | 32px | 32px |
| Terms checkbox text | "Terms of Service and Privacy Policy" | "Business Terms and Data Processing Agreement" |

---

## Flow Overview

```
┌─────────────────────────────────┐
│  org01 — Login/Register (c274v)  │
│  [Phone] [Email] [Google][Apple] │
└──────┬──────────────┬───────────┘
       │              │
       ▼              ▼
┌──────────────┐  ┌──────────────────────────┐
│ org02 — Phone│  │ org04 — Email Sign In     │
│ Number Entry │  │ (OApwZ)                   │
│ (xEtcW)      │  │ [Sign in tab]             │
│ +998 ...     │  │ Email + Password           │
└──────┬───────┘  └────┬──────────┬────────────┘
       │               │          │
       ▼               │          ▼
┌──────────────┐       │  ┌──────────────────────────┐
│ org03 — OTP  │       │  │ org05 — Email Sign Up     │
│ Verification │       │  │ (VyS3b)                   │
│ (u9Lpw2)     │       │  │ [Create workspace tab]     │
│ 6-digit code │       │  │ Org Name + Email + PW+CPW  │
└──────┬───────┘       │  │ + Terms                    │
       │               │  └────────────────────────────┘
       ▼               │
┌──────────────┐       │
│  ONBOARDING  │       │
└──────────────┘       │
                       │
            ┌──────────┘
            │ "Forgot password?"
            ▼
       ┌──────────────────────────┐
       │ org06 — Forgot Password  │
       │ (imHZK)                  │
       │ Email entry              │
       └──────────┬───────────────┘
                  │
                  ▼
       ┌──────────────────────────┐
       │ org07 — Set New Password │
       │ (gvVgX)                  │
       │ 2 fields + 4 requirements│
       └──────────────────────────┘
```

---

## Route Design

```typescript
export const businessAuthRoutes = [
  { path: '/auth/business', name: 'business-auth', component: () => import('@/views/auth/business/LoginRegister.vue') },
  { path: '/auth/business/phone', name: 'business-auth-phone', component: () => import('@/views/auth/business/PhoneNumber.vue') },
  { path: '/auth/business/otp', name: 'business-auth-otp', component: () => import('@/views/auth/business/OtpVerification.vue') },
  { path: '/auth/business/signin', name: 'business-auth-signin', component: () => import('@/views/auth/business/EmailSignIn.vue') },
  { path: '/auth/business/signup', name: 'business-auth-signup', component: () => import('@/views/auth/business/EmailSignUp.vue') },
  { path: '/auth/business/forgot-password', name: 'business-auth-forgot', component: () => import('@/views/auth/business/ForgotPassword.vue') },
  { path: '/auth/business/reset-password', name: 'business-auth-reset', component: () => import('@/views/auth/business/SetNewPassword.vue') },
];
```

---

## Shared Design Tokens (same as Professional)

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
```

## Business Brand Element

```
┌──────────────────────────┐
│ [🏢 icon 36×36]  Business │
│  DARK bg           Inter 24px 600  │
│  rounded 10px       #2A2933         │
└──────────────────────────┘
```

> **IMPORTANT**: The Business brand icon box background is `#2A2933` (dark), NOT `#5749F4` (purple). The icon is `building-2` instead of `user-round`.

---

## Static Data Strategy

Same pattern as Professional. Use the same `professionalAuthService.ts` approach, adapted for business:

```typescript
// src/services/auth/businessAuthService.ts
const MOCK_BUSINESS_USER = {
  id: 'biz-001',
  orgName: 'AutoMaster Garage',
  adminEmail: 'admin@yourgarage.uz',
  phone: '+998 90 555 12 34',
  isOnboarded: false,
};
```

Mock data values used throughout:
- Organization name: `"AutoMaster Garage"` (placeholder: `"e.g. AutoMaster Garage"`)
- Admin email: `"admin@yourgarage.uz"`
- Phone: `"+998 90 555 12 34"`

---

## Shared Components to Create

1. `AuthCard.vue` — shared card wrapper (accept `brandIcon` and `brandText` props to specialize)
2. `BackButton.vue` — shared back link
3. `BusinessBrand.vue` — specifically: `building-2` icon, `#2A2933` bg, "Business" text

---

## Implementation Order

1. Create shared components that differ for Business (brand)
2. Create business auth routes
3. Implement pages 01→07 in order
4. Run `pnpm dlx ultracite fix`
