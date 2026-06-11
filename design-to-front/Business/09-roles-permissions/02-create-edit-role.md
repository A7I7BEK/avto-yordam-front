# Page Prompt: Create / Edit Role

> **Design Node ID**: `U3ZByr` | **Name**: "56 - Create / Edit Role"
> **Route**: `/business/roles-permissions/new` or `/business/roles-permissions/:id/edit`
> **View File**: `src/views/business/RoleForm.vue`

## Overview
Form for creating or editing a custom role. Cannot edit built-in roles (Owner, Admin, Master, Receptionist). Breadcrumb: Roles > New (or Roles > {Name} > Edit).

## Form Fields
- **Role name** — text input, required, placeholder "e.g. Senior Master"
- **Description** — textarea, placeholder "Describe what this role can do..."
- **Copy permissions from** — select dropdown: "Start from scratch", "Copy from Master", "Copy from Admin", etc.

## Permission Assignment Link
After entering name/description, a "Configure permissions →" button or link navigates to the Assign Permissions page (see `03-assign-permissions.md`).

For Edit mode, permissions are shown as a summary with "Edit permissions" button.

## Bottom Actions
- Cancel (outline) → back to roles list
- Save role (primary `#5749F4`)

## Validation
- Name required (min 2 chars, unique)
- At least one permission must be assigned (validated on Assign Permissions page)
