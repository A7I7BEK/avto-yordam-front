# Component Prompt: Decline Booking Modal

> **Design Node ID**: `s80bpW` | **Name**: "24 — Decline Booking Modal"
> **Component File**: `src/components/orders/DeclineBookingModal.vue`

## Overview
Modal for declining a booking. Requires a reason. Opens from Bookings List or Order Detail.

## Modal (480px)
- Header: "Decline booking #BK-1247"
- Close button (X)

## Content
- Info: Customer name, Service
- Warning icon + text: "The customer will be notified. This action cannot be undone."
- **Reason** — select (required):
  - "Schedule conflict"
  - "Service not available"
  - "Outside service area"
  - "Customer request"
  - "Other"
- If "Other" selected: textarea "Please explain..."
- **Notify customer** — checkbox (checked by default): "Send SMS notification to customer"

## Buttons
- Cancel (outline)
- Decline booking (red `#CC3314`)

## Behavior
- On decline: close modal, order marked "Declined", toast shown, order removed from new/pending list
