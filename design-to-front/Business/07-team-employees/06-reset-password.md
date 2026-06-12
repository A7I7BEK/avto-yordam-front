# Component Prompt: Reset Password Dialog

> **Design Node ID**: `b1SzZ`
> **Component File**: `src/components/employees/ResetPasswordDialog.vue`

## Overview
Dialog to reset an employee's password. Options: auto-generate or set manually. Accessed from Edit Employee page.

## Dialog
- 480px wide, centered, overlay
- Lock icon circle (48px, `#EEF0FF` bg, `lock` icon `#5749F4`)
- Title: "Reset password for {name}" (Inter 18px 700)

## Options
Toggle between two modes:

**Auto-generate** (selected by default):
- Generate a random secure password
- "Send via SMS" checkbox (checked by default)
- Preview: mask shown, copy button

**Set manually**:
- Two password inputs: "New password" + "Confirm password"
- Strength indicator bar
- Min 8 chars, 1 uppercase, 1 number

## Buttons
- Cancel (outline) + Reset password (primary `#5749F4`)

## Behavior
- Reset → emit with password data, close, show success toast


**Screenshot**: `06-reset-password.png`
