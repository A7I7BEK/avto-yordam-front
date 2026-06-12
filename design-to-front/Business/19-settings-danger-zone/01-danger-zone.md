# Page Prompt: Danger Zone

> **Design Node ID**: `HnhGx` | **Name**: "50 - Danger Zone"
> **Route**: `/business/settings/danger-zone` | **View File**: `src/views/business/SettingsDangerZone.vue`

## Overview
Settings page for irreversible/dangerous account actions. Red-bordered cards with confirmation dialogs. Part of Settings section. Breadcrumb: Settings > Danger Zone.

## Header
- Title: "Danger zone" (Inter 24px 700)
- Subtitle: "Irreversible actions — proceed with caution"
- Red warning icon in header

## Danger Actions (Cards with red border)

### Deactivate Account
- Red-bordered card (radius 24px, border `#CC3314`)
- Title: "Deactivate account" + description: "Temporarily hide your business from the platform. You can reactivate anytime."
- Button: "Deactivate account" (outline red `#CC3314`)
- Click → confirmation dialog with password input

### Delete Account
- Red-bordered card
- Title: "Delete account permanently" + description: "Remove your business and all associated data. This cannot be undone. Active orders will be cancelled and refunded."
- Button: "Delete account" (filled red `#CC3314`)
- Click → multi-step confirmation: type "DELETE" to confirm, password input, acknowledge consequences

### Export All Data
- Neutral card (gray border)
- Title: "Export all data" + description: "Download a complete archive of your business data including orders, transactions, and team records."
- Button: "Request export" (outline)
- Shows last export date if available: "Last exported: April 10, 2026"

### Transfer Ownership
- Neutral card
- Title: "Transfer ownership" + description: "Transfer full control of this business to another team member."
- Button: "Transfer ownership" (outline)
- Opens modal with team member select + confirmation

## Confirmation Dialogs
Each dangerous action has a modal confirmation:
1. **Deactivate**: Password input + "I understand" checkbox
2. **Delete**: Type "DELETE" + password + "I understand consequences" checkbox
3. **Transfer**: Select new owner + password confirmation

## Mock Data
```typescript
export const dangerZone = {
  canDeactivate: true,
  canDelete: true,
  lastExport: '2026-04-10',
  activeOrders: 7, // shown as warning on delete
};
```
