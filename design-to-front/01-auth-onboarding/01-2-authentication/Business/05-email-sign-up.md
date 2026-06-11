# Page Prompt: org05 — Business Email Sign Up (Create Workspace)

> **Design Node ID**: `VyS3b` | **Route**: `/auth/business/signup?tab=signup` | **Incoming from**: Login/Register or Sign In page | **Leads to**: Onboarding

## 1. Overview

Business registration form. Tab switcher: "Sign in" / "Create workspace" (active). Has 4 fields (more than Professional's 3).

## 2. Brand: `building-2` icon, `#2A2933` bg, "Business"

## 3. Card Content (480px wide, padding 32px, gap 16px)

> Note: Card is slightly wider (480px vs 460px) to accommodate the "Create workspace" tab text.

### Top Row: Back link on the left

### Tab Switcher
```
[ Sign in ]  [ Create workspace (active) ]
```

### Header
- **Title**: "Set up your shop"
- **Subtitle**: "Create your workspace and invite your team in minutes"
- Gap: 4px between title and subtitle

### Fields (4 inputs)

| # | Label | Mock Value | Notes |
|---|-------|-----------|-------|
| 1 | "Organization name" | `"e.g. AutoMaster Garage"` | Placeholder shown in field |
| 2 | "Admin email" | `"admin@yourgarage.uz"` | Pre-filled |
| 3 | "Password" | `"At least 8 characters"` | Placeholder |
| 4 | "Confirm password" | `"Repeat your password"` | Placeholder |

All fields: same pill styling (`#F5F5F5` bg, `#C5C5CB` border, 18px 24px padding, 999px radius).

### Terms Checkbox
```
[✓]  I agree to the Business Terms and Data Processing Agreement
```
Checkbox pattern (`434AE` ref), 16×16px, `#5749F4` bg. Required to enable button.

### "Create workspace" Button
Primary, full width. Disabled until all fields filled AND checkbox checked. Navigates to onboarding on success.

## 4. Implementation

Create `src/views/auth/business/EmailSignUp.vue`. Key differences from Professional:
- 4 fields (adds Organization name and Confirm password)
- Tab label: "Create workspace" instead of "Sign up"
- Terms text: "Business Terms and Data Processing Agreement"
- Card width: 480px
- Button text: "Create workspace"

**Screenshot**: `05-email-sign-up.png`
