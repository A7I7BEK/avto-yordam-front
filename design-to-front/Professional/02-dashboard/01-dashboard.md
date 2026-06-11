# Page Prompt: Professional Dashboard

> **Design Node ID**: `djsrk` | **Route**: `/professional/dashboard`
> **Layout**: Renders inside AppShell (sidebar + header already provided)
> **Viewport**: Content area ~1184×1216px (within 1440×1296 page)

---

## 1. Overview

The Professional Dashboard is the landing page after login/onboarding. It shows the master's key metrics, performance by service category, a weekly bookings chart, and recent bookings list.

---

## 2. Page Structure (inside AppShell content slot)

```
┌──────────────────────────────────────────────────────────┐
│ Workspace > Dashboard                    [Last 6 months ▾]│  ← Breadcrumb + Date Filter
│                                                          │
│ Dashboard                                                │
│ Your performance at a glance                             │
│                                                          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│ │ 📅 1,284 │ │ 💰$24.8K │ │ ⭐ 4.92  │ │ ⏱ 3m12s │    │  ← 4 KPI Cards
│ │ +12.4%   │ │ +8.2%    │ │ +0.05    │ │ -18s     │    │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
│                                                          │
│ ┌──────────────────────┐ ┌──────────────────────────────┐│
│ │ Performance by       │ │ Weekly bookings (chart)      ││
│ │ service category     │ │                              ││
│ │ (table)              │ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓             ││
│ │ Engine   4.9⭐ 148   │ │ Mon Tue Wed Thu Fri Sat Sun  ││
│ │ Chassis  4.8⭐  92   │ │ ● Completed ○ Cancelled      ││
│ │ Electrical 4.7⭐ 54  │ │                              ││
│ │ Transmission 4.6⭐ 31│ │                              ││
│ └──────────────────────┘ └──────────────────────────────┘│
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Recent bookings (table)                              │ │
│ │ Order ID │ Customer │ Service │ Date │ Status │ Amt  │ │
│ │ ...      │ ...      │ ...     │ ...  │ ...    │ ...  │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Content Area Container

```css
padding: 24px;
display: flex;
flex-direction: column;
gap: 14px;
overflow-y: auto;
height: 100%;
```

---

## 4. Breadcrumb + Header Row

### 4.1 Breadcrumb

```
Workspace  >  Dashboard
```

| Element | Spec |
|---------|------|
| Layout | `display:flex; align-items:center; gap:8px;` |
| "Workspace" | Inter 13px, `#616167` |
| Separator | `chevron-right` (Lucide), 14px, `#616167` |
| "Dashboard" | Inter 13px, weight 500, `#2A2933` |

### 4.2 Header Row

`display:flex; justify-content:space-between; align-items:center;`

**Left** (gap 4px):
- "Dashboard", Inter 24px, weight 700, `#2A2933`
- "Your performance at a glance", Inter 13px, `#616167`

**Right — Date filter pill**:
| Property | Value |
|----------|-------|
| Shape | Pill, padding 8px 12px |
| Background | `#F5F5F5` |
| Border | 1px `#C5C5CB` |
| Content | `calendar` icon 13px + "Last 6 months" Inter 12px 500 + `chevron-down` 12px |
| Gap | 6px between elements |
| All text/icons | `#2A2933` / `#616167` |

---

## 5. KPI Cards Row

4 equal-width cards, `display:flex; gap:14px;`

### Shared KPI Card Styling

| Property | Value |
|----------|-------|
| Border-radius | 16px |
| Background | `#FFFFFF` |
| Border | 1px solid `#C5C5CB` |
| Padding | 18px |
| Gap (internal) | 12px |
| Layout | flex column |
| Width | `flex:1` (equal) |

### Card Structure (each)

```
┌──────────────────────────┐
│ Label            [Icon]  │  ← top row: space-between
│                          │
│ 1,284                    │  ← value: 26px 700
│                          │
│ [▲ +12.4%] vs last month │  ← trend row
└──────────────────────────┘
```

### 5.1 Top Row (Label + Icon)

`display:flex; justify-content:space-between; align-items:center;`

**Label**: Inter 12px, weight 500, `#616167`

**Icon container**: 32×32px, rounded 10px, flex center

### 5.2 Value

**Font**: Inter, 26px, weight 700, `#2A2933`

### 5.3 Trend Row

`display:flex; align-items:center; gap:6px;`

**Trend badge**: Pill, padding 3px 8px, rounded 999px, flex row, gap 4px
- Icon: `trending-up` (Lucide), 11px, `#1F8F3D`
- Text: "+12.4%", Inter 11px, weight 600, `#1F8F3D`
- Background: `rgba(161, 229, 161, 0.2)` ≈ `#A1E5A133`

**Comparison text**: "vs last month", Inter 11px, `#616167`

---

### 5.4 The 4 Cards

| # | Label | Value | Trend | Icon (Lucide) | Icon BG | Icon Color |
|---|-------|-------|-------|---------------|---------|------------|
| 1 | Total bookings | **1,284** | +12.4% | `calendar-check` 16px | `rgba(87,73,244,0.1)` ≈ `#5749F41A` | `#5749F4` |
| 2 | Revenue this month | **$24,860** | +8.2% | `wallet` 16px | `rgba(161,229,161,0.2)` ≈ `#A1E5A133` | `#1F8F3D` |
| 3 | Avg rating | **4.92** | +0.05 | `star` 16px (filled) | `rgba(255,217,178,0.4)` ≈ `#FFD9B266` | `#B26B00` |
| 4 | Response time | **3m 12s** | -18s | `timer` 16px | `rgba(201,214,240,0.4)` ≈ `#C9D6F066` | `#1E3A8A` |

---

## 6. Performance Table + Chart (Row)

`display:flex; gap:14px;`

### 6.1 Performance by Service Category (Left, flex:1)

**Card container**: border-radius 16px, `#FFFFFF` bg, 1px `#C5C5CB` border, overflow hidden.

**Card Title** (padding 14px 18px, border-bottom 1px `#C5C5CB`):
- "Performance by service category", Inter 15px, weight 600, `#2A2933`

**Column Headers** (padding 10px 18px, `#F5F5F5` bg, border-bottom 1px `#C5C5CB`):

| Column | Width | Text |
|--------|-------|------|
| CATEGORY | `flex:1` | Inter 11px 600, `#616167`, letter-spacing 0.5 |
| RATING | 120px | same |
| ORDERS | 120px | same |
| TREND | 280px | same |

**Data Rows** (padding 12px 18px, border-bottom 1px `#C5C5CB`):

Each row: `display:flex; align-items:center;`

**Category column** (flex:1, gap 12px):
- Icon: 32×32px, rounded 8px, `#F5F5F5` bg, 1px `#C5C5CB` border, `#616167` icon 16px
- Text: Service name (Inter 14px 600 `#2A2933`) + "X subcategories" (Inter 11px `#616167`), gap 2px

**Rating column** (120px, gap 6px):
- `star` icon 14px, `#FBBF24` (amber) + value Inter 13px 600 `#2A2933`

**Orders column** (120px):
- Value Inter 13px 600 `#2A2933`

**Trend column** (280px, gap 10px):
- Progress bar: 180px wide, 6px height, rounded 999px, `#F5F5F5` bg track, `#5749F4` fill
- Percentage text: Inter 12px 600, `#003300`

| # | Icon | Service | Subcats | Rating | Orders | Trend Bar | Trend % |
|---|------|---------|---------|--------|--------|-----------|---------|
| 1 | `droplet` | Engine | 8 subcategories | ⭐4.9 | 148 | 166/180px | +12% |
| 2 | `car` | Chassis | 6 subcategories | ⭐4.8 | 92 | 126/180px | +8% |
| 3 | `zap` | Electrical | 5 subcategories | ⭐4.7 | 54 | 81/180px | +3% |
| 4 | `cog` | Transmission | 4 subcategories | ⭐4.6 | 31 | 54/180px | +5% |

### 6.2 Weekly Bookings Chart (Right, flex:1)

**Card container**: same styling as table card.

**Title row** (padding 14px 18px, space-between):
- "Weekly bookings" (Inter 15px 600 `#2A2933`)
- Legend: `● Completed` + `○ Cancelled` (dots 8px, text Inter 11px `#616167`, gap 6px/14px)

**Chart body** (padding 18px):
- 7 vertical bar columns (Mon-Sun) + labels below
- Each bar: clipped rounded 6px container, purple `#5749F4` fill bar on top of grey `#C5C5CB` background
- Day labels below: Inter 11px 500, `#616167`

For the mock/dumb version, render static bar heights with CSS. No chart library needed yet.

---

## 7. Recent Bookings Table

**Card container**: same styling (16px radius, white bg, border).

**Title** (padding 14px 18px, border-bottom): "Recent bookings" (Inter 15px 600)

**Columns**: Order ID | Customer | Service | Date | Status | Amount

**Mock data rows** (~5 rows):
| Order ID | Customer | Service | Date | Status | Amount |
|----------|----------|---------|------|--------|--------|
| #ORD-2847 | Alisher Usmonov | Engine diagnostic | Jun 10, 2026 | Completed | $320 |
| #ORD-2846 | Bekzod Toshmatov | Oil change | Jun 10, 2026 | In progress | $85 |
| #ORD-2845 | Dilshod Karimov | Brake replacement | Jun 9, 2026 | Completed | $450 |
| #ORD-2844 | Farhod Rahimov | A/C service | Jun 9, 2026 | Cancelled | $120 |
| #ORD-2843 | Gulnora Azizova | Transmission flush | Jun 8, 2026 | Completed | $280 |

**Status badges**:
- Completed: green dot + text `#003300`
- In progress: amber/yellow dot + text
- Cancelled: grey dot + text

---

## 8. Vue Component

### File: `src/views/professional/Dashboard.vue`

### Mock Data (define as a static constant or from store)

```typescript
const kpiCards = [
  { label: 'Total bookings', value: '1,284', trend: '+12.4%', icon: CalendarCheck, iconBg: '#5749F41A', iconColor: '#5749F4' },
  { label: 'Revenue this month', value: '$24,860', trend: '+8.2%', icon: Wallet, iconBg: '#A1E5A133', iconColor: '#1F8F3D' },
  { label: 'Avg rating', value: '4.92', trend: '+0.05', icon: Star, iconBg: '#FFD9B266', iconColor: '#B26B00' },
  { label: 'Response time', value: '3m 12s', trend: '-18s', icon: Timer, iconBg: '#C9D6F066', iconColor: '#1E3A8A' },
];

const performanceRows = [
  { icon: Droplet, name: 'Engine', subcats: '8 subcategories', rating: 4.9, orders: 148, trendPct: '+12%', trendWidth: 166 },
  { icon: Car, name: 'Chassis', subcats: '6 subcategories', rating: 4.8, orders: 92, trendPct: '+8%', trendWidth: 126 },
  { icon: Zap, name: 'Electrical', subcats: '5 subcategories', rating: 4.7, orders: 54, trendPct: '+3%', trendWidth: 81 },
  { icon: Cog, name: 'Transmission', subcats: '4 subcategories', rating: 4.6, orders: 31, trendPct: '+5%', trendWidth: 54 },
];

const recentBookings = [
  { id: '#ORD-2847', customer: 'Alisher Usmonov', service: 'Engine diagnostic', date: 'Jun 10, 2026', status: 'Completed', amount: '$320' },
  // ... 4 more rows
];
```

### Icons (Lucide)
`CalendarCheck`, `Wallet`, `Star`, `Timer`, `Droplet`, `Car`, `Zap`, `Cog`, `ChevronRight`, `Calendar`, `ChevronDown`, `TrendingUp`

---

## 9. Implementation Checklist

1. [ ] Replace placeholder `Dashboard.vue` with full implementation
2. [ ] Build breadcrumb: "Workspace > Dashboard"
3. [ ] Build header row: title + subtitle + date filter pill
4. [ ] Build 4 KPI cards in a row with proper icon colors
5. [ ] Build Performance table (title + headers + 4 data rows with progress bars)
6. [ ] Build Weekly Bookings chart (7 static bar columns + legend)
7. [ ] Build Recent Bookings table with status badges
8. [ ] All data from mock constants (no API calls yet)
9. [ ] Ensure all icons are properly imported from Lucide
10. [ ] Run `pnpm dlx ultracite fix`

---

## 10. Visual Reference

See: `01-dashboard.png`
