# Page Prompt: Employees List

> **Design Node ID**: `FPtu8`
> **Route**: `/business/team/employees`
> **View File**: `src/views/business/EmployeesList.vue`

## Overview
Paginated data table of all employees with search, role filter, and actions (view, edit, delete). "Add employee" button in header. Sidebar Team > Employees is active.

## Header
- Title: "Employees" (Inter 24px 700) + subtitle "Manage your team"
- Right: "Add employee" primary button (pill, `#5749F4`, + icon) → navigates to create form

## Table
| Column | Description |
|--------|-------------|
| Employee | Avatar 32px + name + role below |
| Phone | Inter 12px normal |
| Role | Pill badge (Master blue, Receptionist amber, Admin purple) |
| Status | Active (green) / Inactive (gray) pill |
| Actions | Eye (view), Pencil (edit), Trash (delete) icon buttons, 32px circles |

## Mock Data
```typescript
export const employees = [
  { id: 'e1', name: 'Aziz Karimov', initials: 'AK', role: 'Master', phone: '+998 90 123 4567', status: 'Active', avatarColor: '#5749F4' },
  { id: 'e2', name: 'Bekzod Rakhimov', initials: 'BR', role: 'Master', phone: '+998 91 234 5678', status: 'Active', avatarColor: '#FF7A4B' },
  { id: 'e3', name: 'Jasur Tursunov', initials: 'JT', role: 'Master', phone: '+998 93 345 6789', status: 'Inactive', avatarColor: '#1FAA59' },
  { id: 'e4', name: 'Dilnoza Karimova', initials: 'DK', role: 'Receptionist', phone: '+998 94 456 7890', status: 'Active', avatarColor: '#00A0E9' },
  { id: 'e5', name: 'Sherzod Toshmatov', initials: 'ST', role: 'Admin', phone: '+998 95 567 8901', status: 'Active', avatarColor: '#A35BFF' },
];
```

## Role Badge Colors
- Master: `#C9D6F0` bg, `#001133` text
- Receptionist: `#FFD9B2` bg, `#4D2700` text
- Admin: `#EEF0FF` bg, `#5749F4` text

## Navigation
- Eye → `/business/team/employees/{id}` (view)
- Pencil → `/business/team/employees/{id}/edit` (edit)
- Trash → opens Delete Employee dialog
- Add button → `/business/team/employees/new`
