# Page Prompt: Step 2 — Professional Info

> **Design Node ID**: `h7bM2o` | **Route**: `/onboarding/professional/professional-info` | **Viewport**: 1440×1000px  
> **Incoming from**: Step 1 (Personal Info)  
> **Leads to**: Dashboard

---

## 1. Overview

Second and final step of the onboarding wizard. The user selects their specializations, enters years of experience, and sets default working hours & days.

---

## 2. Page Layout

Same as Step 1: 1440×1000px, centered card (wider at 680px), brand + stepper + card.

---

## 3. Stepper (Step 2 Active)

| Element | Spec |
|---------|------|
| Width | 920px |
| Step 1 circle | 24×24px, bg `#5749F4`, `check` icon (Lucide) 12px `#FFFFFF` |
| Step 1 label | "Personal info", Inter 13px 500, `#616167` |
| Line | 1px `#C5C5CB`, flex:1 |
| Step 2 circle | 24×24px, bg `#5749F4` (active), "2" white 12px 600 |
| Step 2 label | "Professional info", Inter 13px 600, `#2A2933` |

---

## 4. Card (680px, padding 32px, gap 18px)

### 4.1 Header
- **Title**: "Your professional details", Inter 24px 600, `#2A2933`
- **Subtitle**: "Shown to customers on your public profile. You can edit these any time later.", Inter 14px, `#616167`
- Gap: 6px

---

### 4.2 Section 1: Specialization

Full-width section with bottom border (`padding-bottom: 16px`, `border-bottom: 1px solid #C5C5CB`).

**Label row** (space-between):
- "Specialization", Inter 14px 600, `#2A2933`
- "3 selected", Inter 12px **italic**, `#616167` — updates dynamically

**Hint**: "Pick everything you confidently work on — you can always adjust later.", Inter 12px, `#616167`

**Chip rows** — two rows, 5 chips each, `display:flex; flex-wrap:wrap; gap:8px;`

**Row 1**:

| Chip | Selected? | Text |
|------|-----------|------|
| Engine | ✅ Purple fill | "Engine" + `check` icon 12px |
| Transmission | ○ Outline | "Transmission" |
| Bodywork | ○ Outline | "Bodywork" |
| Paint | ○ Outline | "Paint" |
| Electrical | ✅ Purple fill | "Electrical" + `check` icon |

**Row 2**:

| Chip | Selected? | Text |
|------|-----------|------|
| Diagnostics | ✅ Purple fill | "Diagnostics" + `check` icon |
| Tires | ○ Outline | "Tires" |
| A/C | ○ Outline | "A/C" |
| Suspension | ○ Outline | "Suspension" |
| Glass | ○ Outline | "Glass" |

**Chip styling**:
- **Selected**: `#5749F4` bg, white text 13px 500, `check` icon, gap 6px, padding 8px 14px, pill
- **Unselected**: transparent bg, 1px `#C5C5CB` border, `#2A2933` text 13px 500, padding 8px 14px, pill
- Click toggles selection. "X selected" counter updates.

---

### 4.3 Section 2: Years of Experience

Full-width section with bottom border.

**Label + Description** (gap 2px):
- "Years of experience", Inter 14px 600, `#2A2933`
- "How long have you been doing this work? Self-reported — we'll also track your verified time on the platform separately.", Inter 12px, `#616167`, line-height 1.5

**Input Row** (`display:flex; align-items:center; gap:10px;`):
- **Pill input**: 180px wide, padding 10px 16px, `#F5F5F5` bg, 1px `#C5C5CB` border, pill.
  - Value: "12" (Inter 18px 700 `#2A2933`) + "years" (Inter 13px `#616167`) — inside same pill
  - Gap 8px between number and "years"
  - Click to edit the number
- **Separator**: "·", Inter 13px, `#616167`
- **Hint**: "You can edit this on your profile later.", Inter 12px italic, `#616167`

---

### 4.4 Section 3: Working Time

Full-width section (no bottom border).

**Label + Description** (gap 2px):
- "Working time", Inter 14px 600, `#2A2933`
- "Your default working hours. Each organization you work for can override these on its own schedule.", Inter 12px, `#616167`, line-height 1.5

**Time Row** (`display:flex; align-items:center; gap:12px;`):

```
FROM                  TO
┌──────────┐         ┌──────────┐
│ 09:00  ▾ │   —    │ 18:00  ▾ │
└──────────┘         └──────────┘
  140px                140px
```

Each time selector:
- Small "FROM"/"TO" label above: Inter 10px 600, `#616167`, letter-spacing 1.5px
- Pill dropdown: 140px, padding 10px 16px, `#F5F5F5` bg, 1px `#C5C5CB` border
- Value: "09:00" / "18:00", Inter 18px 700, `#2A2933`
- `chevron-down` icon 14px, `#616167`
- Gap 8px between value and icon, gap 4px between label and input

Dash "—" between: Inter 18px 500, `#616167`

**Days Section** (gap 4px from time row):

```
DAYS
[Mon] [Tue] [Wed] [Thu] [Fri] [Sat] [Sun]
```

- "DAYS" label: Inter 10px 600, `#616167`, letter-spacing 1.5px
- Day chips row: `display:flex; gap:6px;`
- Each day chip: pill, padding 8px 12px, Inter 12px 600

| Day | Selected? | Style |
|-----|-----------|-------|
| Mon | ✅ | Purple bg `#5749F4`, white text |
| Tue | ✅ | Purple bg, white text |
| Wed | ✅ | Purple bg, white text |
| Thu | ✅ | Purple bg, white text |
| Fri | ✅ | Purple bg, white text |
| Sat | ○ | Outline `#C5C5CB`, `#2A2933` text |
| Sun | ○ | Outline `#C5C5CB`, `#2A2933` text |

Click toggles selection.

---

### 4.5 Footer Buttons

Same as Step 1: `space-between` layout.

**Back button**: "Back", `#F5F5F5` bg, pill → navigates to Step 1

**Continue button**: "Continue" + `arrow-right` icon 14px, purple bg, white text → saves all data, navigates to dashboard

---

## 5. Vue Component

### File: `src/views/onboarding/professional/ProfessionalInfo.vue`

### Icons Needed (Lucide)
`UserRound`, `Check`, `ChevronDown`, `ArrowRight`

### Interactions
| Element | Action |
|---------|--------|
| Specialization chips | Toggle on click, update "X selected" counter |
| Years input | Click to edit number |
| Time dropdowns | Click to open time picker (simple select or native time input) |
| Day chips | Toggle on click |
| "Back" | Navigate to Step 1 |
| "Continue" | Save to store → submit onboarding → navigate to dashboard |

---

## 6. Implementation Checklist

1. [ ] Create `src/views/onboarding/professional/ProfessionalInfo.vue`
2. [ ] Implement stepper (step 1 completed ✓, step 2 active)
3. [ ] Build card header
4. [ ] Build Specialization section with 10 toggleable chips (2 rows × 5)
5. [ ] Build Years of Experience section with editable pill
6. [ ] Build Working Time section (FROM/TO dropdowns + day chips)
7. [ ] Wire up all toggle interactions
8. [ ] Read initial data from onboarding store
9. [ ] Save all data to store on "Continue"
10. [ ] Wire up navigation (back to step 1, continue to dashboard)
11. [ ] Run `pnpm dlx ultracite fix`

**Screenshot**: `02-professional-info.png`
