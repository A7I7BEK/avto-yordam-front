# Page Prompt: Assign Permissions

> **Design Node ID**: `QCrzW` | **Name**: "57 - Assign Permissions"
> **Route**: `/business/roles-permissions/{id}/permissions`
> **View File**: `src/views/business/AssignPermissions.vue`

## Overview
Checkbox grid to assign granular permissions to a role. Organized by module. Breadcrumb: Roles > {Name} > Permissions.

## Layout
Two-column: left sidebar lists modules, right shows permissions for selected module.

## Module List (Left, 240px)
Modules with toggle-all checkboxes:
- **Orders** — View, Create, Edit, Delete, Assign, Change status
- **Team** — View, Invite, Remove, Edit roles
- **Earnings** — View, Export
- **Transactions** — View, Export
- **Categories** — View, Edit pricing
- **Reviews** — View, Respond
- **Settings** — View, Edit

## Permissions Grid (Right)
For each module, show permissions as toggle switches or checkboxes in a card grid.

Each permission card:
- Permission name (Inter 13px 500)
- Description (Inter 12px normal, `#616167`)
- Toggle switch (enabled/disabled, `#5749F4` when on)

## Module Select All
Each module has a "Select all" toggle at the top that enables/disables all permissions in that module.

## Bottom Actions
- Cancel → back to role form
- Save permissions (primary `#5749F4`)

## Mock Data
```typescript
export const permissionModules = [
  {
    name: 'Orders', permissions: [
      { key: 'orders.view', label: 'View orders', desc: 'See the orders list and details' },
      { key: 'orders.create', label: 'Create orders', desc: 'Add walk-in and new orders' },
      { key: 'orders.edit', label: 'Edit orders', desc: 'Modify order details and status' },
      { key: 'orders.delete', label: 'Delete orders', desc: 'Remove orders from the system' },
      { key: 'orders.assign', label: 'Assign orders', desc: 'Assign orders to team members' },
    ],
  },
  // ... more modules
];
```


**Screenshot**: `03-assign-permissions.png`
