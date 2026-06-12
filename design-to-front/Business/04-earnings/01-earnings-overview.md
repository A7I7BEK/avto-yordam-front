# Page Prompt: Earnings Overview

> **Design Node ID**: `C8ehq`
> **Page Name**: Earnings Overview — "39 — Earnings Overview"
> **Route**: `/business/earnings`
> **View File**: `src/views/business/Earnings.vue`
> **Uses Layout**: `AppShell.vue` (with Business sidebar + header from `01-layouts-components`)

---

## 1. Overview

The Earnings page provides a comprehensive financial overview for the business. It shows total earnings broken down by online vs cash payments, a weekly revenue trend chart (stacked bars), revenue breakdown by service category (horizontal bars), and top-performing masters ranked by revenue. A date range picker and export button are available.

---

## 2. Page Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ Finance > Earnings                                                │
│                                                                   │
│ Earnings overview              [📅 Last 30 days ▾] [⬇ Export]    │
│ Combined online and cash collections across your organization.    │
├──────────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│ │💰 Total  │ │📱 Online │ │💵 Cash   │ │🧾 Avg    │             │
│ │earnings  │ │payments  │ │collected │ │order val │             │
│ │42.87M    │ │28.32M    │ │14.55M    │ │612K UZS  │             │
│ │+12.4% vs │ │66% of tot│ │34% of tot│ │+3.1% vs  │             │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘             │
├──────────────────────────────────────────────────────────────────┤
│ Revenue by week                                                   │
│ Comparing online (PayMe/Click/Paynet) vs cash collected          │
│  ▓ ▓ ▓ ▓ ▓ ▓     ← stacked bars: 🟣 Online  ⚪ Cash             │
│  ▓ ▓ ▓ ▓ ▓ ▓                                                    │
│ W1  W2  W3  W4  W5  W6                                           │
├──────────────────────────────┬───────────────────────────────────┤
│ Breakdown by category        │ Top masters                       │
│ Engine    12 400 000 ▓▓▓▓▓▓▓│ JK Jasur Karimov   48ord 8.22M   │
│ Bodywork   9 720 000 ▓▓▓▓▓  │ SR Sherzod Rakhimov41ord 6.94M   │
│ Electrical 7 850 000 ▓▓▓▓   │ BU Bekzod Usmonov  36ord 5.51M   │
│ Diagnostics6 200 000 ▓▓▓    │ DM Doniyor Mahmudov29ord 4.18M   │
│ Tires      4 100 000 ▓▓     │ AK Asror Khalilov  24ord 3.24M   │
└──────────────────────────────┴───────────────────────────────────┘
```

---

## 3. Content Area Container

```css
.earnings-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 32px;
  overflow-y: auto;
  flex: 1;
}
```

---

## 4. Header Section

### 4.1 Breadcrumb

```
Finance > Earnings
```

- "Finance": Inter 12px normal, `#616167`
- Chevron-right icon: 12px, `#616167`
- "Earnings": Inter 12px 500, `#2A2933`
- Gap: 6px

### 4.2 Title Row (space-between)

**Left side** (vertical, gap 4px):
- Title: "Earnings overview" — Inter 24px 700, `#2A2933`
- Subtitle: "Combined online and cash collections across your organization." — Inter 13px normal, `#616167`

**Right side** (horizontal, gap 8px):
- **Date range picker**: pill, radius 999, white bg, border 1px `#C5C5CB`, padding 8px 14px, gap 8px
  - `calendar` icon 14px
  - "Last 30 days" — Inter 13px 500, `#2A2933`
  - `chevron-down` icon 12px
- **Export button**: pill, radius 999, `#5749F4` bg, padding 8px 14px, gap 6px
  - `download` icon 14px, white
  - "Export report" — Inter 13px 600, white

---

## 5. KPI Strip — 4 Cards

Horizontal row, gap 16px, each card `flex: 1`.

### KPI Card Structure

```css
.kpi-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border-radius: 24px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
}
```

**Header row** (space-between):
- Label: Inter 12px 500, `#616167`
- Icon (Lucide): 16px, `#616167`

**Value**: Inter 22px 700, `#2A2933`

**Detail row** (horizontal, gap 4px or 6px):
- For cards with trend: `trending-up` icon 12px `#003300` + "+12.4%" Inter 12px 600 `#003300` + "vs prev. period" Inter 12px normal `#616167`
- For cards with percentage: "66%" Inter 12px 600 `#2A2933` + "of total" Inter 12px normal `#616167`

### KPI Data

| # | Label | Value | Icon | Detail |
|---|-------|-------|------|--------|
| 1 | Total earnings | **42 870 000 UZS** | `wallet` | 📈 +12.4% vs prev. period |
| 2 | Online payments | **28 320 000 UZS** | `smartphone` | 66% of total |
| 3 | Cash collected | **14 550 000 UZS** | `banknote` | 34% of total |
| 4 | Avg order value | **612 000 UZS** | `receipt` | 📈 +3.1% vs prev. period |

---

## 6. Revenue by Week Chart

### Card Container

```css
.chart-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-radius: 24px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
}
```

### Chart Header (space-between)

**Left** (vertical, gap 2px):
- Title: "Revenue by week" — Inter 15px 600, `#2A2933`
- Subtitle: "Comparing online (PayMe / Click / Paynet) vs cash collected" — Inter 12px normal, `#616167`

**Right** — Legend (horizontal, gap 12px):
- Online: 10×10px square, radius 2px, `#5749F4` + "Online" Inter 12px normal, `#616167`, gap 6px
- Cash: 10×10px square, radius 2px, `#D9D9DB` + "Cash" Inter 12px normal, `#616167`, gap 6px

### Bar Chart

6 week columns (W1–W6), horizontal, gap 32px, height 180px, padding 0 8px.

Each column is a vertical flex (gap 6px) with `align-items: center`:

**Bar group** (bottom-aligned, gap 4px, height 160px):
- Online bar: 18px wide, radius 6px, `#5749F4` fill, variable height
- Cash bar: 18px wide, radius 6px, `#D9D9DB` fill, variable height (stacked ON TOP of online bar)

**Week label**: Inter 11px normal, `#616167`

### Bar Heights (in pixels, 160px max)

| Week | Online (purple) | Cash (gray) |
|------|----------------|-------------|
| W1 | 88px | 46px |
| W2 | 104px | 62px |
| W3 | 124px | 54px |
| W4 | 96px | 72px |
| W5 | 138px | 80px |
| W6 | 152px | 64px |

### Chart Implementation

Use a pure CSS bar chart (no charting library needed for mock). Each bar is a `div` with `height` set as a percentage of 160px max.

```vue
<div class="bar-group">
  <div class="bar-group__bars">
    <div class="bar bar--online" :style="{ height: onlineHeight + 'px' }" />
    <div class="bar bar--cash" :style="{ height: cashHeight + 'px' }" />
  </div>
  <span class="bar-group__label">{{ week }}</span>
</div>
```

---

## 7. Bottom Row — Two Columns

```css
.bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
```

---

## 8. Breakdown by Category (Left Card)

### Card Container

```css
.breakdown-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
  border-radius: 24px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
}
```

### Card Header

"Breakdown by category" — Inter 15px 600, `#2A2933`

### Category Row (×5)

Each row: vertical, gap 4px.

**Header** (space-between):
- Category name: Inter 13px 500, `#2A2933`
- Amount: Inter 13px 600, `#2A2933`

**Progress bar**: full width, 6px height, radius 999px, `#F5F5F5` bg. Fill bar: `#5749F4`, same height/radius, variable width.

### Data

| Category | Amount | Bar Width |
|----------|--------|-----------|
| Engine | 12 400 000 UZS | 340px (~96%) |
| Bodywork | 9 720 000 UZS | 266px (~75%) |
| Electrical | 7 850 000 UZS | 220px (~62%) |
| Diagnostics | 6 200 000 UZS | 174px (~49%) |
| Tires | 4 100 000 UZS | 114px (~32%) |

---

## 9. Top Masters (Right Card)

### Card Container

Same as breakdown card.

### Card Header

"Top masters" — Inter 15px 600, `#2A2933`

### Master Row (×5)

Horizontal, gap 12px, padding between rows.

```
[JK]  Jasur Karimov         8 220 000 UZS
      48 orders
```

- **Avatar**: 32×32px circle, radius 999, colored bg, white initials Inter 11px 600
- **Info** (vertical, gap 1px, flex: 1):
  - Name: Inter 13px 600, `#2A2933`
  - Orders: Inter 12px normal, `#616167` — "{N} orders"
- **Revenue**: Inter 13px 600, `#2A2933`, right-aligned

### Avatar Colors

| Initials | Name | Avatar Bg | Orders | Revenue |
|----------|------|-----------|--------|---------|
| JK | Jasur Karimov | `#5749F4` | 48 | 8 220 000 UZS |
| SR | Sherzod Rakhimov | `#FF7A4B` | 41 | 6 940 000 UZS |
| BU | Bekzod Usmonov | `#1FAA59` | 36 | 5 510 000 UZS |
| DM | Doniyor Mahmudov | `#5749F4` | 29 | 4 180 000 UZS |
| AK | Asror Khalilov | `#00A0E9` | 24 | 3 240 000 UZS |

---

## 10. Component Tree

```
Earnings.vue
├── BreadcrumbBar.vue               ← Finance > Earnings
├── HeaderRow.vue                   ← Title + date picker + export
├── KpiStrip.vue                    ← 4 KPI cards
│   └── KpiCard.vue ×4
├── RevenueChart.vue                ← Weekly stacked bar chart
│   ├── ChartLegend.vue             ← Online/Cash toggle
│   └── BarGroup.vue ×6            ← Individual week bars
├── BottomRow.vue
│   ├── BreakdownByCategory.vue     ← Category revenue bars
│   │   └── CategoryBar.vue ×5
│   └── TopMasters.vue              ← Master revenue ranking
│       └── MasterRow.vue ×5
```

---

## 11. Mock Data File

```typescript
// src/data/earnings.ts

export const kpiCards = [
  { label: 'Total earnings', value: '42 870 000 UZS', icon: 'wallet', detail: '+12.4%', detailType: 'trend-up', detailSuffix: 'vs prev. period' },
  { label: 'Online payments', value: '28 320 000 UZS', icon: 'smartphone', detail: '66%', detailType: 'percent', detailSuffix: 'of total' },
  { label: 'Cash collected', value: '14 550 000 UZS', icon: 'banknote', detail: '34%', detailType: 'percent', detailSuffix: 'of total' },
  { label: 'Avg order value', value: '612 000 UZS', icon: 'receipt', detail: '+3.1%', detailType: 'trend-up', detailSuffix: 'vs prev. period' },
];

export const weeklyRevenue = [
  { week: 'W1', online: 88, cash: 46 },
  { week: 'W2', online: 104, cash: 62 },
  { week: 'W3', online: 124, cash: 54 },
  { week: 'W4', online: 96, cash: 72 },
  { week: 'W5', online: 138, cash: 80 },
  { week: 'W6', online: 152, cash: 64 },
];

export const categoryBreakdown = [
  { name: 'Engine', amount: '12 400 000 UZS', amountNum: 12400000, barWidth: 340 },
  { name: 'Bodywork', amount: '9 720 000 UZS', amountNum: 9720000, barWidth: 266 },
  { name: 'Electrical', amount: '7 850 000 UZS', amountNum: 7850000, barWidth: 220 },
  { name: 'Diagnostics', amount: '6 200 000 UZS', amountNum: 6200000, barWidth: 174 },
  { name: 'Tires', amount: '4 100 000 UZS', amountNum: 4100000, barWidth: 114 },
];

export const topMasters = [
  { initials: 'JK', name: 'Jasur Karimov', orders: 48, revenue: '8 220 000 UZS', avatarColor: '#5749F4' },
  { initials: 'SR', name: 'Sherzod Rakhimov', orders: 41, revenue: '6 940 000 UZS', avatarColor: '#FF7A4B' },
  { initials: 'BU', name: 'Bekzod Usmonov', orders: 36, revenue: '5 510 000 UZS', avatarColor: '#1FAA59' },
  { initials: 'DM', name: 'Doniyor Mahmudov', orders: 29, revenue: '4 180 000 UZS', avatarColor: '#5749F4' },
  { initials: 'AK', name: 'Asror Khalilov', orders: 24, revenue: '3 240 000 UZS', avatarColor: '#00A0E9' },
];

export const dateRangeOptions = ['Last 7 days', 'Last 30 days', 'This month', 'Last month', 'This year'];
```

---

## 12. Vue Component Outline

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getEarnings } from '@/services/earningsService';
import { dateRangeOptions } from '@/data/earnings';
import KpiStrip from '@/components/earnings/KpiStrip.vue';
import RevenueChart from '@/components/earnings/RevenueChart.vue';
import BreakdownByCategory from '@/components/earnings/BreakdownByCategory.vue';
import TopMasters from '@/components/earnings/TopMasters.vue';

const data = ref<any>(null);
const selectedRange = ref('Last 30 days');

onMounted(async () => {
  data.value = await getEarnings(selectedRange.value);
});

function handleExport() { /* trigger CSV/PDF download */ }
</script>
```

---

## 13. Navigation Connection

- Sidebar **Earnings** nav item is **active** when on this page
- Breadcrumb: Finance > Earnings
- "Export report" button — triggers download (mock: just shows a toast)
- Date range changes refetch data

---

## 14. Service Layer

```typescript
// src/services/earningsService.ts
import { isMockMode } from '@/config';
import { kpiCards, weeklyRevenue, categoryBreakdown, topMasters } from '@/data/earnings';

export async function getEarnings(dateRange: string) {
  if (isMockMode()) {
    return { kpi: kpiCards, weekly: weeklyRevenue, categories: categoryBreakdown, masters: topMasters };
  }
  return apiClient.get('/business/earnings', { params: { range: dateRange } });
}
```


**Screenshot**: `01-earnings-overview.png`
