# Page Prompt: Operating Hours

> **Design Node ID**: `iedNW` | **Name**: "48 - Operating Hours"
> **Route**: `/business/settings/hours` | **View File**: `src/views/business/SettingsHours.vue`

## Overview
Settings page to configure the business operating hours per day of the week. Each day can be toggled on/off with custom open/close times. Part of Settings section. Breadcrumb: Settings > Operating Hours.

## Header
- Title: "Operating hours" (Inter 24px 700)
- Subtitle: "Set when your business accepts bookings"
- Save button (primary `#5749F4`, top-right)

## Day Rows (7 rows, one per day)
Each day row:
```
[Toggle]  Monday      09:00 ─── 18:00
```
- **Toggle switch** — enables/disables the day (green when on). Default: Mon–Sat on, Sun off
- **Day name** — Inter 14px 600, `#2A2933`
- **Time range** — two time pickers: Open time and Close time
  - Pill shape, white bg, border `#C5C5CB`, padding 8px 14px
  - Format: HH:MM (24h)
  - Clock icon on each picker
  - Separator "—" between them

## Time Presets
Quick-select chips below the day rows:
- "Standard (09:00–18:00)"
- "Extended (08:00–20:00)"
- "24 Hours"
Clicking a preset applies to all enabled days.

## Break Time (optional section)
- Toggle: "Add lunch break"
- When on: additional time range "12:00–13:00" shown on each day

## Special Hours / Holidays
- "Add special hours" button
- Date picker + time range for holidays or special days
- List of special days with edit/delete

## Mock Data
```typescript
export const operatingHours = {
  timezone: 'Asia/Tashkent (UTC+5)',
  days: [
    { day: 'Monday',    enabled: true,  open: '09:00', close: '18:00' },
    { day: 'Tuesday',   enabled: true,  open: '09:00', close: '18:00' },
    { day: 'Wednesday', enabled: true,  open: '09:00', close: '18:00' },
    { day: 'Thursday',  enabled: true,  open: '09:00', close: '18:00' },
    { day: 'Friday',    enabled: true,  open: '09:00', close: '18:00' },
    { day: 'Saturday',  enabled: true,  open: '10:00', close: '16:00' },
    { day: 'Sunday',    enabled: false, open: '09:00', close: '18:00' },
  ],
  specialDays: [
    { date: '2026-05-01', name: 'Labor Day', enabled: false },
    { date: '2026-05-09', name: 'Remembrance Day', enabled: false },
  ],
};
```

## Bottom Actions
- Cancel → discard changes
- Save changes (primary `#5749F4`)
