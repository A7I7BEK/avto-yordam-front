# Component Prompt: AppSidebar (Business)

> **Design Node ID**: `Ckxo5`
> **Component File**: `src/components/app/AppSidebar.vue` (Business variant)
> **Width**: 256px | **Height**: 100% (fill viewport)
> **Reusability**: Used in every Business workspace page via AppShell layout

---

## 1. Overview

The Business sidebar is a fixed-width vertical panel on the left side of every Business workspace page. It contains the brand logo ("Business"), 10 navigation items, and a Team section with an expandable submenu. One nav item (Orders) shows a purple notification badge.

---

## 2. Full Structure

```
┌────────────────────────┐
│ [▣] Business           │ ← Header: 32px dark logo + "Business" text, padding 24px, bottom border
├────────────────────────┤
│                        │
│ 📊 Dashboard           │ ← Nav items: 40px height, rounded 10px, padding 10px 12px
│ 📄 Orders        [7]   │   Icon 18px + Text 14px 500
│ 📚 Categories  ACTIVE  │   Inactive: transparent bg, #939399 text & icon
│ 📅 Schedules           │   Active: #F5F5F5 bg, #2A2933 text weight 600, icon #2A2933
│                        │   Badge on Orders: 20×20px purple (#5749F4) circle, white "7"
│ 👥 Team          ▾     │
│   ├ 👤 Employees       │ ← Team submenu: expandable, padding-left 16px
│   └ 👤 Members         │   Sub-items: 32px height, rounded 6px, padding 8px 12px
│                        │   Icon 16px + Text 13px
│ 💰 Earnings            │   Active sub: weight 600
│ 🧾 Transactions        │   Inactive sub: weight 500
│ ⭐ Reviews             │
│ 🛡 Roles & Permissions │
│ ⚙ Settings            │
│                        │
└────────────────────────┘
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

## 4. Sidebar Header (SidebarHeader.vue)

`padding: 24px; border-bottom: 1px solid #D9D9DB;`

### Logo Mark

| Property | Value |
|----------|-------|
| Size | 32×32px |
| Border-radius | 8px |
| Background | `#2A2933` (--foreground) |
| Content | `building-2` icon (Lucide), 18×18px |
| Icon color | `#FFFFFF` |
| Alignment | Flex center |

### Brand Text

| Property | Value |
|----------|-------|
| Text | "Business" |
| Font | Inter, 14px, weight 700, color `#2A2933` |
| Letter-spacing | 1.5px |

### Layout
```
[▣ icon in dark square]  Business
```
Horizontal flex, `align-items: center`, gap 8px.

---

## 5. Navigation Items Container

```css
padding: 8px 16px;
display: flex;
flex-direction: column;
gap: 2px;
flex: 1;
overflow-y: auto;
```

---

## 6. Navigation Items

### 6.1 SidebarNavItem.vue (Reusable Sub-component)

Create a reusable component for all flat nav items:

```vue
<!-- src/components/app/SidebarNavItem.vue -->
<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  to: string;
  icon: Component;
  label: string;
  badge?: number;
  isActive: boolean;
}>();
</script>

<template>
  <router-link
    :to="to"
    class="nav-item"
    :class="{ 'nav-item--active': isActive }"
  >
    <component :is="icon" :size="18" class="nav-item__icon" />
    <span class="nav-item__label">{{ label }}</span>
    <span
      v-if="badge !== undefined && badge > 0"
      class="nav-item__badge"
    >{{ badge }}</span>
  </router-link>
</template>
```

#### Nav Item Styles

```css
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  color: #939399;
  text-decoration: none;
  transition: background-color 0.15s, color 0.15s;
}

.nav-item:hover {
  background-color: #F5F5F5;
}

.nav-item--active {
  background-color: #F5F5F5;
  color: #2A2933;
}

.nav-item--active .nav-item__icon {
  color: #2A2933;
}

.nav-item__icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #939399;
}

.nav-item__label {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  flex: 1;
}

.nav-item--active .nav-item__label {
  font-weight: 600;
}

.nav-item__badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: #5749F4;
  color: #FFFFFF;
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
  margin-left: auto;
}
```

#### Nav Item Behavior

| State | Background | Icon Color | Text Color | Font Weight |
|-------|-----------|------------|-----------|-------------|
| **Inactive** | `transparent` | `#939399` | `#939399` | 500 |
| **Hover** | `#F5F5F5` | `#939399` | `#939399` | 500 |
| **Active** | `#F5F5F5` | `#2A2933` | `#2A2933` | **600** |

---

### 6.2 Complete Nav Items List

| # | Label | Icon (Lucide) | Route | Badge | Notes |
|---|-------|--------------|-------|-------|-------|
| 1 | Dashboard | `layout-dashboard` | `/business/dashboard` | — | Default active on load |
| 2 | Orders | `file-text` | `/business/orders` | 7 | Shows purple badge |
| 3 | Categories | `layers` | `/business/categories` | — | Active in design screenshot |
| 4 | Schedules | `calendar` | `/business/schedules` | — | |
| 5 | Team | `users` | *toggle submenu* | — | **Expandable section** (see §7) |
| 6 | Earnings | `wallet` | `/business/earnings` | — | |
| 7 | Transactions | `receipt` | `/business/transactions` | — | **Note: rounded 6px** (different!) |
| 8 | Reviews | `star` | `/business/reviews` | — | |
| 9 | Roles & Permissions | `shield-check` | `/business/roles-permissions` | — | |
| 10 | Settings | `settings` | `/business/settings` | — | |

> ⚠️ **Transactions item** has `border-radius: 6px` instead of 10px like all others. Implement this — it's visible in the design.

---

## 7. Team Submenu (SidebarTeamGroup.vue)

The "Team" nav item is special — it's an expandable/collapsible section with a submenu.

### 7.1 Team Header

```vue
<button
  class="team-header"
  @click="toggleTeam"
  :aria-expanded="isOpen"
>
  <div class="team-header__left">
    <UsersIcon :size="18" />
    <span>Team</span>
  </div>
  <ChevronDownIcon
    :size="14"
    class="team-header__chevron"
    :class="{ 'team-header__chevron--open': isOpen }"
  />
</button>
```

**Styles**:
```css
.team-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #939399;
  cursor: pointer;
}

.team-header:hover {
  background-color: #F5F5F5;
}

.team-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
}

.team-header__chevron {
  transition: transform 0.2s;
}

.team-header__chevron--open {
  transform: rotate(180deg);
}
```

### 7.2 Team Submenu

When the Team section is expanded, show two sub-items indented to the left:

```vue
<div v-show="isOpen" class="team-submenu">
  <router-link
    to="/business/team/employees"
    class="sub-nav-item"
    :class="{ 'sub-nav-item--active': activeSubItem === 'employees' }"
  >
    <UserRoundCogIcon :size="16" />
    <span>Employees</span>
  </router-link>

  <router-link
    to="/business/team/members"
    class="sub-nav-item"
    :class="{ 'sub-nav-item--active': activeSubItem === 'members' }"
  >
    <UserRoundIcon :size="16" />
    <span>Members</span>
  </router-link>
</div>
```

**Submenu Container**:
```css
.team-submenu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 0 0 16px;
}
```

**Sub Nav Item Styles**:
```css
.sub-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  color: #939399;
  text-decoration: none;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  transition: background-color 0.15s, color 0.15s;
}

.sub-nav-item:hover {
  background-color: #F5F5F5;
}

.sub-nav-item--active {
  color: #2A2933;
  font-weight: 600;
}
```

| State | Icon Color | Text Color | Font Weight |
|-------|-----------|-----------|-------------|
| **Inactive** | `#939399` | `#939399` | 500 |
| **Active** | `#939399` | `#2A2933` | **600** |

**Icons** (Lucide):
- Employees: `user-round-cog` (16px)
- Members: `user-round` (16px)

### 7.3 Chevron Icon

The chevron-down icon (14px, `#939399`) rotates 180° when the submenu is open. Add a smooth CSS transition.

---

## 8. Active Nav Item Logic

Use Vue Router's `useRoute()` to determine which nav item is active:

```typescript
import { useRoute } from 'vue-router';

const route = useRoute();

function isNavActive(path: string): boolean {
  return route.path.startsWith(path);
}

// For Team submenu items:
const isTeamActive = computed(() =>
  route.path.startsWith('/business/team/')
);
const activeTeamSubItem = computed(() => {
  if (route.path.includes('/team/employees')) return 'employees';
  if (route.path.includes('/team/members')) return 'members';
  return null;
});

// Auto-expand team submenu when a team sub-route is active:
const isTeamOpen = ref(isTeamActive.value);
watch(isTeamActive, (val) => { if (val) isTeamOpen.value = true; });
```

---

## 9. Complete Vue Component Structure

### File: `src/components/app/AppSidebar.vue` (Business)

```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  Building2,
  LayoutDashboard,
  FileText,
  Layers,
  Calendar,
  Users,
  Wallet,
  Receipt,
  Star,
  ShieldCheck,
  Settings,
  ChevronDown,
  UserRoundCog,
  UserRound,
} from 'lucide-vue-next';
import SidebarNavItem from './SidebarNavItem.vue';

// -- Route-based active detection --
const route = useRoute();
const isNavActive = (path: string) => route.path.startsWith(path);

// -- Team submenu state --
const isTeamOpen = ref(false);
const isTeamActive = computed(() => route.path.startsWith('/business/team/'));
const activeTeamSubItem = computed(() => {
  if (route.path.includes('/team/employees')) return 'employees';
  if (route.path.includes('/team/members')) return 'members';
  return null;
});
watch(isTeamActive, (val) => { if (val) isTeamOpen.value = true; });

function toggleTeam() {
  isTeamOpen.value = !isTeamOpen.value;
}

// -- Badge data (from store or props) --
const ordersBadgeCount = 7; // TODO: replace with store
</script>
```

```vue
<template>
  <aside class="sidebar">
    <!-- Header -->
    <div class="sidebar__header">
      <div class="sidebar__logo">
        <Building2 :size="18" color="#FFFFFF" />
      </div>
      <span class="sidebar__brand">Business</span>
    </div>

    <!-- Navigation -->
    <nav class="sidebar__nav">
      <SidebarNavItem
        to="/business/dashboard"
        :icon="LayoutDashboard"
        label="Dashboard"
        :is-active="isNavActive('/business/dashboard')"
      />

      <SidebarNavItem
        to="/business/orders"
        :icon="FileText"
        label="Orders"
        :badge="ordersBadgeCount"
        :is-active="isNavActive('/business/orders')"
      />

      <SidebarNavItem
        to="/business/categories"
        :icon="Layers"
        label="Categories"
        :is-active="isNavActive('/business/categories')"
      />

      <SidebarNavItem
        to="/business/schedules"
        :icon="Calendar"
        label="Schedules"
        :is-active="isNavActive('/business/schedules')"
      />

      <!-- Team Group (expandable) -->
      <div class="team-group">
        <button
          class="team-group__header"
          @click="toggleTeam"
          :aria-expanded="isTeamOpen"
        >
          <div class="team-group__header-left">
            <Users :size="18" />
            <span>Team</span>
          </div>
          <ChevronDown
            :size="14"
            class="team-group__chevron"
            :class="{ 'team-group__chevron--open': isTeamOpen }"
          />
        </button>

        <div v-show="isTeamOpen" class="team-group__submenu">
          <router-link
            to="/business/team/employees"
            class="team-group__sub-item"
            :class="{ 'team-group__sub-item--active': activeTeamSubItem === 'employees' }"
          >
            <UserRoundCog :size="16" />
            <span>Employees</span>
          </router-link>

          <router-link
            to="/business/team/members"
            class="team-group__sub-item"
            :class="{ 'team-group__sub-item--active': activeTeamSubItem === 'members' }"
          >
            <UserRound :size="16" />
            <span>Members</span>
          </router-link>
        </div>
      </div>

      <SidebarNavItem
        to="/business/earnings"
        :icon="Wallet"
        label="Earnings"
        :is-active="isNavActive('/business/earnings')"
      />

      <SidebarNavItem
        to="/business/transactions"
        :icon="Receipt"
        label="Transactions"
        :is-active="isNavActive('/business/transactions')"
        class="nav-item--transactions"
      />

      <SidebarNavItem
        to="/business/reviews"
        :icon="Star"
        label="Reviews"
        :is-active="isNavActive('/business/reviews')"
      />

      <SidebarNavItem
        to="/business/roles-permissions"
        :icon="ShieldCheck"
        label="Roles & Permissions"
        :is-active="isNavActive('/business/roles-permissions')"
      />

      <SidebarNavItem
        to="/business/settings"
        :icon="Settings"
        label="Settings"
        :is-active="isNavActive('/business/settings')"
      />
    </nav>
  </aside>
</template>
```

---

## 10. Style Override: Transactions Item

The Transactions nav item has `border-radius: 6px` instead of the default `10px`. Add this override:

```css
.nav-item--transactions {
  border-radius: 6px;
}
```

This can be done via a CSS class prop on the `SidebarNavItem` or by passing a `borderRadius` prop.

---

## 11. Static Data for Mocking

```typescript
// src/data/businessSidebar.ts
export const businessNavItems = [
  { to: '/business/dashboard',        icon: 'layout-dashboard', label: 'Dashboard',         badge: undefined },
  { to: '/business/orders',           icon: 'file-text',        label: 'Orders',            badge: 7 },
  { to: '/business/categories',       icon: 'layers',           label: 'Categories',        badge: undefined },
  { to: '/business/schedules',        icon: 'calendar',         label: 'Schedules',         badge: undefined },
  // Team is handled separately
  { to: '/business/earnings',         icon: 'wallet',           label: 'Earnings',          badge: undefined },
  { to: '/business/transactions',     icon: 'receipt',          label: 'Transactions',      badge: undefined },
  { to: '/business/reviews',          icon: 'star',             label: 'Reviews',           badge: undefined },
  { to: '/business/roles-permissions',icon: 'shield-check',     label: 'Roles & Permissions',badge: undefined },
  { to: '/business/settings',         icon: 'settings',         label: 'Settings',          badge: undefined },
];

export const teamSubItems = [
  { to: '/business/team/employees', icon: 'user-round-cog', label: 'Employees' },
  { to: '/business/team/members',   icon: 'user-round',     label: 'Members' },
];
```

---

## 12. Accessibility Notes

- The sidebar is an `<aside>` landmark element
- Navigation is a `<nav>` element with `aria-label="Main navigation"`
- The Team toggle button has `aria-expanded` bound to `isTeamOpen`
- Active nav items get `aria-current="page"`
- The submenu should be wrapped with `role="group"` and `aria-labelledby` pointing to the Team button

---

## 13. Icon Import Strategy

Use `lucide-vue-next` for all icons. Install with:
```bash
pnpm add lucide-vue-next
```

Import only the icons you need (tree-shakeable):
```typescript
import { Building2, LayoutDashboard, FileText, Layers, Calendar, Users, Wallet, Receipt, Star, ShieldCheck, Settings, ChevronDown, UserRoundCog, UserRound } from 'lucide-vue-next';
```


**Screenshot**: `01-app-sidebar.png`
