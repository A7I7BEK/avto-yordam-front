# Page Prompt: org06 — Business Forgot Password

> **Design Node ID**: `imHZK` | **Route**: `/auth/business/forgot-password` | **Incoming from**: Email Sign In | **Leads to**: Set New Password

## 1. Overview

Business admin requests a password reset link. Same structure as Professional Forgot Password with business copy.

## 2. Brand: `building-2` icon, `#2A2933` bg, "Business"

## 3. Card Content (460px, padding 40px, gap 24px)

### Key Icon (centered)
64×64 circle, `#F5F5F5` bg + border `#C5C5CB`, `key-round` icon 28px, `#5749F4`

### Header
- **Title**: "Reset your workspace password"
- **Subtitle**: "Enter your admin email and we'll send a reset link to recover access to your workspace."
- Line-height: 1.5

### Email Field
- Label: "Email"
- Value: `"admin@yourgarage.uz"` (mock pre-filled)

### "Send reset link" Button — primary, full width

### Hint Box
Rounded 24px, `#F5F5F5` bg, padding 12px 16px. `mail` icon + "Check your spam folder..."

### "Back to sign in" Link
`arrow-left` icon + text → `/auth/business/signin?tab=signin`

## 4. Implementation

Create `src/views/auth/business/ForgotPassword.vue`. Same as Professional with business copy.

**Screenshot**: `06-forgot-password.png`
