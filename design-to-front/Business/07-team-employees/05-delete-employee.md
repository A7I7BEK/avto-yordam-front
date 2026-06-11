# Component Prompt: Delete Employee Dialog

> **Design Node ID**: `MYPdH`
> **Component File**: `src/components/employees/DeleteEmployeeDialog.vue`

## Overview
Confirmation dialog when deleting an employee. Centered modal with warning icon, employee name, and impact summary.

## Dialog
- 440px wide, centered, overlay `rgba(15,23,42,0.4)`
- Red warning icon circle (48px, `#FDEBEC` bg, `alert-triangle` icon `#CC3314`)
- Title: "Delete {name}?" (Inter 18px 700)
- Description: "This employee will lose access to the platform. Active orders assigned to them will need reassignment."
- Info box: "{N} active orders currently assigned" (amber `#FFF6E9` bg)
- Buttons: Cancel (outline) + Delete (red `#CC3314`)

## Behavior
- Delete → emit confirm, close dialog, redirect to list
- Cancel → emit cancel, close dialog
