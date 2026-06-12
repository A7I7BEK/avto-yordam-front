# Component Prompt: Accept Booking Modal

> **Design Node ID**: `e68RB` | **Name**: "22 — Accept Booking Modal"
> **Component File**: `src/components/orders/AcceptBookingModal.vue`

## Overview
Modal for accepting a pending/new booking. Assigns a master and confirms the booking. Opens from Bookings List or Order Detail.

## Modal (520px)
- Header: "Accept booking #BK-1247"
- Close button (X)

## Content
- Info row: Customer name, Service, Scheduled time
- **Assign master** — select dropdown (required): list of available masters with their current load
- **Estimated duration** — auto-filled from service (e.g. "90 min"), editable
- **Notes** (optional) — textarea "Add notes for the master..."

## Buttons
- Cancel (outline)
- Accept booking (primary `#5749F4`)

## Behavior
- On accept: close modal, order status changes to "Confirmed", toast "Booking #BK-1247 accepted"


**Screenshot**: `04-accept-booking-modal.png`
