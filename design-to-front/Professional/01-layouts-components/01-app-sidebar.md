# Component Prompt: AppSidebar (Professional)

> **Design Node ID**: `tgJWP`
> **Component File**: `src/components/app/AppSidebar.vue`
> **Width**: 256px | **Height**: 100% (fill viewport)
> **Reusability**: Used in every Professional workspace page via AppShell layout

---

## 1. Overview

The sidebar is a fixed-width vertical panel on the left side of every Professional workspace page. It contains the brand logo and 5 navigation items. One nav item (Invitations) shows a notification badge.

---

## 2. Full Structure

```
┌──────────────────────┐
│ [P] Professional     │ ← Header: 32px logo + brand text, padding 24px, bottom border
├──────────────────────┤
│                      │
│ 📊 Dashboard         │ ← Nav items: 40px height, rounded 10px, padding 10px 12px
│ 📚 Organizations     │   Icon 18px + Text 14px 500
│ ✉  Invitations  [2]  │   Active: #F5F5F5 bg, #2A2933 text
│ ⭐ Reviews           │   Inactive: transparent bg, #939399 text
│ ⚙ Settings          │   Badge on Invitations: 20×20px red/purple circle
│                      │
└──────────────────────┘
```

---

## 3. Container

```css
width: 256px;
height: 100%;
display: flex;
flex-direction: column;
background: #FFFFFF;
border-right: 1px solid #D9D9DB;
```

---

## 4. Sidebar Header

`padding: 24px; border-bottom: 1px solid #D9D9DB;`

### Logo Mark

| Property | Value |
|----------|-------|
| Size | 32×32px |
| Border-radius | 8px |
| Background | `#5749F4` (--primary) |
| Content | "P" (single letter) |
| Font | Inter, 16px, weight 700, color `#FFFFFF` |
| Alignment | Flex center |

### Brand Text

| Property | Value |
|----------|-------|
| Text | "Professional" |
| Font | Inter, 14px, weight 700, color `#2A2933` |
| Letter-spacing | 1.5px |

### Layout
```
[P]  Professional
```
Horizontal flex, `align-items: center`, gap 8px. Brand text is in a vertical flex column (gap 1px) to allow for a subtitle line later.

---

## 5. Navigation Items

Container: `padding: 8px 16px; display:flex; flex-direction:column; gap:2px; flex:1;`

### 5.1 Nav Item Template (SidebarNavItem.vue)

Create as a reusable sub-component:

```vue
<!-- src/components/app/SidebarNavItem.vue -->
<template>
  <router-link
    :to="to"
    class="nav-item"
    :class="{ active: isActive }"
  >
    <component :is="icon" :size="18" />
    <span class="label">{{ label }}</span>
    <span v-if="badge !== undefined" class="badge">{{ badge }}</span>
  </router-link>
</template>
```

| Props | Type | Required | Description |
|-------|------|----------|-------------|
| `to` | `RouteLocationRaw` | Yes | Router link target |
| `icon` | `Component` | Yes | Lucide icon component |
| `label` | `string` | Yes | Nav item text |
| `badge` | `number \| undefined` | No | Notification count badge |
| `isActive` | `boolean` | No | Whether this item is the current route |

**Default (Inactive) Styling**:
```css
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 40px;
  padding: 10px 12px;
  border-radius: 10px;
  color: #939399;        /* --sidebar-foreground */
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.nav-item:hover {
  background: rgba(245, 245, 245, 0.5);
  color: #2A2933;
}
```

**Active Styling**:
```css
.nav-item.active {
  background: #F5F5F5;   /* --sidebar-accent */
  color: #2A2933;        /* --sidebar-accent-foreground */
}
```

**Badge Styling**:
```css
.badge {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  border-radius: 999px;
  background: #5749F4;   /* --primary */
  color: #FFFFFF;
  font-size: 10px;
  font-weight: 700;
  padding: 0 5px;
}
```

### 5.2 Navigation Items (5 total)

| # | Icon (Lucide) | Label | Route | Badge | Default Active? |
|---|---------------|-------|-------|-------|-----------------|
| 1 | `LayoutDashboard` | Dashboard | `/professional/dashboard` | — | No |
| 2 | `Layers` | Organizations | `/professional/organizations` | — | No |
| 3 | `Mail` | Invitations | `/professional/invitations` | `2` (from store) | **Yes** |
| 4 | `Star` | Reviews | `/professional/reviews` | — | No |
| 5 | `Settings` | Settings | `/professional/settings` | — | No |

Active state is determined by matching the current route path. Invitations is active by default (matches design).

---

## 6. Active State Detection

Use Vue Router's `useRoute()` to detect which nav item is active:

```typescript
const route = useRoute();
const activeKey = computed(() => {
  if (route.path.includes('/dashboard')) return 'dashboard';
  if (route.path.includes('/organizations')) return 'organizations';
  if (route.path.includes('/invitations')) return 'invitations';
  if (route.path.includes('/reviews')) return 'reviews';
  if (route.path.includes('/settings')) return 'settings';
  return 'invitations'; // default
});
```

Or simpler: extract the first path segment after `/professional/` and match.

---

## 7. Vue Component

### File: `src/components/app/AppSidebar.vue`

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { LayoutDashboard, Layers, Mail, Star, Settings } from 'lucide-vue-next';
import SidebarNavItem from './SidebarNavItem.vue';
import { useProfessionalAppStore } from '@/stores/professionalApp';

const route = useRoute();
const store = useProfessionalAppStore();

const navItems = [
  { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', to: { name: 'pro-dashboard' } },
  { key: 'organizations', icon: Layers, label: 'Organizations', to: { name: 'pro-organizations' } },
  { key: 'invitations', icon: Mail, label: 'Invitations', to: { name: 'pro-invitations' }, badge: store.invitationCount },
  { key: 'reviews', icon: Star, label: 'Reviews', to: { name: 'pro-reviews' } },
  { key: 'settings', icon: Settings, label: 'Settings', to: { name: 'pro-settings' } },
];

function isActive(key: string): boolean {
  return route.path.includes(`/${key}`);
}
</script>
```

---

## 8. Implementation Checklist

1. [ ] Create `src/components/app/SidebarNavItem.vue` (reusable nav item)
2. [ ] Create `src/components/app/AppSidebar.vue`
3. [ ] Implement sidebar header: logo mark "P" + "Professional" text
4. [ ] Implement 5 nav items using SidebarNavItem component
5. [ ] Wire active state detection from current route
6. [ ] Wire invitation badge count from Pinia store
7. [ ] Add hover transitions
8. [ ] Run `pnpm dlx ultracite fix`

**Screenshot**: `01-app-sidebar.png`
