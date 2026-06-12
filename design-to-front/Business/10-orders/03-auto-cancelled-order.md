# Page Prompt: Auto-Cancelled Order

> **Design Node ID**: `a0iSzm` | **Name**: "19 — Auto Cancelled Order"
> **Route**: `/business/orders/:id` (when order status is auto-cancelled)
> **View File**: same `OrderDetail.vue` (state variant)

## Overview
Variant of the Order Detail page showing an order that was automatically cancelled by the system (e.g., no master accepted within time limit). Shows cancellation reason and options.

## Cancelled State Banner
- Red/amber banner at top: "⚠️ This order was automatically cancelled"
- Reason: "No master accepted the booking within the 2-hour window"
- Cancelled at: timestamp

## What's Different from Normal Detail
- Status badge: "Auto-Cancelled" (red, `#FFBFB2` bg, `#590F00` text)
- No Accept/Decline/Reschedule actions
- Actions available: "Reopen order" (outline) or "Create similar" (primary)
- Timeline includes: "Auto-cancelled — no master accepted" as final event
- Master field shows "— Never assigned"

## Mock Data
```typescript
const cancelledOrder = {
  ...orderDetail,
  status: 'auto-cancelled',
  cancelReason: 'No master accepted within 2-hour window',
  cancelledAt: 'Apr 12 · 11:15',
  master: null,
  timeline: [
    { event: 'Order placed', date: 'Apr 12 · 09:15' },
    { event: 'Auto-cancelled', date: 'Apr 12 · 11:15', detail: 'No master accepted' },
  ],
};
```


**Screenshot**: `03-auto-cancelled-order.png`
