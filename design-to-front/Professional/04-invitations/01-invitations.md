# Page Prompt: Professional My Invitations

> **Design Node ID**: `jKGtZ` | **Route**: `/professional/invitations`
> **Layout**: Renders inside AppShell (sidebar with Invitations active + "2" badge, header provided)
> **Viewport**: Content area ~1184×906px (within 1440×1009 page)

---

## 1. Overview

The Invitations page shows pending organization invitations sent to the professional. Each invitation card displays the organization, role offered, a personal message, sent time, expiry countdown, and Accept/Decline action buttons.

---

## 2. Content Structure (inside AppShell)

```
┌──────────────────────────────────────────────────────────┐
│ Workspace > My invitations                               │
│                                                          │
│ My invitations  [3 new]                                  │
│ Workshops want you on their team — review and decide.    │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ [AF] AutoFix MCHJ                       🕐 Sent 2d  │ │
│ │      from Tashkent                      ⏳ Exp 5d    │ │
│ │      🏢 Master Electrician · Full-time               │ │
│ │                                                      │ │
│ │ ┌──────────────────────────────────────────────────┐ │ │
│ │ │ "Hi! Your portfolio for brake work caught our    │ │ │
│ │ │  attention. We'd love to have you cover the      │ │ │
│ │ │  Tuesday/Thursday afternoon shifts. Welcome."    │ │ │
│ │ └──────────────────────────────────────────────────┘ │ │
│ │ ──────────────────────────────────────────────────── │ │
│ │                    [Decline]    [✓ Accept]           │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ [RS] Rahimov Service                    🕐 Sent 6h  │ │
│ │      from Samarkand                     ⏳ Exp 7d    │ │
│ │      🏢 Transmission Specialist · Night shift        │ │
│ │      ... message ...                                 │ │
│ │                    [Decline]    [✓ Accept]           │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ ... more cards ...                                       │
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
Workspace  >  My invitations
```

| Element | Spec |
|---------|------|
| "Workspace" | Inter 13px, `#616167` |
| `chevron-right` 14px | `#616167` |
| "My invitations" | Inter 13px, weight 500, `#2A2933` |
| Gap | 8px |

---

## 5. Page Header

`display:flex; justify-content:space-between;`

**Left** (flex column, gap 4px):

**Title row** (gap 10px):
- "My invitations", Inter 24px, weight 700, `#2A2933`
- **"3 new" badge**: Pill, padding 3px 9px, `#5749F4` bg, "3 new" Inter 11px 700 `#FFFFFF`, rounded 999px

**Subtitle**: "Workshops want you on their team — review and decide.", Inter 13px, `#616167`

---

## 6. Invitation Cards (scrollable list, gap 14px)

### 6.1 Shared Card Styling

| Property | Value |
|----------|-------|
| Border-radius | 16px |
| Background | `#FFFFFF` |
| Border | 1px solid `#C5C5CB` |
| Overflow | hidden (clip) |
| Width | 100% |

### 6.2 Card Body (padding 18px 20px, gap 14px)

#### 6.2.1 Top Row — Organization Info + Time

`display:flex; justify-content:space-between;`

**Left — Organization** (gap 14px):
- **Avatar**: 48×48px, rounded 12px, flex center
  - Card 1: `#5749F4` bg (purple), initials "AF" Inter 16px 700 `#FFFFFF`
  - Card 2: `#FFD9B2` bg (amber), initials "RS" Inter 16px 700 `#4D2700`
- **Text column** (gap 6px):
  - **Name row** (gap 3px):
    - Org name: Inter 14px 600, `#2A2933` (e.g. "AutoFix MCHJ")
    - Location: Inter 12px, `#616167` (e.g. "from Tashkent")
  - **Meta row** (gap 10px):
    - `building` icon 12px + role text: e.g. "Master Electrician", Inter 12px, `#616167`
    - Service chip tags: pill, padding 3px 8px, `#F5F5F5` bg, Inter 11px 500, `#616167` (e.g. "Full-time", "Brakes", "Suspension")

**Right — Time & Expiry** (flex column, align-items:end, gap 6px):
- **Sent time**: `clock-3` icon 12px + "Sent 2 days ago", Inter 12px, `#616167`, gap 5px
- **Expiry badge**: `hourglass` icon 11px + "Expires in 5 days", Inter 11px 600, `#4D2700`, gap 5px
  - Pill style: padding 3px 9px, rounded 999px, `#FFD9B2` bg (amber warning)

#### 6.2.2 Message Body

Rounded 12px, `#F5F5F5` bg, padding 12px 14px.

Text: Inter 13px, **italic**, `#2A2933`, line-height 1.5, full width.

#### 6.2.3 Footer — Action Buttons

`display:flex; justify-content:flex-end; padding-top:14px; border-top:1px solid #C5C5CB; gap:8px;`

**Decline button** (outline style):
| Property | Value |
|----------|-------|
| Text | "Decline", Inter 13px 500, `#2A2933` |
| Border | 1px solid `#C5C5CB` |
| Padding | 10px 18px |
| Border-radius | 999px |
| Background | transparent |

**Accept button** (primary style):
| Property | Value |
|----------|-------|
| Text | "Accept", Inter 13px **700**, `#FFFFFF` |
| Icon | `check` (Lucide), 13px, `#FFFFFF` |
| Gap | 6px |
| Background | `#5749F4` |
| Padding | 10px 22px |
| Border-radius | 999px |

---

## 7. Mock Data

```typescript
const invitations = [
  {
    id: 1,
    orgName: 'AutoFix MCHJ',
    initials: 'AF',
    avatarBg: '#5749F4',
    avatarTextColor: '#FFFFFF',
    location: 'from Tashkent',
    role: 'Master Electrician',
    tags: ['Full-time', 'Brakes', 'Suspension'],
    message: 'Hi! Your portfolio for brake work caught our attention. We\'d love to have you cover the Tuesday/Thursday afternoon shifts. Welcome.',
    sent: 'Sent 2 days ago',
    expiresIn: 'Expires in 5 days',
  },
  {
    id: 2,
    orgName: 'Rahimov Service',
    initials: 'RS',
    avatarBg: '#FFD9B2',
    avatarTextColor: '#4D2700',
    location: 'from Samarkand',
    role: 'Transmission Specialist',
    tags: ['Night shift', 'Premium rate'],
    message: 'We\'re growing the night shift and your transmission expertise is exactly what we need. Flexible hours, premium rate.',
    sent: 'Sent 6 hours ago',
    expiresIn: 'Expires in 7 days',
  },
  {
    id: 3,
    orgName: 'Green Auto',
    initials: 'GA',
    avatarBg: '#A1E5A1',
    avatarTextColor: '#003300',
    location: 'from Bukhara',
    role: 'Diagnostics Technician',
    tags: ['Part-time', 'Weekends'],
    message: 'We\'re looking for a skilled diagnostics tech for our new Bukhara branch. Your engine and electrical skills are a perfect match.',
    sent: 'Sent 1 day ago',
    expiresIn: 'Expires in 4 days',
  },
];
```

---

## 8. Acceptance/Decline Behavior

For the mock/demo phase:
- **Accept**: Show a confirmation toast "Invitation accepted!" then remove the card from the list (or mark as accepted with a green badge)
- **Decline**: Show confirmation toast "Invitation declined" then remove the card
- Update the invitation count in the Pinia store when cards are accepted/declined

---

## 9. Vue Component

### File: `src/views/professional/Invitations.vue`

### Icons (Lucide)
`ChevronRight`, `Building`, `Clock3`, `Hourglass`, `Check`

---

## 10. Implementation Checklist

1. [ ] Create `src/views/professional/Invitations.vue` (replace placeholder)
2. [ ] Breadcrumb: Workspace > My invitations
3. [ ] Page header: title + "3 new" badge + subtitle
4. [ ] Invitation cards: avatar + org info + time + expiry badge
5. [ ] Message body: italic text in grey rounded box
6. [ ] Footer: Decline (outline) + Accept (purple) buttons
7. [ ] Wire Accept/Decline actions (remove card, update store)
8. [ ] Varied avatar colors (purple, amber, green per card)
9. [ ] All data from mock constants
10. [ ] Run `pnpm dlx ultracite fix`

---

## 11. Visual Reference

See: `01-invitations.png`
