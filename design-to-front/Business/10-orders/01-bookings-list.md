# Page Prompt: Bookings List

> **Design Node ID**: `vTZ6F` | **Name**: "13 — Bookings List"
> **Route**: `/business/orders` | **View File**: `src/views/business/OrdersList.vue`

## Overview
Data table of all bookings/orders with status tabs, search, date filter, and actions. Sidebar Orders is active (with badge count 7).

## Header
- Title: "Orders" (Inter 24px 700) with "7 new" purple badge
- Subtitle: "Track and manage all customer bookings"
- Right: "Add walk-in" primary button (`#5749F4`, `plus` icon)

## Status Tabs
Horizontal pill tabs: **All** (active, purple bg) | New (7 badge) | Confirmed | In Progress | Done | Cancelled

## Table Columns
| Column | Description |
|--------|-------------|
| Order ID | `#BK-1247`, Inter 12px 500, purple `#5749F4` |
| Customer | Avatar 24px + name |
| Service | Service name |
| Date/Time | "Apr 12 · 14:30" |
| Master | Assigned master name (or "— Unassigned" amber) |
| Amount | Inter 12px 600 |
| Status | Pill badge (New/Confirmed/InProgress/Done/Cancelled) |
| Actions | Eye (view), Accept/Decline (for new) |

## Mock Data
```typescript
export const orders = [
  { id: '#BK-1247', customer: 'Aziz Karimov', initials: 'AK', service: 'Brake pads', date: 'Apr 12 · 14:30', master: 'Bekzod R.', amount: '850K UZS', status: 'new' },
  { id: '#BK-1246', customer: 'Bekzod Rakhimov', initials: 'BR', service: 'Diagnostics', date: 'Apr 12 · 11:08', master: 'Jasur T.', amount: '180K UZS', status: 'pending' },
  { id: '#BK-1245', customer: 'Madina Tursunova', initials: 'MT', service: 'Brakes + Oil', date: 'Apr 10 · 09:00', master: 'Aziz K.', amount: '850K UZS', status: 'done' },
  { id: '#BK-1244', customer: 'Nodir Ergashev', initials: 'NE', service: 'Oil change', date: 'Apr 9 · 16:20', master: 'Aziz K.', amount: '220K UZS', status: 'done' },
  { id: '#BK-1243', customer: 'Alisher Usmanov', initials: 'AU', service: 'Full diagnostics', date: 'Apr 9 · 10:15', master: '—', amount: '350K UZS', status: 'new' },
  { id: '#BK-1242', customer: 'Dilnoza Karimova', initials: 'DK', service: 'Brake pads', date: 'Apr 8 · 14:30', master: 'Bekzod R.', amount: '850K UZS', status: 'confirmed' },
  { id: '#BK-1241', customer: 'Sherzod Toshmatov', initials: 'ST', service: 'AC repair', date: 'Apr 8 · 11:00', master: '—', amount: '450K UZS', status: 'cancelled' },
];
```

## Navigation
- Eye → `/business/orders/{id}` (detail)
- Accept → opens Accept Booking Modal
- Decline → opens Decline Booking Modal
- "Add walk-in" → create new order form
