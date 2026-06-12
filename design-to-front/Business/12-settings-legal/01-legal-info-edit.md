# Page Prompt: Legal Info (Edit)

> **Design Node ID**: `f4Bn0s` | **Name**: "47 - Legal Info (edit)"
> **Route**: `/business/settings/legal` | **View File**: `src/views/business/SettingsLegal.vue`

## Overview
Edit form for the organization's legal/business information. Part of Settings section. Breadcrumb: Settings > Legal Info.

## Header
- Title: "Legal information" (Inter 24px 700)
- Subtitle: "Required for tax reporting and compliance"
- Switch to "Preview" mode button (eye icon) → preview page

## Form Sections
### Business Details
- **Organization name** — text input, required (e.g. "AutoFix MCHJ")
- **Legal form** — select: MCHJ, YaTT, Familiy Enterprise, IE
- **Registration number** (INN) — text input, 9 digits
- **Registration date** — date picker
- **Tax regime** — select: General, Simplified (Soddalashtirilgan)

### Address
- **Legal address** — textarea (e.g. "Tashkent, Yunusabad district, ...")
- **Actual address** — textarea, with "Same as legal" checkbox

### Bank Details
- **Bank name** — text input
- **Account number** — text input, 20 digits
- **MFO** — text input, 5 digits
- **OKONKH** — text input

### Documents
- **Registration certificate** — file upload (PDF/JPG)
- **Tax registration** — file upload
- Uploaded files shown with name + size + delete button

## Bottom Actions
- Cancel → discard changes
- Save changes (primary `#5749F4`)

## Mock Data
```typescript
export const legalInfo = {
  orgName: 'AutoFix MCHJ', legalForm: 'MCHJ',
  inn: '309876543', regDate: '2024-03-15',
  taxRegime: 'Simplified',
  legalAddress: 'Tashkent, Yunusabad district, 12-block, 45',
  actualAddress: 'Tashkent, Yunusabad district, 12-block, 45',
  bankName: 'Ipoteka Bank', accountNumber: '20208000456789012345',
  mfo: '01234', okonkh: '95120',
  documents: [
    { name: 'registration_cert.pdf', size: '2.4 MB' },
    { name: 'tax_cert.pdf', size: '1.1 MB' },
  ],
};
```


**Screenshot**: `01-legal-info-edit.png`
