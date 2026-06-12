# Page Prompt: Payment Providers

> **Design Node ID**: `L8w7YW` | **Name**: "42 - Payment Providers"
> **Route**: `/business/settings/payment` | **View File**: `src/views/business/SettingsPayment.vue`

## Overview
Settings page to manage which payment providers are enabled for accepting customer payments. Each provider has a toggle and configuration. Part of Settings section. Breadcrumb: Settings > Payment.

## Header
- Title: "Payment providers" (Inter 24px 700)
- Subtitle: "Choose how customers can pay for your services"
- Save button (primary, top-right)

## Provider Cards (one per provider)
Each card: white bg, radius 24px, border, padding 20px.

### PayMe
- Icon/logo: PayMe brand color (`#00A0E9`)
- Toggle switch (enabled by default)
- **Commission**: "2.5% per transaction" info
- **Settlement**: "T+2 business days"
- If enabled: show connected phone/account

### Click
- Icon/logo: Click brand color (`#1D7DE0`)
- Toggle switch (enabled by default)
- **Commission**: "2.0% per transaction"
- **Settlement**: "T+1 business days"

### Paynet
- Icon/logo: Paynet brand color (`#7A4BFF`)
- Toggle switch (disabled by default)
- **Commission**: "2.3% per transaction"
- **Settlement**: "T+2 business days"

### Cash
- Icon: banknote icon
- Toggle switch (enabled by default)
- **Commission**: "0%"
- **Settlement**: "Instant — collected at location"
- Note: "Cash payments must be recorded manually"

## Info Banner
Blue info banner at bottom:
"ℹ️ At least one online payment provider must be enabled to receive online bookings."

## Mock Data
```typescript
export const paymentProviders = [
  { id: 'payme', name: 'PayMe', color: '#00A0E9', commission: '2.5%', settlement: 'T+2', enabled: true, connected: true },
  { id: 'click', name: 'Click', color: '#1D7DE0', commission: '2.0%', settlement: 'T+1', enabled: true, connected: true },
  { id: 'paynet', name: 'Paynet', color: '#7A4BFF', commission: '2.3%', settlement: 'T+2', enabled: false, connected: false },
  { id: 'cash', name: 'Cash', color: '#1FAA59', commission: '0%', settlement: 'Instant', enabled: true, connected: true },
];
```

## Bottom Actions
- Cancel → discard changes
- Save changes (primary `#5749F4`)


**Screenshot**: `01-payment-providers.png`
