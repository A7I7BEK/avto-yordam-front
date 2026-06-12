# Page Prompt: 04 — Master Email Sign In

> **Design Node ID**: `yp0mI`
> **Design Name**: 04 — Master Email Sign In
> **Route**: `/auth/professional/signin?tab=signin`
> **Incoming from**: Login/Register page (when "Continue with email" is clicked)
> **Can switch to**: Sign Up tab (same component or sibling route)
> **Leads to**: Dashboard or Forgot Password page

---

## 1. Overview

Email-based sign in with Sign In / Sign Up tabs. The Sign In tab (default) shows:
- Email field (pre-filled with mock data)
- Password field with show/hide toggle
- Sign in button
- Forgot password link

---

## 2. Layout

Centered card (460px, padding 36px, gap 22px) on white 1440×900 page.

---

## 3. Card Content (top to bottom, gap: 22px)

### 3.1 Brand Header
Logo + "Professional" (same pattern)

### 3.2 Back Link
`[←] Back` → Navigate to `/auth/professional`

---

### 3.3 Tab Switcher

```
┌──────────────────────────────────┐
│  ┌──────────┐  ┌──────────┐      │
│  │ Sign in  │  │ Sign up  │      │  56px tall pill container
│  │ (active) │  │          │      │  border: 1px #C5C5CB
│  └──────────┘  └──────────┘      │
└──────────────────────────────────┘
```

Uses the **Tabs** component pattern:

| Property | Value |
|----------|-------|
| Container | 100% width, 56px height, border-radius: 999px, bg `#FFFFFF`, border 1px `#C5C5CB`, padding 8px, gap 8px |
| Active tab | `#D9D9DB` bg (--secondary), pill shape, text `#2A2933`, shadow |
| Inactive tab | Transparent bg, text `#2A2933` (--accent-foreground) |
| Tab text | "Sign in" / "Sign up", Inter 14px, weight 400 |
| Tab padding | 10px 24px |
| **Navigation** | Clicking "Sign up" tab → navigate to `/auth/professional/signup?tab=signup` |

---

### 3.4 Header Text

**Sign In mode**:
- **Title**: "Welcome back"
- **Subtitle**: "Your next job is waiting — sign in to pick it up."

| Element | Font | Size | Weight | Color | Align |
|---------|------|------|--------|-------|-------|
| Title | Inter | 22px | 600 | `#2A2933` | center |
| Subtitle | Inter | 14px | 400 | `#616167` | center |

Gap between title and subtitle: 6px.

---

### 3.5 Email Field

Uses the **Input Group/Filled** component pattern (`VeIJB` ref):

```
Email
┌──────────────────────────────────┐
│ aziz.karimov@masters.uz          │
└──────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Label | "Email", Inter 14px, weight 500, `#2A2933` |
| Input value | "aziz.karimov@masters.uz" (mock pre-filled) |
| Font | Inter, 14px, weight 400, `#2A2933` |
| Padding | 18px 24px |
| Border-radius | 999px (pill) |
| Background | `#F5F5F5` (--accent) |
| Border | 1px solid `#C5C5CB` (--border) |
| Width | 100% |
| Type | `email` |
| Label-input gap | 6px |

---

### 3.6 Password Field

```
Password
┌──────────────────────────────────┐
│ ••••••••••                   👁  │
└──────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Label | "Password", Inter 14px, weight 500, `#2A2933` |
| Input value | `••••••••••` (masked; actual mock value: "password123") |
| Font | Inter, 14px, weight 400 |
| Padding | 18px 24px |
| Border-radius | 999px |
| Background | `#F5F5F5` |
| Border | 1px solid `#C5C5CB` |
| Width | 100% |
| Type | `password` (toggle with eye icon) |
| Eye icon | **`eye`** (Lucide), 16px, `#616167`, clickable to toggle visibility |

---

### 3.7 "Sign in" Button

| Property | Value |
|----------|-------|
| Text | "Sign in" |
| Background | `#5749F4` (--primary) |
| Font | Inter, 14px, weight 500, `#FFFFFF` |
| Padding | 16px 24px, border-radius 999px |
| Width | 100% |

**On click**: Call `professionalAuth.signIn({ email, password })`. On success → navigate to dashboard or onboarding based on `user.isOnboarded`.

---

### 3.8 Forgot Password Link

```
Forgot password?  Go to  Reset Password
```

| Element | Spec |
|---------|------|
| Layout | `display:flex; align-items:center; justify-content:center; gap:6px;` |
| Text 1 | "Forgot password?", Inter 14px, weight 400, `#616167` |
| Text 2 | "Go to", Inter 14px, weight 400, `#616167` |
| Text 3 (link) | "Reset Password", Inter 14px, weight 500, `#5749F4` |
| **Navigation** | → `/auth/professional/forgot-password?email=...` (pass email from input) |

---

## 4. Vue Component Specification

### File
```
src/views/auth/professional/EmailSignIn.vue
```

### Script Setup

```typescript
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { UserRound, ArrowLeft, Eye } from '@lucide/vue';
import { professionalAuth } from '@/services/auth/professionalAuthService';

const router = useRouter();
const route = useRoute();
const activeTab = computed(() => (route.query.tab as string) || 'signin');

const email = ref('aziz.karimov@masters.uz');
const password = ref('password123');
const showPassword = ref(false);
const isLoading = ref(false);
const error = ref('');

function switchTab(tab: string) {
  if (tab === 'signup') {
    router.push({ name: 'professional-auth-signup', query: { tab: 'signup' } });
  }
}

async function signIn() {
  isLoading.value = true;
  error.value = '';
  try {
    const result = await professionalAuth.signIn({ email: email.value, password: password.value });
    localStorage.setItem('token', result.token);
    router.push(result.user.isOnboarded ? { name: 'dashboard' } : { name: 'professional-onboarding' });
  } catch (e) {
    error.value = 'Invalid email or password.';
  } finally {
    isLoading.value = false;
  }
}

function goToForgotPassword() {
  router.push({ name: 'professional-auth-forgot', query: { email: email.value } });
}

function goBack() {
  router.push({ name: 'professional-auth' });
}
```

### Interactions

| Trigger | Action |
|---------|--------|
| "← Back" | Navigate to `/auth/professional` |
| "Sign up" tab | Navigate to `/auth/professional/signup` |
| "Sign in" button | Call sign in API → navigate |
| Eye icon | Toggle password visibility |
| "Reset Password" link | Navigate to forgot password page |
| Enter key | Submit form |

---

## 5. Implementation Checklist

1. [ ] Create `src/views/auth/professional/EmailSignIn.vue`
2. [ ] Reuse brand header
3. [ ] Add back link
4. [ ] Build Sign In / Sign Up tab switcher
5. [ ] Add "Welcome back" header text
6. [ ] Build email input field (pre-filled)
7. [ ] Build password field with eye toggle
8. [ ] Add "Sign in" button
9. [ ] Add forgot password link row
10. [ ] Wire up sign in API
11. [ ] Add loading/error states
12. [ ] Run `pnpm dlx ultracite fix`

---

## 6. Visual Reference

See: `04-email-sign-in.png`
