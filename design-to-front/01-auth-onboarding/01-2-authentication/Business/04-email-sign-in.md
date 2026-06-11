# Page Prompt: org04 — Business Email Sign In

> **Design Node ID**: `OApwZ` | **Route**: `/auth/business/signin?tab=signin` | **Incoming from**: Login/Register | **Can switch to**: Create Workspace tab | **Leads to**: Dashboard or Forgot Password

## 1. Overview

Email sign in for business admins. Tab switcher: "Sign in" (active) / "Create workspace".

## 2. Brand: `building-2` icon, `#2A2933` bg, "Business"

## 3. Card Content (460px, padding 36px, gap 22px)

### Back Link → `/auth/business`

### Tab Switcher
```
[ Sign in (active) ]  [ Create workspace ]
```
Active tab: `#D9D9DB` bg. Clicking "Create workspace" → `/auth/business/signup?tab=signup`.

### Header
- **Title**: "Welcome back, admin"
- **Subtitle**: "Sign in to manage your team and bookings"

### Work Email Field
- Label: "Work email"
- Value: `"admin@yourgarage.uz"` (mock pre-filled)

### Password Field
- Label: "Password", value masked, eye toggle

### "Sign in" Button — primary, full width

### Forgot Password Link
"Forgot password? Go to Reset Password" → `/auth/business/forgot-password?email=...`

## 4. Implementation

Create `src/views/auth/business/EmailSignIn.vue`. Tab labels: "Sign in" / "Create workspace". Field label: "Work email".

**Screenshot**: `04-email-sign-in.png`
