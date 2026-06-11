# Page Prompt: Step 1 — Personal Info

> **Design Node ID**: `i6kZIt` | **Route**: `/onboarding/professional/personal-info` | **Viewport**: 1440×1000px
> **Incoming from**: Auth flow (OTP verify or Sign Up success)
> **Leads to**: Step 2 (Professional Info)

---

## 1. Overview

First step of the 2-step onboarding wizard. The user fills in their personal profile information after authenticating. Phone and email are pre-filled from auth and read-only.

---

## 2. Page Layout

```
Page: 1440×1000px, bg #FFFFFF, padding 40px 80px, flex column, align-items center, gap 24px

  Brand header

  Stepper: ① Personal info ──── ② Professional info

  ┌──────────────────────────────────────┐
  │ Card (640px, padding 32px, gap 18px) │
  │                                      │
  │  Tell us about yourself              │
  │  This is your profile...             │
  │                                      │
  │  [AI]  [Upload photo]               │
  │  80px   JPG or PNG, max 4 MB        │
  │                                      │
  │  Full name: Aziz Ismoilov            │
  │  Date of birth: 14 / 02 / 1991       │
  │  Phone (verified) ✓: +998 90 123...  │
  │  Email: aziz.karimov@masters.uz      │
  │                                      │
  │  Languages: [Uzbek] [Russian] [English]│
  │                                      │
  │  [Back]              [Continue →]    │
  └──────────────────────────────────────┘
```

---

## 3. Stepper (Step 1 Active)

| Element | Spec |
|---------|------|
| Width | 920px |
| Layout | `display:flex; align-items:center; gap:12px;` |
| Step 1 circle | 24×24px, bg `#5749F4`, no border, "1" in white 12px 600 |
| Step 1 label | "Personal info", Inter 13px, 600, `#2A2933` |
| Line | 1px `#C5C5CB`, flex:1 |
| Step 2 circle | 24×24px, transparent bg, 1px `#C5C5CB` border, "2" `#616167` 12px 500 |
| Step 2 label | "Professional info", Inter 13px, 500, `#616167` |

---

## 4. Card (640× fill, padding 32px, gap 18px)

### 4.1 Header
- **Title**: "Tell us about yourself", Inter 24px 600, `#2A2933`
- **Subtitle**: "This is your profile — shared with every organization you work with.", Inter 14px, `#616167`, line-height 1.5
- Gap: 6px

### 4.2 Avatar & Photo Upload Row
Horizontal row: `display:flex; align-items:center; gap:20px;`

**Avatar** (left):
- 80×80px circle, bg `#5749F4`
- Initials: "AI" (first letters of mock name), Inter 28px 600, `#FFFFFF`
- Centered vertically and horizontally

**Upload column** (right, flex column gap 6px):
- **Upload button**: Outline style (`L73ds` ref = Button/Outline), text "Upload photo"
  - Padding 10px 16px, pill border, 1px `#C5C5CB`, text Inter 14px 500 `#2A2933`
- **Hint**: "JPG or PNG, max 4 MB", Inter 12px, `#616167`

### 4.3 Full Name Field
**Input Group/Filled** pattern (`VeIJB`):
- Label: "Full name"
- Value: "Aziz Ismoilov", pill input, `#F5F5F5` bg, `#C5C5CB` border
- Editable

### 4.4 Date of Birth Field
- Label: "Date of birth"
- Value: "14 / 02 / 1991"
- Same pill input styling

### 4.5 Phone Field (Read-only, Verified)

**Label row**: `display:flex; align-items:center; gap:6px;`
- "Phone (verified)" Inter 14px 500 `#2A2933`
- `badge-check` icon (Lucide), 14px, `#003300`
- "Verified" Inter 12px 500, `#003300`

**Input**: "+998 90 123 45 67", pill styling, **read-only** (grey bg, no cursor edit)

### 4.6 Email Field
- Label: "Email"
- Value: "aziz.karimov@masters.uz"
- Pill input, read-only (pre-filled from auth)

### 4.7 Languages Field

**Label**: "Languages", Inter 14px 500, `#2A2933`

**Chips row**: `display:flex; gap:8px;`

| Chip | Text | Style |
|------|------|-------|
| Uzbek | "Uzbek" | Purple bg `#5749F4`, white text 13px 500, pill, padding 6px 14px |
| Russian | "Russian" | Purple bg `#5749F4`, white text 13px 500, pill |
| English | "English" | Outline: 1px `#C5C5CB`, text `#2A2933` 13px 500, pill |

Chips are toggleable — clicking toggles between selected (purple fill) and unselected (outlined).

### 4.8 Footer Buttons

`display:flex; justify-content:space-between; width:100%;`

**Back button** (Ghost/Large style = `5wzLO` ref):
- Text: "Back", Inter 14px 500, `#2A2933`
- Background: `#F5F5F5` (--accent)
- Padding 16px 24px, pill border
- **Action**: Navigate back to previous page (auth flow entry)

**Continue button** (Primary):
- Text: "Continue" + `arrow-right` icon 14px
- Background: `#5749F4`, white text
- Padding 16px 24px, pill border
- Gap 6px between text and icon
- **Action**: Validate → save to store → navigate to Step 2

---

## 5. Vue Component

### File: `src/views/onboarding/professional/PersonalInfo.vue`

### Icons Needed (Lucide)
`UserRound`, `BadgeCheck`, `ArrowRight`

### Interactions
| Element | Action |
|---------|--------|
| "Upload photo" | Open file picker (`.jpg,.png`, max 4MB). Update avatar initials or show preview. |
| Language chips | Toggle selection on click |
| "Back" | Navigate to auth entry point |
| "Continue" | Save to store → `/onboarding/professional/professional-info` |

---

## 6. Implementation Checklist

1. [ ] Create `src/views/onboarding/professional/PersonalInfo.vue`
2. [ ] Implement brand header + stepper (step 1 active)
3. [ ] Build card: header + photo row + 5 fields + languages chips + footer
4. [ ] Avatar with initials generation from name
5. [ ] Pre-fill all fields from mock data
6. [ ] Phone/email fields as read-only with verified badge
7. [ ] Toggleable language chips
8. [ ] Wire up navigation (back + continue)
9. [ ] Create/update onboarding Pinia store
10. [ ] Run `pnpm dlx ultracite fix`

**Screenshot**: `01-personal-info.png`
