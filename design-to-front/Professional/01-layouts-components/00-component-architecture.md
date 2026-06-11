# Professional App — Component Architecture & Layout System

> **Design Source**: `masters-app-halo.pen`
> **Approach**: Extract repeating parts → Build shared components → Compose pages from them
> **Output Folder**: `src/components/` and `src/layouts/`

---

## 1. Philosophy: DRY Layout Composition

Every page in the Professional workspace follows the same structure:

```
┌──────────────────────────────────────────────────────────┐
│ ┌──────────┐ ┌─────────────────────────────────────────┐ │
│ │          │ │  HEADER (tDq5d)             80px        │ │
│ │          │ ├─────────────────────────────────────────┤ │
│ │ SIDEBAR  │ │                                         │ │
│ │ (tgJWP)  │ │  PAGE CONTENT                           │ │
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
AppShell.vue                    ← The master layout wrapper
├── AppSidebar.vue              ← Fixed 256px left sidebar (tgJWP)
│   ├── SidebarLogo.vue          ← Logo mark + "Professional" brand
│   ├── SidebarNav.vue           ← Navigation list container
│   │   └── SidebarNavItem.vue   ← Individual nav item (reusable, active/inactive states)
│   └── SidebarFooter.vue        ← (future: user info, logout, etc.)
│
├── AppHeader.vue               ← Top bar, 80px (tDq5d)
│   ├── HeaderTitle.vue          ← Page title + org breadcrumb
│   ├── LanguageSwitcher.vue     ← EN | UZ | RU pill toggle
│   ├── ThemeToggle.vue          ← Sun/moon icon button
│   ├── NotificationBell.vue     ← Bell icon + red badge
│   └── UserAvatarDropdown.vue   ← Avatar + chevron-down
│
└── <router-view />             ← Page-specific content (changes per route)
```

---

## 3. Route → Layout Mapping

All Professional routes use the `AppShell` layout:

```typescript
// src/router/professional.routes.ts
export const professionalRoutes = [
  {
    path: '/professional',
    component: () => import('@/layouts/AppShell.vue'),
    children: [
      { path: 'dashboard', name: 'pro-dashboard', component: () => import('@/views/professional/Dashboard.vue') },
      { path: 'organizations', name: 'pro-organizations', component: () => import('@/views/professional/Organizations.vue') },
      { path: 'invitations', name: 'pro-invitations', component: () => import('@/views/professional/Invitations.vue') },
      { path: 'reviews', name: 'pro-reviews', component: () => import('@/views/professional/Reviews.vue') },
      { path: 'settings', name: 'pro-settings', component: () => import('@/views/professional/Settings.vue') },
    ],
  },
];
```

---

## 4. Data Flow & State Management

### Shared State (Pinia Store)

```typescript
// src/stores/professionalApp.ts
interface ProfessionalAppState {
  // Navigation
  activeNavItem: 'dashboard' | 'organizations' | 'invitations' | 'reviews' | 'settings';
  invitationCount: number;

  // Header
  userName: string;
  userInitials: string;
  userSpecialization: string;
  organizations: string[];       // e.g. ['AutoFix MCHJ', 'Something MCHJ']
  activeOrganization: string;
  notificationCount: number;

  // Preferences
  language: 'EN' | 'UZ' | 'RU';
  theme: 'light' | 'dark';
}
```

### Mock Data

```typescript
const MOCK_PROFESSIONAL_STATE: ProfessionalAppState = {
  activeNavItem: 'invitations',
  invitationCount: 2,
  userName: 'Rustam Karimov',
  userInitials: 'AI',           // from "Aziz Ismoilov" — adjust as needed
  userSpecialization: 'Electric',
  organizations: ['AutoFix MCHJ', 'Something MCHJ'],
  activeOrganization: 'AutoFix MCHJ',
  notificationCount: 3,
  language: 'EN',
  theme: 'light',
};
```

---

## 5. Implementation Order for Agents

### Phase 1: Foundation Components
1. Create `src/layouts/AppShell.vue` — master layout with sidebar + header + content slot
2. Create `src/components/app/AppSidebar.vue` — full sidebar assembly
3. Create `src/components/app/AppHeader.vue` — full header assembly

### Phase 2: Leaf Components
4. Create `src/components/app/SidebarNavItem.vue` — reusable nav item
5. Create `src/components/app/LanguageSwitcher.vue`
6. Create `src/components/app/ThemeToggle.vue`
7. Create `src/components/app/NotificationBell.vue`
8. Create `src/components/app/UserAvatarDropdown.vue`

### Phase 3: Integration
9. Create the Pinia store
10. Create professional routes with AppShell layout
11. Create placeholder page components (Dashboard, Organizations, etc.)
12. Verify sidebar navigation highlights correctly per route

### Phase 4: Polish
13. Run `pnpm dlx ultracite fix`
14. Test that clicking nav items changes the active state and routes navigate
15. Test language switcher, theme toggle, bell badge count

---

## 6. Responsive Notes

- The sidebar is fixed at 256px on screens ≥ 1024px
- Below 1024px, the sidebar should collapse to an icon-only mode (or hamburger menu)
- The header title should truncate on narrow screens

---

## 7. Design Tokens Reference

```css
--sidebar: #FFFFFF;
--sidebar-foreground: #939399;
--sidebar-accent: #F5F5F5;
--sidebar-accent-foreground: #2A2933;
--sidebar-border: #D9D9DB;
--primary: #5749F4;
--foreground: #2A2933;
--muted-foreground: #616167;
--destructive: #CC3314;
--border: #C5C5CB;
--accent: #F5F5F5;
```
