# Page Prompt: Create Employee

> **Design Node ID**: `m6IrT`
> **Route**: `/business/team/employees/new`
> **View File**: `src/views/business/EmployeeCreate.vue`

## Overview
Multi-section form for adding a new employee. Breadcrumb: Team > Employees > New. Form sections: Personal Info, Contact, Role & Permissions, Password.

## Breadcrumb
Team > Employees > New (chevron-right separators, 12px)

## Form Sections
All sections in a single card (radius 24px, white bg, border).

### Section 1: Personal Information
- **Full name** — text input, placeholder "Enter full name"
- **Phone number** — tel input with +998 prefix, placeholder "90 123 4567"

### Section 2: Role & Permissions
- **Role** — select dropdown: Master, Receptionist, Admin
- **Specialization** (shown for Master role) — text input, e.g. "Engine, Diagnostics"

### Section 3: Account Setup
- **Email** — email input (optional)
- **Password** — password input with show/hide toggle + "Auto-generate" button
- **Send invitation** — checkbox "Send invitation via SMS"

## Bottom Actions
- **Cancel** — outline button, returns to list
- **Create employee** — primary `#5749F4` button

## Validation
- Name required (min 3 chars)
- Phone required (UZ format)
- Role required
- Password required if not auto-generated
