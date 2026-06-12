# Page Prompt: Schedules — Month View

> **Design Node ID**: `G234zC` | **Name**: "14 — Schedules Month"
> **Route**: `/business/schedules` (default: month) | **View File**: `src/views/business/SchedulesMonth.vue`

## Overview
Monthly calendar view showing all bookings by day for each master. Toggle between Month/Week/Day views. Sidebar Schedules is active.

## Header
- Title: "Schedules" (Inter 24px 700)
- Right: View toggle — [Month] | Week | Day (pill selector)
- Date navigator: < April 2026 > arrows
- "Today" button (outline)
- Master filter: "All masters" dropdown

## Calendar Grid
7-column grid (Mon–Sun), 5-6 rows for weeks.

### Day Cell
- Day number (top-left, Inter 12px 600)
- Up to 3 booking chips per master, color-coded by master
- Booking chip: colored bar with time + service name abbreviated
- "+{N} more" link if more than 3 bookings
- Click cell → navigates to day view

### Master Color Map
```typescript
export const masterColors = {
  'Aziz K.': { bg: '#EEF0FF', bar: '#5749F4', text: '#2A2933' },
  'Bekzod R.': { bg: '#FFF0E9', bar: '#FF7A4B', text: '#4D2700' },
  'Jasur T.': { bg: '#E8FAF0', bar: '#1FAA59', text: '#003300' },
};
```

## Mock Data
```typescript
export const monthBookings = [
  { date: '2026-04-12', master: 'Aziz K.', time: '09:00', service: 'Oil change', orderId: '#BK-1247' },
  { date: '2026-04-12', master: 'Bekzod R.', time: '10:30', service: 'Brake pads', orderId: '#BK-1246' },
  { date: '2026-04-13', master: 'Aziz K.', time: '14:00', service: 'Diagnostics', orderId: '#BK-1245' },
];
```

## Navigation
- View toggles: Month → Week → Day views
- Click day → `/business/schedules/day?date=2026-04-12`
- Click booking chip → `/business/orders/{id}`


**Screenshot**: `01-schedules-month.png`
