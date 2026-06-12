# Page Prompt: Edit Employee

> **Design Node ID**: `fEk6b`
> **Route**: `/business/team/employees/:id/edit`
> **View File**: `src/views/business/EmployeeEdit.vue`

## Overview
Same form as Create Employee but pre-filled with existing data. Breadcrumb: Team > Employees > {Name} > Edit. Additional sections for status management.

## Breadcrumb
Team > Employees > Aziz Karimov > Edit

## Differences from Create
- Form pre-populated with employee data
- **Status toggle**: Active/Inactive switch at top of form
- **Reset password** button (opens Reset Password dialog — see `06-reset-password.md`)
- Submit button label: "Save changes"

## Form Data (mock pre-fill)
```typescript
const employee = {
  name: 'Aziz Karimov',
  phone: '90 123 4567',
  role: 'Master',
  specialization: 'Engine, Diagnostics',
  email: 'aziz.k@autofix.uz',
  status: 'Active',
};
```

## Cancel Behavior
Returns to employee view page (`/business/team/employees/{id}`)


**Screenshot**: `03-edit-employee.png`
