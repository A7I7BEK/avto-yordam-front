# Page Prompt: Bank Info

> **Design Node ID**: `mm9fS` | **Name**: "43 - Bank Info"
> **Route**: `/business/settings/bank-info` | **View File**: `src/views/business/SettingsBankInfo.vue`

## Overview
Settings page for managing bank account information used for payouts. Part of Settings section. Breadcrumb: Settings > Bank Info.

## Header
- Title: "Bank information" (Inter 24px 700)
- Subtitle: "Used for receiving payouts from the platform"
- Save button (primary, top-right)

## Form Sections

### Account Holder
- **Full name** — text input, required (e.g. "Rustam Karimov")
- **INN (Tax ID)** — text input, 9 digits

### Bank Details
- **Bank name** — text input or select from list (Ipoteka Bank, Xalq Bank, Agrobank, etc.)
- **Account number** — text input, 20 digits, masked after entry
- **MFO code** — text input, 5 digits
- **Card number** (optional) — text input, 16 digits, shows detected type icon (Humo/Uzcard/Visa)

### Verification Status
If bank account is verified:
- Green banner: "✓ Account verified" with verified date
If pending:
- Amber banner: "Verification in progress — usually takes 1–2 business days"

## Mock Data
```typescript
export const bankInfo = {
  holderName: 'Rustam Karimov',
  inn: '309876543',
  bankName: 'Ipoteka Bank',
  accountNumber: '20208000456789012345',
  mfo: '01234',
  cardNumber: '8600123456789012',
  cardType: 'Humo',
  verified: true,
  verifiedAt: '2024-04-10',
};
```

## Bottom Actions
- Cancel → discard changes
- Save changes (primary `#5749F4`)


**Screenshot**: `01-bank-info.png`
