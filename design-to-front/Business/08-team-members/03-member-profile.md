# Page Prompt: Member Profile

> **Design Node ID**: `ZAexD` | **Name**: "30 - Member Profile"
> **Route**: `/business/team/members/:id` | **View File**: `src/views/business/MemberProfile.vue`

## Overview
Read-only profile of a team member with stats and activity. Breadcrumb: Team > Members > {Name}.

## Header
- Large avatar (64px, colored bg) + name + role badge + status badge
- Organization name below
- "Member since Mar 2025"
- Actions: Remove button (outline red)

## Info Cards
- **Contact**: Phone, Email (if available)
- **Organization**: Org name, joined date
- **Activity**: Total orders, revenue, avg rating (for Masters)
- **Recent orders**: mini list of last 5 orders

## Mock Data
```typescript
export const memberProfile = {
  id: 'm1', name: 'Aziz Karimov', initials: 'AK', avatarColor: '#5749F4',
  role: 'Master', org: 'AutoFix MCHJ', phone: '+998 90 123 4567',
  status: 'Active', joinedAt: 'Mar 12, 2025',
  stats: { totalOrders: 218, revenue: '42.8M UZS', rating: 4.9 },
};
```

## Navigation
- Remove → opens Remove Confirmation dialog
- Back → `/business/team/members`
