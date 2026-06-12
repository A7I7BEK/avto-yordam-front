# Page Prompt: Legal Info (Preview)

> **Design Node ID**: `h7t2a` | **Name**: "47 - Legal Info (preview)"
> **Route**: `/business/settings/legal` (same route, toggle mode)
> **View File**: same `SettingsLegal.vue` (preview mode)

## Overview
Read-only preview of the organization's legal information. Toggle between Edit and Preview modes. Breadcrumb: Settings > Legal Info.

## Header
- Title: "Legal information" + "Preview" badge (blue, `#C9D6F0` bg)
- Switch to "Edit" button (pencil icon) → switches to edit mode

## Info Cards
All data displayed in read-only cards (radius 24px, white bg, border):

### Business Details Card
| Field | Value |
|-------|-------|
| Organization | AutoFix MCHJ |
| Legal form | MCHJ (Masʼuliyati Cheklangan Jamiyat) |
| INN | 309 876 543 |
| Registered | March 15, 2024 |
| Tax regime | Simplified (Soddalashtirilgan) |

### Address Card
| Field | Value |
|-------|-------|
| Legal address | Tashkent, Yunusabad district, 12-block, 45 |
| Actual address | Same as legal |

### Bank Details Card
| Field | Value |
|-------|-------|
| Bank | Ipoteka Bank |
| Account | 2020 8000 4567 8901 2345 |
| MFO | 01234 |
| OKONKH | 95120 |

### Documents Card
- List of uploaded files with download links
- File icon + name + size

## Verification Status
If documents are verified: green badge "Verified by platform"
If pending: amber badge "Under review"

## Navigation
- Edit button → switches to edit mode
- Settings sidebar → back to settings


**Screenshot**: `02-legal-info-preview.png`
