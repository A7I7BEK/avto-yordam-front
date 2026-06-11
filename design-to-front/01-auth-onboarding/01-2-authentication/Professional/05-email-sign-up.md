# Page Prompt: 05 — Master Email Sign Up

> **Design Node ID**: `opm0A`
> **Design Name**: 05 — Master Email Sign Up
> **Route**: `/auth/professional/signup?tab=signup`
> **Incoming from**: Login/Register page or Email Sign In page (tab switch)
> **Leads to**: Dashboard or Onboarding

---

## 1. Overview

Registration for professionals via email. The Sign Up tab (active) shows:
- Full name field
- Email field
- Password field (with hint "At least 8 characters")
- Terms & Privacy checkbox
- Create profile button

---

## 2. Layout

Centered card (460px, padding 32px, gap 16px) on white 1440×900 page. Page padding: 32px.

Note: This card has a tighter gap (16px) and smaller padding (32px) because it has more fields.

---

## 3. Card Content (top to bottom, gap: 16px)

### 3.1 Brand Header
Logo + "Professional" (same pattern)

### 3.2 Back Link
`[←] Back` → Navigate to `/auth/professional`

---

### 3.3 Tab Switcher

```
┌──────────────────────────────────┐
│  ┌──────────┐  ┌──────────┐      │
│  │ Sign in  │  │ Sign up  │      │  Sign up is ACTIVE now
│  │          │  │ (active) │      │
│  └──────────┘  └──────────┘      │
└──────────────────────────────────┘
```

Same styling as Sign In page, but "Sign up" is the active tab. Clicking "Sign in" navigates back to sign in.

| Property | Value |
|----------|-------|
| Active tab (Sign up) | `#D9D9DB` bg, shadow, `#2A2933` text |
| Inactive tab (Sign in) | Transparent, `#2A2933` text |
| **Navigation** | "Sign in" tab → `/auth/professional/signin?tab=signin` |

---

### 3.4 Header Text

- **Title**: "Create your profile"
  - Inter, 22px, weight 600, `#2A2933`, text-align: center, full width
- **Subtitle**: "Your craft, your hours — join thousands of masters earning on their terms."
  - Inter, 13px, weight 400, `#616167`, line-height: 1.5, text-align: center, full width

Gap between title and subtitle: 4px.

---

### 3.5 Full Name Field

Uses **Input Group/Filled** pattern:

```
Full name
┌──────────────────────────────────┐
│ Aziz Karimov                     │
└──────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Label | "Full name", Inter 14px, weight 500, `#2A2933` |
| Value | "Aziz Karimov" (mock pre-filled) |
| Font | Inter, 14px, weight 400 |
| Padding | 18px 24px, pill border, `#F5F5F5` bg, `#C5C5CB` border |
| Width | 100% |

---

### 3.6 Email Field

```
Email
┌──────────────────────────────────┐
│ aziz.karimov@masters.uz          │
└──────────────────────────────────┘
```

Same styling as Full Name field. Mock value: "aziz.karimov@masters.uz".

---

### 3.7 Password Field

```
Password
┌──────────────────────────────────┐
│ At least 8 characters            │
└──────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Label | "Password", Inter 14px, weight 500 |
| Placeholder | "At least 8 characters" (shown as grey placeholder text) |
| Type | `password` |
| Same pill styling | `#F5F5F5` bg, `#C5C5CB` border |

---

### 3.8 Terms Checkbox

```
[✓]  I agree to the Terms of Service and Privacy Policy
```

| Element | Spec |
|---------|------|
| Layout | `display:flex; align-items:center; gap:10px;` |
| Checkbox | Uses **Checkbox/Checked** pattern (`434AE` ref): 16×16px, `#5749F4` bg, rounded 6px, white check icon |
| Text | "I agree to the Terms of Service and Privacy Policy", Inter 13px, weight 400, `#2A2933` |
| **Required** | Button should be disabled until checkbox is checked |
| **Links** | "Terms of Service" and "Privacy Policy" should be styled as links (color `#5749F4`, `text-decoration: underline`) |

---

### 3.9 "Create profile" Button

| Property | Value |
|----------|-------|
| Text | "Create profile" |
| Background | `#5749F4` (--primary) |
| Font | Inter, 14px, weight 500, `#FFFFFF` |
| Padding | 16px 24px, border-radius 999px |
| Width | 100% |
| Disabled when | Checkbox not checked OR fields empty |

**On click**: Call `professionalAuth.signUp({ fullName, email, password })`. On success → navigate to onboarding (new users always go to onboarding).

---

## 4. Vue Component Specification

### File
```
src/views/auth/professional/EmailSignUp.vue
```

### Script Setup

```typescript
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { UserRound, ArrowLeft, Check } from 'lucide-vue-next';
import { professionalAuth } from '@/services/auth/professionalAuthService';

const router = useRouter();
const route = useRoute();

const fullName = ref('Aziz Karimov');
const email = ref('aziz.karimov@masters.uz');
const password = ref('');
const agreedToTerms = ref(false);
const isLoading = ref(false);
const error = ref('');

const canSubmit = computed(() =>
  fullName.value.trim() && email.value.trim() && password.value.length >= 8 && agreedToTerms.value
);

function switchTab(tab: string) {
  if (tab === 'signin') {
    router.push({ name: 'professional-auth-signin', query: { tab: 'signin' } });
  }
}

async function signUp() {
  if (!canSubmit.value) return;
  isLoading.value = true;
  error.value = '';
  try {
    const result = await professionalAuth.signUp({
      fullName: fullName.value,
      email: email.value,
      password: password.value,
    });
    localStorage.setItem('token', result.token);
    router.push({ name: 'professional-onboarding' });
  } catch (e) {
    error.value = 'Registration failed. This email may already be in use.';
  } finally {
    isLoading.value = false;
  }
}

function goBack() {
  router.push({ name: 'professional-auth' });
}
```

### Interactions

| Trigger | Action |
|---------|--------|
| "← Back" | Navigate to `/auth/professional` |
| "Sign in" tab | Navigate to sign in page |
| Checkbox click | Toggle `agreedToTerms` |
| "Create profile" button | Call sign up API → navigate |
| Terms/Privacy links | Show alert or link to static pages |

---

## 5. Implementation Checklist

1. [ ] Create `src/views/auth/professional/EmailSignUp.vue`
2. [ ] Reuse brand header + back link
3. [ ] Build Sign In / Sign Up tab switcher (Sign Up active)
4. [ ] Add "Create your profile" header
5. [ ] Build Full Name field (pre-filled)
6. [ ] Build Email field (pre-filled)
7. [ ] Build Password field (placeholder: "At least 8 characters")
8. [ ] Build Terms checkbox with links
9. [ ] Add "Create profile" button (conditionally enabled)
10. [ ] Wire up sign up API
11. [ ] Add loading/error states
12. [ ] Run `pnpm dlx ultracite fix`

---

## 6. Visual Reference

See: `05-email-sign-up.png`
