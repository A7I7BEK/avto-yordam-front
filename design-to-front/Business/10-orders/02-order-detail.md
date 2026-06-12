# Page Prompt: Order Detail

> **Design Node ID**: `hcpPj` | **Name**: "15 — Order Detail"
> **Route**: `/business/orders/:id` | **View File**: `src/views/business/OrderDetail.vue`

## Overview
Full order/booking detail with status bar, customer & service info, timeline, and actions. Breadcrumb: Orders > #BK-1247.

## Header
- Order ID + status badge (large, colored)
- Back link "← Back to orders"
- Actions: Accept/Decline (if new), Reschedule, Cancel order (if active)

## Info Sections (2 columns)
Left:
- **Customer**: Avatar + name + phone
- **Service**: Service name + category + duration
- **Vehicle**: Make/model/year
- **Master**: Assigned master (or "Assign master" dropdown)

Right:
- **Amount**: Big price display
- **Date/Time**: Scheduled date & time
- **Created**: When order was placed
- **Payment**: Status + link to transaction

## Timeline
Vertical timeline of order events:
- Order placed (date)
- Master assigned (date)
- Confirmed (date) — if applicable
- In progress (date) — if applicable
- Completed (date) — if applicable
- Payment received (date) — if applicable

## Mock Data
```typescript
export const orderDetail = {
  id: '#BK-1247', status: 'new',
  customer: { name: 'Aziz Karimov', phone: '+998 90 123 4567' },
  service: { name: 'Brake pads exchange', category: 'Engine', duration: '90 min' },
  vehicle: 'Chevrolet Malibu 2023',
  master: { name: 'Bekzod R.', initials: 'BR' },
  amount: '850 000 UZS', scheduledAt: 'Apr 12 · 14:30', createdAt: 'Apr 12 · 09:15',
  payment: { status: 'Pending', txId: null },
  timeline: [
    { event: 'Order placed', date: 'Apr 12 · 09:15' },
    { event: 'Master assigned', date: 'Apr 12 · 09:30' },
  ],
};
```

## Navigation
- Accept → opens Accept Booking Modal
- Decline → opens Decline Booking Modal
- Reschedule → opens Reschedule Modal
- Cancel → opens cancellation confirmation


**Screenshot**: `02-order-detail.png`
