# Business App — Component Architecture & Layout System

> **Design Source**: `masters-app-halo.pen`
> **Approach**: Extract repeating parts → Build shared components → Compose pages from them
> **Output Folder**: `src/components/` and `src/layouts/`

---

## 1. Philosophy: DRY Layout Composition

Every page in the Business workspace follows the same structure:

```
┌──────────────────────────────────────────────────────────┐
│ ┌──────────┐ ┌─────────────────────────────────────────┐ │
│ │          │ │  HEADER (YygsD)             80px        │ │
│ │          │ ├─────────────────────────────────────────┤ │
│ │ SIDEBAR  │ │                                         │ │
│ │ (Ckxo5)  │ │  PAGE CONTENT                           │ │
│ │          │ │  (changes per route)                    │ │
│ │  256px   │ │                                         │ │
│ │          │ │                                         │ │
│ └──────────┘ └─────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

This layout itself is a reusable **AppShell** — a wrapper component that contains the sidebar and header, with a `<router-view />` (or slot) in the content area for page-specific content.

---

## 2. Component Tree

```
AppShell.vue                           ← The master layout wrapper
├── AppSidebar.vue                     ← Fixed 256px left sidebar (Ckxo5)
│   ├── SidebarHeader.vue              ← Logo mark (building icon) + "Business" brand
│   ├── SidebarNavItem.vue             ← Individual nav item (reusable, active/inactive/badge states)
│   ├── SidebarTeamGroup.vue           ← Team expandable section with chevron + submenu
│   │   └── SidebarSubNavItem.vue      ← Sub-menu item (Employees, Members)
│   └── SidebarFooter.vue              ← (future: user info, logout, etc.)
│
├── AppHeader.vue                      ← Top bar, 80px (YygsD)
│   ├── HeaderOrgInfo.vue              ← User name + org with accent dot
│   ├── LanguageSwitcher.vue           ← EN | UZ | RU pill toggle
│   ├── ThemeToggle.vue                ← Sun/moon icon button
│   ├── NotificationBell.vue           ← Bell icon + red badge
│   └── UserAvatarDropdown.vue         ← Avatar + chevron-down
│
├── EmptyStateCard.vue                 ← Reusable empty state card (Mt4Rj)
│
└── <router-view />                    ← Page-specific content (changes per route)
```

---

## 3. Route → Layout Mapping

All Business routes use the `AppShell` layout:

```typescript
// src/router/business.routes.ts
export const businessRoutes = [
  {
    path: '/business',
    component: () => import('@/layouts/AppShell.vue'),
    redirect: '/business/dashboard',
    children: [
      { path: 'dashboard',        name: 'biz-dashboard',        component: () => import('@/views/business/Dashboard.vue') },
      { path: 'orders',           name: 'biz-orders',           component: () => import('@/views/business/Orders.vue') },
      { path: 'categories',       name: 'biz-categories',       component: () => import('@/views/business/Categories.vue') },
      { path: 'schedules',        name: 'biz-schedules',        component: () => import('@/views/business/Schedules.vue') },
      { path: 'team/employees',   name: 'biz-team-employees',   component: () => import('@/views/business/TeamEmployees.vue') },
      { path: 'team/members',     name: 'biz-team-members',     component: () => import('@/views/business/TeamMembers.vue') },
      { path: 'earnings',         name: 'biz-earnings',         component: () => import('@/views/business/Earnings.vue') },
      { path: 'transactions',     name: 'biz-transactions',     component: () => import('@/views/business/Transactions.vue') },
      { path: 'reviews',          name: 'biz-reviews',          component: () => import('@/views/business/Reviews.vue') },
      { path: 'roles-permissions',name: 'biz-roles',            component: () => import('@/views/business/RolesPermissions.vue') },
      { path: 'settings',         name: 'biz-settings',         component: () => import('@/views/business/Settings.vue') },
    ],
  },
];
```

---

## 4. Data Flow & State Management

### Shared State (Pinia Store)

```typescript
// src/stores/businessApp.ts
interface BusinessAppState {
  // Navigation
  activeNavItem: string;
  ordersBadgeCount: number;
  notificationCount: number;
  teamSubmenuOpen: boolean;
  activeTeamSubItem: 'employees' | 'members';

  // Header
  userName: string;           // e.g. "Rustam Karimov"
  userRole: string;           // e.g. "Owner"
  orgName: string;            // e.g. "AutoFix MCHJ"

  // Preferences
  language: 'EN' | 'UZ' | 'RU';
  theme: 'light' | 'dark';

  // User
  userInitials: string;       // e.g. "RK"
}
```

---

## 5. Design Tokens (Shared)

```css
:root {
  /* Colors */
  --primary: #5749F4;
  --primary-foreground: #FFFFFF;
  --foreground: #2A2933;
  --muted-foreground: #616167;
  --muted-icon: #939399;
  --border: #D9D9DB;
  --border-soft: #C5C5CB;
  --accent: #F5F5F5;
  --background: #FFFFFF;
  --destructive: #CC3314;

  /* Typography */
  --font-primary: 'Inter', sans-serif;

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 10px;
  --radius-xl: 24px;
  --radius-pill: 999px;

  /* Layout */
  --sidebar-width: 256px;
  --header-height: 80px;
}
```

---

## 6. Key Differences from Professional Workspace

| Aspect | Professional | Business |
|--------|-------------|----------|
| Brand | "P" + "Professional" | building-2 icon + "Business" |
| Logo mark | Purple square (#5749F4) | Dark square (#2A2933) |
| Nav items | 5 flat items | 10 items + Team submenu |
| Badges | Invitations badge | Orders badge (purple) |
| Team section | ❌ None | ✅ Expandable submenu (Employees, Members) |
| Header user | "Rustam Karimov — Electric" | "Rustam Karimov — Owner" |
| Header org | Multi-org (comma-separated) | Single org "AutoFix MCHJ" |
| Empty states | Not defined (separate component) | 8 predefined variants |

---

## 7. Implementation Order

1. **AppShell.vue** — CSS grid/flex layout (shared between Professional and Business? Consider a single generic `AppShell` with slot-based sidebar/header injection)
2. **AppSidebar.vue** — Business sidebar with all nav items and Team submenu
3. **AppHeader.vue** — Business header with org info + controls
4. **EmptyStateCard.vue** — Generic empty state component with icon, title, description, optional button
5. Then pages: Dashboard → Orders → Categories → Schedules → Team → Earnings → Transactions → Reviews → Roles → Settings

---

## 8. Shared vs Business-Specific Components

**Fully shared** (use the same component in both Professional and Business):
- `LanguageSwitcher.vue` — identical
- `ThemeToggle.vue` — identical
- `NotificationBell.vue` — identical

**Business-specific** (different from Professional):
- `AppSidebar.vue` — different nav items, different logo, Team submenu
- `AppHeader.vue` — different left-side info (single org vs multi-org)
- `SidebarNavItem.vue` — similar but needs badge + active indicator support
- `UserAvatarDropdown.vue` — identical structure, different data

**Recommendation**: Make components generic with props/configuration where possible. For example, pass the nav items array as a prop to `AppSidebar`, pass user info as props to `AppHeader`. This way both Professional and Business can use the same components with different configuration.

---

## 9. AppShell Flexibility

To support both Professional and Business with one AppShell:

```vue
<!-- src/layouts/AppShell.vue -->
<script setup lang="ts">
defineProps<{
  sidebarComponent: Component;
  headerComponent: Component;
}>();
</script>

<template>
  <div class="app-shell">
    <component :is="sidebarComponent" class="app-shell__sidebar" />
    <div class="app-shell__main">
      <component :is="headerComponent" class="app-shell__header" />
      <main class="app-shell__content">
        <slot />
      </main>
    </div>
  </div>
</template>
```

Or simply have two separate layout files: `BusinessAppShell.vue` and `ProfessionalAppShell.vue`. Choose the simpler approach. Given the differences in sidebar nav structure, separate shells are recommended.
