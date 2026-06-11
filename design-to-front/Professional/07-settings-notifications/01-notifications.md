# Page Prompt: Professional Settings — Notifications

> **Design Node ID**: `CMfjo` | **Route**: `/professional/settings/notifications`
> **Shared Shell**: Sidebar (Settings active) + Header + Settings sub-nav

---

## 1. Overview

A notification preferences matrix where the professional toggles which channels (In-app, SMS, Telegram, Email) receive which event types. Uses a checkbox grid layout with event rows and channel columns.

---

## 2. Content Structure

```
┌──────────────────────────────────────────────────────────┐
│ Workspace > Settings > Notifications                     │
│                                                          │
│ ┌──────────┬─────────────────────────────────────────────┤
│ │PERSONAL  │                                             │
│ │          │  Notifications                              │
│ │👤Account │  Pick how you'd like to be reached          │
│ │          │  for each event.                            │
│ │🔔Notif.  │                                             │
│ │ (active) │  ┌────────────────────────────────────────┐ │
│ │          │  │ Event           │In-app│SMS│TG│Email │ │ │
│ │PREFERENCES│ │────────────────────────────────────────│ │
│ │          │  │ New order       │  ✓   │ ✓ │  │  ✓   │ │ │
│ │🎨Appear. │  │ received        │      │   │  │      │ │ │
│ │          │  │────────────────────────────────────────│ │ │
│ │🛡Privacy │  │ Order confirmed │  ✓   │   │  │  ✓   │ │ │
│ │          │  │────────────────────────────────────────│ │ │
│ │          │  │ Order cancelled │  ✓   │ ✓ │ ✓│  ✓   │ │ │
│ │          │  │────────────────────────────────────────│ │ │
│ │          │  │ Payment received│  ✓   │ ✓ │  │  ✓   │ │ │
│ │          │  │────────────────────────────────────────│ │ │
│ │          │  │ New review      │  ✓   │   │ ✓│  ✓   │ │ │
│ │          │  │────────────────────────────────────────│ │ │
│ │          │  │ Invitation      │  ✓   │ ✓ │ ✓│  ✓   │ │ │
│ │          │  │ received        │      │   │  │      │ │ │
│ │          │  │────────────────────────────────────────│ │ │
│ │          │  │ System updates  │  ✓   │   │  │      │ │ │
│ │          │  └────────────────────────────────────────┘ │ │
│ │          │                                             │ │
│ │          │         [Reset to defaults]  [Save changes] │ │
│ └──────────┴─────────────────────────────────────────────┤
└──────────────────────────────────────────────────────────┘
```

---

## 3. Shared Shell (from 00-settings-shell.md)

- Breadcrumb: `Workspace > Settings > Notifications` (3 segments)
- Sub-navigation: Account / **Notifications (active)** / Appearance & language / Privacy & data
- Notifications has purple filled checkbox icon `#5749F4` as its indicator, and `#F5F5F5` bg

### 3.1 Sub-navigation Enhancement

This page introduces section headers in the sub-nav:

```
PERSONAL
  👤 Account
  🔔 Notifications  ← active (#F5F5F5 bg)

PREFERENCES
  🎨 Appearance & language
  🛡 Privacy & data
```

"PERSONAL" and "PREFERENCES" are section labels: Inter 10px 600, `#616167`, letter-spacing 0.5, padding 12px 12px 4px.

---

## 4. Content Area

### 4.1 Page Header

- **Title**: "Notifications", Inter 22px 700, `#2A2933`
- **Subtitle**: "Pick how you'd like to be reached for each event.", Inter 13px, `#616167`, max-width 780px
- Gap: 4px

### 4.2 Notification Matrix Table

Full-width card with column headers and event rows.

#### Column Headers

`#F5F5F5` bg row, padding 14px 18px, border-bottom 1px `#C5C5CB`.

| Column | Width | Content |
|--------|-------|---------|
| Event | `flex:1` | "Event" Inter 11px 600, `#616167` |
| In-app | 84px | "In-app" centered |
| SMS | 84px | "SMS" centered |
| Telegram | 84px | "Telegram" centered |
| Email | 84px | "Email" centered |

All channel labels: Inter 11px 600, `#616167`.

#### Data Rows

Each row: padding 14px 18px, border-bottom 1px `#C5C5CB`, `display:flex; align-items:center;`.

**Event column** (flex:1, gap 2px):
- Event name: Inter 13px 500, `#2A2933`
- Description: Inter 11px, `#616167`

**Channel columns** (84px each, centered):
- Checked: 18×18px, rounded 4px, `#5749F4` fill, white `check` icon 10px inside
- Unchecked: 18×18px, rounded 4px, `#FFFFFF` fill, 1px `#C5C5CB` border, empty

#### Notification Events (7 rows)

| # | Event | Description | In-app | SMS | Telegram | Email |
|---|-------|-------------|--------|-----|----------|-------|
| 1 | New order received | A customer placed a new booking request | ✓ | ✓ | ○ | ✓ |
| 2 | Order confirmed | You or your team accepted a pending order | ✓ | ○ | ○ | ✓ |
| 3 | Order cancelled | A previously confirmed order was cancelled | ✓ | ✓ | ✓ | ✓ |
| 4 | Payment received | Funds have been credited for a completed job | ✓ | ✓ | ○ | ✓ |
| 5 | New review | A customer left a rating and feedback | ✓ | ○ | ✓ | ✓ |
| 6 | Invitation received | An organization invited you to join their team | ✓ | ✓ | ✓ | ✓ |
| 7 | System updates | Platform announcements and maintenance notices | ✓ | ○ | ○ | ○ |

### 4.3 Footer Buttons

`display:flex; gap:12px; justify-content:flex-end;`

- **Reset to defaults**: Outline ghost button, `#C5C5CB` border, `#2A2933` text
- **Save changes**: Primary purple button

---

## 5. Mock Data

```typescript
const notificationEvents = [
  {
    event: 'New order received',
    description: 'A customer placed a new booking request',
    channels: { inApp: true, sms: true, telegram: false, email: true },
  },
  {
    event: 'Order confirmed',
    description: 'You or your team accepted a pending order',
    channels: { inApp: true, sms: false, telegram: false, email: true },
  },
  {
    event: 'Order cancelled',
    description: 'A previously confirmed order was cancelled',
    channels: { inApp: true, sms: true, telegram: true, email: true },
  },
  {
    event: 'Payment received',
    description: 'Funds have been credited for a completed job',
    channels: { inApp: true, sms: true, telegram: false, email: true },
  },
  {
    event: 'New review',
    description: 'A customer left a rating and feedback',
    channels: { inApp: true, sms: false, telegram: true, email: true },
  },
  {
    event: 'Invitation received',
    description: 'An organization invited you to join their team',
    channels: { inApp: true, sms: true, telegram: true, email: true },
  },
  {
    event: 'System updates',
    description: 'Platform announcements and maintenance notices',
    channels: { inApp: true, sms: false, telegram: false, email: false },
  },
];
```

---

## 6. Vue Component

### File: `src/views/professional/settings/Notifications.vue`

### Icons (Lucide)
`Bell`, `Check`, `ChevronRight`

### Interactions

| Action | Behavior |
|--------|----------|
| Click checkbox | Toggle channel for that event |
| "Save changes" | Save to store / persist (mock: show toast) |
| "Reset to defaults" | Reset all checkboxes to default values |

---

## 7. Implementation Checklist

1. [ ] Create `src/views/professional/settings/Notifications.vue`
2. [ ] Reuse shared shell (sidebar, header, sub-nav)
3. [ ] Add section headers "PERSONAL" / "PREFERENCES" to sub-nav
4. [ ] Breadcrumb: Workspace > Settings > Notifications
5. [ ] Page header: title + subtitle
6. [ ] Matrix table: column headers row
7. [ ] 7 event rows with toggleable channel checkboxes
8. [ ] Checkbox styling: purple filled with check vs white outlined
9. [ ] Footer: Reset + Save buttons
10. [ ] Run `pnpm dlx ultracite fix`

**Screenshot**: `01-notifications.jpg`
