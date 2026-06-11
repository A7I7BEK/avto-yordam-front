# Component Prompt: AppHeader (Professional)

> **Design Node ID**: `tDq5d`
> **Component File**: `src/components/app/AppHeader.vue`
> **Width**: fill_container (remaining space after 256px sidebar) | **Height**: 80px
> **Reusability**: Used in every Professional workspace page via AppShell layout

---

## 1. Overview

The header sits at the top-right of every Professional workspace page. It displays the current user's name/organization on the left and utility controls (language, theme, notifications, avatar) on the right.

---

## 2. Full Structure

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Rustam Karimov — Electric        [EN|UZ|RU]  [☀]  [🔔³]  [AI ▾]        │
│ ● AutoFix MCHJ, Something MCHJ                                          │
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
border: 1px solid #D9D9DB;
border-left: none; /* sidebar covers left edge */
```

> Note: The design shows `border-width: { top: 1, right: 1, bottom: 1 }` — no left border since it abuts the sidebar.

---

## 4. Left Side — User Identity

```html
<div class="header-left">
  <span class="user-name">Rustam Karimov — Electric</span>
  <div class="org-line">
    <span class="accent-dot"></span>
    <span class="org-names">AutoFix MCHJ, Something MCHJ</span>
  </div>
</div>
```

### 4.1 User Name Line

| Property | Value |
|----------|-------|
| Text | "Rustam Karimov — Electric" (from store: `userName + ' — ' + userSpecialization`) |
| Font | Inter, 15px, weight 600, color `#2A2933` |
| Letter-spacing | -0.3px |
| Line-height | 1.3 |

### 4.2 Organization Line

`display:flex; align-items:center; gap:6px;`

**Accent Dot**:
| Property | Value |
|----------|-------|
| Size | 5×5px |
| Border-radius | 999px |
| Background | `#5749F4` (--primary) |

**Organization Names**:
| Property | Value |
|----------|-------|
| Text | "AutoFix MCHJ, Something MCHJ" (from store: `organizations.join(', ')`) |
| Font | Inter, 11px, weight 500, color `#616167` |
| Letter-spacing | 0.2px |
| Line-height | 1.3 |

Gap between name line and org line: 1px (tight).

---

## 5. Right Side — Utility Controls

`display:flex; align-items:center; gap:8px;`

### 5.1 Language Switcher (LanguageSwitcher.vue)

A compact 3-option pill toggle:

```
┌───┬───┬───┐
│EN │UZ │RU │
└───┴───┴───┘
```

**Container**:
| Property | Value |
|----------|-------|
| Background | `#F5F5F5` (--accent) |
| Border | 1px solid `#C5C5CB` (--border) |
| Border-radius | 999px (pill) |
| Padding | 4px |
| Gap | 2px |
| Layout | Horizontal flex |

**Each language chip** (padding 4px 10px, rounded 999px):

| State | Background | Text Color | Font |
|-------|-----------|------------|------|
| Active | `#FFFFFF` | `#2A2933` | Inter 12px, weight 600 |
| Inactive | transparent | `#616167` | Inter 12px, weight 500 |

**Default active**: "EN" (English).

**Behavior**: Clicking a chip sets the active language. For now, just toggle the visual state. The actual i18n integration comes later.

### 5.2 Theme Toggle (ThemeToggle.vue)

| Property | Value |
|----------|-------|
| Size | 36×36px circle |
| Background | `#F5F5F5` (--accent) |
| Border-radius | 999px |
| Icon | `sun` (Lucide), 16px, color `#2A2933` |
| Cursor | pointer |
| Flex | center |

**Behavior**: Click toggles between `sun` (light mode) and `moon` (dark mode) icons. For MVP, just toggle the icon — theme switching comes later.

### 5.3 Notification Bell (NotificationBell.vue)

| Property | Value |
|----------|-------|
| Container size | 36×36px |
| Background | `#F5F5F5` (--accent) |
| Border-radius | 999px |
| Layout | `position: relative` (for badge positioning) |

**Bell Icon**: `bell` (Lucide), 16px, color `#2A2933`, centered at (10, 10) within the 36px box.

**Badge**:
| Property | Value |
|----------|-------|
| Size | 14×14px |
| Border-radius | 999px (circle) |
| Background | `#CC3314` (--destructive) |
| Position | `top: 6px; right: 6px` (absolute from container) |
| Text | "3" (from store: `notificationCount`) |
| Font | Inter, 9px, weight 700, color `#FFFFFF` |
| Alignment | Flex center |

**Hide badge** if `notificationCount === 0`.

### 5.4 Avatar Dropdown (UserAvatarDropdown.vue)

A pill-shaped button with avatar + name initials + chevron:

```
┌────┬──┐
│ AI │▾ │
└────┴──┘
```

**Container**:
| Property | Value |
|----------|-------|
| Background | `#F5F5F5` (--accent) |
| Border-radius | 999px (pill) |
| Padding | 4px 12px 4px 4px |
| Gap | 8px |
| Layout | Horizontal flex, align-items center |
| Cursor | pointer |

**Avatar Circle** (left):
| Property | Value |
|----------|-------|
| Size | 28×28px |
| Border-radius | 999px |
| Background | `#5749F4` (--primary) |
| Text | "AI" (from store: `userInitials`) |
| Font | Inter, 11px, weight 700, color `#FFFFFF` |
| Alignment | Flex center |

**Chevron Icon** (right):
| Property | Value |
|----------|-------|
| Icon | `chevron-down` (Lucide), 14px |
| Color | `#2A2933` |

**Behavior**: Clicking opens a dropdown menu (for MVP, just show a placeholder alert like "Profile menu coming soon"). The full dropdown implementation (logout, settings link, etc.) is a future task.

---

## 6. Vue Component

### File: `src/components/app/AppHeader.vue`

```vue
<script setup lang="ts">
import { useProfessionalAppStore } from '@/stores/professionalApp';
import LanguageSwitcher from './LanguageSwitcher.vue';
import ThemeToggle from './ThemeToggle.vue';
import NotificationBell from './NotificationBell.vue';
import UserAvatarDropdown from './UserAvatarDropdown.vue';

const store = useProfessionalAppStore();
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <span class="user-name">{{ store.userName }} — {{ store.userSpecialization }}</span>
      <div class="org-line">
        <span class="accent-dot"></span>
        <span class="org-names">{{ store.organizations.join(', ') }}</span>
      </div>
    </div>

    <div class="header-right">
      <LanguageSwitcher />
      <ThemeToggle />
      <NotificationBell :count="store.notificationCount" />
      <UserAvatarDropdown :initials="store.userInitials" />
    </div>
  </header>
</template>
```

### Sub-component props:

| Component | Props |
|-----------|-------|
| `LanguageSwitcher` | `modelValue: string`, emits `update:modelValue` |
| `ThemeToggle` | `modelValue: 'light' \| 'dark'`, emits `update:modelValue` |
| `NotificationBell` | `count: number` |
| `UserAvatarDropdown` | `initials: string` |

---

## 7. Implementation Checklist

1. [ ] Create `src/components/app/LanguageSwitcher.vue` — 3-chip pill toggle
2. [ ] Create `src/components/app/ThemeToggle.vue` — sun/moon icon button
3. [ ] Create `src/components/app/NotificationBell.vue` — bell + red badge
4. [ ] Create `src/components/app/UserAvatarDropdown.vue` — avatar pill + chevron
5. [ ] Create `src/components/app/AppHeader.vue` — assembles all right-side controls
6. [ ] Wire left-side user name, specialization, orgs from store
7. [ ] Wire right-side controls to store (language, theme, notifications, user)
8. [ ] Add hover/click interactions
9. [ ] Run `pnpm dlx ultracite fix`

**Screenshot**: `02-app-header.png`
