# Page Prompt: Personal Info — Preview (Read-only)

> **Node**: `G9Fnan` | **Tab**: Personal info (active) | **Mode**: Preview
> **Route**: `/professional/settings/account?tab=personal`

## 1. Overview

Read-only view of the professional's profile. Shows avatar, verified badge, and detail cards in a grid. Has an "Edit profile" button that navigates to the edit view.

## 2. Content Area

### 2.1 Section Header (space-between)

**Left**: "Personal information" (Inter 16px 600 `#2A2933`) + "How customers and teammates see you. Read-only preview." (Inter 12px `#616167`), gap 4px

**Right — Edit button**: Purple pill, padding 8px 14px, `pencil` icon 13px + "Edit profile" Inter 12px 600 `#FFFFFF`, gap 6px. → Navigates to edit tab.

### 2.2 Profile Header Row (gap 18px)

- **Avatar**: 64×64px circle, `#5749F4` bg, "AI" initials Inter 20px 700 `#FFFFFF`
- **Name + Role** (gap 4px): "Aziz Ismoilov" Inter 18px 700 + "Master mechanic · Tashkent, Uzbekistan" Inter 13px `#616167`
- **Verified badge**: `badge-check` icon + "Verified master" Inter 11px 600 `#003300`, green bg pill (`#A1E5A1`), padding 6px 12px

### 2.3 Divider

1px `#C5C5CB`, full width

### 2.4 Detail Cards (2-column grid, gap 16px)

Each card: rounded 6px, `#F5F5F5` bg, 1px `#C5C5CB` border, padding 14px, flex column, gap 8px.
- Label: Inter 11px 500, `#616167`
- Value: Inter 15px 600, `#2A2933`

**Row 1** (2 cards):
| Label | Value |
|-------|-------|
| Full name | Aziz Ismoilov |
| Date of birth | 14 / 02 / 1991 |

**Row 2** (2 cards):
| Label | Value |
|-------|-------|
| Specialization | European brands · Engine & diagnostics |
| Working time | Mon–Sat · 09:00–19:00 |

**Row 3** (1 card, full width):
| Label | Value |
|-------|-------|
| Years of experience (self-reported) | 8 years |

## 3. Implementation

Create `src/views/professional/settings/AccountPersonalPreview.vue` or use a single `AccountSettings.vue` with conditional rendering based on tab + mode.

**Icons**: `Pencil`, `BadgeCheck`

**Screenshot**: `01-personal-info-preview.jpg`
