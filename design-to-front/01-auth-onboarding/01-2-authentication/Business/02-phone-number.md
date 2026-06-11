# Page Prompt: org02 — Business Phone Number

> **Design Node ID**: `xEtcW` | **Route**: `/auth/business/phone` | **Incoming from**: Login/Register | **Leads to**: OTP Verification

## 1. Overview

Business phone number entry page. Same structure as Professional Phone Number with Business brand and copy.

## 2. Brand: `building-2` icon, `#2A2933` bg, "Business"

## 3. Card Content (460px, padding 40px, gap 24px)

### Back Link → `/auth/business`

### Header
- **Title**: "Enter your business phone"
- **Subtitle**: "We'll send a verification code to your admin number"

### Phone Input — same pattern:
- Country code: `+998` with chevron-down
- Number: `90 555 12 34` (mock pre-filled)

### "Send code" Button
Primary, full width → calls API → navigates to `/auth/business/otp?phone=...&otpId=...`

### Privacy Notice: `shield-check` icon + privacy text

## 4. Implementation

Create `src/views/auth/business/PhoneNumber.vue`. Same logic as Professional version with Business brand and routes.

**Screenshot**: `02-phone-number.png`
