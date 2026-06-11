# Page Prompt: Professional My Organizations (List)

> **Design Node ID**: `u1fac` | **Route**: `/professional/organizations`
> **Layout**: Renders inside AppShell (sidebar with Organizations active, header provided)
> **Viewport**: Content area ~1184×836px

---

## 1. Overview

A list of organizations (shops/companies) where the professional works as a team member. Each org is displayed as a beautiful gradient card with its logo, role, membership date, and ID.

---

## 2. Content Structure

```
┌──────────────────────────────────────────────────────────┐
│ Workspace > My organizations                             │
│                                                          │
│ My organizations                                         │
│ Shops where you work as a member of the team             │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ │
│ │ [AF] AutoFix Toshkent          [👑 Owner]            │ │  ← purple card
│ │      Tashkent · MCHJ · Electrical                    │ │
│ │                                                      │ │
│ │ MEMBER SINCE        ORG ID                           │ │
│ │ Jan 2023            AF-MCHJ-0042                     │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ │
│ │ [RS] Rapid Service             [🔧 Master]           │ │  ← teal card
│ │      Samarkand · YTT · Transmission                  │ │
│ │                                                      │ │
│ │ MEMBER SINCE        ORG ID                           │ │
│ │ Aug 2023            RS-MCHJ-0118                     │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ │
│ │ [DA] Detailing Auto             [🔧 Master]          │ │  ← amber card
│ │      Bukhara · MCHJ · Bodywork                       │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Breadcrumb

`Workspace > My organizations` (same pattern: Inter 13px, chevron-right, active last segment 500 weight)

---

## 4. Page Header

- **Title**: "My organizations", Inter 24px, weight 700, `#2A2933`
- **Subtitle**: "Shops where you work as a member of the team", Inter 13px, `#616167`
- Gap: 4px

---

## 5. Organization Cards (vertical stack, gap 16px)

### 5.1 Shared Card Styling

| Property | Value |
|----------|-------|
| Width | 100% (fill_container) |
| Height | 220px |
| Border-radius | 20px |
| Overflow | hidden (clip) |
| Box-shadow | `0 24px 60px` with the card's gradient color at ~29% opacity |
| Border | 1px solid (lighter variant of card color) |
| Layout | `position: relative` for decorative elements |

### 5.2 Card Background

Each card has a distinct gradient fill:

| Card | Gradient | Border | Shadow Color |
|------|----------|--------|-------------|
| 1 (AutoFix) | `linear-gradient(135deg, #5749F4 0%, #1B1356 100%)` | `#7A6FFF` | `rgba(87,73,244,0.29)` |
| 2 (Rapid Service) | `linear-gradient(135deg, #0F766E 0%, #053330 100%)` | `#14B8A6` | `rgba(15,118,110,0.29)` |
| 3 (Detailing Auto) | `linear-gradient(135deg, #B45309 0%, #4A1E02 100%)` | `#F59E0B` | `rgba(180,83,9,0.29)` |

### 5.3 Decorative Elements (absolute positioned, no interaction)

- Large white circle at ~80% opacity 0.06, e.g. 280×280px at right-center
- Small white circle at ~80% opacity 0.04, e.g. 200×200px at right

### 5.4 Card Header Row

Positioned ~28px from left, 24px from top, width ~1080px, `space-between`.

**Left — Org Identity** (gap 14px):
- **Avatar**: 48×48px, rounded 12px, `#FFFFFF` bg, initials (Inter 18px 800), color matches gradient
  - AF, color `#5749F4` | RS, color `#0F766E` | DA, color `#B45309`
- **Text** (gap 3px):
  - Org name: Inter 22px 700, `#FFFFFF`, letter-spacing -0.5
  - Meta row (gap 6px): location · legal type · specialization
    - Inter 12px, `rgba(255,255,255,0.7)` ≈ `#FFFFFFB3`

**Right — Role Badge**:
- Pill: padding 5px 12px, rounded 999px, `#FFFFFF` bg
- Icon + text: Inter 11px 700, color matches card gradient
  - Card 1: `crown` icon + "Owner"
  - Card 2: `wrench` icon + "Master"
  - Card 3: `wrench` icon + "Master"

### 5.5 Card Footer

Positioned ~28px from left, ~160px from top, width ~1080px, `space-between`, `align-items:flex-end`.

Two stat columns, each (gap 3px):
- **Label**: Inter 9px 700, `rgba(255,255,255,0.6)` ≈ `#FFFFFF99`, letter-spacing 1, uppercase
- **Value**: Inter 14px 600, `#FFFFFF`

| Card | MEMBER SINCE | ORG ID |
|------|-------------|--------|
| 1 | Jan 2023 | AF-MCHJ-0042 |
| 2 | Aug 2023 | RS-MCHJ-0118 |
| 3 | Mar 2024 | DA-MCHJ-0271 |

---

## 6. Card Click Behavior

Clicking a card → opens the Organization Detail Modal (see page 02). For the MVP, navigate to a sub-route or emit an event to show the modal.

---

## 7. Mock Data

```typescript
const organizations = [
  {
    id: 'af',
    name: 'AutoFix Toshkent',
    initials: 'AF',
    gradient: 'linear-gradient(135deg, #5749F4 0%, #1B1356 100%)',
    border: '#7A6FFF',
    shadow: 'rgba(87,73,244,0.29)',
    location: 'Tashkent',
    legalType: 'MCHJ',
    specialization: 'Electrical',
    role: 'Owner',
    roleIcon: 'crown',
    memberSince: 'Jan 2023',
    orgId: 'AF-MCHJ-0042',
  },
  {
    id: 'rs',
    name: 'Rapid Service',
    initials: 'RS',
    gradient: 'linear-gradient(135deg, #0F766E 0%, #053330 100%)',
    border: '#14B8A6',
    shadow: 'rgba(15,118,110,0.29)',
    location: 'Samarkand',
    legalType: 'YTT',
    specialization: 'Transmission',
    role: 'Master',
    roleIcon: 'wrench',
    memberSince: 'Aug 2023',
    orgId: 'RS-MCHJ-0118',
  },
  {
    id: 'da',
    name: 'Detailing Auto',
    initials: 'DA',
    gradient: 'linear-gradient(135deg, #B45309 0%, #4A1E02 100%)',
    border: '#F59E0B',
    shadow: 'rgba(180,83,9,0.29)',
    location: 'Bukhara',
    legalType: 'MCHJ',
    specialization: 'Bodywork',
    role: 'Master',
    roleIcon: 'wrench',
    memberSince: 'Mar 2024',
    orgId: 'DA-MCHJ-0271',
  },
];
```

---

## 8. Vue Component

### File: `src/views/professional/Organizations.vue`

### Icons (Lucide)
`ChevronRight`, `Crown`, `Wrench`

---

## 9. Implementation Checklist

1. [ ] Create `src/views/professional/Organizations.vue` (replace placeholder)
2. [ ] Breadcrumb + page header
3. [ ] Build gradient org card component (or inline)
4. [ ] 3 cards with unique gradients (purple, teal, amber)
5. [ ] Decorative background circles (CSS pseudo-elements or absolute divs)
6. [ ] Avatar initials with matching gradient color
7. [ ] Role badge (Owner/Master) with icon
8. [ ] Footer with MEMBER SINCE + ORG ID
9. [ ] Card click → emit or navigate to detail
10. [ ] Run `pnpm dlx ultracite fix`

**Screenshot**: `01-organizations-list.jpg`
