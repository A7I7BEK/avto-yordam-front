# Page Prompt: Schedules — Day View

> **Design Node ID**: `vobPC` | **Name**: "14B — Schedules Day"
> **Route**: `/business/schedules/day` | **View File**: `src/views/business/SchedulesDay.vue`

## Overview
Single-day timeline view showing all masters' bookings side-by-side in time-slot columns. Most granular view. Toggle Month/Week/Day.

## Header
- Same toggle, Day active
- Date navigator: < April 12, 2026 (Monday) >
- Master filter, Today button

## Layout
- Horizontal timeline from 08:00 to 18:00
- Each master gets a row with:
  - Avatar + name (left, 120px)
  - Time slots as colored cards positioned by time
- Current time indicator (vertical red line)
- Empty slots shown as available (dashed outline)

### Booking Card (in day view)
- Shows: time range (09:00–10:30), service name, customer, vehicle
- Colored left border by master
- Click → order detail
- Height proportional to duration

## Mock Data
```typescript
export const dayBookings = [
  { master: 'Aziz K.', time: '09:00', endTime: '10:30', service: 'Oil change', customer: 'Akmal N.', orderId: '#BK-1247' },
  { master: 'Bekzod R.', time: '09:00', endTime: '10:00', service: 'Diagnostics', customer: 'Bekzod R.', orderId: '#BK-1246' },
  { master: 'Jasur T.', time: '11:00', endTime: '12:30', service: 'Brake pads', customer: 'Madina T.', orderId: '#BK-1245' },
  { master: 'Aziz K.', time: '13:00', endTime: '14:00', service: 'Filter change', customer: 'Nodir E.', orderId: '#BK-1244' },
];
```

## Navigation
- Click booking → `/business/orders/{id}`
- Click empty slot → open quick-create order form
- Toggle to Week or Month


**Screenshot**: `03-schedules-day.png`
