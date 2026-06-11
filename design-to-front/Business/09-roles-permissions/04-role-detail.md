# Page Prompt: Role Detail (View)

> **Design Node ID**: `iY5H0` | **Name**: "56 - Role Detail (View)"
> **Route**: `/business/roles-permissions/:id`
> **View File**: `src/views/business/RoleDetail.vue`

## Overview
Read-only view of a role showing its name, description, type, member count, and all assigned permissions grouped by module. Breadcrumb: Roles > {Name}.

## Header
- Role name (Inter 24px 700) + type badge (Built-in / Custom)
- Description below
- "{N} members" badge with member avatars
- Actions: Edit (pencil, custom only), Duplicate (copy icon)

## Members Section
- List of members with this role (avatars + names)
- "View all members" link → `/business/team/employees?role={id}`

## Permissions Section
Organized by module in collapsible accordion sections:

**Module: Orders** (expandable)
- ✓ View orders
- ✓ Create orders
- ✓ Edit orders
- ✗ Delete orders
- ✓ Assign orders

Each permission: check (green) or cross (gray) icon + permission name.

Modules: Orders, Team, Earnings, Transactions, Categories, Reviews, Settings.

## Bottom Actions
- Edit (if custom) → `/business/roles-permissions/{id}/edit`
- Duplicate → creates copy
- Back → `/business/roles-permissions`
