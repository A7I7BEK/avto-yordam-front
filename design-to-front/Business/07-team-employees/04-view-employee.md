# Page Prompt: View Employee

> **Design Node ID**: `MDrCO`
> **Route**: `/business/team/employees/:id`
> **View File**: `src/views/business/EmployeeView.vue`

## Overview
Read-only employee profile with actions toolbar. Breadcrumb: Team > Employees > {Name}.

## Header
- Large avatar (64px) + name (Inter 22px 700) + role badge
- "Active since Jan 2025" subtitle
- Actions: Edit button (outline), Delete button (outline red)

## Info Cards (2 columns)
Left column:
- **Personal Info**: Full name, Phone, Email
- **Role**: Role badge, Specialization

Right column:
- **Statistics**: Total orders completed, Total revenue generated, Average rating, Join date
- **Recent Activity**: Last 5 orders (order ID, date, service, amount)

## Mock Data
```typescript
export const employeeProfile = {
  id: 'e1', name: 'Aziz Karimov', initials: 'AK', avatarColor: '#5749F4',
  role: 'Master', specialization: 'Engine, Diagnostics',
  phone: '+998 90 123 4567', email: 'aziz.k@autofix.uz',
  status: 'Active', joinedAt: 'Jan 15, 2025',
  stats: { totalOrders: 218, totalRevenue: '42.8M UZS', avgRating: 4.9, completionRate: '96%' },
  recentOrders: [
    { id: '#BK-1247', date: 'Apr 12', service: 'Brake pads', amount: '850K UZS' },
    { id: '#BK-1245', date: 'Apr 10', service: 'Brakes + Oil', amount: '850K UZS' },
  ],
};
```

## Navigation
- Edit → `/business/team/employees/{id}/edit`
- Delete → opens Delete Employee dialog
- Back → `/business/team/employees`


**Screenshot**: `04-view-employee.png`
