# Page Prompt: Languages Settings

> **Node**: `yuhUc` | **Tab**: Languages (active) | **Mode**: Edit
> **Route**: `/professional/settings/account?tab=languages`

## 1. Overview

Manage the professional's spoken languages. Selectable chip-style interface with a search/add bar.

## 2. Content Area

### 2.1 Section Header — same shell (no edit button here)

### 2.2 Language Section

**Label**: "Languages you speak" (Inter 14px 600 `#2A2933`) + "Clients and organizations will see these." (Inter 12px `#616167`), gap 4px.

### 2.3 Selected Languages Chips

Selected chips are purple fill with white text. Unselected are outlined.

| Language | Selected | Style |
|----------|----------|-------|
| Uzbek | ✅ | Purple bg, white text 13px 500, pill padding 6px 14px |
| Russian | ✅ | Purple bg, white text |
| English | ○ | Outline `#C5C5CB`, `#2A2933` text, pill |
| German | ○ | Outline |

Click toggles selection. Selected chips appear at the top, unselected below.

### 2.4 Add Language Input

Pill input with search icon: `search` icon 14px + placeholder "Add a language..." Inter 13px `#616167`. `#F5F5F5` bg, 1px `#C5C5CB` border, padding 10px 16px. Full width.

As user types, suggest matching languages. For mock, show a static dropdown with suggestions like Tajik, Turkish, French, Korean.

### 2.5 Save Button

"Save changes" primary button (purple pill, full width). Only enabled if changes were made.

## 3. Implementation

**Icons**: `Search`

**Screenshot**: `02-languages.jpg`
