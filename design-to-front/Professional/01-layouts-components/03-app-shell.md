# Layout Prompt: AppShell (Professional)

> **Component File**: `src/layouts/AppShell.vue`
> **Purpose**: The master layout wrapper for ALL Professional workspace pages
> **Composes**: AppSidebar + AppHeader + `<router-view />`

---

## 1. Overview

AppShell is the outermost layout component for the Professional workspace. It arranges the sidebar (fixed left), header (top-right), and page content (remaining area) in a consistent structure used by every page.

---

## 2. Layout Grid

```
┌──────────────────────────────────────────────────────────┐
│ ┌──────────┐ ┌─────────────────────────────────────────┐ │
│ │          │ │  AppHeader           80px               │ │
│ │          │ ├─────────────────────────────────────────┤ │
│ │ AppSidebar│ │                                         │ │
│ │  256px   │ │  <router-view />                        │ │
│ │          │ │  (page content — fills remaining space)  │ │
│ │          │ │                                         │ │
│ │          │ │                                         │ │
│ └──────────┘ └─────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 3. CSS Layout (CSS Grid approach)

```css
.app-shell {
  display: grid;
  grid-template-columns: 256px 1fr;
  grid-template-rows: 80px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar content";
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.app-shell__sidebar {
  grid-area: sidebar;
}

.app-shell__header {
  grid-area: header;
}

.app-shell__content {
  grid-area: content;
  overflow-y: auto;
  background: #FFFFFF;
}
```

Or use Flexbox:

```css
.app-shell {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.app-shell__sidebar {
  width: 256px;
  flex-shrink: 0;
}

.app-shell__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.app-shell__header {
  height: 80px;
  flex-shrink: 0;
}

.app-shell__content {
  flex: 1;
  overflow-y: auto;
}
```

**Choose the Flexbox approach** — it's simpler and works well for this fixed sidebar layout.

---

## 4. Vue Component

### File: `src/layouts/AppShell.vue`

```vue
<script setup lang="ts">
import AppSidebar from '@/components/app/AppSidebar.vue';
import AppHeader from '@/components/app/AppHeader.vue';
</script>

<template>
  <div class="app-shell">
    <AppSidebar class="app-shell__sidebar" />
    <div class="app-shell__main">
      <AppHeader class="app-shell__header" />
      <main class="app-shell__content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: #FFFFFF;
}

.app-shell__sidebar {
  width: 256px;
  flex-shrink: 0;
}

.app-shell__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.app-shell__header {
  height: 80px;
  flex-shrink: 0;
}

.app-shell__content {
  flex: 1;
  overflow-y: auto;
}
</style>
```

---

## 5. Route Configuration

```typescript
// src/router/professional.routes.ts
import type { RouteRecordRaw } from 'vue-router';

export const professionalRoutes: RouteRecordRaw[] = [
  {
    path: '/professional',
    component: () => import('@/layouts/AppShell.vue'),
    redirect: '/professional/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'pro-dashboard',
        component: () => import('@/views/professional/Dashboard.vue'),
      },
      {
        path: 'organizations',
        name: 'pro-organizations',
        component: () => import('@/views/professional/Organizations.vue'),
      },
      {
        path: 'invitations',
        name: 'pro-invitations',
        component: () => import('@/views/professional/Invitations.vue'),
      },
      {
        path: 'reviews',
        name: 'pro-reviews',
        component: () => import('@/views/professional/Reviews.vue'),
      },
      {
        path: 'settings',
        name: 'pro-settings',
        component: () => import('@/views/professional/Settings.vue'),
      },
    ],
  },
];
```

---

## 6. Page Placeholders

For each child route, create a minimal placeholder page that just shows the page name:

```vue
<!-- src/views/professional/Dashboard.vue -->
<template>
  <div class="page-placeholder">
    <h1>Dashboard</h1>
    <p>Coming soon</p>
  </div>
</template>
```

Create similar placeholder files for: `Organizations.vue`, `Invitations.vue`, `Reviews.vue`, `Settings.vue`.

---

## 7. Implementation Checklist

1. [ ] Create `src/layouts/AppShell.vue` with flexbox layout
2. [ ] Import and place AppSidebar + AppHeader
3. [ ] Add `<router-view />` for page content
4. [ ] Create `src/router/professional.routes.ts` with AppShell as parent
5. [ ] Create 5 placeholder page components
6. [ ] Register routes in main router `src/router/index.ts`
7. [ ] Verify: navigating to `/professional/dashboard` renders sidebar + header + placeholder
8. [ ] Verify: clicking sidebar nav items changes the route and highlights active item
9. [ ] Run `pnpm dlx ultracite fix`

**Screenshot**: See `01-app-sidebar.png` and `02-app-header.png` for visual reference of each component.
