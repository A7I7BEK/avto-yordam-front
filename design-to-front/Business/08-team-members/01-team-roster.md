# Page Prompt: Team Roster (Members List)

> **Design Node ID**: `OUeax` | **Name**: "27 - Team Roster"
> **Route**: `/business/team/members` | **View File**: `src/views/business/MembersList.vue`

## Overview
List of all team members with their roles, organizations, and status. Sidebar Team > Members is active. Header has "Invite member" button.

## Header
- Title: "Team Members" (Inter 24px 700) + subtitle "People working across your organization"
- Right: "Invite member" primary button (pill, `#5749F4`, `user-plus` icon) → opens invite form

## Search & Filter
- Search input: "Search members..." with search icon
- Role filter: All / Master / Receptionist / Admin
- Status filter: All / Active / Inactive / Pending

## Member Cards (Grid or List)
Each card/row shows:
- Avatar (40px circle, colored bg, initials)
- Name (Inter 14px 600) + Role badge
- Organization name below
- Phone number
- Status badge (Active green, Inactive gray, Pending amber)
- Actions: eye (view), trash (remove) icon buttons

## Mock Data
```typescript
export const members = [
  { id: 'm1', name: 'Aziz Karimov', initials: 'AK', role: 'Master', org: 'AutoFix MCHJ', phone: '+998 90 123 4567', status: 'Active', avatarColor: '#5749F4' },
  { id: 'm2', name: 'Bekzod Rakhimov', initials: 'BR', role: 'Master', org: 'AutoFix MCHJ', phone: '+998 91 234 5678', status: 'Active', avatarColor: '#FF7A4B' },
  { id: 'm3', name: 'Saida Karimova', initials: 'SK', role: 'Receptionist', org: 'AutoFix MCHJ', phone: '+998 93 345 6789', status: 'Active', avatarColor: '#1FAA59' },
  { id: 'm4', name: 'Doniyor Mahmudov', initials: 'DM', role: 'Master', org: 'AutoFix MCHJ', phone: '+998 94 456 7890', status: 'Inactive', avatarColor: '#00A0E9' },
  { id: 'm5', name: 'Nilufar Khasanova', initials: 'NK', role: 'Admin', org: 'AutoFix MCHJ', phone: '+998 95 567 8901', status: 'Pending', avatarColor: '#A35BFF' },
];
```

## Navigation
- "Invite member" → `/business/team/members/invite` (or opens modal)
- Eye → `/business/team/members/{id}`
- Trash → opens Remove Confirmation dialog


**Screenshot**: `01-team-roster.png`
