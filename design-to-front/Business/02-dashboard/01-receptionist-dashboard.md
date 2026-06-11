# Page Prompt: Receptionist Dashboard (Front Desk Overview)

> **Design Node ID**: `wrw72`
> **Page Name**: Receptionist Dashboard — "Front desk overview"
> **Route**: `/business/dashboard/receptionist` (or as first tab on `/business/dashboard`)
> **View File**: `src/views/business/DashboardReceptionist.vue`
> **Uses Layout**: `AppShell.vue` (with Business sidebar + header from `01-layouts-components`)

---

## 1. Overview

The Receptionist Dashboard is a real-time operational view designed for front-desk staff. It shows today's booking KPIs at a glance, an incoming bookings queue for quick accept/decline actions, and a schedule view organized by master. This is one of **3 dashboard variants** — the sidebar "Dashboard" menu should navigate to the appropriate variant based on user role.

---

## 2. Page Layout (Inside AppShell Content Area)

```
┌──────────────────────────────────────────────────────────────┐
│ Home > Dashboard                          ← Breadcrumb       │
│ Front desk overview                       ← Page Title       │
├──────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ │ Today's   │ │ Pending  │ │Confirmed │ │ Walk-ins │        │ ← KPI Row (4 cards)
│ │ bookings  │ │    7     │ │today  13 │ │    2     │        │
│ │   22      │ │          │ │          │ │          │        │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
├────────────────────────────┬─────────────────────────────────┤
│ Incoming bookings queue    │ Today's schedule by master      │
│ ┌────────────────────────┐ │ ┌────────────────────────────┐  │
│ │ Queue Item 1            │ │ │ Master 1 — 5 bookings     │  │
│ │ Customer, service, time │ │ │ 09:00 Oil change          │  │
│ │ [Accept] [Decline]     │ │ │ 10:30 Brake pads          │  │
│ ├────────────────────────┤ │ │ 14:00 Diagnostics         │  │
│ │ Queue Item 2            │ │ └────────────────────────────┘  │
│ │ ...                    │ │ ┌────────────────────────────┐  │
│ ├────────────────────────┤ │ │ Master 2 — 3 bookings     │  │
│ │ Queue Item 3            │ │ │ ...                       │  │
│ │ ...                    │ │ └────────────────────────────┘  │
│ └────────────────────────┘ │ ┌────────────────────────────┐  │
│                             │ │ Master 3 — 4 bookings     │  │
│                             │ │ ...                       │  │
│                             │ └────────────────────────────┘  │
└────────────────────────────┴─────────────────────────────────┘
```

---

## 3. Breadcrumb

```
Home > Dashboard
```

- "Home" — Inter 13px normal, `#616167`, no link (static)
- Chevron-right icon 12px, `#616167`
- "Dashboard" — Inter 13px weight 500, `#2A2933`, current page

Space between items: 6px.

---

## 4. Page Title

| Property | Value |
|----------|-------|
| Text | "Front desk overview" |
| Font | Inter, 22px, weight 600, color `#2A2933` |
| Margin-bottom | 18px (gap with KPI row) |

---

## 5. KPI Row — 4 Stat Cards

Horizontal row, gap 14px, equal width (`flex: 1`).

### Card Structure (shared for all 4)

```css
.kpi-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  border-radius: 24px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
}

.kpi-card__label {
  font: Inter 12px 500;
  color: #616167;
}

.kpi-card__value {
  font: Inter 24px 600;
  color: #2A2933;
}
```

### Card Data

| # | Label | Value | Icon (optional) |
|---|-------|-------|-----------------|
| 1 | Today's bookings | **22** | — |
| 2 | Pending | **7** | — |
| 3 | Confirmed today | **13** | — |
| 4 | Walk-ins | **2** | — |

---

## 6. Incoming Bookings Queue (Left Column)

A card containing a list of pending booking requests.

### Card Container

```css
.queue-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border-radius: 24px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
}
```

### Card Header

```
Incoming bookings queue                    [7 pending]  ← badge
```

- Title: Inter 14px 600, `#2A2933`
- Badge: pill shape, radius 999, `#FFD9B2` background, `#4D2700` text, Inter 10px 700, padding 8px 12px

### Queue Item (×3)

Each queue item is a card-inside-the-card:

```css
.queue-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 24px;
  background: #F5F5F5;
  border: 1px solid #C5C5CB;
}
```

**Queue Item Top Row** (space-between):
| Left | Right |
|------|-------|
| Customer name + avatar | Time badge (e.g. "Today · 09:15") |
- Customer name: Inter 13px 600, `#2A2933`
- Avatar: 24×24 circle, `#D9D9DB`, initials text
- Time badge: Inter 11px normal, `#616167`

**Queue Item Details** (below top row):
- Service name: Inter 12px normal, `#2A2933`
- Vehicle info (optional): Inter 11px normal, `#616167`

**Queue Item Buttons** (horizontal, gap 6px):
- **Accept** button: primary filled, `#5749F4`, white text, radius 999, padding 6px 14px, Inter 12px 600
- **Decline** button: outline, white bg, border `#C5C5CB`, text `#2A2933`, radius 999, padding 6px 14px, Inter 12px 600

### Mock Data for Queue

```typescript
// src/data/dashboardReceptionist.ts
export const queueBookings = [
  {
    id: 'BK-1250',
    customerName: 'Alisher Usmanov',
    customerInitials: 'AU',
    service: 'Full diagnostics + oil change',
    vehicle: 'Chevrolet Malibu 2023',
    time: 'Today · 10:30',
    status: 'pending',
  },
  {
    id: 'BK-1249',
    customerName: 'Dilnoza Karimova',
    customerInitials: 'DK',
    service: 'Brake pad replacement',
    vehicle: 'Hyundai Sonata 2021',
    time: 'Today · 09:15',
    status: 'pending',
  },
  {
    id: 'BK-1248',
    customerName: 'Sherzod Toshmatov',
    customerInitials: 'ST',
    service: 'AC repair + filter',
    vehicle: 'Toyota Camry 2020',
    time: 'Today · 08:00',
    status: 'pending',
  },
];
```

---

## 7. Today's Schedule by Master (Right Column)

A card containing a list of masters and their scheduled bookings.

### Card Container

```css
.schedule-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border-radius: 24px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
}
```

### Card Header

```
Today's schedule by master
```

- Title: Inter 14px 600, `#2A2933`

### Master Row (×3)

Each master row:

```css
.master-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  border-radius: 24px;
  background: #F5F5F5;
}
```

**Master Header** (horizontal, gap 8px):
| Element | Details |
|---------|---------|
| Avatar | 28×28 circle, `#D9D9DB`, initials |
| Name | Inter 13px 600, `#2A2933` |
| Booking count badge | Pill, `#EEF0FF` bg, `#5749F4` text, Inter 11px 600, e.g. "5 bookings" |

**Master Booking List** (vertical, gap 4px):
Each booking:
```
09:00    Oil change — Malibu        ● Confirmed
```
- Time: Inter 11px 600, `#2A2933`, width ~50px
- Service + vehicle: Inter 11px normal, `#616167`
- Status dot + text: small colored dot + Inter 11px, status-based color

### Mock Data for Schedule

```typescript
export const masterSchedules = [
  {
    masterName: 'Aziz Karimov',
    masterInitials: 'AK',
    bookingCount: 5,
    bookings: [
      { time: '09:00', service: 'Oil change', vehicle: 'Malibu', status: 'confirmed' },
      { time: '10:30', service: 'Brake pads', vehicle: 'Sonata', status: 'in-progress' },
      { time: '14:00', service: 'Diagnostics', vehicle: 'Spark', status: 'confirmed' },
      { time: '15:30', service: 'Suspension', vehicle: 'Tracker', status: 'pending' },
      { time: '17:00', service: 'Tire rotation', vehicle: 'Cobalt', status: 'confirmed' },
    ],
  },
  {
    masterName: 'Bekzod Rakhimov',
    masterInitials: 'BR',
    bookingCount: 3,
    bookings: [
      { time: '09:00', service: 'AC repair', vehicle: 'Camry', status: 'confirmed' },
      { time: '12:00', service: 'Engine check', vehicle: 'Malibu', status: 'pending' },
      { time: '16:00', service: 'Oil change', vehicle: 'Nexia', status: 'confirmed' },
    ],
  },
  {
    masterName: 'Jasur Tursunov',
    masterInitials: 'JT',
    bookingCount: 4,
    bookings: [
      { time: '08:00', service: 'Diagnostics', vehicle: 'Spark', status: 'done' },
      { time: '11:00', service: 'Brake pads', vehicle: 'Lacetti', status: 'in-progress' },
      { time: '13:00', service: 'Filter change', vehicle: 'Tracker', status: 'confirmed' },
      { time: '15:00', service: 'Suspension', vehicle: 'Camry', status: 'pending' },
    ],
  },
];
```

### Status Color Map

| Status | Dot Color | Text Color |
|--------|----------|------------|
| `confirmed` | `#5749F4` (purple) | `#2A2933` |
| `in-progress` | `#B45309` (amber) | `#A05A00` |
| `done` | `#25603A` (green) | `#25603A` |
| `pending` | `#616167` (gray) | `#616167` |

---

## 8. Two-Column Layout

```css
.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
```

On smaller screens (max-width: 1024px), stack to single column.

---

## 9. Component Tree for This Page

```
DashboardReceptionist.vue
├── BreadcrumbBar.vue              ← Reusable breadcrumb (Home > Dashboard)
├── KpiCardRow.vue                 ← 4 KPI cards in a row
│   └── KpiCard.vue ×4            ← Individual stat card
├── BookingQueueCard.vue           ← Left column card
│   ├── QueueCardHeader.vue        ← Title + badge
│   └── QueueItem.vue ×3          ← Individual queue booking
└── MasterScheduleCard.vue         ← Right column card
    ├── ScheduleCardHeader.vue     ← Title
    └── MasterRow.vue ×3           ← Individual master schedule
        └── BookingSlot.vue ×N     ← Individual time slot
```

---

## 10. Mock Data Service Pattern

All mock data should be in a dedicated file. Use an environment flag to switch between mock and real API:

```typescript
// src/services/dashboardService.ts
import { isMockMode } from '@/config';
import { queueBookings, masterSchedules, kpiStats } from '@/data/dashboardReceptionist';
import { apiClient } from '@/api/client';

export async function getReceptionistDashboard() {
  if (isMockMode()) {
    return {
      kpi: kpiStats,
      queue: queueBookings,
      schedules: masterSchedules,
    };
  }
  return apiClient.get('/business/dashboard/receptionist');
}
```

```typescript
// src/config/index.ts
export function isMockMode(): boolean {
  return import.meta.env.VITE_USE_MOCK === 'true';
}
```

### Mock KPI Data

```typescript
export const kpiStats = {
  todayBookings: 22,
  pending: 7,
  confirmedToday: 13,
  walkIns: 2,
};
```

---

## 11. Interactions & Events

| Element | Event | Action |
|---------|-------|--------|
| Accept button (queue) | `@click` | Emit `accept-booking` with booking ID. Show success toast. Remove item from queue. |
| Decline button (queue) | `@click` | Emit `decline-booking` with booking ID. Show confirmation? Animate item out. |
| Queue item card | `@click` | Navigate to `/business/orders/{id}` (booking detail) |
| Master row | `@click` | Navigate to `/business/schedules?master={id}` |
| Booking slot | `@click` | Navigate to `/business/orders/{id}` |

---

## 12. Navigation Connection

This page is accessed via the **Dashboard** nav item in the Business sidebar.

If the app supports multiple dashboard variants (receptionist, owner, command center), the sidebar Dashboard link should either:
- Go to `/business/dashboard` and auto-redirect based on user role, OR
- Show a submenu under Dashboard with "Front Desk", "Overview", "Command Center"

The role-based approach is simpler. In the Pinia store:

```typescript
// src/stores/businessApp.ts
function getDashboardRoute(userRole: string): string {
  switch (userRole) {
    case 'receptionist': return '/business/dashboard/receptionist';
    case 'owner':
    case 'admin': return '/business/dashboard/overview';
    default: return '/business/dashboard/command-center';
  }
}
```

---

## 13. Page-Specific Vue Component

### File: `src/views/business/DashboardReceptionist.vue`

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getReceptionistDashboard } from '@/services/dashboardService';
import type { QueueBooking, MasterSchedule } from '@/types/dashboard';

const kpi = ref({ todayBookings: 0, pending: 0, confirmedToday: 0, walkIns: 0 });
const queue = ref<QueueBooking[]>([]);
const schedules = ref<MasterSchedule[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  const data = await getReceptionistDashboard();
  kpi.value = data.kpi;
  queue.value = data.queue;
  schedules.value = data.schedules;
  isLoading.value = false;
});

function handleAccept(bookingId: string) { /* ... */ }
function handleDecline(bookingId: string) { /* ... */ }
</script>
```

---

## 14. TypeScript Types

```typescript
// src/types/dashboard.ts
export interface KpiStats {
  todayBookings: number;
  pending: number;
  confirmedToday: number;
  walkIns: number;
}

export interface QueueBooking {
  id: string;
  customerName: string;
  customerInitials: string;
  service: string;
  vehicle: string;
  time: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface BookingSlot {
  time: string;
  service: string;
  vehicle: string;
  status: 'confirmed' | 'in-progress' | 'done' | 'pending';
}

export interface MasterSchedule {
  masterName: string;
  masterInitials: string;
  bookingCount: number;
  bookings: BookingSlot[];
}

export interface ReceptionistDashboardData {
  kpi: KpiStats;
  queue: QueueBooking[];
  schedules: MasterSchedule[];
}
```
