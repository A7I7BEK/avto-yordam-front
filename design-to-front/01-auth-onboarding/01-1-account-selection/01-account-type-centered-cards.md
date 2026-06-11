# Page Prompt: Account Type Selection — Centered Cards

> **Design Node ID**: `fbQ3C`
> **Design Name**: Account Type · Centered Cards
> **Target**: Vue 3 + TypeScript + Composition API
> **Route**: `/auth/account-type` (or similar)
> **Viewport**: 1440×900px (centered layout, vertically spaced)

---

## 1. Overview

This is the **account type selection** page where the user picks between two roles:
- **Professional** (individual master/repair person)
- **Business** (company/organization managing a team)

The layout is a **centered, vertically-distributed** design on a white background with two subtle decorative purple blur blobs behind the content.

---

## 2. Page Dimensions & Background

| Property | Value |
|----------|-------|
| Width | 1440px |
| Height | 900px |
| Background | `#FFFFFF` (CSS variable `--background`) |

### 2.1 Decorative Background Blobs (absolute positioned, no pointer events)

**Blob 1 (top-left)**:
- Type: `<div>` with `border-radius: 50%`
- Width: 880px, Height: 880px
- Position: `left: -240px; top: -320px`
- Fill: `#5749F4` at `opacity: 0.08`
- Filter: `blur(100px)`

**Blob 2 (bottom-right)**:
- Type: `<div>` with `border-radius: 50%`
- Width: 760px, Height: 760px
- Position: `right: calc(1000px - 1440px)` = `left: 1000px; top: 460px`
- Fill: `#5749F4` at `opacity: 0.07`
- Filter: `blur(100px)`

---

## 3. Content Root

A flex column container centered in the page:

```
display: flex
flex-direction: column
align-items: center
justify-content: space-between
width: 1440px
height: 900px
padding: 44px 80px
```

This container has 3 children: **Heading**, **Cards Row**, **Footer**.

---

## 4. Heading Section

Centered text block, max-width 620px, centered horizontally.

```html
<div class="heading" style="display:flex; flex-direction:column; align-items:center; gap:12px; width:620px;">
  <h1>Choose your account type</h1>
  <p>Choose the account type that fits you best. This tailors your whole experience — you can always change it later.</p>
</div>
```

| Element | Font | Size | Weight | Color | Notes |
|---------|------|------|--------|-------|-------|
| `<h1>` | Inter | 38px | 700 | `#2A2933` (--foreground) | text-align: center |
| `<p>` | Inter | 16px | 400 (normal) | `#616167` (--muted-foreground) | line-height: 1.5, text-align: center |

---

## 5. Cards Row

Two cards side-by-side with a 28px gap.

```html
<div style="display:flex; gap:28px;">
  <!-- Master Card -->
  <!-- Business Card -->
</div>
```

### 5.1 Shared Card Styling

Both cards share the same base styling:

| Property | Value |
|----------|-------|
| Width | 400px |
| Border-radius | 40px (CSS var `--radius-l`) |
| Background | `#FFFFFF` (--card) |
| Border | 1px solid `#C5C5CB` (--border), inner stroke |
| Box-shadow | `0 12px 20px rgba(0,0,0,0.059)` — blur:20px, color:#0000000f, offset-y:12px |
| Padding | 32px (all sides) |
| Layout | flex column, gap: 22px |

### 5.2 Professional Card (Master Card)

#### 5.2.1 Card Structure (top to bottom, gap 22px)

```
┌──────────────────────────────┐
│ [IconBox 64×64]  [Badge]    │ ← Header row, space-between
├──────────────────────────────┤
│ Professional                 │ ← Title
│ Work independently...        │ ← Description
├──────────────────────────────┤
│ ────────────────────────     │ ← Divider (1px)
├──────────────────────────────┤
│ ✓ Set your own rates...      │ ← Feature 1
│ ✓ Get matched with...        │ ← Feature 2
│ ✓ Fast payouts after...      │ ← Feature 3
├──────────────────────────────┤
│ [Continue as Pro →]          │ ← CTA Button
└──────────────────────────────┘
```

#### 5.2.2 Header Row (`justify-content: space-between; align-items: center`)

**Icon Box**:
- Width × Height: 64×64px
- Border-radius: 24px (var `--radius-m`)
- Background: `#5749F4` (--primary)
- Flex center (both axes)
- Icon: **`user-round`** from Lucide icons, size 30px, color `#FFFFFF`

**Badge**:
- Padding: 6px 12px
- Border-radius: 999px (pill)
- Background: `#F5F5F5` (--accent)
- Text: "For individuals"
- Font: Inter, 12px, weight 600, color `#616167` (--muted-foreground)

#### 5.2.3 Title & Description

**Title**: "Professional"
- Font: Inter, 24px, weight 700, color `#2A2933` (--foreground)

**Description**: "Work independently — accept jobs near you, set your own rates and grow your reputation."
- Font: Inter, 14px, weight 400, color `#616167` (--muted-foreground)
- Line-height: 1.5
- Height constrained to 42px (2 lines)

#### 5.2.4 Divider

- Width: 100% of card content
- Height: 1px
- Color: `#C5C5CB` (--border)

#### 5.2.5 Features (3 items, gap 14px)

Each feature row: `display:flex; align-items:center; gap:10px;`

**Check icon container**:
- Width × Height: 22×22px
- Border-radius: 999px (circle)
- Background: `rgba(87, 73, 244, 0.102)` ≈ `#5749F41A`
- Flex center
- Icon: **`check`** from Lucide, size 13px, color `#5749F4` (--primary)

**Feature texts** (Inter, 14px, 400, `#2A2933`):
1. "Set your own rates & schedule"
2. "Get matched with nearby jobs"
3. "Fast payouts after every job"

#### 5.2.6 CTA Button

- Full width of card content
- Padding: 16px 20px
- Border-radius: 999px (pill)
- Background: `#5749F4` (--primary)
- Flex row, justify-content: center, align-items: center, gap: 8px

**Button content**:
- Text: "Continue as Pro" — Inter, 15px, weight 600, color `#FFFFFF`
- Icon: **`arrow-right`** from Lucide, size 18px, color `#FFFFFF`

### 5.3 Business Card

#### 5.3.1 Header Row

**Icon Box**:
- Same as Master (64×64px, rounded 24px)
- Background: `#2A2933` (--foreground) ← **darker, not purple**
- Icon: **`building-2`** from Lucide, size 30px, color `#FFFFFF`

**Badge**:
- Same styling as Master badge
- Text: "For companies"

#### 5.3.2 Title & Description

**Title**: "Business"
- Font: Inter, 24px, weight 700, color `#2A2933` (--foreground)

**Description**: "Register your organization and manage a whole team of masters from one dashboard."
- Same styling as Master description

#### 5.3.3 Divider

Same as Master (1px, `#C5C5CB`)

#### 5.3.4 Features (3 items, gap 14px)

**Check icon container**:
- Width × Height: 22×22px
- Border-radius: 999px
- Background: `rgba(42, 41, 51, 0.102)` ≈ `#2A29331A`
- Icon: **`check`** from Lucide, size 13px, color `#2A2933` (--foreground)

**Feature texts** (Inter, 14px, 400, `#2A2933`):
1. "Manage a team of masters"
2. "Assign & track jobs at scale"
3. "Company billing & support"

#### 5.3.5 CTA Button

- Same pill styling as Master CTA
- Background: `#2A2933` (--foreground) ← **not purple, dark**
- Text: "Continue as Business" — Inter, 15px, weight 600, color `#FFFFFF`
- Icon: **`arrow-right`** from Lucide, size 18px, color `#FFFFFF`

---

## 6. Footer

Centered below the cards.

```html
<div style="display:flex; align-items:center; gap:6px;">
  <span>Already have an account?</span>
  <a href="/auth/signin">Sign in</a>
</div>
```

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| "Already have an account?" | Inter | 14px | 400 | `#616167` (--muted-foreground) |
| "Sign in" (link) | Inter | 14px | 600 | `#5749F4` (--primary) |

---

## 7. Vue Component Specification

### 7.1 File Structure

Create a single-file component:

```
src/views/auth/AccountTypeCenteredCards.vue
```

### 7.2 Component API

**Props**: None (this is a top-level route page)

**Emits**: None (use router navigation)

**Internal state**:
- `selectedType: Ref<'professional' | 'business' | null>` — tracks which card is selected/hovered (optional enhancement)

### 7.3 Interactions

| Element | Action |
|---------|--------|
| "Continue as Pro" button | Navigate to professional registration/onboarding route |
| "Continue as Business" button | Navigate to business registration/onboarding route |
| "Sign in" link | Navigate to sign-in page route |
| Cards (optional hover) | Scale slightly or show border highlight on hover |

### 7.4 Dependencies

- **Lucide Vue Next** (`lucide-vue-next`): For icons — `UserRound`, `Building2`, `Check`, `ArrowRight`
- **Vue Router**: For navigation (`useRouter`)

### 7.5 CSS Approach

Use **scoped styles** in the SFC. Define CSS custom properties from the design system:

```css
:root {
  --background: #FFFFFF;
  --foreground: #2A2933;
  --muted-foreground: #616167;
  --primary: #5749F4;
  --primary-foreground: #FFFFFF;
  --border: #C5C5CB;
  --accent: #F5F5F5;
  --card: #FFFFFF;
  --radius-l: 40px;
  --radius-m: 24px;
  --radius-pill: 999px;
}
```

### 7.6 Accessibility Requirements

- All interactive elements (buttons, links) must be keyboard-focusable
- CTA buttons must have `role="button"` and appropriate `aria-label` attributes
- The "Sign in" link must be an `<a>` tag or `<router-link>`
- Color contrast must meet WCAG AA standards
- Use semantic HTML: `<h1>`, `<p>`, `<nav>` where appropriate

### 7.7 Responsive Notes

- On viewports narrower than 900px, stack the two cards vertically instead of side-by-side
- Maintain the centered layout
- Reduce heading font sizes proportionally on mobile

---

## 8. Design Tokens Reference

| Token | Light Value | Usage |
|-------|-------------|-------|
| `--background` | `#FFFFFF` | Page background |
| `--foreground` | `#2A2933` | Primary text, Business card icon bg, Business CTA bg |
| `--muted-foreground` | `#616167` | Secondary text, badges |
| `--primary` | `#5749F4` | Professional icon bg, Professional CTA bg, check icons, link color |
| `--primary-foreground` | `#FFFFFF` | Text on primary bg |
| `--border` | `#C5C5CB` | Card borders, dividers |
| `--accent` | `#F5F5F5` | Badge backgrounds |
| `--card` | `#FFFFFF` | Card background |
| `--radius-l` | `40px` | Card border-radius |
| `--radius-m` | `24px` | Icon box border-radius |
| `--radius-pill` | `999px` | Button and badge border-radius |

---

## 9. Implementation Checklist for AI Agent

1. [ ] Create `AccountTypeCenteredCards.vue` in `src/views/auth/`
2. [ ] Add route in `src/router/index.ts`
3. [ ] Implement decorative background blobs (absolute positioned divs with blur)
4. [ ] Implement centered content root with flexbox
5. [ ] Implement heading with title + subtitle
6. [ ] Create a reusable `<AccountTypeCard>` component or implement both cards inline
7. [ ] Professional card: icon box + badge + title + description + divider + 3 features + CTA
8. [ ] Business card: same structure with different icon, colors, and content
9. [ ] Implement footer with "Already have an account? Sign in"
10. [ ] Wire up CTA button clicks to router navigation
11. [ ] Install `lucide-vue-next` if not already installed
12. [ ] Ensure scoped styles, semantic HTML, and accessibility
13. [ ] Run `pnpm dlx ultracite fix` to format/lint
14. [ ] Test that the page renders correctly at 1440×900 viewport

---

## 10. Visual Reference

See the accompanying screenshot file: `01-account-type-centered-cards.png`
