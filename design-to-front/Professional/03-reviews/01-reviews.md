# Page Prompt: Professional Reviews Received

> **Design Node ID**: `bAoDR` | **Route**: `/professional/reviews`
> **Layout**: Renders inside AppShell (sidebar with Reviews active, header provided)
> **Viewport**: Content area ~1184×912px (within 1440×1000 page)

---

## 1. Overview

The Reviews page shows all customer reviews received by the professional. It features a summary section with average rating, star distribution, filter controls, and a scrollable list of individual review cards with text, photos, and response options.

---

## 2. Content Structure (inside AppShell)

```
┌──────────────────────────────────────────────────────────┐
│ Workspace > Reviews                                      │  ← breadcrumb
│                                                          │
│ Reviews received                                         │  ← page header
│ Customer feedback for your work                          │
│                                                          │
│ ┌────────────┐ ┌────────────────────────────────────────┐│
│ │    4.8     │ │ Distribution                           ││
│ │  ★★★★★    │ │ 5★ ████████████████████████  82%       ││  ← summary row
│ │ 327 reviews│ │ 4★ ██████  13%                         ││
│ │            │ │ 3★ ██  3%                              ││
│ │            │ │ 2★ █  1%                               ││
│ │            │ │ 1★ ▏  1%                               ││
│ └────────────┘ └────────────────────────────────────────┘│
│                                                          │
│ [Rating: All ▾] [Last 30 days ▾] [◉ With text only]     │  ← filters
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ [NU] Nilufar Umarova                                 │ │
│ │ ★★★★★  ·  10 May  ·  Brake pads exchange             │ │
│ │                                                      │ │
│ │ Akmal did a thorough job on my Cobalt's front        │ │
│ │ brakes. He explained what was worn out...             │ │  ← review card
│ │                                                      │ │
│ │ [photo1] [photo2]                                    │ │
│ │                                                      │ │
│ │ [👍 Helpful (12)]  [Reply]  [Report]                 │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ ... more review cards ...                            │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Content Container

```css
padding: 24px;
display: flex;
flex-direction: column;
gap: 14px;
overflow-y: auto;
height: 100%;
```

---

## 4. Breadcrumb

```
Workspace  >  Reviews
```

| Element | Spec |
|---------|------|
| "Workspace" | Inter 13px, `#616167` |
| `chevron-right` 14px | `#616167` |
| "Reviews" | Inter 13px, weight 500, `#2A2933` |
| Gap | 8px |

---

## 5. Page Header

`display:flex; justify-content:space-between;`

- **Title**: "Reviews received", Inter 24px, weight 700, `#2A2933`
- **Subtitle**: "Customer feedback for your work", Inter 13px, `#616167`
- Gap between title/subtitle: 4px

---

## 6. Summary Row

`display:flex; gap:14px;`

### 6.1 Big Stat Card (280px, fixed height 163px)

Card: 16px radius, `#FFFFFF` bg, 1px `#C5C5CB` border, padding 18px, flex column, justify-content center, gap 6px.

| Element | Spec |
|---------|------|
| **Rating number** | "4.8", Inter **48px**, weight **800**, `#2A2933`, letter-spacing -1 |
| **Stars row** | 5 stars, gap 3px: 4 filled (`#FBBF24`), 1 empty (`#C5C5CB`), 16px each |
| **Count text** | "327 reviews", Inter 13px, weight 500, `#616167` |

### 6.2 Distribution Card (flex:1)

Same 16px card styling, padding 18px, flex column, gap 8px.

**Title**: "Distribution", Inter 10px, weight 700, `#616167`, letter-spacing 0.5

**5 distribution rows** — each: `display:flex; align-items:center; gap:10px;`

| # | Star | Bar Width | Pct |
|---|------|-----------|-----|
| 5★ | 5, `#FBBF24` star 11px | 680px (full) purple fill / grey track, 8px height, rounded 999px | 82% |
| 4★ | 4, star | 110px | 13% |
| 3★ | 3, star | 32px | 3% |
| 2★ | 2, star | 14px | 1% |
| 1★ | 1, star | 6px | 1% |

Each row structure:
- Star number: Inter 12px 600, `#2A2933`, fixed width 14px
- Star icon: 11px, `#FBBF24`
- Progress bar container: `flex:1`, 8px height, `#F5F5F5` bg, rounded 999px, positioned relative
- Progress bar fill: absolute left 0, 8px height, `#5749F4` fill, rounded 999px
- Percentage: Inter 12px 600, `#2A2933`, width 36px, text-align right

---

## 7. Filters Row

`display:flex; gap:8px;`

Three filter pills, each: padding 8px 12px, rounded 999px, `#F5F5F5` bg, 1px `#C5C5CB` border.

### 7.1 Rating Filter
"Rating: All" + `chevron-down` 13px. Inter 13px 500 `#2A2933`, gap 6px.

### 7.2 Date Filter
"Last 30 days" + `chevron-down` 13px. Same styling.

### 7.3 With Text Only Toggle
Toggle switch + "With text only". Inter 13px 500 `#2A2933`, gap 8px.

**Toggle switch** (pill shape):
| Property | Value |
|----------|-------|
| Container | 28×16px, rounded 999px, `#5749F4` bg (on), padding 2px |
| Knob | 12×12px circle, `#FFFFFF` bg, positioned right (justify-content: end) |
| Default | ON (toggle right) |

---

## 8. Review Cards (scrollable list)

Each card: 16px radius, `#FFFFFF` bg, 1px `#C5C5CB` border, padding 18px, gap 12px, flex column.

### 8.1 Card Header Row

`display:flex; justify-content:space-between;`

**Left — Author info** (gap 12px):
- **Avatar**: 38×38px circle, `#D9D9DB` bg, initials "NU", Inter 13px 700 `#2A2933`, flex center
- **Name + Meta** (flex column, gap 2px):
  - Name: Inter 14px 600, `#2A2933`
  - Meta row (gap 6px): Stars + · + Date + · + Service
    - Stars: 5 small stars, 12px each, gap 2px, `#FBBF24` or `#C5C5CB`
    - · separator: Inter 11px, `#616167`
    - Date: "10 May", Inter 11px, `#616167`
    - · separator
    - Service: "Brake pads exchange", Inter 11px, `#616167`

**Right** — optional (can add a 3-dot menu or leave empty).

### 8.2 Review Body Text

Inter 13px, `#2A2933`, line-height 1.5, full width.

Full text: "Akmal did a thorough job on my Cobalt's front brakes. He explained what was worn out and showed me the old pads before throwing them away. Honest pricing, fast turnaround. Will come back for the rear set when due."

### 8.3 Photos Row (if present)

`display:flex; gap:6px;`

Thumbnail images: 60×60px, rounded 8px, dark placeholder backgrounds (`#1F2937`, `#0F172A`).

### 8.4 Action Row

`display:flex; align-items:center; gap:14px;`

| Action | Icon | Text | Spec |
|--------|------|------|------|
| Helpful | `thumbs-up` 14px | "Helpful (12)" | Inter 12px, `#616167`, clickable |
| Reply | `corner-down-right` 14px | "Reply" | same |
| Report | `flag` 14px | "Report" | same |

---

## 9. Mock Data

```typescript
const summary = {
  averageRating: 4.8,
  totalReviews: 327,
  distribution: [
    { stars: 5, pct: 82, barWidth: 680 },
    { stars: 4, pct: 13, barWidth: 110 },
    { stars: 3, pct: 3, barWidth: 32 },
    { stars: 2, pct: 1, barWidth: 14 },
    { stars: 1, pct: 1, barWidth: 6 },
  ],
};

const reviews = [
  {
    id: 1,
    author: 'Nilufar Umarova',
    initials: 'NU',
    rating: 5,
    date: '10 May',
    service: 'Brake pads exchange',
    text: 'Akmal did a thorough job on my Cobalt\'s front brakes. He explained what was worn out and showed me the old pads before throwing them away. Honest pricing, fast turnaround. Will come back for the rear set when due.',
    photos: 2,
    helpfulCount: 12,
  },
  // ... 4 more mock reviews with varied data
];
```

---

## 10. Vue Component

### File: `src/views/professional/Reviews.vue`

### Icons (Lucide)
`ChevronRight`, `Star`, `ChevronDown`, `ThumbsUp`, `CornerDownRight`, `Flag`

---

## 11. Implementation Checklist

1. [ ] Create `src/views/professional/Reviews.vue` (replace placeholder)
2. [ ] Breadcrumb: Workspace > Reviews
3. [ ] Page header: "Reviews received" + subtitle
4. [ ] Big stat card: 4.8 rating (48px), 5 stars, "327 reviews"
5. [ ] Distribution card: 5 rows with purple progress bars + percentages
6. [ ] Filters: Rating dropdown + Date dropdown + Text-only toggle
7. [ ] Review cards: avatar + name + stars + date + service + text + photos + actions
8. [ ] Map stars as `v-for` with filled/empty logic
9. [ ] All data from mock constants
10. [ ] Run `pnpm dlx ultracite fix`

---

## 12. Visual Reference

See: `01-reviews.png`
