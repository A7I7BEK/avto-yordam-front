# Page Prompt: 07 — Master Set New Password

> **Design Node ID**: `ehmqg`
> **Design Name**: 07 — Master Set New Password
> **Route**: `/auth/professional/reset-password`
> **Incoming from**: Forgot Password page (after sending reset link)
> **Leads to**: Email Sign In page (after successful reset)

---

## 1. Overview

User sets a new password after requesting a reset. The page features:
- Lock icon
- Heading and description
- New password field
- Confirm new password field
- Password requirements checklist (3 items with live validation)
- Set new password button
- Back to sign in link

---

## 2. Layout

Centered card (460px, padding 36px, gap 22px) on white page.

---

## 3. Card Content (top to bottom, gap: 22px)

### 3.1 Brand Header
Logo + "Professional" (same pattern)

No back arrow at top — "Back to sign in" at bottom instead.

---

### 3.2 Lock Icon (centered)

```
       ┌──────────┐
       │  🔒 icon │  64×64 circle
       │          │  bg: #F5F5F5
       └──────────┘
```

| Property | Value |
|----------|-------|
| Container | 64×64px, border-radius: 999px, bg `#F5F5F5` |
| Icon | **`lock`** (Lucide), 28px, `#5749F4` |
| Alignment | Centered |

---

### 3.3 Header Text

**Title**: "Set a new password"
- Inter, 22px, weight 600, `#2A2933`

**Subtitle**: "Choose a strong password to keep your master profile and earnings safe."
- Inter, 14px, weight 400, `#616167`, line-height: 1.5, text-align: center, full width

Gap: 8px.

---

### 3.4 New Password Field

Uses **Input Group/Filled** pattern:

```
New password
┌──────────────────────────────────┐
│ ••••••••••••                     │
└──────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Label | "New password", Inter 14px, weight 500 |
| Value | Masked (`••••••••••••`) |
| Type | `password` |
| Pill styling | `#F5F5F5` bg, `#C5C5CB` border, 18px 24px padding |

---

### 3.5 Confirm New Password Field

```
Confirm new password
┌──────────────────────────────────┐
│ ••••••••••••                     │
└──────────────────────────────────┘
```

Same styling as New Password field. Label: "Confirm new password".

---

### 3.6 Password Requirements Checklist

A vertical list of 3 requirement items, each with icon + text:

```
✓  At least 8 characters
✓  Contains a number
○  Contains an uppercase letter
```

| Element | Spec |
|---------|------|
| Layout | `display:flex; flex-direction:column; gap:6px;` |
| Each row | `display:flex; align-items:center; gap:8px;` |

**Requirement rows:**

| # | Icon | Text | State |
|---|------|------|-------|
| 1 | **`check`** (Lucide), 14px, `#003300` (--color-success-foreground) | "At least 8 characters" | ✅ Met (pre-checked) |
| 2 | **`check`** (Lucide), 14px, `#003300` | "Contains a number" | ✅ Met (pre-checked) |
| 3 | **`circle`** (Lucide), 14px, `#616167` | "Contains an uppercase letter" | ○ Unmet (empty circle) |

All text: Inter, 12px, weight 400, `#616167`.

**Live validation**: As the user types, check each requirement and swap:
- Unmet → **`circle`** icon, `#616167` color
- Met → **`check`** icon, `#003300` color

The three checks:
1. `password.length >= 8`
2. `/\d/.test(password)`
3. `/[A-Z]/.test(password)`

---

### 3.7 "Set new password" Button

| Property | Value |
|----------|-------|
| Text | "Set new password" |
| Background | `#5749F4` (--primary) |
| Font | Inter, 14px, weight 500, `#FFFFFF` |
| Padding | 16px 24px, border-radius 999px |
| Width | 100% |
| Disabled when | Passwords don't match OR requirements not all met |

**On click**: Call `professionalAuth.resetPassword({ token: resetToken, newPassword })`. On success → show success toast/message → navigate to `/auth/professional/signin?tab=signin`.

---

### 3.8 "Back to sign in" Link

```
[← arrow-left 14px]  Back to sign in
```

| Element | Spec |
|---------|------|
| Icon | **`arrow-left`** (Lucide), 14px, `#5749F4` |
| Text | "Back to sign in", Inter 14px, weight 500, `#5749F4` |
| **Navigation** | → `/auth/professional/signin?tab=signin` |

---

## 4. Vue Component Specification

### File
```
src/views/auth/professional/SetNewPassword.vue
```

### Script Setup

```typescript
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { UserRound, Lock, ArrowLeft, Check, Circle } from 'lucide-vue-next';
import { professionalAuth } from '@/services/auth/professionalAuthService';

const router = useRouter();
const route = useRoute();

const resetToken = (route.query.resetToken as string) || 'mock-reset-token';
const newPassword = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const error = ref('');

const requirements = computed(() => [
  { label: 'At least 8 characters', met: newPassword.value.length >= 8 },
  { label: 'Contains a number', met: /\d/.test(newPassword.value) },
  { label: 'Contains an uppercase letter', met: /[A-Z]/.test(newPassword.value) },
]);

const allRequirementsMet = computed(() => requirements.value.every(r => r.met));
const passwordsMatch = computed(() => newPassword.value === confirmPassword.value && newPassword.value.length > 0);
const canSubmit = computed(() => allRequirementsMet.value && passwordsMatch.value);

async function setNewPassword() {
  if (!canSubmit.value) return;
  isLoading.value = true;
  error.value = '';
  try {
    await professionalAuth.resetPassword({ token: resetToken, newPassword: newPassword.value });
    // Success — redirect to sign in
    router.push({ name: 'professional-auth-signin', query: { tab: 'signin', reset: 'success' } });
  } catch (e) {
    error.value = 'Failed to reset password. The link may have expired.';
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
| Typing in password fields | Live-update requirements checklist |
| "Set new password" button | Call reset password API → navigate to sign in |
| "Back to sign in" link | Navigate to sign in |
| Enter key | Submit form |

---

## 5. Implementation Checklist

1. [ ] Create `src/views/auth/professional/SetNewPassword.vue`
2. [ ] Reuse brand header
3. [ ] Add lock icon (centered)
4. [ ] Add "Set a new password" heading + subtitle
5. [ ] Build new password field
6. [ ] Build confirm password field
7. [ ] Build requirements checklist with live icons (check/circle)
8. [ ] Add "Set new password" button (conditionally enabled)
9. [ ] Add "Back to sign in" link
10. [ ] Wire up reset password API
11. [ ] Add loading/error states
12. [ ] Run `pnpm dlx ultracite fix`

---

## 6. Visual Reference

See: `07-set-new-password.png`
