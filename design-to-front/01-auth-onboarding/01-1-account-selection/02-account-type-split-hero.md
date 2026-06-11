# Page Prompt: Account Type Selection — Split Hero

> **Design Node ID**: `nlnmY`
> **Design Name**: Account Type · Split Hero
> **Target**: Vue 3 + TypeScript + Composition API
> **Route**: `/auth/account-type` (or as an alternative layout)
> **Viewport**: 1440×900px (split layout: 600px left panel + flexible right panel)

---

## 1. Overview

This is the **account type selection** page presented as a **split-screen hero** layout:
- **Left panel** (600px, fixed): A visually rich dark-purple gradient panel with branding, a compelling headline, bullet points, and social-proof statistics. This panel communicates the platform's value proposition.
- **Right panel** (flexible, fills remaining ~840px): The interactive selection area with a header, two selectable cards (Professional / Business), and a sign-in footer.

The user picks between:
- **Professional** (individual master/repair person)
- **Business** (company/organization managing a team)

---

## 2. Page Dimensions & Background

| Property | Value |
|----------|-------|
| Width | 1440px |
| Height | 900px |
| Background | `#FFFFFF` (--background) |

The page is a horizontal flex row: `display: flex; height: 900px;`.

---

## 3. Left Panel — Branding Hero (600px fixed width)

### 3.1 Panel Container

```css
width: 600px;
height: 900px;
overflow: hidden;
position: relative;
background: linear-gradient(225deg, #6B5EF9 0%, #5749F4 52%, #342B9E 100%);
```

The gradient goes from top-left to bottom-right at a 225° angle:
- Color stop 0%: `#6B5EF9`
- Color stop 52%: `#5749F4`
- Color stop 100%: `#342B9E`

### 3.2 Decorative Elements (absolute positioned, no pointer events)

All positioned absolutely within the left panel, behind the content.

**Glow 1**:
- Width: 480px, Height: 480px
- Border-radius: 50%
- Position: `left: 300px; top: -190px`
- Fill: `rgba(255,255,255,0.078)` ≈ `#FFFFFF14`

**Glow 2**:
- Width: 380px, Height: 380px
- Border-radius: 50%
- Position: `left: 360px; top: 560px`
- Fill: `rgba(255,255,255,0.059)` ≈ `#FFFFFF0F`

**Ring**:
- Width: 320px, Height: 320px
- Border-radius: 50%
- Position: `left: -130px; top: 650px`
- Border: 1.5px solid `rgba(255,255,255,0.169)` ≈ `#FFFFFF2B`
- No fill (transparent)

### 3.3 Left Content (488px wide, positioned at 56px from top-left)

```css
position: absolute;
left: 56px;
top: 56px;
width: 488px;
height: 788px; /* = 900 - 56*2 */
display: flex;
flex-direction: column;
justify-content: space-between;
```

The left content has 3 sections stacked vertically with `space-between`.

---

#### 3.3.1 Brand Section

```html
<div style="display:flex; align-items:center; gap:12px;">
  <!-- Logo -->
  <div style="width:36px; height:36px; border-radius:10px; background:#FFFFFF; display:flex; align-items:center; justify-content:center;">
    <WrenchIcon :size="20" color="#5749F4" />
  </div>
  <!-- Brand Name -->
  <span style="font-family:Inter; font-size:24px; font-weight:600; color:#FFFFFF;">Professional</span>
</div>
```

| Element | Spec |
|---------|------|
| Logo box | 36×36px, border-radius 10px, `#FFFFFF` bg, flex center |
| Logo icon | **`wrench`** from Lucide, 20px, color `#5749F4` |
| Brand text | "Professional", Inter 24px, weight 600, color `#FFFFFF` |

---

#### 3.3.2 Middle Section (gap: 26px between children)

Contains: Eyebrow → Headline → Paragraph → Bullets

**3.3.2.1 Eyebrow Chip**:
```html
<div style="display:flex; align-items:center; gap:8px; padding:7px 14px; border-radius:999px; background:rgba(255,255,255,0.141);">
  <SparklesIcon :size="14" color="#FFFFFF" />
  <span>Welcome to Avto Yordam</span>
</div>
```
- Background: `rgba(255,255,255,0.141)` ≈ `#FFFFFF24`
- Text: "Welcome to Avto Yordam", Inter 12px, weight 600, color `#FFFFFF`, letter-spacing: 0.3px
- Icon: **`sparkles`** from Lucide, 14px, `#FFFFFF`

**3.3.2.2 Headline**:
- Text: **"Your craft. Your hours. Your income."**
- Font: Inter, **40px**, weight **700**, color `#FFFFFF`
- Line-height: **1.15**
- Full width of container

**3.3.2.3 Paragraph**:
- Text: "Masters connects skilled repair professionals and growing businesses with the customers who need them — across the whole city, every day."
- Font: Inter, 16px, weight 400, color `rgba(255,255,255,0.769)` ≈ `#FFFFFFC4`
- Line-height: **1.55**
- Full width of container

**3.3.2.4 Bullet Points (3 items, vertical gap: 16px)**:

Each bullet is a horizontal row: `display:flex; align-items:center; gap:14px;`

**Icon container** (shared across all bullets):
- Width × Height: 38×38px
- Border-radius: 12px
- Background: `rgba(255,255,255,0.122)` ≈ `#FFFFFF1F`
- Icon inside: Lucide icon, 18px, color `#FFFFFF`

**Bullet text**: Inter, 15px, weight 500, color `rgba(255,255,255,0.902)` ≈ `#FFFFFFE6`

| # | Icon (Lucide) | Text |
|---|---------------|------|
| 1 | `calendar-check` | "Work on a schedule that fits your life" |
| 2 | `wallet` | "Get paid quickly after every job" |
| 3 | `shield-check` | "Join a verified, trusted community" |

---

#### 3.3.3 Stats Section

A horizontal row of 3 stat blocks separated by vertical dividers.

```html
<div style="display:flex; align-items:center; gap:22px;">
  <!-- Stat 1 -->
  <div style="display:flex; flex-direction:column; gap:3px;">
    <span style="font:Inter; font-size:24px; font-weight:700; color:#FFFFFF;">12K+</span>
    <span style="font:Inter; font-size:12px; font-weight:400; color:rgba(255,255,255,0.6);">Active masters</span>
  </div>
  <!-- Divider -->
  <div style="width:1px; height:40px; background:rgba(255,255,255,0.161);"></div>
  <!-- Stat 2 -->
  <div style="display:flex; flex-direction:column; gap:3px;">
    <span style="...">4.9</span>
    <span style="...">Average rating</span>
  </div>
  <!-- Divider -->
  <div style="width:1px; height:40px; background:rgba(255,255,255,0.161);"></div>
  <!-- Stat 3 -->
  <div style="display:flex; flex-direction:column; gap:3px;">
    <span style="...">98%</span>
    <span style="...">Jobs completed</span>
  </div>
</div>
```

| Stat | Value | Label |
|------|-------|-------|
| 1 | **12K+** | Active masters |
| 2 | **4.9** | Average rating |
| 3 | **98%** | Jobs completed |

**Value styling**: Inter, 24px, weight 700, color `#FFFFFF`
**Label styling**: Inter, 12px, weight 400, color `rgba(255,255,255,0.6)` ≈ `#FFFFFF99`
**Divider**: 1px × 40px, `rgba(255,255,255,0.161)` ≈ `#FFFFFF29`
**Gap between stats**: 22px

---

## 4. Right Panel — Account Selection (flexible width)

### 4.1 Panel Container

```css
flex: 1;
display: flex;
align-items: center;    /* vertical centering */
justify-content: center;
padding: 0 64px;
background: #FFFFFF;
```

### 4.2 Right Content (flex column, gap: 30px)

Contains: Header → Cards Row → Footer (sign-in)

---

#### 4.2.1 Header Section (flex column, gap: 12px)

**Chip** (above the title):
```html
<div style="display:flex; align-items:center; gap:6px; padding:6px 12px; border-radius:999px; background:rgba(87,73,244,0.078);">
  <UserPlusIcon :size="13" color="#5749F4" />
  <span>Create your account</span>
</div>
```
- Background: `rgba(87, 73, 244, 0.078)` ≈ `#5749F414`
- Icon: **`user-plus`** from Lucide, 13px, color `#5749F4`
- Text: "Create your account", Inter, 12px, weight 600, color `#5749F4`

**Title**:
- "Choose your account type"
- Inter, 28px, weight 600, color `#2A2933` (--foreground)

**Description**:
- "Tell us how you'll use Masters so we can set up the right tools for you. Pick the option that fits you best."
- Inter, 15px, weight 400, color `#616167` (--muted-foreground)
- Line-height: 1.5
- Full width

---

#### 4.2.2 Cards Row

Two cards side-by-side with equal width, 24px gap.

```html
<div style="display:flex; gap:24px; width:100%;">
  <!-- Professional Card -->
  <!-- Business Card -->
</div>
```

Each card: `flex: 1;` (equal width)

### 4.3 Shared Card Styling

| Property | Value |
|----------|-------|
| Height | 436px (fixed) |
| Border-radius | 40px (--radius-l) |
| Background | `#FFFFFF` (--card) |
| Border | 1px solid `#C5C5CB` (--border), inner |
| Box-shadow | `0 10px 8.75px rgba(0,0,0,0.039)` — blur:8.75px, color:#0000000a, offset-y:10px |
| Padding | 28px (all sides) |
| Layout | flex column, justify-content: space-between, gap: 16px |

### 4.4 Professional Card

#### 4.4.1 Card Structure

```
┌──────────────────────────────┐
│ [Icon 56×56]      [Badge]   │ ← Top row, space-between
│                              │
│ Professional                 │ ← Title
│ Individual repair...         │ ← Subtitle
│                              │
│ Register as an individual... │ ← Description paragraph
│                              │
│ ──────────────────────       │ ← Divider
│                              │
│ ○ Set your own rates...      │ ← Feature 1
│ ○ Fast payouts after...      │ ← Feature 2
│ ○ Build your reputation...   │ ← Feature 3
│                              │
│ [  Continue as Pro  ]        │ ← CTA Button (full width)
└──────────────────────────────┘
```

#### 4.4.2 Top Row (`justify-content: space-between; align-items: center`)

**Icon Tile** (left):
- Width × Height: 56×56px
- Border-radius: 24px (--radius-m)
- Background: `#5749F4` (--primary)
- Icon: **`user-round`** from Lucide, 26px, color `#FFFFFF`, centered

**Badge** (right):
- Padding: 5px 11px
- Border-radius: 999px (pill)
- Background: `#F5F5F5` (--accent)
- Text: "FOR INDIVIDUALS"
- Font: Inter, 11px, weight 600, color `#616167`, letter-spacing: 0.4px

#### 4.4.3 Title Group (`flex column, gap: 4px`)

**Title**: "Professional"
- Inter, 20px, weight 600, color `#2A2933`

**Subtitle**: "Individual repair professional"
- Inter, 13px, weight 400, color `#616167`

#### 4.4.4 Description

- "Register as an individual craftsperson — take jobs, set your own rates, and earn on your own schedule."
- Inter, 14px, weight 400, color `#616167`
- Line-height: 1.5

#### 4.4.5 Divider

- Width: 100%, Height: 1px
- Color: `#C5C5CB` (--border)

#### 4.4.6 Features (3 items, vertical gap: 11px)

Each feature: `display:flex; align-items:center; gap:10px;`

**Feature icon**: **`circle-check`** from Lucide, 18px
- Color: `#5749F4` (--primary) for Professional card

**Feature text**: Inter, 13px, weight 400, color `#2A2933`

| # | Text |
|---|------|
| 1 | "Set your own rates and schedule" |
| 2 | "Fast payouts after every job" |
| 3 | "Build your reputation with reviews" |

**Note**: The icon is just the raw Lucide icon (no background circle). Unlike the Centered Cards variant, here we use `circle-check` directly without a container circle.

#### 4.4.7 CTA Button

Use the **Button/Large/Default** reusable component pattern:

```html
<button style="
  display:flex; align-items:center; justify-content:center; gap:6px;
  padding:16px 24px; border-radius:999px;
  background:#5749F4; color:#FFFFFF;
  font-family:Inter; font-size:14px; font-weight:500;
  width:100%; border:none; cursor:pointer;
">
  Continue as Pro
</button>
```

| Property | Value |
|----------|-------|
| Text | "Continue as Pro" |
| Font | Inter, 14px, weight 500, color `#FFFFFF` |
| Padding | 16px 24px |
| Border-radius | 999px (pill) |
| Background | `#5749F4` (--primary) |
| Width | 100% (fill_container) |
| Icon | No icon in this variant (the Button/Large/Default ref shows an optional leading icon "plus" but it's disabled here) |

### 4.5 Business Card

Same structure as Professional Card with these differences:

#### 4.5.1 Top Row

**Icon Tile**:
- Same 56×56px, rounded 24px
- Background: `#2A2933` (--foreground) ← **dark, not purple**
- Icon: **`building-2`** from Lucide, 26px, color `#FFFFFF`

**Badge**:
- Same styling
- Text: "FOR COMPANIES"

#### 4.5.2 Title Group

**Title**: "Business"
- Inter, 20px, weight 600, color `#2A2933`

**Subtitle**: "Organization or company"
- Inter, 13px, weight 400, color `#616167`

#### 4.5.3 Description

- "Register your company as a legal entity and manage a full team of masters from one shared dashboard."

#### 4.5.4 Features

| # | Text |
|---|------|
| 1 | "Manage a full team of masters" |
| 2 | "Assign and track jobs at scale" |
| 3 | "Company billing & verified entity" |

**Feature icon**: `circle-check` from Lucide, 18px, color `#2A2933` (--foreground)

#### 4.5.5 CTA Button

| Property | Value |
|----------|-------|
| Text | "Continue as Business" |
| Background | `#2A2933` (--foreground) ← **dark, not purple** |
| Other | Same as Professional CTA |

---

## 5. Footer (Right Panel Bottom)

```html
<div style="display:flex; align-items:center; justify-content:center; gap:6px; width:100%;">
  <span>Already have an account?</span>
  <a href="/auth/signin">Sign in</a>
</div>
```

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| "Already have an account?" | Inter | 14px | 400 | `#616167` (--muted-foreground) |
| "Sign in" (link) | Inter | 14px | 600 | `#5749F4` (--primary) |

---

## 6. Vue Component Specification

### 6.1 File Structure

Create a single-file component:

```
src/views/auth/AccountTypeSplitHero.vue
```

### 6.2 Component API

**Props**: None
**Emits**: None
**Internal state**:
- `selectedType: Ref<'professional' | 'business' | null>`

### 6.3 Interactions

| Element | Action |
|---------|--------|
| "Continue as Pro" button | Router navigate to professional onboarding |
| "Continue as Business" button | Router navigate to business onboarding |
| "Sign in" link | Router navigate to sign-in page |
| Cards (optional) | Hover: subtle scale or shadow lift; Click: could toggle selection visual |

### 6.4 Dependencies

- **Lucide Vue Next** (`lucide-vue-next`): Icons used:
  - `Wrench`, `Sparkles`, `CalendarCheck`, `Wallet`, `ShieldCheck` — left panel
  - `UserPlus`, `UserRound`, `Building2`, `CircleCheck` — right panel
- **Vue Router**: `useRouter` for navigation

### 6.5 CSS Approach

Scoped styles in SFC. Variables:

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

### 6.6 Accessibility

- All interactive elements keyboard-focusable
- Semantic HTML: `<h1>`, `<h2>`, `<p>`, `<button>`, `<a>`
- Left panel text must have sufficient contrast against the gradient background
- Stats section: use `<dl>` or semantic list if appropriate
- Sign-in link must be a `<router-link>` or `<a>`

### 6.7 Responsive Behavior

- **Below 1024px**: Stack left panel on top of right panel (vertical layout). Left panel height should shrink proportionally.
- **Below 768px**: Cards stack vertically. Left panel becomes a compact banner.
- **Below 480px**: Reduce font sizes; left panel stats may wrap.

---

## 7. Left Panel Gradient Stops

```css
background: linear-gradient(225deg, #6B5EF9 0%, #5749F4 52%, #342B9E 100%);
```

| Stop | Color | Position |
|------|-------|----------|
| 1 | `#6B5EF9` | 0% |
| 2 | `#5749F4` | 52% |
| 3 | `#342B9E` | 100% |

---

## 8. Implementation Checklist for AI Agent

1. [ ] Create `AccountTypeSplitHero.vue` in `src/views/auth/`
2. [ ] Add route in `src/router/index.ts`
3. [ ] Implement left panel container with gradient background + overflow hidden
4. [ ] Add decorative glow ellipses and ring (absolute positioned, no interaction)
5. [ ] Implement left panel content: brand (logo + name)
6. [ ] Implement left panel middle: eyebrow chip → headline → paragraph → 3 bullet points
7. [ ] Implement left panel bottom: 3 stats with vertical dividers
8. [ ] Implement right panel container (flex-1, centered)
9. [ ] Implement right panel header: chip + title + description
10. [ ] Create reusable `<AccountTypeCard>` component for Professional and Business cards
11. [ ] Implement card: top row (icon tile + badge) → title + subtitle → description → divider → 3 features → CTA button
12. [ ] Professional card uses `#5749F4` accent; Business card uses `#2A2933` accent
13. [ ] Implement footer: "Already have an account? Sign in"
14. [ ] Wire up all button/link clicks to router
15. [ ] Install `lucide-vue-next` if needed
16. [ ] Ensure scoped styles, semantic HTML, accessibility
17. [ ] Run `pnpm dlx ultracite fix`
18. [ ] Test at 1440×900 viewport

---

## 9. Visual Reference

See the accompanying screenshot file: `02-account-type-split-hero.png`
