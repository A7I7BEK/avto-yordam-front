# Page Prompt: 03 — Master OTP Verification

> **Design Node ID**: `zNECF`
> **Design Name**: 03 — Master OTP Verification
> **Route**: `/auth/professional/otp`
> **Incoming from**: Phone Number page (with `phone` and `otpId` query params)
> **Leads to**: Dashboard (if onboarded) or Onboarding flow

---

## 1. Overview

After submitting a phone number, the user enters a 6-digit OTP code sent via SMS. The page shows:
- A message bubble icon
- Instructions with the masked phone number
- 6 OTP input boxes
- Countdown timer for resend
- Verify button
- Resend link

---

## 2. Layout

Centered card (500px wide this time, padding 40px, gap 24px) on white 1440×900 page.

---

## 3. Card Content (top to bottom, gap: 24px)

### 3.1 Brand Header (same pattern)

Logo (36×36, `#5749F4`, `user-round`) + "Professional"

### 3.2 Back Link

`[←] Back` → Navigate to `/auth/professional/phone`

---

### 3.3 Message Icon (centered)

```
       ┌──────────┐
       │  💬 icon │  64×64 circle
       │          │  bg: #F5F5F5
       └──────────┘
```

| Property | Value |
|----------|-------|
| Container | 64×64px, border-radius: 999px, bg `#F5F5F5`, flex center |
| Icon | **`message-circle-more`** (Lucide), 28px, `#5749F4` |
| Alignment | Centered horizontally within card |

---

### 3.4 Header Text

**Title**: "Almost there..."
- Inter, 24px, weight 600, `#2A2933`

**Subtitle**: "We sent a 6-digit code to +998 90 123 45 67"
- Inter, 14px, weight 400, `#616167`, text-align: center, full width
- The phone number should come from the query param or route state

---

### 3.5 OTP Input

Uses the **Input OTP Group/Filled** component pattern (`QqVcT` ref):

Label: "Verification code"
6 individual input boxes, each styled as:

| Property | Value |
|----------|-------|
| Size | ~48px wide × ~56px tall (estimate from standard OTP pattern) |
| Border-radius | 24px (--radius-m) |
| Background | `#F5F5F5` (--accent) |
| Border | 1px solid `#C5C5CB` (--border) |
| Font | Inter, 20px+, centered |
| Text color | `#2A2933` (--foreground) |
| Gap between boxes | ~8px |

The boxes should be centered horizontally. Use `<input>` with `maxlength="1"` and `type="text"` `inputmode="numeric"` `pattern="[0-9]"`.

Auto-focus the first input. Auto-advance to next input on digit entry.

> **Mock behavior**: For demo purposes, any 6-digit code is accepted. Pre-fill with `000000` so testers can just click "Verify and continue".

---

### 3.6 Countdown Timer

```
[⏱ timer 14px]  Resend code in 0:42
```

| Element | Spec |
|---------|------|
| Layout | `display:flex; align-items:center; justify-content:center; gap:8px;` |
| Icon | **`timer`** (Lucide), 14px, `#616167` |
| Text | "Resend code in 0:42", Inter 14px, weight 400, `#616167` |

**Behavior**: Start a 60-second countdown on page load. Show `MM:SS` format. When timer reaches 0, hide this row and show the resend link below.

---

### 3.7 "Verify and continue" Button

| Property | Value |
|----------|-------|
| Text | "Verify and continue" |
| Background | `#5749F4` (--primary) |
| Font | Inter, 14px, weight 500, `#FFFFFF` |
| Padding | 16px 24px, border-radius 999px |
| Width | 100% |
| No leading icon | |

**On click**: Call `professionalAuth.verifyOtp({ otpId, code })`. On success:
- Store token (e.g., in Pinia store or localStorage)
- Check `user.isOnboarded`:
  - If `false` → navigate to onboarding
  - If `true` → navigate to dashboard (`/`)

Show loading spinner on button while verifying. Show error message below the button if verification fails.

---

### 3.8 Resend Link

```
Didn't receive the code?  Resend
```

| Element | Spec |
|---------|------|
| Layout | `display:flex; align-items:center; justify-content:center; gap:6px;` |
| Text 1 | "Didn't receive the code?", Inter 14px, weight 400, `#616167` |
| Text 2 (link) | "Resend", Inter 14px, weight 500, `#5749F4` |

**Behavior**: Only visible after countdown reaches 0. Clicking calls `professionalAuth.loginWithPhone()` again to request a new code, then resets the 60-second timer.

---

## 4. Vue Component Specification

### File
```
src/views/auth/professional/OtpVerification.vue
```

### Script Setup

```typescript
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { UserRound, ArrowLeft, MessageCircleMore, Timer } from '@lucide/vue';
import { professionalAuth } from '@/services/auth/professionalAuthService';

const router = useRouter();
const route = useRoute();

const phone = (route.query.phone as string) || '+998 90 123 45 67';
const otpId = (route.query.otpId as string) || 'mock-otp-id';

const otpValues = ref(['0', '0', '0', '0', '0', '0']); // pre-filled for demo
const timeLeft = ref(60);
const canResend = computed(() => timeLeft.value <= 0);
const isLoading = ref(false);
const error = ref('');
let timer: ReturnType<typeof setInterval> | null = null;

function startTimer() {
  timeLeft.value = 60;
  timer = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--;
    else if (timer) clearInterval(timer);
  }, 1000);
}

async function verify() {
  const code = otpValues.value.join('');
  if (code.length !== 6) return;
  isLoading.value = true;
  error.value = '';
  try {
    const result = await professionalAuth.verifyOtp({ otpId, code });
    localStorage.setItem('token', result.token);
    if (result.user.isOnboarded) {
      router.push({ name: 'dashboard' });
    } else {
      router.push({ name: 'professional-onboarding' });
    }
  } catch (e) {
    error.value = 'Invalid code. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

async function resendCode() {
  await professionalAuth.loginWithPhone({ phone });
  startTimer();
}

function goBack() {
  router.push({ name: 'professional-auth-phone' });
}

onMounted(() => startTimer());
onUnmounted(() => { if (timer) clearInterval(timer); });
```

### Interactions

| Trigger | Action |
|---------|--------|
| "← Back" | Navigate to phone page |
| Type in OTP boxes | Auto-advance, auto-submit when 6 digits entered |
| "Verify and continue" | Call API → navigate |
| "Resend" link | Request new code, reset timer |
| Timer expires | Show resend link, hide timer row |

---

## 5. Implementation Checklist

1. [ ] Create `src/views/auth/professional/OtpVerification.vue`
2. [ ] Reuse brand header
3. [ ] Add back link
4. [ ] Add message bubble icon (centered)
5. [ ] Add "Almost there..." heading + phone number subtitle
6. [ ] Build 6-digit OTP input with auto-advance
7. [ ] Add countdown timer with `timer` icon
8. [ ] Add "Verify and continue" button
9. [ ] Add "Didn't receive the code? Resend" link (conditional)
10. [ ] Wire up verification API + post-login routing
11. [ ] Add loading/error states
12. [ ] Run `pnpm dlx ultracite fix`

---

## 6. Visual Reference

See: `03-otp-verification.png`
