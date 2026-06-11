# Page Prompt: Phone & Email Settings

> **Node**: `B9txSQ` | **Tab**: Phone & email (active) | **Mode**: Edit
> **Route**: `/professional/settings/account?tab=phone-email`

## 1. Overview

Manage phone number and email addresses. Phone shows as verified, email can be changed with verification flow.

## 2. Content Area

### 2.1 Section Header — same shell

### 2.2 Phone Section

**Label**: "Phone number" Inter 14px 600 `#2A2933`

**Verified phone row**: Pill display, `#F5F5F5` bg, 1px `#C5C5CB` border, padding 10px 16px
- `+998 90 123 45 67` Inter 14px `#2A2933`
- `badge-check` icon 14px + "Verified" Inter 12px 500 `#003300`, gap 6px

**Change phone button**: Outline pill "Change number" — not editable in-place; triggers a verification flow (future/stub).

### 2.3 Email Section

**Label**: "Email addresses" Inter 14px 600

**Primary email**: `aziz.karimov@masters.uz` in pill display with "Primary" badge (`#A1E5A1` bg green pill, "Primary" text 11px 600 `#003300`)

**Add email**: Pill input "Add another email..." + "Add" button (primary small pill)

### 2.4 Save Button

"Save changes" primary button, full width.

## 3. Implementation

**Icons**: `BadgeCheck`, `Plus`

**Screenshot**: `03-phone-email.jpg`
