# Page Prompt: Business Overview Dashboard (Owner/Admin)

> **Design Node ID**: `jP78Z`
> **Page Name**: Business Overview Dashboard — "20 — Business Overview Dashboard"
> **Route**: `/business/dashboard/overview`
> **View File**: `src/views/business/DashboardOverview.vue`
> **Uses Layout**: `AppShell.vue` (with Business sidebar + header from `01-layouts-components`)

---

## 1. Overview

The Business Overview Dashboard is the main dashboard for owners and admins. It provides a high-level overview of the entire business: KPIs with trend indicators, a recent orders table, an earnings chart, top employees ranking, and service breakdown. This is one of **3 dashboard variants**.

---

## 2. Page Layout (Inside AppShell Content Area)

```
┌──────────────────────────────────────────────────────────────┐
│ Body padding: 20px 32px                                      │
├──────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ 📋 +12%  │ │ 📈 +8%   │ │ 👥       │ │ 🕐 3 urg │ │ 💰        │ │ ✓         │ │ ← KPI Row
│ │Today's   │ │Monthly   │ │Active    │ │Pending   │ │Avg Order  │ │Completion │ │   6 cards
│ │Bookings  │ │Revenue   │ │Employees │ │Orders    │ │Value      │ │Rate       │ │
│ │   24     │ │48.2M UZS │ │   14     │ │    7     │ │385K UZS   │ │   91%     │ │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
├──────────────────────────────────────┬───────────────────────────────────────┤
│ Recent Orders                       │ Earnings                               │
│ ORDER  CUSTOMER  SERVICE  EMPL  AMT │ 48 200 000 UZS  [+8% vs last month]   │
│ #BK-.. Aziz K.   Brakes   Bekz 350K│ ▓▓ ▓▓▓ ▓▓ ▓▓▓▓ ▓▓▓ ▓▓▓▓ ▓▓▓▓▓       │ ← Bar chart
│ #BK-.. Bekzod R. Diag..   Jasur180K│ ───────────────────────────────────── │
│ #BK-.. Madina T. Brakes.. Aziz 850K│ Total transactions: 184  Avg: 262K UZS│
│ #BK-.. Nodir E.  Oil ch.. Aziz 220K│                                        │
├──────────────────────────────────────┼───────────────────────────────────────┤
│ Top Employees                       │ Service Breakdown                      │
│ AK Aziz Karimov   18 ord·6.2M ⭐4.9 │ Engine repair   ▓▓▓▓▓▓▓▓▓▓▓▓▓ 48     │
│ BR Bekzod Rakhimov 15 ord·4.8M⭐4.7 │ Brake pads      ▓▓▓▓▓▓▓▓▓▓    32     │
│ JT Jasur Tursunov 12 ord·3.9M ⭐4.6 │ Diagnostics     ▓▓▓▓▓▓▓▓      28     │
│                                     │ Oil change      ▓▓▓▓▓          17     │
└──────────────────────────────────────┴───────────────────────────────────────┘
```

---

## 3. Content Area Container

```css
.dashboard-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 32px;
  overflow-y: auto;
  flex: 1;
}
```

**Note**: This dashboard does NOT have a breadcrumb or page title. The KPI row starts immediately.

---

## 4. KPI Row — 6 Cards

Horizontal row, gap 12px, each card flex:1.

### KPI Card Structure

Each card has 3 sections stacked vertically (gap 8px):

```
┌─────────────────────────────┐
│ [icon-36×36]      [+12% 📈] │ ← Icon row (space-between)
│ Today's Bookings            │ ← Label
│ 24                          │ ← Value
└─────────────────────────────┘
```

**Container**:
```css
.kpi-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 24px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
}
```

**Icon**: 36×36px, border-radius 12px, centered. Icon itself: 18px from Lucide.

**Trend badge**: Inter 11px 600, with `trending-up` icon 12px. Shown for cards 1 and 2.

**Label**: Inter 11px 500, `#616167`.

**Value**: Inter 26px 700, `#2A2933`.

### KPI Data

| # | Icon (Lucide) | Icon Bg | Trend | Label | Value |
|---|--------------|---------|-------|-------|-------|
| 1 | `clipboard-list` | `#EEF0FF` | `+12%` trending-up `#003300` | Today's Bookings | **24** |
| 2 | `trending-up` | `#E8FAF0` | `+8%` trending-up `#003300` | Monthly Revenue | **48.2M UZS** |
| 3 | `users` | `#FFF0E9` | *(none)* | Active Employees | **14** |
| 4 | `clock` | `#FFF8E5` | `3 urgent` text `#4D2700` | Pending Orders | **7** |
| 5 | `banknote` | `#F3E8FF` | *(none)* | Avg Order Value | **385K UZS** |
| 6 | `circle-check` | `#E8F0FF` | *(none)* | Completion Rate | **91%** |

### KPI Icon Colors

| Card | Icon Color | Icon Background |
|------|-----------|----------------|
| Today's Bookings | `#5749F4` | `#EEF0FF` |
| Monthly Revenue | `#25603A` | `#E8FAF0` |
| Active Employees | `#A05A00` | `#FFF0E9` |
| Pending Orders | `#B45309` | `#FFF8E5` |
| Avg Order Value | `#7C3AED` | `#F3E8FF` |
| Completion Rate | `#1E40AF` | `#E8F0FF` |

---

## 5. Recent Orders Card (Middle Row, Left)

Height: 350px. Contains a mini data table.

### Card Container

```css
.orders-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border-radius: 24px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
  height: 350px;
}
```

### Card Header

```
Recent Orders                              View all →
```

- Title: Inter 15px 600, `#2A2933`
- "View all →": Inter 12px 500, `#5749F4`, with `arrow-right` icon 14px. This links to `/business/orders`.

### Table Header Row

```
ORDER       CUSTOMER      SERVICE      EMPLOYEE     AMOUNT    STATUS
```

| Column | Width | Font |
|--------|-------|------|
| ORDER | 90px | Inter 10px 600, `#616167` |
| CUSTOMER | 120px | Inter 10px 600, `#616167` |
| SERVICE | 100px | Inter 10px 600, `#616167` |
| EMPLOYEE | 100px | Inter 10px 600, `#616167` |
| AMOUNT | 80px | Inter 10px 600, `#616167` |
| STATUS | 70px | Inter 10px 600, `#616167` |

Bottom border: 1px `#C5C5CB`.

### Table Data Rows (×4)

Each row: `padding: 10px 0`, bottom border 1px `#C5C5CB` (except last row).

| # | Order ID | Customer | Service | Employee | Amount | Status |
|---|----------|----------|---------|----------|--------|--------|
| 1 | #BK-1247 | Aziz Karimov | Brake pads | Bekzod R. | 350K UZS | **Active** |
| 2 | #BK-1246 | Bekzod Rakhimov | Diagnostics | Jasur T. | 180K UZS | **Pending** |
| 3 | #BK-1245 | Madina Tursunova | Brakes + Oil | Aziz K. | 850K UZS | **Done** |
| 4 | #BK-1244 | Nodir Ergashev | Oil change | Aziz K. | 220K UZS | **Done** |

**Order ID**: Inter 12px 500, `#2A2933`
**Customer**: Avatar (24×24, `#D9D9DB`, initials) + name (Inter 12px normal, `#2A2933`), gap 6px
**Service/Employee**: Inter 12px normal, `#2A2933`
**Amount**: Inter 12px 500, `#2A2933`

**Status Pills**:

| Status | Background | Text Color | Text |
|--------|-----------|-----------|------|
| Active | `#C9D6F0` | `#001133` | Active |
| Pending | `#FFD9B2` | `#4D2700` | Pending |
| Done | `#EEF8F0` | `#25603A` | Done |

Status pill: border-radius 999px, padding 4px 10px, Inter 10px 600.

### Mock Data

```typescript
// src/data/dashboardOverview.ts
export const recentOrders = [
  { id: '#BK-1247', customerName: 'Aziz Karimov', customerInitials: 'AK', service: 'Brake pads', employeeName: 'Bekzod R.', amount: '350K UZS', status: 'active' },
  { id: '#BK-1246', customerName: 'Bekzod Rakhimov', customerInitials: 'BR', service: 'Diagnostics', employeeName: 'Jasur T.', amount: '180K UZS', status: 'pending' },
  { id: '#BK-1245', customerName: 'Madina Tursunova', customerInitials: 'MT', service: 'Brakes + Oil', employeeName: 'Aziz K.', amount: '850K UZS', status: 'done' },
  { id: '#BK-1244', customerName: 'Nodir Ergashev', customerInitials: 'NE', service: 'Oil change', employeeName: 'Aziz K.', amount: '220K UZS', status: 'done' },
];
```

---

## 6. Earnings Card (Middle Row, Right)

Height: 350px. Contains a mini bar chart and stats.

### Card Container

```css
.earnings-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border-radius: 24px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
  height: 350px;
}
```

### Card Header

```
Earnings                         [This month ▾]
```

- Title: Inter 15px 600, `#2A2933`
- Period selector: pill, radius 999, `#F5F5F5` bg, border 1px `#C5C5CB`, padding 5px 10px, Inter 11px normal + `chevron-down` 12px

### Earnings Amount

```
48 200 000 UZS
[+8%] vs last month
```

- Big number: Inter 26px 700, `#2A2933`
- Trend badge: `#E8FAF0` bg, `#25603A` text, "+8%", radius 999, padding 3px 8px
- "vs last month": Inter 11px normal, `#616167`
- Row gap: 6px

### Bar Chart

7 vertical bars, gap 8px, container height 95px, centered vertically.

Each bar column:
- Bar fill: `#5749F4` (primary), corner radius 4px (top)
- Day label below: Inter 10px normal, `#616167`, e.g. "Mon", "Tue", etc.
- Gap between bar and label: 4px

Bars should have different heights to simulate varying daily earnings. Mock bar heights (as percentage of max):

| Mon | Tue | Wed | Thu | Fri | Sat | Sun |
|-----|-----|-----|-----|-----|-----|-----|
| 60% | 80% | 55% | 90% | 70% | 100% | 45% |

### Bottom Stats Row

Divider line (1px `#C5C5CB`) then two stats:

| Left | Right |
|------|-------|
| Total transactions | Avg per order |
| **184** | **262K UZS** |

- Label: Inter 10px normal, `#616167`
- Value: Inter 18px 700, `#2A2933`

### Mock Data

```typescript
export const earnings = {
  totalAmount: 48200000,
  currency: 'UZS',
  trendPercent: 8,
  chartData: [
    { day: 'Mon', value: 60 },
    { day: 'Tue', value: 80 },
    { day: 'Wed', value: 55 },
    { day: 'Thu', value: 90 },
    { day: 'Fri', value: 70 },
    { day: 'Sat', value: 100 },
    { day: 'Sun', value: 45 },
  ],
  totalTransactions: 184,
  avgPerOrder: 262000,
};
```

---

## 7. Top Employees Card (Bottom Row, Left)

Height: 250px.

### Card Container

```css
.employees-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  border-radius: 24px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
  height: 250px;
}
```

### Card Header

```
Top Employees                    This week
```

- Title: Inter 15px 600, `#2A2933`
- Period: Inter 11px normal, `#616167`

### Employee Row (×3)

Each row: gap 10px, padding 10px 0, bottom border 1px `#C5C5CB` (except last).

```
[AK]  Aziz Karimov               [⭐ 4.9]
      18 orders · 6.2M UZS
```

- **Avatar**: 32×32px circle, `#D9D9DB` bg, initials Inter 14px 500 `#2A2933`
- **Name**: Inter 13px 500, `#2A2933`
- **Stats**: Inter 11px normal, `#616167` — "{N} orders · {M}M UZS"
- **Rating badge**: pill, `#EEF8F0` bg, `#25603A` text, Inter 11px 600, padding 4px 10px, radius 999. Content: "⭐ {rating}"

### Mock Data

```typescript
export const topEmployees = [
  { initials: 'AK', name: 'Aziz Karimov', orders: 18, revenue: '6.2M UZS', rating: 4.9 },
  { initials: 'BR', name: 'Bekzod Rakhimov', orders: 15, revenue: '4.8M UZS', rating: 4.7 },
  { initials: 'JT', name: 'Jasur Tursunov', orders: 12, revenue: '3.9M UZS', rating: 4.6 },
];
```

---

## 8. Service Breakdown Card (Bottom Row, Right)

Height: 250px.

### Card Container

```css
.services-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px;
  border-radius: 24px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
  height: 250px;
}
```

### Card Header

```
Service Breakdown                  [125 total]
```

- Title: Inter 15px 600, `#2A2933`
- Total badge: pill, `#EEF0FF` bg, `#5749F4` text, Inter 11px 600, padding 4px 10px, radius 999

### Service Row (×4)

Each row: gap 5px vertical.

```
Engine repair           48
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     ← progress bar
```

- **Label row** (space-between):
  - Service name: Inter 12px 500, `#2A2933`
  - Count: Inter 12px 600, `#2A2933`
- **Progress bar background**: 6px height, radius 3px, `#F5F5F5`, full width
- **Progress bar fill**: 6px height, radius 3px, `#5749F4`, width proportional to value

Row gap: 12px between services.

### Mock Data

```typescript
export const serviceBreakdown = [
  { name: 'Engine repair', count: 48, maxCount: 48 },
  { name: 'Brake pads', count: 32, maxCount: 48 },
  { name: 'Diagnostics', count: 28, maxCount: 48 },
  { name: 'Oil change', count: 17, maxCount: 48 },
];
```

---

## 9. Middle and Bottom Row Layouts

```css
.middle-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  height: 250px;
}
```

---

## 10. Component Tree

```
DashboardOverview.vue
├── KpiRow.vue                     ← 6 KPI cards
│   └── KpiCard.vue ×6            ← Individual KPI with icon + trend
├── MiddleRow.vue
│   ├── RecentOrdersCard.vue       ← Orders mini-table
│   │   ├── CardHeader.vue         ← Title + "View all" link
│   │   └── OrderRow.vue ×4       ← Individual order row
│   └── EarningsCard.vue           ← Earnings chart
│       ├── PeriodSelector.vue     ← "This month" dropdown
│       ├── BarChart.vue           ← 7-bar chart
│       └── EarningsStats.vue      ← Bottom stats (total, avg)
├── BottomRow.vue
│   ├── TopEmployeesCard.vue       ← Employee ranking
│   │   └── EmployeeRow.vue ×3    ← Individual employee
│   └── ServiceBreakdownCard.vue   ← Service progress bars
│       └── ServiceBar.vue ×4     ← Individual service bar
```

---

## 11. Vue Component Outline

### File: `src/views/business/DashboardOverview.vue`

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getOverviewDashboard } from '@/services/dashboardService';
import KpiRow from '@/components/dashboard/KpiRow.vue';
import RecentOrdersCard from '@/components/dashboard/RecentOrdersCard.vue';
import EarningsCard from '@/components/dashboard/EarningsCard.vue';
import TopEmployeesCard from '@/components/dashboard/TopEmployeesCard.vue';
import ServiceBreakdownCard from '@/components/dashboard/ServiceBreakdownCard.vue';

const data = ref<any>(null);
const isLoading = ref(true);

onMounted(async () => {
  data.value = await getOverviewDashboard();
  isLoading.value = false;
});
</script>

<template>
  <div class="dashboard-body">
    <KpiRow :items="data?.kpi" />
    <div class="middle-row">
      <RecentOrdersCard :orders="data?.recentOrders" />
      <EarningsCard :earnings="data?.earnings" />
    </div>
    <div class="bottom-row">
      <TopEmployeesCard :employees="data?.topEmployees" />
      <ServiceBreakdownCard :services="data?.serviceBreakdown" />
    </div>
  </div>
</template>
```

---

## 12. Full Mock Data File

```typescript
// src/data/dashboardOverview.ts

export const kpiItems = [
  { icon: 'clipboard-list', iconBg: '#EEF0FF', iconColor: '#5749F4', trend: '+12%', trendColor: '#003300', label: "Today's Bookings", value: '24', valueNum: 24 },
  { icon: 'trending-up', iconBg: '#E8FAF0', iconColor: '#25603A', trend: '+8%', trendColor: '#003300', label: 'Monthly Revenue', value: '48.2M UZS', valueNum: 48200000 },
  { icon: 'users', iconBg: '#FFF0E9', iconColor: '#A05A00', trend: null, label: 'Active Employees', value: '14', valueNum: 14 },
  { icon: 'clock', iconBg: '#FFF8E5', iconColor: '#B45309', trend: '3 urgent', trendColor: '#4D2700', label: 'Pending Orders', value: '7', valueNum: 7 },
  { icon: 'banknote', iconBg: '#F3E8FF', iconColor: '#7C3AED', trend: null, label: 'Avg Order Value', value: '385K UZS', valueNum: 385000 },
  { icon: 'circle-check', iconBg: '#E8F0FF', iconColor: '#1E40AF', trend: null, label: 'Completion Rate', value: '91%', valueNum: 91 },
];

export const recentOrders = [
  { id: '#BK-1247', customerName: 'Aziz Karimov', customerInitials: 'AK', service: 'Brake pads', employeeName: 'Bekzod R.', amount: '350K UZS', status: 'active' as const },
  { id: '#BK-1246', customerName: 'Bekzod Rakhimov', customerInitials: 'BR', service: 'Diagnostics', employeeName: 'Jasur T.', amount: '180K UZS', status: 'pending' as const },
  { id: '#BK-1245', customerName: 'Madina Tursunova', customerInitials: 'MT', service: 'Brakes + Oil', employeeName: 'Aziz K.', amount: '850K UZS', status: 'done' as const },
  { id: '#BK-1244', customerName: 'Nodir Ergashev', customerInitials: 'NE', service: 'Oil change', employeeName: 'Aziz K.', amount: '220K UZS', status: 'done' as const },
];

export const earnings = {
  totalAmount: '48 200 000',
  currency: 'UZS',
  trendPercent: 8,
  chartBars: [
    { day: 'Mon', height: 60 },
    { day: 'Tue', height: 80 },
    { day: 'Wed', height: 55 },
    { day: 'Thu', height: 90 },
    { day: 'Fri', height: 70 },
    { day: 'Sat', height: 100 },
    { day: 'Sun', height: 45 },
  ],
  totalTransactions: 184,
  avgPerOrder: '262K UZS',
};

export const topEmployees = [
  { initials: 'AK', name: 'Aziz Karimov', orders: 18, revenue: '6.2M UZS', rating: 4.9 },
  { initials: 'BR', name: 'Bekzod Rakhimov', orders: 15, revenue: '4.8M UZS', rating: 4.7 },
  { initials: 'JT', name: 'Jasur Tursunov', orders: 12, revenue: '3.9M UZS', rating: 4.6 },
];

export const serviceBreakdown = [
  { name: 'Engine repair', count: 48 },
  { name: 'Brake pads', count: 32 },
  { name: 'Diagnostics', count: 28 },
  { name: 'Oil change', count: 17 },
];
```

---

## 13. Navigation Connection

- "View all →" in Recent Orders links to `/business/orders`
- Clicking an order row navigates to `/business/orders/{id}`
- Clicking an employee row navigates to `/business/team/employees/{id}`
- The KPI cards are display-only (no click action)
- Sidebar Dashboard item is **active** when on this page

---

## 14. Responsive Considerations

- KPI row: 6 cards on desktop (≥1280px), 3 per row on tablet (768-1279px), 2 per row on mobile (<768px)
- Middle and bottom rows: 2 columns on desktop, 1 column on tablet/mobile
- Table columns: reduce to ORDER + CUSTOMER + STATUS on mobile


**Screenshot**: `02-business-overview-dashboard.png`
