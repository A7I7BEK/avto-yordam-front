# Page Prompt: Professional Settings — Appearance & Language

> **Design Node ID**: `rEZRn` | **Route**: `/professional/settings/appearance`
> **Shared Shell**: Sidebar (Settings active) + Header + Settings sub-nav

---

## 1. Overview

Two-section settings page: **Theme** (Light/Dark/System selection cards) and **Language** (selectable language list with flags).

---

## 2. Content Structure

```
┌──────────────────────────────────────────────────────────┐
│ Workspace > Settings > Appearance & language             │
│                                                          │
│ ┌──────────┬─────────────────────────────────────────────┤
│ │PERSONAL  │  Appearance & language                      │
│ │          │                                             │
│ │👤Account │  Theme                                      │
│ │          │  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │🔔Notif.  │  │ ☀ Light  │ │ 🌙 Dark  │ │ 💻 System│   │
│ │          │  │  (sel)   │ │          │ │          │   │
│ │PREFERENCES│ │ ┌──────┐ │ │ ┌──────┐ │ │ ┌──────┐ │   │
│ │          │  │ │light │ │ │ │dark  │ │ │ │l ▐ d│ │   │
│ │🎨Appear. │  │ │preview│ │ │ │prevw │ │ │ │split │ │   │
│ │ (active) │  │ └──────┘ │ │ └──────┘ │ │ └──────┘ │   │
│ │          │  │ ● Light  │ │ ○ Dark   │ │ ○ System │   │
│ │🛡Privacy │  └──────────┘ └──────────┘ └──────────┘   │
│ │          │                                             │
│ │          │  Language                                   │
│ │          │  ┌──────────────────────────────────────┐  │
│ │          │  │ 🇬🇧 English  EN              ✓      │  │  ← selected
│ │          │  │ 🇺🇿 Uzbek    UZ                     │  │
│ │          │  │ 🇷🇺 Russian  RU                     │  │
│ │          │  └──────────────────────────────────────┘  │
│ │          │                                             │
│ │          │                          [Save changes]     │
│ └──────────┴─────────────────────────────────────────────┤
└──────────────────────────────────────────────────────────┘
```

---

## 3. Shell (shared)

- Breadcrumb: `Workspace > Settings > Appearance & language`
- Sub-nav: Appearance & language **active** (`#F5F5F5` bg, 600 weight)

---

## 4. Page Header

- **Title**: "Appearance & language", Inter 22px 700, `#2A2933`
- No subtitle needed (or same as settings default)

---

## 5. Theme Section

### 5.1 Section Label

"Theme", Inter 14px 600, `#2A2933`

### 5.2 Theme Cards Row

3 equal-width cards in a row, gap 16px.

**Shared card**: rounded 24px, padding 14px, `#FFFFFF` bg, flex column, gap 10px.

**Selected card**: 2px `#5749F4` border. **Unselected**: 1px `#C5C5CB` border.

#### Card 1: Light (selected)

**Preview area** (120px height, rounded 6px, 1px `#C5C5CB` border, `#FFFFFF` bg, padding 8px, gap 6px):
- Left sidebar strip: 32px wide, `#F5F5F5` bg
- Right content: mock elements — header bar, content blocks in `#F5F5F5`

**Footer**: `space-between`
- Left: ☀ `sun` icon 16px + "Light" Inter 13px 500 `#2A2933`, gap 6px
- Right: Radio selected — 16px circle, `#5749F4` fill, small white dot inside

#### Card 2: Dark

**Preview area**: `#131124` bg (dark), mock elements in `#1A182E`
- Same structure, dark theme colors

**Footer**: `moon` icon + "Dark", radio unselected (16px circle, white fill, 1px `#C5C5CB` border, no dot)

#### Card 3: System

**Preview area**: Split — left half `#FFFFFF` (light), right half `#131124` (dark)
- Clipped to rounded 6px

**Footer**: `monitor` icon + "System", radio unselected

---

## 6. Language Section

### 6.1 Section Label

"Language", Inter 14px 600, `#2A2933`

### 6.2 Language List

Vertical stack, gap 8px.

Each language item: rounded 24px, padding 16px, `#FFFFFF` bg, flex row, gap 14px, `align-items:center`.

**Selected**: 2px `#5749F4` border. **Unselected**: 1px `#C5C5CB` border.

Item structure:
- **Flag**: 28×20px, rounded 6px, clipped. Mock: 3 horizontal stripes (country flag colors)
  - English: 🇬🇧 blue/white/red (`#012169`/`#FFFFFF`/`#C8102E`)
  - Uzbek: 🇺🇿 blue/white/green (`#0099B5`/`#FFFFFF`/`#1EB53A`)
  - Russian: 🇷🇺 white/blue/red (`#FFFFFF`/`#0039A6`/`#D52B1E`)
- **Text** (flex column, gap 2px):
  - Language name: Inter 14px 600, `#2A2933`
  - Language code: Inter 11px, `#616167`
- **Checkmark** (right): Selected only — 16px circle, `#5749F4` fill, white `check` icon 10px

| # | Flag | Name | Code | Selected |
|---|------|------|------|----------|
| 1 | 🇬🇧 | English | EN | ✅ |
| 2 | 🇺🇿 | Uzbek | UZ | ○ |
| 3 | 🇷🇺 | Russian | RU | ○ |

Clicking a language selects it (radio behavior — only one selected at a time).

---

## 7. Footer

"Save changes" primary button, right-aligned.

---

## 8. Vue Component

### File: `src/views/professional/settings/Appearance.vue`

### Icons (Lucide)
`Sun`, `Moon`, `Monitor`, `Check`, `ChevronRight`

### Interactions

| Action | Behavior |
|--------|----------|
| Click theme card | Select that theme, update radio indicators |
| Click language item | Select that language, update checkmarks |
| "Save changes" | Persist to store / mock toast |

---

## 9. Implementation Checklist

1. [ ] Create `src/views/professional/settings/Appearance.vue`
2. [ ] Reuse shell + sub-nav (Appearance & language active)
3. [ ] Theme section: 3 cards with preview areas + radio footers
4. [ ] Language section: 3 items with flag stripes + checkmarks
5. [ ] Theme/Language selection logic
6. [ ] Save button
7. [ ] Run `pnpm dlx ultracite fix`

**Screenshot**: `01-appearance.jpg`
