# Page Prompt: org07 — Business Set New Password

> **Design Node ID**: `gvVgX` | **Route**: `/auth/business/reset-password` | **Incoming from**: Forgot Password | **Leads to**: Sign In page

## 1. Overview

Business admin sets a new password. Has **4 requirements** (Professional has 3) — adds "Different from your last 3 passwords".

## 2. Brand: `building-2` icon, `#2A2933` bg, "Business"

## 3. Card Content (460px, padding 36px, gap 22px)

### Lock Icon (centered)
64×64 circle, `#F5F5F5` bg + border `#C5C5CB`, `lock` icon 28px, `#5749F4`

### Header
- **Title**: "Set a new password"
- **Subtitle**: "Choose a strong password for admin@yourgarage.uz. This protects your workspace, team, and customer data."
- Line-height: 1.5

### New Password Field
- Label: "New password", masked value

### Confirm New Password Field
- Label: "Confirm new password", masked value

### Password Requirements (4 items, gap 6px)

Each row: icon 14px + text Inter 12px `#616167`, gap 8px.

| # | Met? | Icon | Text |
|---|------|------|------|
| 1 | ✅ | `check`, `#003300` | "At least 8 characters" |
| 2 | ✅ | `check`, `#003300` | "Contains a number" |
| 3 | ○ | `circle`, `#616167` | "Contains an uppercase letter" |
| 4 | ○ | `circle`, `#616167` | "Different from your last 3 passwords" |

**Live validation**: Items 1-3 check against typed password. Item 4 is always shown as unmet in mock (would need server-side validation).

### "Set new password" Button
Primary, full width. Disabled until: passwords match + all 4 requirements met.

### "Back to sign in" Link
`arrow-left` icon + text → `/auth/business/signin?tab=signin`

## 4. Implementation

Create `src/views/auth/business/SetNewPassword.vue`. Key difference from Professional:
- **4 requirements** instead of 3 (adds "Different from your last 3 passwords")
- Business-specific subtitle copy
- `lock` icon circle has border (`#C5C5CB` stroke)

**Screenshot**: `07-set-new-password.png`
