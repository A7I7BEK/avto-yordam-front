# Page Prompt: Organization Detail Modal

> **Design Node ID**: `Wt0xo` | **Route**: Shown as a modal overlay on the Organizations list page
> **Trigger**: Clicking an organization card on the list page

---

## 1. Overview

A modal dialog showing detailed information about a specific organization. Opens over a dark semi-transparent backdrop. Contains header with org info, stats cards, and additional detail sections.

---

## 2. Modal Structure

```
┌──────────────────────────────────────────────────────────┐
│ [Background: organizations list, dimmed #000000B3]       │
│                                                          │
│   ┌────────────────────────────────────────────────┐     │
│   │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │     │
│   │                                                │     │
│   │ [AF]  AutoFix Toshkent                         │     │
│   │       Tashkent · MCHJ · Electrical             │     │
│   │                                                │     │
│   │       [👑 Owner]  [✓ Verified]  [AF-MCHJ-0042] │     │
│   │                                                │     │
│   ├────────────────────────────────────────────────┤     │
│   │                                                │     │
│   │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │     │
│   │ │ 👥   │ │ ⭐   │ │ 📅   │ │ 💰   │          │     │
│   │ │Team  │ │Rating│ │Book- │ │Rev-  │          │     │
│   │ │  12  │ │ 4.9  │ │ings  │ │enue  │          │     │
│   │ │      │ │      │ │ 148  │ │$24K  │          │     │
│   │ └──────┘ └──────┘ └──────┘ └──────┘          │     │
│   │                                                │     │
│   │ [More detail sections...]                      │     │
│   │                                                │     │
│   │                              [Close ✕]         │     │
│   └────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Modal Backdrop

| Property | Value |
|----------|-------|
| Position | fixed, inset 0 |
| Background | `rgba(0, 0, 0, 0.7)` ≈ `#000000B3` |
| Z-index | 1000 |
| Click behavior | Click backdrop → close modal |

---

## 4. Modal Container

| Property | Value |
|----------|-------|
| Width | 720px |
| Max-height | 680px (scrollable if needed) |
| Border-radius | 24px |
| Background | `#FFFFFF` |
| Position | centered (flex or absolute) |
| Overflow | hidden |

---

## 5. Modal Header (Gradient Banner)

Same gradient as the org card it represents. Height ~180px.

### 5.1 Org Avatar
48×48px, rounded 12px, `#FFFFFF` bg, matching-color initials (Inter 18px 800). Positioned ~28px from top-left.

### 5.2 Org Name + Meta
- Name: Inter 22px 700, `#FFFFFF`, letter-spacing -0.5
- Meta row: "Tashkent · MCHJ · Electrical", Inter 12px, `rgba(255,255,255,0.7)`
- Positioned below avatar

### 5.3 Badge Row (below name)
`display:flex; gap:8px;`

| Badge | Icon | Text | Style |
|-------|------|------|-------|
| Role | `crown` 12px | "Owner" | White bg, purple text 11px 700, pill |
| Verified | `shield-check` 12px | "Verified" | Semi-transparent white bg `rgba(255,255,255,0.15)`, white text 11px 600, pill |
| Org ID | — | "AF-MCHJ-0042" | Same semi-transparent bg, `rgba(255,255,255,0.8)` text 11px 500, pill |

All pills: padding 4px 10px, rounded 999px.

---

## 6. Modal Body (below gradient, white area)

Padding ~24px.

### 6.1 Stats Cards Row

`display:flex; gap:12px;` — 4 equal-width cards.

Each stat card: rounded 12px, `#F5F5F5` bg, 1px `#C5C5CB` border, padding 10px 12px, flex column, gap 5px.

| # | Icon | Icon BG | Label | Value |
|---|------|---------|-------|-------|
| 1 | `users` 12px white | `#5749F4` 20×20px rounded 6px | "Team" (10px 600 `#616167`) | **12** (17px 700) |
| 2 | `star` 12px white | `#F59E0B` 20×20px | "Rating" | **4.9** |
| 3 | `calendar-check` 12px white | `#0F766E` 20×20px | "Bookings" | **148** |
| 4 | `wallet` 12px white | `#5749F4` 20×20px | "Revenue" | **$24K** |

### 6.2 Additional Detail Sections (if more detail is in design)
For MVP/mock, the modal body can also include placeholder sections (like "Contact info", "Address", etc.) with static data.

---

## 7. Modal Close

- An `x` icon button in the top-right corner of the modal
- Or clicking the backdrop
- Or pressing Escape key

---

## 8. Vue Component

### File: `src/components/app/OrgDetailModal.vue` (reusable)

### Props

| Prop | Type | Description |
|------|------|-------------|
| `org` | `Organization \| null` | The org data to display; `null` hides the modal |
| `visible` | `boolean` | Whether modal is shown |

### Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | — | User closed the modal |

### Mock Data

```typescript
const mockOrgDetail = {
  ...organizations[0],  // from list mock data
  teamSize: 12,
  rating: 4.9,
  totalBookings: 148,
  revenue: '$24K',
};
```

---

## 9. Usage in Organizations.vue

```vue
<script setup>
import { ref } from 'vue';
import OrgDetailModal from '@/components/app/OrgDetailModal.vue';

const selectedOrg = ref(null);
const showModal = ref(false);

function openDetail(org) {
  selectedOrg.value = org;
  showModal.value = true;
}
</script>

<template>
  <!-- org cards -->
  <div v-for="org in organizations" @click="openDetail(org)">
    ...
  </div>

  <OrgDetailModal
    :org="selectedOrg"
    :visible="showModal"
    @close="showModal = false"
  />
</template>
```

---

## 10. Implementation Checklist

1. [ ] Create `src/components/app/OrgDetailModal.vue`
2. [ ] Backdrop: fixed, dark overlay, click to close
3. [ ] Modal container: 720px, white, rounded 24px
4. [ ] Gradient header banner (reuse gradient from org)
5. [ ] Org avatar + name + meta + badges in header
6. [ ] Stats row: 4 cards with colored icon squares
7. [ ] Close button + Escape key support
8. [ ] Integrate into Organizations.vue with click handler
9. [ ] Add slide/fade transition
10. [ ] Run `pnpm dlx ultracite fix`

**Screenshot**: `02-org-detail-modal.jpg`
