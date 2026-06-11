# Page Prompt: Roles List

> **Design Node ID**: `c6BJee` | **Name**: "55 - Roles List"
> **Route**: `/business/roles-permissions` | **View File**: `src/views/business/RolesList.vue`

## Overview
Lists all roles (built-in and custom) with member counts, descriptions, and actions. Sidebar Roles & Permissions is active. Header has "Create role" button.

## Header
- Title: "Roles & Permissions" (Inter 24px 700) + subtitle "Manage who can do what in your organization"
- Right: "Create role" primary button (`#5749F4`, `shield-plus` icon)

## Role Cards / Table
Each role shows:
- Shield icon (colored by type: purple for custom, blue for built-in)
- Role name (Inter 14px 600)
- Description (Inter 12px normal, `#616167`)
- Member count badge: "{N} members"
- Type badge: "Built-in" (blue) or "Custom" (purple)
- Actions: eye (view), pencil (edit — custom only), copy (duplicate)

## Mock Data
```typescript
export const roles = [
  { id: 'r1', name: 'Owner', desc: 'Full access to everything', members: 1, type: 'built-in', iconColor: '#1E40AF' },
  { id: 'r2', name: 'Admin', desc: 'Manage team, orders, and settings', members: 2, type: 'built-in', iconColor: '#1E40AF' },
  { id: 'r3', name: 'Master', desc: 'View and manage assigned orders', members: 5, type: 'built-in', iconColor: '#1E40AF' },
  { id: 'r4', name: 'Receptionist', desc: 'Manage front desk and bookings', members: 3, type: 'built-in', iconColor: '#1E40AF' },
  { id: 'r5', name: 'Senior Master', desc: 'Master + pricing & schedule control', members: 2, type: 'custom', iconColor: '#5749F4' },
  { id: 'r6', name: 'Accountant', desc: 'View earnings, transactions, export reports', members: 1, type: 'custom', iconColor: '#5749F4' },
];
```

## Navigation
- Create role → `/business/roles-permissions/new`
- Eye → `/business/roles-permissions/{id}`
- Pencil → `/business/roles-permissions/{id}/edit`
- Copy → duplicates role and opens edit form
