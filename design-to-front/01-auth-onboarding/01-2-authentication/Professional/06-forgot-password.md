# Page Prompt: 06 — Master Forgot Password

> **Design Node ID**: `wFppT`
> **Design Name**: 06 — Master Forgot Password
> **Route**: `/auth/professional/forgot-password`
> **Incoming from**: Email Sign In page ("Reset Password" link)
> **Leads to**: Set New Password page

---

## 1. Overview

User enters their email to receive a password reset link. The page features:
- Key-round icon
- Friendly heading
- Email field (pre-filled if coming from sign-in)
- Send reset link button
- Helpful hint about checking spam
- Back to sign in link

---

## 2. Layout

Centered card (460px, padding 40px, gap 24px) on white page.

---

## 3. Card Content (top to bottom, gap: 24px)

### 3.1 Brand Header
Logo + "Professional" (same pattern)

No back arrow at top — instead, there's a "Back to sign in" link at the bottom.

---

### 3.2 Key Icon (centered)

```
       ┌──────────┐
       │  🔑 icon │  64×64 circle
       │          │  bg: #F5F5F5
       └──────────┘
```

| Property | Value |
|----------|-------|
| Container | 64×64px, border-radius: 999px, bg `#F5F5F5` |
| Icon | **`key-round`** (Lucide), 28px, `#5749F4` |
| Alignment | Centered horizontally |

---

### 3.3 Header Text

**Title**: "Forgot your password?"
- Inter, 22px, weight 600, `#2A2933`

**Subtitle**: "Happens to the best of us. Enter your email and we'll send a reset link."
- Inter, 14px, weight 400, `#616167`, line-height: 1.5, text-align: center, full width

Gap: 8px between title and subtitle.

---

### 3.4 Email Field

Uses **Input Group/Filled** pattern:

```
Email
┌──────────────────────────────────┐
│ aziz.karimov@masters.uz          │
└──────────────────────────────────┘
```

Same pill styling as other auth pages. Pre-filled if `email` query param is present (passed from sign-in page).

---

### 3.5 "Send reset link" Button

| Property | Value |
|----------|-------|
| Text | "Send reset link" |
| Background | `#5749F4` (--primary) |
| Font | Inter, 14px, weight 500, `#FFFFFF` |
| Padding | 16px 24px, border-radius 999px |
| Width | 100% |

**On click**: Call `professionalAuth.forgotPassword({ email })`. On success → navigate to `/auth/professional/reset-password?resetToken=...`.

---

### 3.6 Hint Box

```
┌──────────────────────────────────────────┐
│  [📧 mail 14px]  Check your spam folder  │  rounded 24px box
│                   if you don't see it     │  bg: #F5F5F5
│                   within a minute.        │
└──────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Container | Rounded 24px (--radius-m), bg `#F5F5F5`, padding 12px 16px |
| Layout | `display:flex; align-items:center; justify-content:center; gap:8px;` |
| Icon | **`mail`** (Lucide), 14px, `#616167` |
| Text | "Check your spam folder if you don't see it within a minute.", Inter 12px, weight 400, `#616167` |

This hint is static — always visible.

---

### 3.7 "Back to sign in" Link

```
[← arrow-left 14px]  Back to sign in
```

| Element | Spec |
|---------|------|
| Layout | `display:flex; align-items:center; justify-content:center; gap:6px;` |
| Icon | **`arrow-left`** (Lucide), 14px, `#5749F4` |
| Text | "Back to sign in", Inter 14px, weight 500, `#5749F4` |
| **Navigation** | → `/auth/professional/signin?tab=signin` |

---

## 4. Vue Component Specification

### File
```
src/views/auth/professional/ForgotPassword.vue
```

### Script Setup

```typescript
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { UserRound, KeyRound, Mail, ArrowLeft } from 'lucide-vue-next';
import { professionalAuth } from '@/services/auth/professionalAuthService';

const router = useRouter();
const route = useRoute();

const email = ref((route.query.email as string) || 'aziz.karimov@masters.uz');
const isLoading = ref(false);
const error = ref('');
const success = ref(false);

async function sendResetLink() {
  isLoading.value = true;
  error.value = '';
  try {
    const result = await professionalAuth.forgotPassword({ email: email.value });
    success.value = true;
    // Navigate after short delay or let user click
    router.push({
      name: 'professional-auth-reset',
      query: { resetToken: result.resetToken }
    });
  } catch (e) {
    error.value = 'Failed to send reset link. Try again.';
  } finally {
    isLoading.value = false;
  }
}

function goBackToSignIn() {
  router.push({ name: 'professional-auth-signin', query: { tab: 'signin' } });
}
```

### Interactions

| Trigger | Action |
|---------|--------|
| "Send reset link" button | Call forgot password API → navigate |
| "Back to sign in" link | Navigate to `/auth/professional/signin` |
| Enter key | Submit form |

---

## 5. Implementation Checklist

1. [ ] Create `src/views/auth/professional/ForgotPassword.vue`
2. [ ] Reuse brand header
3. [ ] Add key-round icon (centered)
4. [ ] Add "Forgot your password?" heading + subtitle
5. [ ] Build email field (pre-filled from query param)
6. [ ] Add "Send reset link" button
7. [ ] Add spam-folder hint box
8. [ ] Add "Back to sign in" link
9. [ ] Wire up forgot password API
10. [ ] Add loading/error/success states
11. [ ] Run `pnpm dlx ultracite fix`

---

## 6. Visual Reference

See: `06-forgot-password.png`
