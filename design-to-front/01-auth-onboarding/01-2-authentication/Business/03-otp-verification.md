# Page Prompt: org03 — Business OTP Verification

> **Design Node ID**: `u9Lpw2` | **Route**: `/auth/business/otp` | **Incoming from**: Phone Number | **Leads to**: Dashboard/Onboarding

## 1. Overview

OTP verification for business. Same structure as Professional OTP with Business-specific copy.

## 2. Brand: `building-2` icon, `#2A2933` bg, "Business"

## 3. Card Content (500px, padding 40px, gap 24px)

### Back Link → `/auth/business/phone`

### Message Icon
64×64 circle, `#F5F5F5` bg, `message-circle-more` icon 28px, `#5749F4`

### Header
- **Title**: "Verify your workspace"
- **Subtitle**: "We sent a 6-digit code to +998 90 555 12 34"

### OTP Input — 6 boxes (same as Professional, pre-filled with `000000`)

### Timer Row
- Icon: **`clock`** (Lucide) ← Business uses `clock`, Professional uses `timer`
- Text: "Resend code in 0:42"
- 60-second countdown

### "Verify and continue" Button — primary, full width

### Resend Link — "Didn't receive the code? Resend"

## 4. Implementation

Create `src/views/auth/business/OtpVerification.vue`. Key difference: use `clock` icon instead of `timer`.

**Screenshot**: `03-otp-verification.png`
