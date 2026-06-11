# Component Prompt: Remove Member Confirmation

> **Design Node ID**: `ueqU1` | **Name**: "31 - Remove Member Confirmation"
> **Component File**: `src/components/members/RemoveMemberDialog.vue`

## Overview
Confirmation dialog when removing a member from the team. Centered modal with warning and impact summary.

## Dialog
- 440px wide, centered, overlay `rgba(15,23,42,0.4)`
- Warning icon circle (48px, `#FDEBEC` bg, `user-minus` icon `#CC3314`)
- Title: "Remove {name}?" (Inter 18px 700)
- Description: "{name} will lose access to the organization. Their completed work and records will be preserved."
- Info box with amber bg: "This member has {N} active orders. These will need reassignment."
- Buttons: Cancel (outline) + Remove (red `#CC3314`)

## Behavior
- Remove → emit confirm, close, redirect to roster, show toast
- Cancel → emit cancel, close
