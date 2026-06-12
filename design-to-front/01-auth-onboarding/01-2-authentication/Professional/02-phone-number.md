# Page Prompt: 02 — Master Phone Number

> **Design Node ID**: `oYuX8`
> **Design Name**: 02 — Master Phone Number
> **Route**: `/auth/professional/phone`
> **Incoming from**: Login/Register page (when "Continue with phone" is clicked)
> **Leads to**: OTP Verification page

---

## 1. Overview

The user enters their phone number to receive a verification code. The page features:
- Country code selector (+998 for Uzbekistan, default)
- Phone number input field
- Send code button
- Privacy reassurance message

---

## 2. Layout (same as all auth pages)

```
White 1440×900 page → centered 460px card → brand at top
```

---

## 3. Card Content (top to bottom, gap: 24px)

### 3.1 Brand Header (same as Login page)

Logo (36×36, `#5749F4` bg, `user-round` icon) + "Professional" text

### 3.2 Back Link

`[←] Back` → Navigate back to `/auth/professional` (Login/Register)

### 3.3 Header Text

**Title**: "What's your number?"
- Inter, 24px, weight 600, `#2A2933`, text-align: center, full width

**Subtitle**: "We'll send a verification code so you can get back to your craft."
- Inter, 14px, weight 400, `#616167`, line-height: 1.5, text-align: center, full width

---

### 3.4 Phone Input Field

A label + horizontal row containing country code + number input.

```
Phone number
┌──────────┐ ┌──────────────────────┐
│ +998  ▾  │ │ 90 555 12 34         │
└──────────┘ └──────────────────────┘
```

#### Label
- "Phone number", Inter 14px, weight 500, `#2A2933`

#### Input Row (`display:flex; gap:8px;`)

**Country Code Selector** (left):
| Property | Value |
|----------|-------|
| Content | `+998` + chevron-down icon |
| Font | Inter, 14px, weight 500, `#2A2933` |
| Icon | **`chevron-down`** (Lucide), 14px, `#616167` |
| Padding | 18px 20px |
| Border-radius | 999px (pill) |
| Background | `#F5F5F5` (--accent) |
| Border | 1px solid `#C5C5CB` (--border) |
| Gap between text and icon | 6px |

**Phone Number Input** (right, fills remaining):
| Property | Value |
|----------|-------|
| Placeholder/Value | "90 555 12 34" (pre-filled mock data) |
| Font | Inter, 14px, weight 400, `#2A2933` |
| Padding | 18px 24px |
| Border-radius | 999px (pill) |
| Background | `#F5F5F5` (--accent) |
| Border | 1px solid `#C5C5CB` (--border) |
| Width | `flex: 1` (fill_container) |

> **Mock data**: Pre-fill with `90 555 12 34` as a default value so the flow can be demoed without typing.

#### Input Group Spacing
The label and input row are in a flex column with `gap: 6px`.

---

### 3.5 "Send code" Button

Uses the **Button/Large/Default** pattern (primary, pill, full width):

| Property | Value |
|----------|-------|
| Text | "Send code" |
| Font | Inter, 14px, weight 500, `#FFFFFF` |
| Background | `#5749F4` (--primary) |
| Padding | 16px 24px |
| Border-radius | 999px |
| Width | 100% |
| No leading icon | `enabled: false` |
| **Navigation** | → `/auth/professional/otp?phone=...` |

On click, call the `professionalAuth.loginWithPhone()` service with the entered phone number. On success, navigate to OTP page passing the `otpId` and phone number as query params.

---

### 3.6 Privacy Notice

```
[🛡️ shield-check 14px]  Your number stays private — we use it only to verify you.
```

| Element | Spec |
|---------|------|
| Layout | `display:flex; align-items:center; justify-content:center; gap:8px;` |
| Icon | **`shield-check`** (Lucide), 14px, `#616167` |
| Text | Inter, 12px, weight 400, `#616167` |

---

## 4. Vue Component Specification

### File
```
src/views/auth/professional/PhoneNumber.vue
```

### Script Setup

```typescript
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { UserRound, ArrowLeft, ChevronDown, ShieldCheck } from '@lucide/vue';
import { professionalAuth } from '@/services/auth/professionalAuthService';

const router = useRouter();
const phoneNumber = ref('90 555 12 34'); // mock default
const countryCode = ref('+998');
const isLoading = ref(false);
const error = ref('');

async function sendCode() {
  isLoading.value = true;
  error.value = '';
  try {
    const fullPhone = `${countryCode.value} ${phoneNumber.value}`;
    const result = await professionalAuth.loginWithPhone({ phone: fullPhone });
    router.push({
      name: 'professional-auth-otp',
      query: { phone: fullPhone, otpId: result.otpId }
    });
  } catch (e) {
    error.value = 'Failed to send code. Please try again.';
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
| Country code click | Show dropdown (simple select for mock) |
| "Send code" button | Call API → navigate to OTP page |
| Enter key in input | Same as "Send code" |

---

## 5. Implementation Checklist

1. [ ] Create `src/views/auth/professional/PhoneNumber.vue`
2. [ ] Reuse brand header pattern
3. [ ] Add back link
4. [ ] Add title + subtitle
5. [ ] Build phone input row (country code selector + number input)
6. [ ] Add "Send code" primary button
7. [ ] Add privacy notice
8. [ ] Wire up form submission + navigation to OTP page
9. [ ] Add loading state on button during API call
10. [ ] Run `pnpm dlx ultracite fix`

---

## 6. Visual Reference

See: `02-phone-number.png`
