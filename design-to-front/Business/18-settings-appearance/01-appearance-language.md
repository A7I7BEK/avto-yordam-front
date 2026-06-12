# Page Prompt: Appearance & Language

> **Design Node ID**: `l6kzV` | **Name**: "Appearance & language"
> **Route**: `/business/settings/appearance` | **View File**: `src/views/business/SettingsAppearance.vue`

## Overview
Settings page for theme (light/dark/system) and language preferences. Part of Settings section. Breadcrumb: Settings > Appearance.

## Header
- Title: "Appearance & language" (Inter 24px 700)
- Subtitle: "Customize how the app looks and feels"

## Sections

### Theme
Three selectable theme cards in a row:
| Card | Icon | Label | Description |
|------|------|-------|-------------|
| Light | `sun` | Light | Always use light mode |
| Dark | `moon` | Dark | Always use dark mode |
| System | `monitor` | System | Follow device settings |

- Selected card: purple border (`#5749F4`), checked icon
- Cards: radius 16px, white bg, border, padding 16px, centered

### Language
Select dropdown or radio list:
- 🇬🇧 English (selected)
- 🇺🇿 O'zbekcha
- 🇷🇺 Русский

Dropdown: pill, white bg, border `#C5C5CB`, padding 8px 14px, `globe` icon + language name + `chevron-down`

### Date Format
- DD/MM/YYYY (selected)
- MM/DD/YYYY
- YYYY-MM-DD

### Time Format
- 24-hour (selected)
- 12-hour (AM/PM)

## Mock Data
```typescript
export const appearanceSettings = {
  theme: 'light', // 'light' | 'dark' | 'system'
  language: 'en', // 'en' | 'uz' | 'ru'
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
};
```

## Bottom Actions
- Save changes (primary `#5749F4`) — applies immediately with transition
