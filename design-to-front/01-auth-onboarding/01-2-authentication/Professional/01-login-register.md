# Page Prompt: 01 — Master Login/Register

> **Design Node ID**: `Q8vgN3`
> **Design Name**: 01 — Master Login/Register
> **Route**: `/auth/professional`
> **Viewport**: 1440×900px (centered card layout with brand header)

---

## 1. Overview

This is the **entry point** for Professional authentication. The user can:
- Continue with phone → navigates to Phone Number page
- Continue with email → navigates to Email Sign In page
- Sign in with Google or Apple (SSO)
- Switch to Organization account type

The page is a centered white card on a white background with the "Professional" brand at the top.

---

## 2. Layout Structure

```
┌──────────────────────────────────────────────┐
│                  [Brand]                      │
│          [👤 icon] Professional              │
│                                              │
│  ┌────────────────────────────────────┐      │
│  │         [← Back] (top-left)        │      │
│  │                                    │      │
│  │     Welcome to Professional        │      │
│  │  Your craft, your hours — start    │      │
│  │        earning today               │      │
│  │                                    │      │
│  │  [📱 Continue with phone    ]      │      │
│  │  [📧 Continue with email    ]      │      │
│  │                                    │      │
│  │  ────────── or ──────────         │      │
│  │                                    │      │
│  │  [G  Google              ]         │      │
│  │  [  Apple               ]         │      │
│  │                                    │      │
│  │  Are you an organization?          │      │
│  │  Switch to Organization            │      │
│  └────────────────────────────────────┘      │
└──────────────────────────────────────────────┘
```

---

## 3. Page Container

```css
width: 1440px;
height: 900px;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
background: #FFFFFF;
padding: 48px;
gap: 24px;
```

---

## 4. Brand Header (outside card)

A horizontal flex row at the top of the page content area.

| Element | Spec |
|---------|------|
| Layout | `display:flex; align-items:center; gap:12px;` |
| Logo box | 36×36px, border-radius: 10px, bg `#5749F4`, flex center |
| Logo icon | **`user-round`** (Lucide), 20px, `#FFFFFF` |
| Brand text | "Professional", Inter 24px, weight 600, `#2A2933` |

---

## 5. Card Container

```css
width: 460px;
border-radius: 40px;
background: #FFFFFF;
border: 1px solid #C5C5CB;
box-shadow: 0 10px 8.75px rgba(0, 0, 0, 0.039);
padding: 36px;
display: flex;
flex-direction: column;
gap: 22px;
```

---

## 6. Card Content (top to bottom, gap: 22px)

### 6.1 Back Link

```
[← arrow-left 16px] Back
```

| Element | Spec |
|---------|------|
| Layout | `display:flex; align-items:center; gap:6px;` |
| Icon | **`arrow-left`** (Lucide), 16px, `#616167` |
| Text | "Back", Inter 14px, weight 400, `#616167` |
| **Navigation** | Goes back to Account Type Selection page (`/auth/account-type`) |

### 6.2 Header Text (flex column, gap: 8px)

**Title**: "Welcome to Professional"
- Inter, 24px, weight 600, `#2A2933`

**Subtitle**: "Your craft, your hours — start earning today"
- Inter, 14px, weight 400, `#616167`
- text-align: center, full width

---

### 6.3 "Continue with phone" Button

Uses the **Button/Large/Default** component pattern (`PoWVd` ref) with overrides:

```html
<button style="
  display:flex; align-items:center; justify-content:center; gap:6px;
  padding: 16px 24px; border-radius: 999px; width: 100%;
  background: #5749F4; color: #FFFFFF; border: none; cursor: pointer;
  font-family: Inter; font-size: 14px; font-weight: 500;
">
  <PhoneIcon :size="20" /> Continue with phone
</button>
```

| Property | Value |
|----------|-------|
| Leading icon | **`phone`** (Lucide), 20px, `#FFFFFF` (enabled in ref override) |
| Text | "Continue with phone" |
| Font | Inter, 14px, weight 500, `#FFFFFF` |
| Padding | 16px 24px |
| Border-radius | 999px (pill) |
| Background | `#5749F4` (--primary) |
| Width | 100% |
| **Navigation** | → `/auth/professional/phone` |

### 6.4 "Continue with email" Button

Uses the **Button/Large/Secondary** pattern (`yufPk` = secondary variant of `PoWVd`):

```html
<button style="
  display:flex; align-items:center; justify-content:center; gap:6px;
  padding: 16px 24px; border-radius: 999px; width: 100%;
  background: #D9D9DB; color: #2A2933; border: none; cursor: pointer;
  font-family: Inter; font-size: 14px; font-weight: 500;
">
  <MailIcon :size="20" /> Continue with email
</button>
```

| Property | Value |
|----------|-------|
| Leading icon | **`mail`** (Lucide), 20px, `#2A2933` |
| Text | "Continue with email" |
| Background | `#D9D9DB` (--secondary) |
| Text color | `#2A2933` (--secondary-foreground) |
| **Navigation** | → `/auth/professional/signin` |

---

### 6.5 "or" Divider

```
────────── or ──────────
```

| Element | Spec |
|---------|------|
| Layout | `display:flex; align-items:center; gap:12px;` |
| Lines | Two `<div>` elements, height: 1px, `width: fill_container`, bg `#C5C5CB` |
| Text | "or", Inter 12px, weight 400, `#616167` |

---

### 6.6 Social Login Buttons (flex column, gap: 10px)

Two identical-styled pill buttons, side by side:

```
[  G  Google     ]  [    Apple     ]
```

| Property | Value |
|----------|-------|
| Layout | `display:flex; align-items:center; justify-content:center; gap:8px;` |
| Padding | 14px 16px |
| Border-radius | 999px |
| Background | `#FFFFFF` |
| Border | 1px solid `#C5C5CB` |
| Width | 100% (each fills half with gap) |
| Text | Inter, 14px, weight 500, `#2A2933` |
| Icon size | 16px |

**Google button**:
- Icon: **`google-logo`** (Phosphor) — fallback: use inline SVG of Google "G" logo
- Text: "Google"

**Apple button**:
- Icon: **`apple-logo`** (Phosphor) — fallback: use inline SVG of Apple logo
- Text: "Apple"

> **Note**: Phosphor icons (`google-logo`, `apple-logo`) may not be available in Lucide. Import from `@phosphor-icons/vue` or use inline SVGs for the SSO brand logos.

**Both buttons**: For the MVP/mock phase, these buttons can show an alert or toast saying "SSO login coming soon" — just have the `@click` handler call a stub function.

---

### 6.7 Footer Switch Link

```
Are you an organization?  Switch to Organization
```

| Element | Spec |
|---------|------|
| Layout | `display:flex; align-items:center; justify-content:center; gap:6px;` |
| Text 1 | "Are you an organization?", Inter 13px, weight 400, `#616167` |
| Text 2 (link) | "Switch to Organization", Inter 13px, weight 500, `#5749F4` |
| **Navigation** | → Organization auth flow (future) — can route to `/auth/organization` or show alert |

---

## 7. Vue Component Specification

### File
```
src/views/auth/professional/LoginRegister.vue
```

### Script Setup

```typescript
import { useRouter } from 'vue-router';
import { UserRound, ArrowLeft, Phone, Mail } from 'lucide-vue-next';
// import { GoogleLogo, AppleLogo } from '@phosphor-icons/vue'; // or inline SVG

const router = useRouter();

function goToPhone() {
  router.push({ name: 'professional-auth-phone' });
}

function goToEmail() {
  router.push({ name: 'professional-auth-signin', query: { tab: 'signin' } });
}

function goBack() {
  router.push({ name: 'account-type' }); // or /auth/account-type
}

function handleGoogleLogin() {
  // TODO: Implement Google OAuth
  alert('Google login coming soon');
}

function handleAppleLogin() {
  // TODO: Implement Apple OAuth
  alert('Apple login coming soon');
}

function switchToOrganization() {
  // TODO: Navigate to org auth flow
  alert('Organization flow coming soon');
}
```

### Interactions Summary

| Trigger | Action |
|---------|--------|
| "← Back" | Navigate to `/auth/account-type` |
| "Continue with phone" | Navigate to `/auth/professional/phone` |
| "Continue with email" | Navigate to `/auth/professional/signin?tab=signin` |
| "Google" button | Stub — show alert |
| "Apple" button | Stub — show alert |
| "Switch to Organization" | Stub — show alert or navigate to org flow |

---

## 8. Implementation Checklist

1. [ ] Create `src/views/auth/professional/LoginRegister.vue`
2. [ ] Implement brand header (logo icon + "Professional" text)
3. [ ] Implement the card container with correct styling
4. [ ] Add "Back" link with arrow-left icon
5. [ ] Add welcome heading + subtitle
6. [ ] Implement "Continue with phone" button (primary)
7. [ ] Implement "Continue with email" button (secondary)
8. [ ] Add "or" divider with lines
9. [ ] Add Google and Apple SSO buttons (with brand icons)
10. [ ] Add "Switch to Organization" footer link
11. [ ] Wire up all navigation buttons
12. [ ] Run `pnpm dlx ultracite fix`

---

## 9. Visual Reference

See the accompanying screenshot: `01-login-register.png`
