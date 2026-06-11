# Component Prompt: AppHeader (Business)

> **Design Node ID**: `YygsD`
> **Component File**: `src/components/app/AppHeader.vue` (Business variant)
> **Width**: fill_container (remaining space after 256px sidebar) | **Height**: 80px
> **Reusability**: Used in every Business workspace page via AppShell layout

---

## 1. Overview

The header sits at the top-right of every Business workspace page. It displays the current user's name and organization on the left, and utility controls (language switcher, theme toggle, notification bell, avatar dropdown) on the right.

---

## 2. Full Structure

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Rustam Karimov — Owner    [EN|UZ|RU]  [☀]  [🔔³]  [AI ▾]              │
│ ● AutoFix MCHJ                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Container

```css
width: 100%;
height: 80px;
display: flex;
align-items: center;
justify-content: space-between;
padding: 0 24px;
background: #FFFFFF;
border-style: solid;
border-color: #D9D9DB;
border-width: 1px 1px 1px 0; /* top, right, bottom — NO left border (abuts sidebar) */
```

> The design specifies `border-width: { top: 1, right: 1, bottom: 1 }` — no left border, since it meets the sidebar.

---

## 4. Left Side — Organization Identity (HeaderOrgInfo.vue)

```html
<div class="header-left">
  <span class="user-name">Rustam Karimov — Owner</span>
  <div class="org-line">
    <span class="accent-dot"></span>
    <span class="org-name">AutoFix MCHJ</span>
  </div>
</div>
```

**Container styles**:
```css
.header-left {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
```

### 4.1 User Name Line

| Property | Value |
|----------|-------|
| Text | `{userName} — {userRole}` (e.g. "Rustam Karimov — Owner") |
| Font | Inter, 15px, weight 600, color `#2A2933` |
| Letter-spacing | -0.3px |
| Line-height | 1.3 |

### 4.2 Organization Line

`display: flex; align-items: center; gap: 6px;`

**Accent Dot**:

| Property | Value |
|----------|-------|
| Size | 5×5px |
| Border-radius | 999px |
| Background | `#5749F4` (--primary) |

**Organization Name**:

| Property | Value |
|----------|-------|
| Text | `{orgName}` (e.g. "AutoFix MCHJ") |
| Font | Inter, 11px, weight 500, color `#616167` |
| Letter-spacing | 0.2px |
| Line-height | 1.3 |

> **Note**: Unlike the Professional header which shows multiple organizations separated by commas, the Business header shows a single organization name.

---

## 5. Right Side — Utility Controls

`display: flex; align-items: center; gap: 8px;`

### 5.1 Language Switcher (LanguageSwitcher.vue)

A compact 3-option pill toggle:

```
┌────┬────┬────┐
│ EN │ UZ │ RU │
└────┴────┴────┘
```

**Container**:
```css
display: flex;
align-items: center;
gap: 2px;
padding: 4px;
border-radius: 999px;
background: #F5F5F5;
border: 1px solid #C5C5CB;
```

**Option Styles**:

| State | Background | Text Color | Font Weight | Padding |
|-------|-----------|-----------|-------------|---------|
| **Active** | `#FFFFFF` | `#2A2933` | 600 | `4px 10px` |
| **Inactive** | `transparent` | `#616167` | 500 | `4px 10px` |

All options: `border-radius: 999px`, font Inter 12px, cursor pointer.

**Component interface**:
```typescript
defineProps<{
  modelValue: 'EN' | 'UZ' | 'RU';
}>();

defineEmits<{
  'update:modelValue': [value: 'EN' | 'UZ' | 'RU'];
}>();
```

```vue
<template>
  <div class="lang-switcher" role="radiogroup" aria-label="Language">
    <button
      v-for="lang in ['EN', 'UZ', 'RU']"
      :key="lang"
      class="lang-switcher__option"
      :class="{ 'lang-switcher__option--active': modelValue === lang }"
      role="radio"
      :aria-checked="modelValue === lang"
      @click="$emit('update:modelValue', lang)"
    >{{ lang }}</button>
  </div>
</template>
```

---

### 5.2 Theme Toggle (ThemeToggle.vue)

A single icon button:

| Property | Value |
|----------|-------|
| Size | 36×36px |
| Border-radius | 999px |
| Background | `#F5F5F5` |
| Icon | `sun` (Lucide), 16px × 16px |
| Icon color | `#2A2933` |
| Cursor | pointer |

```vue
<template>
  <button class="theme-toggle" @click="toggleTheme" aria-label="Toggle theme">
    <Sun :size="16" />
  </button>
</template>
```

```css
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 999px;
  background: #F5F5F5;
  color: #2A2933;
  cursor: pointer;
  flex-shrink: 0;
}

.theme-toggle:hover {
  background: #E8E8E8;
}
```

---

### 5.3 Notification Bell (NotificationBell.vue)

A button with a bell icon and a red notification badge:

```
┌──────┐
│  🔔  │  ← 36×36px circle, #F5F5F5 bg
│   ³  │  ← Red badge (#CC3314), 14×14px, positioned top-right
└──────┘
```

**Container** (`position: relative`):
```css
.notification-bell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 999px;
  background: #F5F5F5;
  color: #2A2933;
  cursor: pointer;
  flex-shrink: 0;
}
```

**Bell Icon** (`bell` from Lucide, 16px): positioned at (10, 10) centered.

**Badge**:
```css
.notification-bell__badge {
  position: absolute;
  top: 6px;
  right: 6px;   /* Instead of left — use right offset */
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
  border-radius: 999px;
  background: #CC3314;
  color: #FFFFFF;
  font-family: Inter, sans-serif;
  font-size: 9px;
  font-weight: 700;
  line-height: 1;
}
```

> The design shows the badge positioned at x:20, y:6 inside the 36×36 container. Translate this to CSS: `top: 6px; right: 6px;` (since the container is 36px wide: 36 - 20 - 14 = ~2px, use the 6px inset).

**Show badge only when count > 0:**
```vue
<span v-if="count > 0" class="notification-bell__badge">{{ count > 99 ? '99+' : count }}</span>
```

---

### 5.4 User Avatar Dropdown (UserAvatarDropdown.vue)

A pill-shaped button with avatar initials and a chevron:

```
┌───────┬────┐
│  AI   │ ▾  │
└───────┴────┘
```

**Container**:
```css
.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 4px;  /* top right bottom left */
  border: none;
  border-radius: 999px;
  background: #F5F5F5;
  cursor: pointer;
}
```

**Avatar Circle**:

| Property | Value |
|----------|-------|
| Size | 28×28px |
| Border-radius | 999px |
| Background | `#5749F4` (--primary) |
| Initials | "AI" (from `userInitials` store) |
| Font | Inter, 11px, weight 700, color `#FFFFFF` |
| Alignment | Flex center |

**Chevron Icon**: `chevron-down` (Lucide), 14px, color `#2A2933`.

```vue
<script setup lang="ts">
defineProps<{
  initials: string;   // e.g. "AI" for Aziz Ismoilov
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <button class="user-avatar" @click="$emit('click')" aria-label="User menu">
    <span class="user-avatar__circle">{{ initials }}</span>
    <ChevronDown :size="14" />
  </button>
</template>
```

---

## 6. Complete Vue Component

### File: `src/components/app/AppHeader.vue` (Business)

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Sun, Bell, ChevronDown } from 'lucide-vue-next';
import { useBusinessAppStore } from '@/stores/businessApp';
import LanguageSwitcher from './LanguageSwitcher.vue';
import ThemeToggle from './ThemeToggle.vue';
import NotificationBell from './NotificationBell.vue';
import UserAvatarDropdown from './UserAvatarDropdown.vue';

const store = useBusinessAppStore();
</script>

<template>
  <header class="header">
    <div class="header__left">
      <span class="header__user-name">{{ store.userName }} — {{ store.userRole }}</span>
      <div class="header__org-line">
        <span class="header__accent-dot" />
        <span class="header__org-name">{{ store.orgName }}</span>
      </div>
    </div>

    <div class="header__right">
      <LanguageSwitcher
        v-model="store.language"
      />
      <ThemeToggle />
      <NotificationBell :count="store.notificationCount" />
      <UserAvatarDropdown
        :initials="store.userInitials"
      />
    </div>
  </header>
</template>
```

---

## 7. Styles

```css
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  padding: 0 24px;
  background: #FFFFFF;
  border-style: solid;
  border-color: #D9D9DB;
  border-width: 1px 1px 1px 0;
  flex-shrink: 0;
}

/* Left Side */
.header__left {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.header__user-name {
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #2A2933;
  letter-spacing: -0.3px;
  line-height: 1.3;
}

.header__org-line {
  display: flex;
  align-items: center;
  gap: 6px;
}

.header__accent-dot {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: #5749F4;
  flex-shrink: 0;
}

.header__org-name {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #616167;
  letter-spacing: 0.2px;
  line-height: 1.3;
}

/* Right Side */
.header__right {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

---

## 8. Static Data for Mocking

```typescript
// src/data/businessHeader.ts
export const mockBusinessHeader = {
  userName: 'Rustam Karimov',
  userRole: 'Owner',
  orgName: 'AutoFix MCHJ',
  userInitials: 'RK',
  language: 'EN' as const,
  notificationCount: 3,
};
```

---

## 9. Accessibility Notes

- Header is a `<header>` landmark element
- Language switcher uses `role="radiogroup"` with `role="radio"` options
- All icon buttons have `aria-label` (e.g., "Toggle theme", "Notifications", "User menu")
- Notification badge announces count via `aria-label="3 notifications"`
- Use `aria-expanded` on the avatar dropdown button when a dropdown menu is open

---

## 10. Differences from Professional Header

| Property | Professional | Business |
|----------|-------------|----------|
| User name format | `{name} — {specialization}` | `{name} — {role}` |
| Organization display | Multi-org: "AutoFix MCHJ, Something MCHJ" | Single org: "AutoFix MCHJ" |
| Language switcher | Same | Same |
| Theme toggle | Same | Same |
| Notification bell | Same | Same |
| Avatar dropdown | Same structure | Same structure |
| Left border | Full border (all sides) | No left border (abuts sidebar) |
