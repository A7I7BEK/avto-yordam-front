# Component Prompt: Notification Detail Modal

> **Design Node ID**: `JG0wo`
> **Page Name**: Notification Detail Modal — "54 — Notification Detail Modal"
> **Component File**: `src/components/notifications/NotificationDetailModal.vue`
> **Usage**: Opens from the Notifications Center when a notification card is clicked

---

## 1. Overview

The Notification Detail Modal shows full information about a selected notification. It appears centered over the dimmed notifications page. The modal displays the notification icon (large), title, full description, timestamp, and action buttons (e.g., "View order", "View review", "Dismiss").

---

## 2. Modal Structure

```
┌─────────────────────────────────────────┐
│                              [✕]        │ ← Close button
│         ┌──────────┐                    │
│         │   🕐 48px │                    │ ← Large icon circle
│         └──────────┘                    │
│                                         │
│    New booking #BK-1247                 │ ← Title
│    Brake pads exchange — Aziz Karimov   │ ← Description
│    Today · 2 min ago                    │ ← Timestamp
│                                         │
│    Full details about this booking      │ ← Extended info
│    are available on the order page.     │
│                                         │
│    ┌────────────────────────────┐       │
│    │        View order →        │       │ ← Primary action
│    └────────────────────────────┘       │
│    ┌────────────────────────────┐       │
│    │        Dismiss             │       │ ← Secondary action
│    └────────────────────────────┘       │
└─────────────────────────────────────────┘
```

---

## 3. Overlay

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
```

---

## 4. Modal Container

```css
.notification-detail-modal {
  width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 24px;
  border-radius: 24px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
  box-shadow: 0 20px 50px rgba(0,0,0,0.24);
  text-align: center;
}
```

---

## 5. Content

### 5.1 Close Button

Top-right: 32×32px circle, `#F5F5F5` bg, `x` icon 16px `#2A2933`. Positioned absolute or flex-end.

### 5.2 Large Icon

48×48px circle, radius 999. Icon 24px. Colors match notification type.

### 5.3 Title

Inter 18px 700, `#2A2933`

### 5.4 Description

Inter 14px normal, `#616167`, max-width 360px

### 5.5 Timestamp

Inter 12px normal, `#616167`

### 5.6 Extended Info

Inter 13px normal, `#616167`, centered

### 5.7 Action Buttons

Full-width buttons, radius 999, padding 12px, Inter 14px 600:

**Primary**: `#5749F4` bg, white text, e.g. "View order →"
**Secondary (Dismiss)**: white bg, border `#C5C5CB`, `#2A2933` text

Gap between buttons: 8px.

---

## 6. Component Interface

```typescript
defineProps<{
  notification: {
    id: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    title: string;
    desc: string;
    time: string;
    category: string;
    actionRoute?: string;
    actionLabel?: string;
    extendedInfo?: string;
  };
}>();

defineEmits<{ close: []; dismiss: [id: string] }>();
```

---

## 7. Actions by Category

| Category | Action Label | Route |
|----------|-------------|-------|
| Bookings | View order → | `/business/orders/{orderId}` |
| Reviews | View review → | `/business/reviews` |
| Payments | View transaction → | `/business/transactions/{txId}` |
| Invitations | View invitation → | `/business/invitations` |
| Employee | Review employee → | `/business/team/employees/{id}` |

"Dismiss" marks the notification as read and closes the modal.

---

## 8. Accessibility

- `role="dialog"`, `aria-modal="true"`
- Focus trap inside modal
- Close on Escape, close on overlay click
- Return focus to the notification card on close


**Screenshot**: `02-notification-detail-modal.png`
