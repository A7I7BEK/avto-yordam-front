# Page Prompt: Business Command Center Dashboard

> **Design Node ID**: `RkXnV`
> **Page Name**: Business Command Center — "21 — Business Command Center"
> **Route**: `/business/dashboard/command-center`
> **View File**: `src/views/business/DashboardCommandCenter.vue`
> **Uses Layout**: `AppShell.vue` (with Business sidebar + header from `01-layouts-components`)

---

## 1. Overview

The Business Command Center is an advanced dashboard for power users. It provides big-picture metrics (revenue, orders, employees, rating), order status breakdown, recent transactions with directional indicators, attention-requiring alerts, and a weekly performance summary. This is one of **3 dashboard variants**.

---

## 2. Page Layout (Inside AppShell Content Area)

```
┌──────────────────────────────────────────────────────────────┐
│ Body padding: 18px 28px                                      │
├──────────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐│
│ │ 📈            │ │ 📋           │ │ 👥           │ │ ⭐            ││ ← Big Stats Row
│ │ Total Revenue │ │ Total Orders │ │ Active Empl  │ │ Business Rtng││   4 cards
│ │  ₴48.2M      │ │    184       │ │ 14 (6 on job)│ │  4.7 ⭐      ││   120px tall
│ │  +12% vs…    │ │  +8% vs…     │ │              │ │ 156 reviews  ││
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘│
├──────────────────────────────────┬───────────────────────────────┤
│ Orders by Status                 │ Recent Transactions            │
│ ┌──────────┐ ┌──────────┐ ┌────┐│ ↙ Order #BK-1247  +350 000    │
│ │ Completed│ │ Active   │ │Inco││   Today · 09:15               │
│ │   102    │ │   45     │ │ 22 ││ ↙ Order #BK-1246  +180 000    │
│ └──────────┘ └──────────┘ └────┘│   Today · 08:30               │
│ ┌──────────┐ ┌──────────┐       │ ↗ Refund #BK-1240  -120 000  │
│ │ Pending  │ │Cancelled │       │   Yesterday · 16:20           │
│ │    7     │ │    8     │       │ ↙ Order #BK-1244  +220 000   │
│ └──────────┘ └──────────┘       │   Yesterday · 14:10           │
├──────────────────────────────────┼───────────────────────────────┤
│ ⚠️ Needs Attention               │ This Week          [+12% 📈]  │
│ ┌────────────────────────────┐   │ ┌──────────┐ ┌──────────┐    │
│ │ 🕐 3 orders expiring       │   │ │New orders│ │Completed │    │
│ │   BK-1246,1245,1243 need…  │   │ │   42     │ │   38     │    │
│ │                    Act now→│   │ │  +8% ↗   │ │  +15% ↗  │    │
│ ├────────────────────────────┤   │ └──────────┘ └──────────┘    │
│ │ ⚠ Employee doc expiring   │   │ ┌──────┐ ┌──────┐ ┌───────┐  │
│ │   Bekzod R. license in 7d │   │ │12.4M │ │18 min│ │ 94%   │  │
│ │                   Review →│   │ │Revenue│ │Resp. │ │Satisf.│  │
│ ├────────────────────────────┤   │ └──────┘ └──────┘ └───────┘  │
│ │ ⭐ New 5-star review       │   │                                │
│ │   From Aziz Karimov       │   │                                │
│ │                   View →  │   │                                │
│ └────────────────────────────┘   │                                │
└──────────────────────────────────┴───────────────────────────────┘
```

---

## 3. Content Area Container

```css
.command-center-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 28px;
  overflow-y: auto;
  flex: 1;
}
```

---

## 4. Big Stats Row — 4 Cards

Height: 120px. Horizontal row, gap 12px, cards equally sized.

### Big Stat Card Structure

```
┌─────────────────────────────────┐
│ Total Revenue              [📈] │ ← space-between
│ ₴48.2M                         │ ← big value
│ +12% vs last month              │ ← trend line (optional)
└─────────────────────────────────┘
```

**Container**:
```css
.big-stat-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px;
  border-radius: 24px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
  height: 120px;
  justify-content: space-between; /* or let content define */
}
```

**Top row** (space-between, align-items start):
- Label: Inter 11px 500, `#616167`
- Icon container: 44×44px, border-radius 14px, centered icon 22px

**Value**: Inter 24px 700, `#2A2933`

**Trend line**: Inter 11px normal, with optional colored arrow icon. Displayed only for Revenue and Orders.

### Big Stat Data

| # | Label | Value | Icon | Icon Bg | Icon Color | Trend |
|---|-------|-------|------|---------|------------|-------|
| 1 | Total Revenue | **₴48.2M** | `trending-up` | `#E8FAF0` | `#25603A` | +12% vs last month |
| 2 | Total Orders | **184** | `clipboard-list` | `#EEF0FF` | `#5749F4` | +8% vs last month |
| 3 | Active Employees | **14** | `users` | `#FFF0E9` | `#A05A00` | 6 currently on jobs |
| 4 | Business Rating | **4.7 ⭐** | `star` | `#FFF8E5` | `#B45309` | Based on 156 reviews |

### Mock Data

```typescript
// src/data/dashboardCommandCenter.ts
export const bigStats = [
  { label: 'Total Revenue', value: '₴48.2M', icon: 'trending-up', iconBg: '#E8FAF0', iconColor: '#25603A', trend: '+12% vs last month' },
  { label: 'Total Orders', value: '184', icon: 'clipboard-list', iconBg: '#EEF0FF', iconColor: '#5749F4', trend: '+8% vs last month' },
  { label: 'Active Employees', value: '14', icon: 'users', iconBg: '#FFF0E9', iconColor: '#A05A00', trend: '6 currently on jobs' },
  { label: 'Business Rating', value: '4.7 ⭐', icon: 'star', iconBg: '#FFF8E5', iconColor: '#B45309', trend: 'Based on 156 reviews' },
];
```

---

## 5. Orders by Status Card (Middle Row, Left)

Height: 320px.

### Card Container

```css
.orders-status-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border-radius: 24px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
  height: 320px;
}
```

### Card Header

```
Orders by Status                  [184 total]
```

- Title: Inter 15px 600, `#2A2933`
- Total badge: pill, `#F5F5F5` bg, border 1px `#C5C5CB`, `#616167` text, Inter 11px 600, padding 4px 10px, radius 999

### Status Cards Grid

Two rows of status cards inside:

**Row 1** (3 cards, gap 10px):
```
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Completed│ │ Active   │ │ Incoming │
│   102    │ │   45     │ │   22     │
│  +12% ↗  │ │  +8% ↗   │ │  +5% ↗   │
└──────────┘ └──────────┘ └──────────┘
```

**Row 2** (2 cards, gap 10px):
```
┌──────────┐ ┌──────────┐
│ Pending  │ │Cancelled │
│    7     │ │    8     │
│  -3% ↘   │ │  +1% ↗   │
└──────────┘ └──────────┘
```

### Status Card Mini

```css
.status-mini-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  border-radius: 14px;
}
```

| Status | Background | Border |
|--------|-----------|--------|
| Completed | `#A1E5A1` | none |
| Active | `#F5F5F5` | 1px `#C5C5CB` |
| Incoming | `#C9D6F0` | none |
| Pending | `#FFD9B2` | none |
| Cancelled | `#FFBFB2` | none |

**Status label**: Inter 11px 600, dark variant of bg color
**Count**: Inter 22px 700, `#2A2933`
**Trend**: Inter 10px 600, colored arrow icon 12px (trending-up green or trending-down red)

### Mock Data

```typescript
export const ordersByStatus = {
  total: 184,
  statuses: [
    { label: 'Completed', count: 102, trend: '+12%', trendUp: true, bg: '#A1E5A1', textColor: '#1A4D1A' },
    { label: 'Active', count: 45, trend: '+8%', trendUp: true, bg: '#F5F5F5', border: true, textColor: '#2A2933' },
    { label: 'Incoming', count: 22, trend: '+5%', trendUp: true, bg: '#C9D6F0', textColor: '#001133' },
    { label: 'Pending', count: 7, trend: '-3%', trendUp: false, bg: '#FFD9B2', textColor: '#4D2700' },
    { label: 'Cancelled', count: 8, trend: '+1%', trendUp: true, bg: '#FFBFB2', textColor: '#590F00' },
  ],
};
```

---

## 6. Recent Transactions Card (Middle Row, Right)

Height: 320px.

### Card Container

```css
.transactions-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border-radius: 24px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
  height: 320px;
}
```

### Card Header

```
Recent Transactions                    View all
```

- Title: Inter 15px 600, `#2A2933`
- "View all": Inter 12px 500, `#5749F4`, links to `/business/transactions`

### Transaction Row (×4)

Each row: gap 10px, padding 12px 0, bottom border 1px `#C5C5CB` (except last).

```
[↙ icon]  Order #BK-1247 payment         +350 000
           Today · 09:15
```

**Icon circle**: 36×36px, border-radius 10px, centered icon 16px

| Type | Icon (Lucide) | Icon Color | Background |
|------|--------------|------------|------------|
| Incoming payment | `arrow-down-left` | `#25603A` | `#E8FAF0` |
| Refund/outgoing | `arrow-up-right` | `#CC3314` | `#FDEBEC` |

**Transaction info** (flex column, gap 2px):
- Title: Inter 12px 500, `#2A2933`
- Time: Inter 10px normal, `#616167`

**Amount**:
- Positive: Inter 12px 600, `#25603A`, prefixed with "+"
- Negative: Inter 12px 600, `#CC3314`, prefixed with "-"

### Mock Data

```typescript
export const recentTransactions = [
  { type: 'incoming', title: 'Order #BK-1247 payment', time: 'Today · 09:15', amount: 350000 },
  { type: 'incoming', title: 'Order #BK-1246 payment', time: 'Today · 08:30', amount: 180000 },
  { type: 'outgoing', title: 'Refund #BK-1240', time: 'Yesterday · 16:20', amount: -120000 },
  { type: 'incoming', title: 'Order #BK-1244 payment', time: 'Yesterday · 14:10', amount: 220000 },
];

function formatAmount(amount: number): string {
  const prefix = amount >= 0 ? '+' : '';
  const absValue = Math.abs(amount);
  if (absValue >= 1000000) return `${prefix}${(absValue / 1000000).toFixed(1)}M`;
  if (absValue >= 1000) return `${prefix}${(absValue / 1000).toFixed(0)}K`;
  return `${prefix}${absValue}`;
}
// Results: "+350K", "+180K", "-120K", "+220K"

// For display in the component, you might want:
// "+350 000", "+180 000", "-120 000", "+220 000"
// Use toLocaleString or manual formatting
```

---

## 7. Needs Attention Card (Bottom Row, Left)

Height: 250px.

### Card Container

```css
.alerts-card {
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
⚠️ Needs Attention
```

- Title: Inter 15px 600, `#2A2933` (the ⚠️ is not in the design text — it's implied by the alert content)

### Alert Item (×3)

Each alert: horizontal row, gap 10px, padding 12px, border-radius 12px.

```
[icon 32×32]  Title text               Action →
              Description text
```

**Icon circle**: 32×32px, border-radius 999px, icon 16px, white icon on colored bg.

**Info** (flex column, gap 2px, flex: 1):
- Title: Inter 12px 600
- Description: Inter 11px normal

**Action link**: Inter 12px 600, right-aligned, colored to match alert.

### Alert Data

| # | Icon | Icon Bg | Title | Description | Action | Bg Color | Text/Icon Colors |
|---|------|---------|-------|-------------|--------|----------|-----------------|
| 1 | `clock` | `#B45309` | 3 orders expiring within 2 hours | BK-1246, BK-1245, BK-1243 need master assignment | **Act now →** | `#FFF6E9` | Title: `#4D2700`, Desc: `#A05A00`, Action: `#B45309` |
| 2 | `alert-triangle` | `#CC3314` | Employee document expiring | Bekzod R. — license expires in 7 days | **Review →** | `#FDEBEC` | Title: `#590F00`, Desc: `#CC3314`, Action: `#CC3314` |
| 3 | `star` | `#5749F4` | New 5-star review received | From Aziz Karimov — Brake pad replacement | **View →** | `#EEF0FF` | Title: `#2A2933`, Desc: `#616167`, Action: `#5749F4` |

### Mock Data

```typescript
export const alerts = [
  {
    icon: 'clock',
    iconBg: '#B45309',
    title: '3 orders expiring within 2 hours',
    description: 'BK-1246, BK-1245, BK-1243 need master assignment',
    actionLabel: 'Act now →',
    actionColor: '#B45309',
    bg: '#FFF6E9',
    titleColor: '#4D2700',
    descColor: '#A05A00',
  },
  {
    icon: 'alert-triangle',
    iconBg: '#CC3314',
    title: 'Employee document expiring',
    description: 'Bekzod R. — license expires in 7 days',
    actionLabel: 'Review →',
    actionColor: '#CC3314',
    bg: '#FDEBEC',
    titleColor: '#590F00',
    descColor: '#CC3314',
  },
  {
    icon: 'star',
    iconBg: '#5749F4',
    title: 'New 5-star review received',
    description: 'From Aziz Karimov — Brake pad replacement',
    actionLabel: 'View →',
    actionColor: '#5749F4',
    bg: '#EEF0FF',
    titleColor: '#2A2933',
    descColor: '#616167',
  },
];
```

---

## 8. Weekly Summary Card (Bottom Row, Right)

Height: 250px.

### Card Container

```css
.weekly-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border-radius: 24px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
  height: 250px;
  justify-content: space-between;
}
```

### Card Header

```
This Week                    [+12% 📈]
```

- Title: Inter 15px 600, `#2A2933`
- Badge: pill, `#E8FAF0` bg, gap 4px, padding 4px 10px, radius 999. `trending-up` icon 12px + "+12%" Inter 11px 600, both `#25603A`

### Main Stats (2 cards, gap 10px)

```
┌──────────────┐ ┌──────────────┐
│ New orders   │ │ Completed    │
│ 42           │ │ 38           │
│ +8% ↗        │ │ +15% ↗       │
└──────────────┘ └──────────────┘
```

Each sub-card:
```css
.weekly-stat-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-radius: 12px;
}
```

| Card | Label | Value | Trend | Bg |
|------|-------|-------|-------|----|
| New orders | New orders | **42** | +8% ↗ | `#EEF0FF` |
| Completed | Completed | **38** | +15% ↗ | `#E8FAF0` |

- Label: Inter 10px 500, `#616167`
- Value: Inter 20px 700, `#2A2933`
- Trend: Inter 11px 600, green for positive

### Bottom Stats (3 items, horizontal, gap 10px)

```
12.4M        18 min       94%
Revenue      Response     Satisfaction
```

Each stat (flex column, centered, gap 3px, flex: 1):
- Value: Inter 16px 700, `#2A2933` (or `#25603A` for positive)
- Label: Inter 10px normal, `#616167`

### Mock Data

```typescript
export const weeklySummary = {
  trendPercent: 12,
  newOrders: { count: 42, trend: '+8%', trendUp: true },
  completed: { count: 38, trend: '+15%', trendUp: true },
  bottomStats: [
    { value: '12.4M', label: 'Revenue', color: '#2A2933' },
    { value: '18 min', label: 'Response', color: '#2A2933' },
    { value: '94%', label: 'Satisfaction', color: '#25603A' },
  ],
};
```

---

## 9. Middle and Bottom Row Layouts

```css
.middle-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  height: 320px;
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
DashboardCommandCenter.vue
├── BigStatsRow.vue                ← 4 big stat cards
│   └── BigStatCard.vue ×4        ← Individual stat card with icon
├── MiddleRow.vue
│   ├── OrdersByStatusCard.vue     ← Order status breakdown
│   │   └── StatusMiniCard.vue ×5 ← Individual status chip
│   └── RecentTransactionsCard.vue ← Transaction feed
│       └── TransactionRow.vue ×4 ← Individual transaction
├── BottomRow.vue
│   ├── AlertsCard.vue             ← Needs attention alerts
│   │   └── AlertItem.vue ×3      ← Individual alert
│   └── WeeklySummaryCard.vue      ← Weekly KPI summary
│       ├── WeeklyStatCard.vue ×2  ← New orders / Completed
│       └── WeeklyBottomStat.vue ×3 ← Revenue / Response / Satisfaction
```

---

## 11. Vue Component Outline

### File: `src/views/business/DashboardCommandCenter.vue`

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getCommandCenterDashboard } from '@/services/dashboardService';
import BigStatsRow from '@/components/dashboard/BigStatsRow.vue';
import OrdersByStatusCard from '@/components/dashboard/OrdersByStatusCard.vue';
import RecentTransactionsCard from '@/components/dashboard/RecentTransactionsCard.vue';
import AlertsCard from '@/components/dashboard/AlertsCard.vue';
import WeeklySummaryCard from '@/components/dashboard/WeeklySummaryCard.vue';

const data = ref<any>(null);
const isLoading = ref(true);

onMounted(async () => {
  data.value = await getCommandCenterDashboard();
  isLoading.value = false;
});

function handleAlertAction(alertId: string) {
  // Navigate based on alert type
}
</script>

<template>
  <div class="command-center-body">
    <BigStatsRow :stats="data?.bigStats" />
    <div class="middle-row">
      <OrdersByStatusCard :data="data?.ordersByStatus" />
      <RecentTransactionsCard :transactions="data?.recentTransactions" />
    </div>
    <div class="bottom-row">
      <AlertsCard :alerts="data?.alerts" @action="handleAlertAction" />
      <WeeklySummaryCard :data="data?.weeklySummary" />
    </div>
  </div>
</template>
```

---

## 12. Full Mock Data File

```typescript
// src/data/dashboardCommandCenter.ts

export const bigStats = [
  { label: 'Total Revenue', value: '₴48.2M', icon: 'trending-up', iconBg: '#E8FAF0', iconColor: '#25603A', trend: '+12% vs last month' },
  { label: 'Total Orders', value: '184', icon: 'clipboard-list', iconBg: '#EEF0FF', iconColor: '#5749F4', trend: '+8% vs last month' },
  { label: 'Active Employees', value: '14', icon: 'users', iconBg: '#FFF0E9', iconColor: '#A05A00', trend: '6 currently on jobs' },
  { label: 'Business Rating', value: '4.7 ⭐', icon: 'star', iconBg: '#FFF8E5', iconColor: '#B45309', trend: 'Based on 156 reviews' },
];

export const ordersByStatus = {
  total: 184,
  statuses: [
    { label: 'Completed', count: 102, trend: '+12%', trendUp: true, bg: '#A1E5A1', textColor: '#1A4D1A' },
    { label: 'Active', count: 45, trend: '+8%', trendUp: true, bg: '#F5F5F5', border: true, textColor: '#2A2933' },
    { label: 'Incoming', count: 22, trend: '+5%', trendUp: true, bg: '#C9D6F0', textColor: '#001133' },
    { label: 'Pending', count: 7, trend: '-3%', trendUp: false, bg: '#FFD9B2', textColor: '#4D2700' },
    { label: 'Cancelled', count: 8, trend: '+1%', trendUp: true, bg: '#FFBFB2', textColor: '#590F00' },
  ],
};

export const recentTransactions = [
  { type: 'incoming' as const, title: 'Order #BK-1247 payment', time: 'Today · 09:15', amount: 350000 },
  { type: 'incoming' as const, title: 'Order #BK-1246 payment', time: 'Today · 08:30', amount: 180000 },
  { type: 'outgoing' as const, title: 'Refund #BK-1240', time: 'Yesterday · 16:20', amount: -120000 },
  { type: 'incoming' as const, title: 'Order #BK-1244 payment', time: 'Yesterday · 14:10', amount: 220000 },
];

export const alerts = [
  {
    id: 'orders-expiring',
    icon: 'clock',
    iconBg: '#B45309',
    title: '3 orders expiring within 2 hours',
    description: 'BK-1246, BK-1245, BK-1243 need master assignment',
    actionLabel: 'Act now →',
    actionColor: '#B45309',
    bg: '#FFF6E9',
    titleColor: '#4D2700',
    descColor: '#A05A00',
    actionRoute: '/business/orders?filter=expiring',
  },
  {
    id: 'doc-expiring',
    icon: 'alert-triangle',
    iconBg: '#CC3314',
    title: 'Employee document expiring',
    description: 'Bekzod R. — license expires in 7 days',
    actionLabel: 'Review →',
    actionColor: '#CC3314',
    bg: '#FDEBEC',
    titleColor: '#590F00',
    descColor: '#CC3314',
    actionRoute: '/business/team/employees/BR',
  },
  {
    id: 'new-review',
    icon: 'star',
    iconBg: '#5749F4',
    title: 'New 5-star review received',
    description: 'From Aziz Karimov — Brake pad replacement',
    actionLabel: 'View →',
    actionColor: '#5749F4',
    bg: '#EEF0FF',
    titleColor: '#2A2933',
    descColor: '#616167',
    actionRoute: '/business/reviews',
  },
];

export const weeklySummary = {
  trendPercent: 12,
  newOrders: { count: 42, trend: '+8%', trendUp: true },
  completed: { count: 38, trend: '+15%', trendUp: true },
  bottomStats: [
    { value: '12.4M', label: 'Revenue', color: '#2A2933' },
    { value: '18 min', label: 'Response', color: '#2A2933' },
    { value: '94%', label: 'Satisfaction', color: '#25603A' },
  ],
};
```

---

## 13. Navigation Connections

| Element | Target Route |
|---------|-------------|
| "View all" (transactions) | `/business/transactions` |
| Transaction row | `/business/transactions/{id}` |
| Alert: orders expiring | `/business/orders?filter=expiring` |
| Alert: document expiring | `/business/team/employees/{id}` |
| Alert: new review | `/business/reviews` |
| Status mini-card | `/business/orders?status={status}` |

---

## 14. Service Layer Pattern

```typescript
// src/services/dashboardService.ts
export async function getCommandCenterDashboard() {
  if (isMockMode()) {
    return {
      bigStats,
      ordersByStatus,
      recentTransactions,
      alerts,
      weeklySummary,
    };
  }
  return apiClient.get('/business/dashboard/command-center');
}
```

---

## 15. Dashboard Variant Switching

All 3 dashboard variants share the same sidebar "Dashboard" nav item. The route structure:

```typescript
// src/router/business.routes.ts
{
  path: 'dashboard',
  redirect: '/business/dashboard/overview',  // default for owner/admin
  children: [
    { path: 'receptionist', name: 'biz-dash-receptionist', component: () => import('@/views/business/DashboardReceptionist.vue') },
    { path: 'overview', name: 'biz-dash-overview', component: () => import('@/views/business/DashboardOverview.vue') },
    { path: 'command-center', name: 'biz-dash-command', component: () => import('@/views/business/DashboardCommandCenter.vue') },
  ],
}
```

The `redirect` target is determined by user role. The sidebar "Dashboard" link always points to `/business/dashboard`, which redirects based on role. This can be implemented as a route guard or a computed redirect in the store.

---

## 16. Responsive Notes

- Big stats: 4 columns on desktop, 2 on tablet, 1 on mobile
- Middle/bottom rows: 2 columns on desktop, 1 on tablet/mobile
- Status cards: grid of 3+2 on desktop, stack vertically on mobile
- Alert items remain horizontal but wrap on very narrow screens

---

## 17. TypeScript Types

```typescript
// src/types/dashboard.ts (add to existing)

export interface BigStat {
  label: string;
  value: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  trend: string;
}

export interface OrderStatusItem {
  label: string;
  count: number;
  trend: string;
  trendUp: boolean;
  bg: string;
  border?: boolean;
  textColor: string;
}

export interface TransactionItem {
  type: 'incoming' | 'outgoing';
  title: string;
  time: string;
  amount: number;
}

export interface AlertItem {
  id: string;
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  actionLabel: string;
  actionColor: string;
  bg: string;
  titleColor: string;
  descColor: string;
  actionRoute: string;
}

export interface WeeklyStatItem {
  value: string;
  label: string;
  color: string;
}

export interface CommandCenterDashboardData {
  bigStats: BigStat[];
  ordersByStatus: { total: number; statuses: OrderStatusItem[] };
  recentTransactions: TransactionItem[];
  alerts: AlertItem[];
  weeklySummary: {
    trendPercent: number;
    newOrders: { count: number; trend: string; trendUp: boolean };
    completed: { count: number; trend: string; trendUp: boolean };
    bottomStats: WeeklyStatItem[];
  };
}
```


**Screenshot**: `03-command-center-dashboard.png`
