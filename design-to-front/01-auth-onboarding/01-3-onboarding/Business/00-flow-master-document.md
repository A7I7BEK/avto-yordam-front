# Business Onboarding Flow — Master Document

> **Target**: Vue 3 + TypeScript + Composition API + Vue Router
> **Design Source**: `masters-app-halo.pen` → `04-auth-onboarding-layouts` → `Organization · Onboarding`
> **Output Folder**: `src/views/onboarding/business/`
> **Incoming from**: Business Auth (OTP or Create Workspace success)
> **Leads to**: Dashboard

---

## Flow Overview

```
┌─────────────────────────────────────────┐
│  Step 1: Organization Type (lyxy1)       │
│  Choose legal structure:                 │
│  MCHJ · YTT · Self Employed              │
│                    [Continue] ─────────┐  │
└───────────────────────────────────────│──┘
                                        │
                                        ▼
┌─────────────────────────────────────────┐
│  Step 2: Bank Account (toYVY)           │
│  Account holder + Bank + MFO + INN +    │
│  Account number + Currency              │
│                    [Continue] ─────────┐  │
└───────────────────────────────────────│──┘
                                        │
                                        ▼
                                  ┌──────────┐
                                  │ DASHBOARD │
                                  └──────────┘
```

---

## Key Differences from Professional Onboarding

| Aspect | Professional | Business |
|--------|-------------|----------|
| Steps | 2 (Personal + Professional info) | 2 (Org Type + Bank Account) |
| Stepper style | Numbered circles with connecting line | Progress bar (2 segments) |
| Step indicator | Circles + labels | "Organization · Step X of 2" text + colored bar |
| Brand | Purple bg, `user-round` | Dark bg, `building-2` |
| Card layout | Single centered card | Three side-by-side cards (step 1) / full-width card (step 2) |
| Data focus | Personal profile | Legal structure + banking |

---

## Route Design

```typescript
export const businessOnboardingRoutes = [
  {
    path: '/onboarding/business',
    name: 'business-onboarding',
    redirect: '/onboarding/business/org-type',
  },
  {
    path: '/onboarding/business/org-type',
    name: 'business-onboarding-step1',
    component: () => import('@/views/onboarding/business/OrgType.vue'),
  },
  {
    path: '/onboarding/business/bank-account',
    name: 'business-onboarding-step2',
    component: () => import('@/views/onboarding/business/BankAccount.vue'),
  },
];
```

---

## Shared Patterns

### Progress Bar (replaces Professional's circle stepper)

```
┌──────────────────────────────────────────────┐
│ Business              Organization · Step 1 of 2 │  ← header row, space-between
├──────────────────────────────────────────────┤
│ ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← 2 segments
│   purple active       grey inactive           │
└──────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Container | `display:flex; gap:6px; width:100%;` |
| Segment height | 6px |
| Segment radius | 3px |
| Active segment | `#5749F4` fill |
| Inactive segment | `#F5F5F5` fill |
| Both active (step 2) | Both segments `#5749F4` |
| Width | Each segment `flex:1` |

### Header Row

```
[🏢 Business]              Organization · Step 1 of 2
```

- Brand: `building-2` icon, `#2A2933` bg, "Business" Inter 20px 600
- Step label: Inter 14px, `#616167`, right-aligned
- `justify-content: space-between`

---

## Data Model

```typescript
interface BusinessOnboardingData {
  // Step 1
  organizationType: 'MCHJ' | 'YTT' | 'SELF_EMPLOYED';

  // Step 2
  accountHolder: string;
  bank: string;
  mfo: string;
  inn: string;
  accountNumber: string;
  currency: 'UZS'; // fixed
}
```

---

## Static Data (Mock)

```typescript
const MOCK_BUSINESS_ONBOARDING = {
  organizationType: 'MCHJ',
  accountHolder: '"AutoFix" Mas\'uliyati Cheklangan Jamiyati',
  bank: 'Hamkorbank — Tashkent City (Yunusobod)',
  mfo: '00832',
  inn: '307284921',
  accountNumber: '20208 000 9001 2347 8965',
  currency: 'UZS',
};
```

---

## Implementation Order

1. Create shared `ProgressBar.vue` component
2. Create Pinia store `useBusinessOnboardingStore`
3. Create onboarding routes
4. Implement Step 1 (Organization Type)
5. Implement Step 2 (Bank Account)
6. Wire up navigation
7. Run `pnpm dlx ultracite fix`
