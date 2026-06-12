# Page Prompt: Schedules — Week View

> **Design Node ID**: `PX6eu` | **Name**: "14A — Schedules Week"
> **Route**: `/business/schedules/week` | **View File**: `src/views/business/SchedulesWeek.vue`

## Overview
Weekly grid: masters as rows (left column), days as columns, bookings displayed as time-block cards. Toggle Month/Week/Day views.

## Header
- Same as Month view but Week is active toggle
- Date navigator: < Apr 6–12, 2026 >
- Master filter, Today button

## Grid Layout
- Left column (120px): Master names with avatars
- 7 day columns (equal width)
- Time rows from 08:00 to 18:00 (scrollable)
- Booking cards positioned by time slot

### Booking Card
- Height proportional to duration
- Colored by master
- Shows: time range, service name, customer initials
- Click → order detail
- Drag to reschedule (future feature)

## Mock Data
Same data as month view, filtered to the selected week.

## Navigation
- Click booking → `/business/orders/{id}`
- Toggle to Month or Day


**Screenshot**: `02-schedules-week.png`
