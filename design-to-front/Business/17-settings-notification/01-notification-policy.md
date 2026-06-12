# Page Prompt: Notification Policy

> **Design Node ID**: `bXUlf` | **Name**: "46 - Notification Policy"
> **Route**: `/business/settings/notifications` | **View File**: `src/views/business/SettingsNotifications.vue`

## Overview
Settings page to configure which notifications the business receives (push, SMS, email). Grouped by category with individual toggles. Part of Settings section. Breadcrumb: Settings > Notifications.

## Header
- Title: "Notification preferences" (Inter 24px 700)
- Subtitle: "Control which notifications you receive and how"
- Save button (primary, top-right)

## Notification Groups
Each group is a card (radius 24px, white bg, border) with a section title and toggle rows.

### Bookings
| Notification | Push | SMS | Email |
|-------------|------|-----|-------|
| New booking received | ✓ | ✓ | ✗ |
| Booking confirmed | ✓ | ✗ | ✗ |
| Booking cancelled | ✓ | ✓ | ✗ |
| Booking reminder (24h before) | ✓ | ✗ | ✓ |

### Payments
| Notification | Push | SMS | Email |
|-------------|------|-----|-------|
| Payment received | ✓ | ✗ | ✓ |
| Payment failed | ✓ | ✓ | ✗ |
| Payout processed | ✗ | ✗ | ✓ |

### Team
| Notification | Push | SMS | Email |
|-------------|------|-----|-------|
| Employee joined | ✓ | ✗ | ✓ |
| Employee left | ✓ | ✗ | ✓ |
| Document expiring | ✓ | ✓ | ✓ |

### Reviews
| Notification | Push | SMS | Email |
|-------------|------|-----|-------|
| New review received | ✓ | ✗ | ✓ |

### System
| Notification | Push | SMS | Email |
|-------------|------|-----|-------|
| Platform updates | ✗ | ✗ | ✓ |
| Account security alerts | ✓ | ✓ | ✓ |

## Toggle Columns
Three columns of toggle switches labeled Push, SMS, Email at the top of each group.

## Mock Data
```typescript
export const notificationSettings = {
  bookings: {
    newBooking: { push: true, sms: true, email: false },
    confirmed: { push: true, sms: false, email: false },
    cancelled: { push: true, sms: true, email: false },
    reminder: { push: true, sms: false, email: true },
  },
  payments: {
    received: { push: true, sms: false, email: true },
    failed: { push: true, sms: true, email: false },
    payout: { push: false, sms: false, email: true },
  },
  // ...etc
};
```

## Bottom Actions
- Cancel → discard changes
- Save changes (primary `#5749F4`)


**Screenshot**: `01-notification-policy.png`
