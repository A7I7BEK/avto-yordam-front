# Page Prompt: Step 1 — Organization Type

> **Design Node ID**: `lyxy1` | **Route**: `/onboarding/business/org-type` | **Viewport**: 1440×1000px  
> **Incoming from**: Business Auth | **Leads to**: Step 2 (Bank Account)

---

## 1. Overview

The business selects its legal structure from 3 options presented as selectable cards. One card is pre-selected (MCHJ). Each card has a distinct color theme (info/warning/success).

---

## 2. Page Layout

```
1440×1000px, bg #FFFFFF, padding 40px 80px, flex column, gap 32px

┌──────────────────────────────────────────────┐
│ [🏢 Business]       Organization · Step 1 of 2 │  ← header
├──────────────────────────────────────────────┤
│ ██████████████████████░░░░░░░░░░░░░░░░░░░░░░ │  ← progress bar
├──────────────────────────────────────────────┤
│  Choose your organization type               │
│  Pick the legal structure that matches...    │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  MCHJ    │  │   YTT    │  │  Self    │   │
│  │ SELECTED │  │  Select  │  │ Employed │   │
│  │          │  │          │  │  Select  │   │
│  └──────────┘  └──────────┘  └──────────┘   │
│                                              │
│  [← Back]                    [Continue →]    │
└──────────────────────────────────────────────┘
```

---

## 3. Header Row

`display:flex; justify-content:space-between; align-items:center; width:100%;`

| Element | Spec |
|---------|------|
| Brand | `building-2` icon 20px, 36×36px `#2A2933` bg, rounded 10px, "Business" Inter 20px 600, gap 10px |
| Step label | "Organization · Step 1 of 2", Inter 14px, `#616167` |

---

## 4. Progress Bar

Two horizontal segments, gap 6px, full width.

| Segment | Color | Meaning |
|---------|-------|---------|
| Segment 1 | `#5749F4` | Step 1 active |
| Segment 2 | `#F5F5F5` | Step 2 inactive |

Each: height 6px, border-radius 3px, `flex:1`.

---

## 5. Body Section

`display:flex; flex-direction:column; gap:36px; justify-content:center; flex:1;`

### 5.1 Title Section (gap 10px)
- **Title**: "Choose your organization type", Inter 28px 600, `#2A2933`
- **Subtitle**: "Pick the legal structure that matches how your business is registered.", Inter 15px, `#616167`

### 5.2 Three Cards Row

`display:flex; gap:20px;`

Each card: 340px wide, padding 28px, gap 16px, border-radius 40px, `#FFFFFF` bg.

---

#### Card 1: MCHJ (SELECTED)

| Property | Value |
|----------|-------|
| Border | **2px solid `#5749F4`** (selected state) |

**Top Row** (space-between):
- **Icon box**: 48×48px, rounded 24px, `#C9D6F0` bg (info color), `building-2` icon 24px, `#001133`
- **Badge**: Info label style (`Tn1Ii` ref = Label/Info): "MCHJ", `#C9D6F0` bg, `#001133` text, pill, padding 8px 12px

**Title**: "Limited Liability Company", Inter 18px 600, `#2A2933`

**Description**: "MChJ is the most common form for small and mid-size service businesses. Founders share liability up to capital contribution.", Inter 13px, `#616167`, line-height 1.5

**CTA**: "Selected" pill button — `#5749F4` bg, white text 14px 500, `check` icon 16px, gap 8px, padding 10px 16px, full width, centered

---

#### Card 2: YTT (Unselected)

| Property | Value |
|----------|-------|
| Border | 1px solid `#C5C5CB` |

**Top Row**:
- **Icon box**: 48×48px, rounded 24px, `#FFD9B2` bg (warning color), `briefcase` icon 24px, `#4D2700`
- **Badge**: Warning label style (`2bkgE` ref): "YTT", `#FFD9B2` bg, `#4D2700` text

**Title**: "Individual Entrepreneur", Inter 18px 600

**Description**: "YTT (Yakka Tartibdagi Tadbirkor) — a sole-trader format with simplified tax and direct personal liability."

**CTA**: "Select" outline button (`L73ds` ref = Button/Outline): `#C5C5CB` border, `#2A2933` text 14px 500, pill, full width

---

#### Card 3: Self Employed (Unselected)

| Property | Value |
|----------|-------|
| Border | 1px solid `#C5C5CB` |

**Top Row**:
- **Icon box**: 48×48px, rounded 24px, `#A1E5A1` bg (success color), `user-round` icon 24px, `#003300`
- **Badge**: Success label style (`qHX3A` ref): "Self Employed", `#A1E5A1` bg, `#003300` text

**Title**: "Solo Master", Inter 18px 600

**Description**: "For one-person setups working without a formal company. Lowest paperwork, fastest start."

**CTA**: "Select" outline button (same as YTT)

---

#### Card Interaction

Clicking an unselected card:
1. That card gets the selected state (2px purple border, CTA changes to "Selected" purple pill)
2. Previously selected card reverts to unselected state (1px grey border, CTA changes to "Select" outline)

---

## 6. Footer

`display:flex; justify-content:space-between; width:100%;`

**Back button** (Secondary/Large = `yufPk` ref):
- "Back" + `arrow-left` icon, `#D9D9DB` bg, `#2A2933` text, pill → back to auth

**Continue button** (Primary):
- "Continue" + `arrow-right` icon, `#5749F4` bg, white text, pill → Step 2

---

## 7. Vue Component

### File: `src/views/onboarding/business/OrgType.vue`

### Icons (Lucide): `Building2`, `Briefcase`, `UserRound`, `ArrowLeft`, `ArrowRight`, `Check`

### Implementation Checklist

1. [ ] Create `src/views/onboarding/business/OrgType.vue`
2. [ ] Implement header row + progress bar (step 1 active)
3. [ ] Build body: title + 3 cards row
4. [ ] MCHJ card: info colors, purple border, "Selected" CTA
5. [ ] YTT card: warning colors, outline border, "Select" CTA
6. [ ] Self Employed card: success colors, outline border, "Select" CTA
7. [ ] Wire card click → toggle selection state
8. [ ] Footer: Back + Continue buttons
9. [ ] Create/update business onboarding Pinia store
10. [ ] Run `pnpm dlx ultracite fix`

**Screenshot**: `01-org-type.png`
