# Component Prompt: Reschedule Modal

> **Design Node ID**: `tLWIs` | **Name**: "21 — Reschedule Modal"
> **Component File**: `src/components/orders/RescheduleModal.vue`

## Overview
Modal for rescheduling a confirmed/active order to a new date and time. Opens from Order Detail.

## Modal (500px)
- Header: "Reschedule #BK-1247"
- Close button (X)

## Content
- Current schedule display: "Currently: Apr 12 · 14:30"
- **New date** — date picker (calendar dropdown)
- **New time** — time select or slots list: 08:00, 09:00, 10:00, ...
  - Show available slots only
  - Mark conflicting slots in red
- **Master** — if changing master, select dropdown (optional)
- **Reason** (optional) — textarea "Reason for rescheduling..."

## Buttons
- Cancel (outline)
- Confirm reschedule (primary `#5749F4`)

## Behavior
- On confirm: close modal, update order, show toast "Booking rescheduled to Apr 14 · 10:00"


**Screenshot**: `06-reschedule-modal.png`
