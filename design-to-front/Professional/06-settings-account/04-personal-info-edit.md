# Page Prompt: Personal Info — Edit

> **Node**: `nHi2O` | **Tab**: Personal info (active) | **Mode**: Edit
> **Route**: `/professional/settings/account?tab=personal&mode=edit`

## 1. Overview

Edit mode for personal information. Form fields replace the read-only cards. "Save changes" and "Cancel" buttons.

## 2. Content Area

### 2.1 Section Header

**Left**: "Edit personal information" (Inter 16px 600) + "Update your profile details below."

**Right — Cancel button**: Outline pill "Cancel" → returns to preview mode

### 2.2 Profile Header Row

Same avatar + name display as preview, but with "Change photo" link below avatar (Inter 12px `#5749F4`).

### 2.3 Form Fields (single column, gap 16px)

Each field uses **Input Group/Filled** pattern (`VeIJB` ref):

| # | Label | Mock Value | Notes |
|---|-------|-----------|-------|
| 1 | Full name | Aziz Ismoilov | Text input |
| 2 | Date of birth | 14 / 02 / 1991 | Date input |
| 3 | Specialization | European brands · Engine & diagnostics | Text input |
| 4 | Working hours | Mon–Sat · 09:00–19:00 | Could be dropdowns |
| 5 | Years of experience | 8 | Number + "years" unit |

### 2.4 Bio / About Textarea

Label: "Short bio" (Inter 14px 500), placeholder: "Tell clients about your experience..." Textarea: 120px min-height, `#F5F5F5` bg, 1px `#C5C5CB` border, rounded 12px, padding 14px. Mock text: "European car specialist with 8 years of hands-on experience..."

### 2.5 Footer Buttons

`space-between`:
- **Cancel**: Ghost/secondary "Cancel" → back to preview
- **Save**: Primary "Save changes" → saves and returns to preview

## 3. Implementation

### File: `src/views/professional/settings/AccountPersonalEdit.vue`

### Icons: `Pencil`

### Approach

Use a single `AccountSettings.vue` page component that conditionally renders sub-views based on tab query param and mode. Or use separate components with shared shell.

**Screenshot**: `04-personal-info-edit.jpg`
