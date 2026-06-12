# Avto Yordam — Project Architecture & Implementation Guide

> **Design File**: `design/masters-app-halo.pen`
> **Framework**: Vue 3 + TypeScript + Composition API + Vue Router + Pinia
> **Target**: Two-part web app for auto service professionals and business organizations
> **Backend Status**: Not ready — use static mock data with clean service layer for easy migration

---

## 1. Project Overview

### Two User Types

The platform serves two distinct user types with separate workspaces:

| Workspace | Users | Purpose | URL Prefix |
|-----------|-------|---------|------------|
| **Professional** | Individual mechanics, specialists | Build reputation through reviews, join organizations, receive invitations | `/professional/*` |
| **Business** | Organization owners, admins, receptionists, masters | Manage auto service: orders, team, earnings, schedules, settings | `/business/*` |

### Account Selection → Redirect

On first login/registration, the user chooses a path:

```
┌──────────────────────────────┐
│     Welcome to Avto Yordam   │
│                              │
│  ┌────────────────────────┐  │
│  │ Continue as Business   │  │  → /business/dashboard
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ Continue as Professional│  │  → /professional/dashboard
│  └────────────────────────┘  │
└──────────────────────────────┘
```

A single user can have both a Professional and a Business account. The choice determines the initial redirect after auth.

---

## 2. Authentication & Onboarding Flow

```
Landing Page
    │
    ├── Continue as Business ──→ /auth/business/*
    │   ├── Login/Register
    │   ├── Phone verification (OTP)
    │   ├── Email sign-in/sign-up
    │   ├── Forgot password → Set new password
    │   └── Onboarding
    │       ├── Organization type selection
    │       └── Bank account setup
    │
    └── Continue as Professional ──→ /auth/professional/*
        ├── Login/Register
        ├── Phone verification (OTP)
        ├── Email sign-in/sign-up
        ├── Forgot password → Set new password
        └── Onboarding
            ├── Personal info
            └── Professional info (specialization, experience)
```

All auth pages are full-screen (no sidebar/header). After onboarding completes, the user is redirected to their workspace dashboard.

---

## 3. Full Route Architecture

### 3.1 Router Structure

```typescript
// src/router/index.ts
const routes = [
  // === Auth (no layout) ===
  {
    path: '/auth',
    children: [
      ...businessAuthRoutes,     // /auth/business/*
      ...professionalAuthRoutes, // /auth/professional/*
    ],
  },

  // === Business Workspace (with Business AppShell) ===
  {
    path: '/business',
    component: () => import('@/layouts/BusinessAppShell.vue'),
    redirect: '/business/dashboard',
    children: businessWorkspaceRoutes,
  },

  // === Professional Workspace (with Professional AppShell) ===
  {
    path: '/professional',
    component: () => import('@/layouts/ProfessionalAppShell.vue'),
    redirect: '/professional/dashboard',
    children: professionalWorkspaceRoutes,
  },

  // === Utility (no layout) ===
  { path: '/:pathMatch(.*)*', component: () => import('@/views/utility/NotFound.vue') },
];
```

### 3.2 Role-Based Dashboard Redirect

```typescript
// After login, redirect based on user role:
function getDashboardRoute(userRole: string): string {
  switch (userRole) {
    case 'owner':
    case 'admin':    return '/business/dashboard/overview';
    case 'receptionist': return '/business/dashboard/receptionist';
    case 'master':
    case 'specialist':  return '/professional/dashboard';
    default:         return '/business/dashboard/command-center';
  }
}
```

### 3.3 Full Route Tables

#### Auth Routes (`/auth/*`)

| Path | Page | Purpose |
|------|------|---------|
| `/auth/business/login` | Login/Register | Business account entry |
| `/auth/business/phone` | Phone number | Phone verification |
| `/auth/business/otp` | OTP verification | SMS code entry |
| `/auth/business/email-signin` | Email sign-in | Email + password |
| `/auth/business/email-signup` | Email sign-up | Registration |
| `/auth/business/forgot-password` | Forgot password | Password recovery |
| `/auth/business/set-new-password` | Set new password | Reset flow |
| `/auth/professional/*` | (same 7 pages) | Professional variants |

#### Business Workspace Routes (`/business/*`)

| # | Path | Page | Sidebar Nav |
|---|------|------|-------------|
| 1 | `/business/dashboard` | Dashboard (redirects by role) | Dashboard ✓ |
| 2 | `/business/orders` | Bookings List | Orders |
| 3 | `/business/orders/:id` | Order Detail | Orders |
| 4 | `/business/categories` | Service Categories | Categories ✓ |
| 5 | `/business/schedules` | Schedules (Month) | Schedules |
| 6 | `/business/schedules/week` | Schedules (Week) | Schedules |
| 7 | `/business/schedules/day` | Schedules (Day) | Schedules |
| 8 | `/business/team/employees` | Employees List | Team > Employees |
| 9 | `/business/team/employees/new` | Create Employee | Team > Employees |
| 10 | `/business/team/employees/:id` | View Employee | Team > Employees |
| 11 | `/business/team/employees/:id/edit` | Edit Employee | Team > Employees |
| 12 | `/business/team/members` | Team Roster | Team > Members |
| 13 | `/business/team/members/invite` | Invite Member | Team > Members |
| 14 | `/business/team/members/:id` | Member Profile | Team > Members |
| 15 | `/business/earnings` | Earnings Overview | Earnings |
| 16 | `/business/transactions` | Transactions List | Transactions |
| 17 | `/business/transactions/:id` | Transaction Detail | Transactions |
| 18 | `/business/reviews` | Reviews | Reviews |
| 19 | `/business/roles-permissions` | Roles List | Roles & Permissions |
| 20 | `/business/roles-permissions/new` | Create Role | Roles & Permissions |
| 21 | `/business/roles-permissions/:id` | Role Detail | Roles & Permissions |
| 22 | `/business/roles-permissions/:id/edit` | Edit Role | Roles & Permissions |
| 23 | `/business/roles-permissions/:id/permissions` | Assign Permissions | Roles & Permissions |
| 24 | `/business/notifications` | Notifications Center | (bell in header) |
| 25 | `/business/settings/legal` | Legal Info | Settings |
| 26 | `/business/settings/hours` | Operating Hours | Settings |
| 27 | `/business/settings/photos` | Photos | Settings |
| 28 | `/business/settings/bank-info` | Bank Info | Settings |
| 29 | `/business/settings/payment` | Payment Providers | Settings |
| 30 | `/business/settings/notifications` | Notification Policy | Settings |
| 31 | `/business/settings/appearance` | Appearance & Language | Settings |
| 32 | `/business/settings/danger-zone` | Danger Zone | Settings |

#### Professional Workspace Routes (`/professional/*`)

| # | Path | Page | Sidebar Nav |
|---|------|------|-------------|
| 1 | `/professional/dashboard` | Dashboard | Dashboard ✓ |
| 2 | `/professional/organizations` | Organizations List | Organizations |
| 3 | `/professional/invitations` | Invitations | Invitations |
| 4 | `/professional/reviews` | Reviews | Reviews |
| 5 | `/professional/settings/account` | Account Settings | Settings |
| 6 | `/professional/settings/notifications` | Notifications | Settings |
| 7 | `/professional/settings/appearance` | Appearance | Settings |
| 8 | `/professional/settings/privacy` | Privacy & Data | Settings |

#### Utility Routes (no layout)

| Path | Page |
|------|------|
| `*` | 404 Error |
| _(network interceptor)_ | Network Offline |

---

## 4. Layout System (DRY)

### 4.1 AppShell Pattern

Both workspaces use the same **AppShell** layout pattern: sidebar (256px) + header (80px) + content area.

```
┌──────────┐ ┌─────────────────────────────────────────┐
│          │ │  HEADER                     80px        │
│ SIDEBAR  │ ├─────────────────────────────────────────┤
│  256px   │ │  <router-view />                         │
│          │ │  (page content)                          │
└──────────┘ └─────────────────────────────────────────┘
```

**Implementation**: Two separate layout files since sidebars differ significantly:

- `src/layouts/BusinessAppShell.vue` — imports `BusinessAppSidebar` + `BusinessAppHeader`
- `src/layouts/ProfessionalAppShell.vue` — imports `ProfessionalAppSidebar` + `ProfessionalAppHeader`

### 4.2 Shared Components (used in BOTH workspaces)

| Component | Purpose |
|-----------|---------|
| `LanguageSwitcher.vue` | EN/UZ/RU pill toggle |
| `ThemeToggle.vue` | Sun/moon icon button |
| `NotificationBell.vue` | Bell icon + red badge |
| `UserAvatarDropdown.vue` | Avatar initials + chevron |
| `EmptyStateCard.vue` | Reusable empty state (icon + title + desc + button) |
| `ToggleSwitch.vue` | Enable/disable toggle |
| `BreadcrumbBar.vue` | Path breadcrumbs |
| `StatusBadge.vue` | Colored pill status badges |
| `KpiCard.vue` | Stat card with label + value + icon |

### 4.3 Business-Specific Components

| Component | Purpose |
|-----------|---------|
| `BusinessAppSidebar.vue` | Building icon + "Business", 10 nav items, Team submenu |
| `BusinessAppHeader.vue` | User name + single org, language/theme/bell/avatar |
| `SidebarNavItem.vue` | Nav item with icon, label, badge, active state |
| `SidebarTeamGroup.vue` | Expandable Team section (Employees/Members) |

### 4.4 Professional-Specific Components

| Component | Purpose |
|-----------|---------|
| `ProfessionalAppSidebar.vue` | "P" logo + "Professional", 5 flat nav items |
| `ProfessionalAppHeader.vue` | User name + specialization, multi-org list |
| `SidebarNavItem.vue` | Nav item with icon, label, badge, active state |

---

## 5. Business Sidebar Navigation

```
┌────────────────────────┐
│ [▣] Business           │ ← Header: building-2 icon in dark square + "Business"
├────────────────────────┤
│ 📊 Dashboard           │ ← Active: #F5F5F5 bg, #2A2933 text weight 600
│ 📄 Orders        [7]   │ ← Badge: 20×20px purple circle
│ 📚 Categories          │
│ 📅 Schedules           │
│ 👥 Team          ▾     │ ← Expandable submenu
│   ├ 👤 Employees       │    Sub-items: 16px icons, 13px text
│   └ 👤 Members         │    Active sub: weight 600
│ 💰 Earnings            │
│ 🧾 Transactions        │ ← Border-radius: 6px (different!)
│ ⭐ Reviews             │
│ 🛡 Roles & Permissions │
│ ⚙ Settings            │
└────────────────────────┘
```

**Design details**:
- Width: 256px, white bg, right border 1px #D9D9DB
- Nav items: 40px height, rounded 10px, padding 10px 12px, gap 12px
- Icons: 18px Lucide for main nav, 16px for sub-items
- Text: Inter 14px for main, 13px for sub
- Team chevron rotates 180° when expanded

---

## 6. Professional Sidebar Navigation

```
┌──────────────────────┐
│ [P] Professional     │ ← Header: purple square + "Professional"
├──────────────────────┤
│ 📊 Dashboard         │
│ 📚 Organizations     │
│ ✉  Invitations  [2]  │ ← Badge on Invitations
│ ⭐ Reviews           │
│ ⚙ Settings          │
└──────────────────────┘
```

---

## 7. Design Tokens

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
  --success: #25603A;
  --success-bg: #E8FAF0;
  --warning: #B45309;
  --warning-bg: #FFF8E5;
  --info-bg: #C9D6F0;

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

  /* Shadows */
  --shadow-modal: 0 20px 50px rgba(0, 0, 0, 0.24);
}
```

---

## 8. Data Strategy — Mock Services with Clean API Migration

### 8.1 Pattern

All data access goes through service functions. A single environment flag switches between mock and real backend:

```typescript
// src/config/index.ts
export function isMockMode(): boolean {
  return import.meta.env.VITE_USE_MOCK !== 'false'; // default: true
}
```

### 8.2 Service Example

```typescript
// src/services/earningsService.ts
import { isMockMode } from '@/config';
import { mockEarningsData } from '@/data/earnings';
import { apiClient } from '@/api/client';

export async function getEarnings(dateRange: string) {
  if (isMockMode()) {
    return mockEarningsData;
  }
  return apiClient.get('/business/earnings', { params: { range: dateRange } });
}
```

### 8.3 Mock Data Files

All mock data lives in `src/data/` as TypeScript constants:

```
src/data/
├── businessApp.ts          # Sidebar nav items, header user info
├── emptyStates.ts          # 8 empty state card variants
├── dashboardOverview.ts    # KPI cards, orders table, chart data
├── dashboardReceptionist.ts # Queue, schedules
├── dashboardCommandCenter.ts # Big stats, alerts, weekly
├── categories.ts           # Category tree + services
├── earnings.ts             # KPI, weekly chart, category breakdown, top masters
├── transactions.ts         # Transaction list data
├── transactionDetail.ts    # Single transaction detail
├── notifications.ts        # Notifications list
├── employees.ts            # Employee list + profile
├── members.ts              # Member roster + profile
├── orders.ts               # Bookings list + detail
├── roles.ts                # Roles list + permissions
├── schedules.ts            # Month/week/day schedule data
├── settings.ts             # Legal, hours, photos, bank, payment, notifications, appearance
└── ...
```

### 8.4 API Client Placeholder

```typescript
// src/api/client.ts
export const apiClient = {
  async get(url: string, config?: any) {
    // When backend is ready, replace with actual fetch/axios
    throw new Error('API client not implemented — use mock mode');
  },
  async post(url: string, data?: any) { /* ... */ },
  async put(url: string, data?: any) { /* ... */ },
  async patch(url: string, data?: any) { /* ... */ },
  async delete(url: string) { /* ... */ },
};
```

### 8.5 Mock User Context

```typescript
// src/data/user.ts
export const mockBusinessUser = {
  userName: 'Rustam Karimov',
  userRole: 'Owner',
  orgName: 'AutoFix MCHJ',
  userInitials: 'RK',
  language: 'EN' as const,
  notificationCount: 3,
  ordersBadgeCount: 7,
};

export const mockProfessionalUser = {
  userName: 'Rustam Karimov',
  userInitials: 'RK',
  specialization: 'Electric',
  organizations: ['AutoFix MCHJ', 'Something MCHJ'],
  language: 'EN' as const,
  notificationCount: 2,
  invitationCount: 2,
};
```

---

## 9. Icon Strategy

All icons use **Lucide Vue Next** (`@lucide/vue`):

```bash
pnpm add @lucide/vue
```

Import only what's needed (tree-shakeable):
```typescript
import { Building2, LayoutDashboard, FileText, Layers, Calendar, Users, Wallet, Receipt, Star, ShieldCheck, Settings, ChevronDown, UserRoundCog, UserRound, Sun, Bell, Search, SlidersHorizontal, ArrowUpDown, TrendingUp, Clock, CircleCheck, Banknote, Smartphone, Download, Eye, Pencil, Trash2, X, Info, AlertTriangle, CheckCheck, UserPlus, UserMinus, Lock, WifiOff, FileQuestion } from '@lucide/vue';
```

---

## 10. Project File Structure

```
src/
├── main.ts
├── App.vue
├── router/
│   ├── index.ts              # Main router
│   ├── auth.routes.ts        # Auth routes
│   ├── business.routes.ts    # Business workspace routes
│   └── professional.routes.ts# Professional workspace routes
├── stores/
│   ├── businessApp.ts        # Business app state (Pinia)
│   └── professionalApp.ts    # Professional app state (Pinia)
├── layouts/
│   ├── BusinessAppShell.vue  # Sidebar + Header + router-view
│   └── ProfessionalAppShell.vue
├── components/
│   ├── app/                  # Shared layout components
│   │   ├── LanguageSwitcher.vue
│   │   ├── ThemeToggle.vue
│   │   ├── NotificationBell.vue
│   │   ├── UserAvatarDropdown.vue
│   │   ├── EmptyStateCard.vue
│   │   ├── ToggleSwitch.vue
│   │   ├── BreadcrumbBar.vue
│   │   ├── StatusBadge.vue
│   │   └── KpiCard.vue
│   ├── business/             # Business-specific components
│   │   ├── BusinessAppSidebar.vue
│   │   ├── BusinessAppHeader.vue
│   │   ├── SidebarNavItem.vue
│   │   └── SidebarTeamGroup.vue
│   ├── professional/         # Professional-specific components
│   │   ├── ProfessionalAppSidebar.vue
│   │   └── ProfessionalAppHeader.vue
│   ├── dashboard/            # Dashboard-specific components
│   ├── categories/           # Category-specific components
│   ├── earnings/             # Earnings-specific components
│   ├── transactions/         # Transaction-specific components
│   ├── notifications/        # Notification-specific components
│   ├── employees/            # Employee-specific components
│   ├── members/              # Member-specific components
│   ├── orders/               # Order-specific components
│   ├── roles/                # Role-specific components
│   ├── schedules/            # Schedule-specific components
│   └── settings/             # Settings-specific components
├── views/
│   ├── business/             # Business page views
│   │   ├── DashboardReceptionist.vue
│   │   ├── DashboardOverview.vue
│   │   ├── DashboardCommandCenter.vue
│   │   ├── OrdersList.vue
│   │   ├── OrderDetail.vue
│   │   ├── Categories.vue
│   │   ├── SchedulesMonth.vue
│   │   ├── SchedulesWeek.vue
│   │   ├── SchedulesDay.vue
│   │   ├── EmployeesList.vue
│   │   ├── EmployeeCreate.vue
│   │   ├── EmployeeEdit.vue
│   │   ├── EmployeeView.vue
│   │   ├── MembersList.vue
│   │   ├── MemberInvite.vue
│   │   ├── MemberProfile.vue
│   │   ├── Earnings.vue
│   │   ├── Transactions.vue
│   │   ├── TransactionDetail.vue
│   │   ├── Reviews.vue
│   │   ├── RolesList.vue
│   │   ├── RoleForm.vue
│   │   ├── RoleDetail.vue
│   │   ├── AssignPermissions.vue
│   │   ├── Notifications.vue
│   │   ├── SettingsLegal.vue
│   │   ├── SettingsHours.vue
│   │   ├── SettingsPhotos.vue
│   │   ├── SettingsBankInfo.vue
│   │   ├── SettingsPayment.vue
│   │   ├── SettingsNotifications.vue
│   │   ├── SettingsAppearance.vue
│   │   └── SettingsDangerZone.vue
│   ├── professional/         # Professional page views
│   │   ├── Dashboard.vue
│   │   ├── Organizations.vue
│   │   ├── Invitations.vue
│   │   ├── Reviews.vue
│   │   └── Settings.vue
│   └── utility/              # Utility pages
│       ├── NotFound.vue
│       └── Offline.vue
├── data/                     # Mock data files
├── services/                 # Service layer (mock/API switch)
├── types/                    # TypeScript type definitions
└── config/
    └── index.ts              # Environment config (isMockMode)
```

---

## 11. TypeScript Types

```typescript
// src/types/index.ts

export type UserRole = 'owner' | 'admin' | 'receptionist' | 'master' | 'specialist';
export type OrderStatus = 'new' | 'pending' | 'confirmed' | 'in-progress' | 'done' | 'cancelled' | 'auto-cancelled';
export type PaymentProvider = 'PayMe' | 'Click' | 'Paynet' | 'Cash';
export type TransactionStatus = 'Paid' | 'Pending' | 'Failed' | 'Collected';
export type Theme = 'light' | 'dark' | 'system';
export type Language = 'EN' | 'UZ' | 'RU';
export type EmployeeStatus = 'Active' | 'Inactive';
export type MemberStatus = 'Active' | 'Inactive' | 'Pending';
export type RoleType = 'built-in' | 'custom';
export type ScheduleView = 'month' | 'week' | 'day';
export type NotificationCategory = 'Bookings' | 'Reviews' | 'Payments' | 'Invitations' | 'Team';
```

---

## 12. Implementation Order

### Phase 1: Foundation
1. Project scaffold (Vite + Vue 3 + TS + Router + Pinia)
2. Design tokens & global CSS
3. Router configuration (all routes defined, pages as stubs)
4. Layouts: `BusinessAppShell.vue`, `ProfessionalAppShell.vue`
5. Shared components: LanguageSwitcher, ThemeToggle, NotificationBell, UserAvatarDropdown, ToggleSwitch, BreadcrumbBar, StatusBadge, KpiCard, EmptyStateCard

### Phase 2: Business Workspace
6. Business sidebar + header
7. Dashboard (3 variants)
8. Orders (list + detail + modals)
9. Categories (list + pricing dialog)
10. Schedules (month/week/day)
11. Team Employees (CRUD + modals)
12. Team Members (roster + invite + profile + remove)
13. Earnings
14. Transactions (list + detail)
15. Reviews
16. Roles & Permissions (list + CRUD + assign)
17. Notifications (center + detail modal + delete)
18. Settings (all 8 pages)
19. Utility pages (404, offline)

### Phase 3: Professional Workspace
20. Professional sidebar + header
21. Dashboard
22. Organizations
23. Invitations
24. Reviews
25. Settings (account, notifications, appearance, privacy)

### Phase 4: Auth & Onboarding
26. Account selection page
27. Auth pages (login/register/phone/OTP/email/forgot/reset)
28. Onboarding pages (personal info, professional info, org type, bank account)

---

## 13. Design Prompt Reference

All detailed page specifications are in `design-to-front/`. Each folder contains markdown prompts and high-resolution screenshots:

```
design-to-front/
├── 01-auth-onboarding/       # Auth & onboarding pages
│   ├── 01-1-account-selection/
│   ├── 01-2-authentication/  # Business/Professional auth flows
│   └── 01-3-onboarding/      # Business/Professional onboarding
├── Business/                 # All Business workspace pages (20 folders)
│   ├── 01-layouts-components/ # Sidebar, Header, Empty State Cards
│   ├── 02-dashboard/          # 3 dashboard variants
│   ├── 03-categories/         # Service categories + pricing dialog
│   ├── 04-earnings/           # Earnings overview
│   ├── 05-transactions/       # Transactions list + detail
│   ├── 06-notifications/      # Notification center + modals
│   ├── 07-team-employees/     # Employee CRUD + modals
│   ├── 08-team-members/       # Member roster + invite + profile
│   ├── 09-roles-permissions/  # Roles list + CRUD + permissions
│   ├── 10-orders/             # Bookings list + detail + modals
│   ├── 11-schedules/          # Month/Week/Day views
│   ├── 12-settings-legal/     # Legal info edit + preview
│   ├── 13-settings-hours/     # Operating hours
│   ├── 14-settings-photos/    # Photo upload gallery
│   ├── 15-settings-bank-info/ # Bank account info
│   ├── 16-settings-payment/   # Payment providers
│   ├── 17-settings-notification/# Notification preferences
│   ├── 18-settings-appearance/# Theme + language
│   ├── 19-settings-danger-zone/# Dangerous actions
│   └── 20-utility-pages/      # 404 + Network Offline
└── Professional/             # All Professional workspace pages (9 folders)
    ├── 01-layouts-components/ # Sidebar, Header, AppShell
    ├── 02-dashboard/
    ├── 03-reviews/
    ├── 04-invitations/
    ├── 05-organizations/
    ├── 06-settings-account/
    ├── 07-settings-notifications/
    ├── 08-settings-appearance/
    └── 09-settings-privacy-data/
```

When implementing a page, the smaller agent should:
1. Read this architecture document first
2. Read the specific page prompt from the relevant folder
3. Study the screenshot for visual accuracy
4. Implement the Vue component with mock data
5. Wire it into the router and sidebar navigation
6. Ensure the page connects logically to related pages

---

## 14. Key Principles

1. **DRY above all** — Extract repeating UI into shared components
2. **Mock-first** — All data flows through services, ready for API swap
3. **Type-safe** — Every prop, store state, and service function is typed
4. **Accessible** — Semantic HTML, ARIA labels, keyboard navigation
5. **Consistent** — Follow design tokens exactly; don't invent new colors/spacing
6. **Connected** — Every page links logically to related pages (e.g., orders → transactions, employees → edit → reset password)
