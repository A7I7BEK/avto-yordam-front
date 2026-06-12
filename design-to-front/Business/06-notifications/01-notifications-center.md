# Page Prompt: Notifications Center

> **Design Node ID**: `ev4GH`
> **Page Name**: Notifications Center — "50 — Notifications Center"
> **Route**: `/business/notifications`
> **View File**: `src/views/business/Notifications.vue`
> **Uses Layout**: `AppShell.vue`

---

## 1. Overview

The Notifications Center aggregates all business notifications in one place. It has category tabs (All, Unread with count badge, Bookings, Invitations, Reviews, Payments), time-grouped sections (Today, Yesterday), and each notification card shows an icon, title, description, timestamp, and a delete button. Header has "Mark all as read" and "Preferences" actions.

---

## 2. Page Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ Notifications  [3 new]           [Mark all read]  [Preferences]  │
│ Everything happening across your work, in one place.              │
├──────────────────────────────────────────────────────────────────┤
│ [All]  [Unread 3]  [Bookings]  [Invitations]  [Reviews]  [Payments]│
├──────────────────────────────────────────────────────────────────┤
│ TODAY                                                             │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ [🕐] New booking #BK-1247                       2 min ago   │ │ ← unread (purple border)
│ │     Brake pads exchange — Aziz Karimov              [🗑]    │ │
│ ├──────────────────────────────────────────────────────────────┤ │
│ │ [💬] New 5-star review received                  10 min ago  │ │ ← unread
│ │     Aziz Karimov rated your brake pad service       [🗑]    │ │
│ ├──────────────────────────────────────────────────────────────┤ │
│ │ [💰] Payment received PM-8472913                1 hour ago  │ │
│ │     850 000 UZS via PayMe — Order #BK-1247         [🗑]    │ │
│ └──────────────────────────────────────────────────────────────┘ │
│ YESTERDAY                                                         │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ [📅] Booking completed #BK-1244                 Yesterday   │ │
│ │     Oil change — Nodir Ergashev                      [🗑]    │ │
│ ├──────────────────────────────────────────────────────────────┤ │
│ │ [👥] Employee document reminder                  Yesterday   │ │
│ │     Bekzod R. license expires in 7 days              [🗑]    │ │
│ └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Header

### Title Row (space-between)

**Left** (vertical, gap 4px):
- "Notifications" — Inter 24px 700, `#2A2933`, with "3 new" purple badge (radius 999, `#5749F4`, white Inter 11px 600, padding 2px 10px, gap 10px)
- "Everything happening across your work, in one place." — Inter 13px normal, `#616167`

**Right** (horizontal, gap 8px):
- "Mark all as read": pill, white bg, border `#C5C5CB`, padding 8px 14px, `check-check` icon 14px + text Inter 12px 500, gap 6px
- "Preferences": pill, white bg, border `#C5C5CB`, padding 8px 14px, `settings` icon 14px + text Inter 12px 500, gap 6px

---

## 4. Category Tabs

Horizontal row, gap 8px. Pills:

| Tab | Active Bg/Text | Inactive Bg/Text | Badge |
|-----|---------------|------------------|-------|
| **All** | `#5749F4` / white 600 | white / `#2A2933` 500, border `#C5C5CB` | — |
| Unread | white / `#2A2933` 500 | same | "3" purple pill |
| Bookings | white / `#2A2933` 500 | same | — |
| Invitations | white / `#2A2933` 500 | same | — |
| Reviews | white / `#2A2933` 500 | same | — |
| Payments | white / `#2A2933` 500 | same | — |

Pill styles: radius 999, padding 6px 14px, gap 6px, Inter 12px.

---

## 5. Notification List

### 5.1 Time Group Headers

"Today" / "Yesterday" — Inter 11px 600, `#616167`, letter-spacing 0.5px

### 5.2 Notification Card

Card: radius 24px, white bg, padding 14px, gap 12px horizontal.

**Unread**: purple border (`#5749F4`, 1px). **Read**: no border or default.

**Structure** (horizontal, gap 12px):
- **Icon circle** (left): 36×36px, radius 999, centered icon 16px
  - Bookings: `calendar` icon, `#FFD9B2` bg, `#B45309` icon
  - Reviews: `star` icon, `#C9D6F0` bg, `#5749F4` icon
  - Payments: `arrow-down-left` icon, `#E8FAF0` bg, `#25603A` icon
  - Employee: `user-round` icon, `#FFF0E9` bg, `#A05A00` icon
- **Text** (flex:1, vertical, gap 2px):
  - Title: Inter 13px 600, `#2A2933`
  - Description: Inter 12px normal, `#616167`
- **Time** (right, column, align-end, gap 4px):
  - Timestamp: Inter 11px normal, `#616167`
- **Delete button**: 32×32px circle, `#F5F5F5` bg, border `#C5C5CB`, `trash-2` icon 14px `#CC3314`. Opens delete confirmation dialog.

### 5.3 Data

```typescript
// src/data/notifications.ts
export const notifications = [
  { id: 'n1', icon: 'calendar', iconBg: '#FFD9B2', iconColor: '#B45309', title: 'New booking #BK-1247', desc: 'Brake pads exchange — Aziz Karimov', time: '2 min ago', timeGroup: 'Today', category: 'Bookings', unread: true },
  { id: 'n2', icon: 'star', iconBg: '#C9D6F0', iconColor: '#5749F4', title: 'New 5-star review received', desc: 'Aziz Karimov rated your brake pad service', time: '10 min ago', timeGroup: 'Today', category: 'Reviews', unread: true },
  { id: 'n3', icon: 'arrow-down-left', iconBg: '#E8FAF0', iconColor: '#25603A', title: 'Payment received PM-8472913', desc: '850 000 UZS via PayMe — Order #BK-1247', time: '1 hour ago', timeGroup: 'Today', category: 'Payments', unread: true },
  { id: 'n4', icon: 'calendar', iconBg: '#F5F5F5', iconColor: '#616167', title: 'Booking completed #BK-1244', desc: 'Oil change — Nodir Ergashev', time: 'Yesterday', timeGroup: 'Yesterday', category: 'Bookings', unread: false },
  { id: 'n5', icon: 'user-round', iconBg: '#FFF0E9', iconColor: '#A05A00', title: 'Employee document reminder', desc: 'Bekzod R. license expires in 7 days', time: 'Yesterday', timeGroup: 'Yesterday', category: 'Bookings', unread: false },
];
```

---

## 6. Component Tree

```
Notifications.vue
├── HeaderRow.vue                  ← Title + "3 new" + actions
├── CategoryTabs.vue               ← All, Unread, Bookings, etc.
└── NotificationList.vue           ← Grouped list
    ├── TimeGroup.vue ×2           ← "Today" / "Yesterday"
    │   └── NotificationCard.vue ×N
    │       ├── NotificationIcon.vue
    │       ├── NotificationText.vue
    │       └── DeleteButton.vue    ← Opens delete confirmation
    └── NotificationDetailModal.vue ← (from 02)
```

---

## 7. Navigation

- Click notification → opens Notification Detail Modal (JG0wo, see `02-notification-detail-modal.md`)
- Click delete → opens Delete Confirmation dialog (gRz6e, see `03-delete-confirmation.md`)
- Header "Preferences" → `/business/settings/notifications`
- Notifications bell in header syncs with this page's unread count


**Screenshot**: `01-notifications-center.png`
