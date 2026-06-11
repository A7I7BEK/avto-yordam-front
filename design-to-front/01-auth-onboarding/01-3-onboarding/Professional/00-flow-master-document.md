# Professional Onboarding Flow — Master Document

> **Target**: Vue 3 + TypeScript + Composition API + Vue Router  
> **Design Source**: `masters-app-halo.pen` → `04-auth-onboarding-layouts` → `Master · Onboarding`  
> **Output Folder**: `src/views/onboarding/professional/`  
> **Incoming from**: Professional Auth (OTP or Sign Up success)  
> **Leads to**: Dashboard

---

## Flow Overview

```
┌─────────────────────────────────────────┐
│  Step 1: Personal Info (i6kZIt)          │
│  Avatar + Full Name + DOB + Phone +      │
│  Email + Languages                       │
│                    [Continue] ─────────┐  │
└───────────────────────────────────────│──┘
                                        │
                                        ▼
┌─────────────────────────────────────────┐
│  Step 2: Professional Info (h7bM2o)      │
│  Specialization chips + Years of         │
│  experience + Working time/days          │
│                    [Continue] ─────────┐  │
└───────────────────────────────────────│──┘
                                        │
                                        ▼
                                  ┌──────────┐
                                  │ DASHBOARD │
                                  └──────────┘
```

---

## Route Design

```typescript
export const professionalOnboardingRoutes = [
  {
    path: '/onboarding/professional',
    name: 'professional-onboarding',
    redirect: '/onboarding/professional/personal-info',
  },
  {
    path: '/onboarding/professional/personal-info',
    name: 'professional-onboarding-step1',
    component: () => import('@/views/onboarding/professional/PersonalInfo.vue'),
  },
  {
    path: '/onboarding/professional/professional-info',
    name: 'professional-onboarding-step2',
    component: () => import('@/views/onboarding/professional/ProfessionalInfo.vue'),
  },
];
```

---

## Shared Design Tokens (same as auth)

```css
--primary: #5749F4;
--foreground: #2A2933;
--muted-foreground: #616167;
--border: #C5C5CB;
--accent: #F5F5F5;
--card: #FFFFFF;
--background: #FFFFFF;
--radius-l: 40px;
--radius-pill: 999px;
```

---

## Brand Header (identical to Professional auth)

```
[👤 icon 36×36, purple bg]  Professional
```

---

## Stepper Component (shared across both steps)

A horizontal row showing progress through 2 steps, connected by a line:

```
 ① Personal info ────────────── ② Professional info
(purple, active)      (line)    (outlined, inactive)
```

| Element | Active Step | Completed Step | Inactive Step |
|---------|-------------|----------------|---------------|
| Circle bg | `#5749F4` | `#5749F4` | transparent |
| Circle border | none | none | 1px `#C5C5CB` |
| Circle content | Step number (white) | ✓ check icon (white) | Step number (`#616167`) |
| Circle size | 24×24px, border-radius 999px | same | same |
| Label text | Inter 13px 600 `#2A2933` | Inter 13px 500 `#616167` | Inter 13px 500 `#616167` |
| Connecting line | 1px `#C5C5CB`, flex: 1 | same | same |
| Gap | 12px between items | same | same |

---

## Navigation Between Steps

- Step 1 → Step 2: On "Continue" click, validate fields, then `router.push({ name: 'professional-onboarding-step2' })`
- Step 2 → Dashboard: On "Continue" click, save all data, then `router.push({ name: 'dashboard' })`
- "Back" buttons: navigate to previous step (Step 2 → Step 1 via `router.push`)
- Data should be persisted across steps using a Pinia store or provide/inject

---

## Data Model

```typescript
interface ProfessionalOnboardingData {
  // Step 1 — Personal Info
  avatar?: File | null;
  fullName: string;
  dateOfBirth: string;
  phone: string;        // read-only, from auth
  email: string;        // read-only, from auth
  languages: string[];  // ['uzbek', 'russian', 'english']

  // Step 2 — Professional Info
  specializations: string[];  // e.g. ['engine', 'electrical', 'diagnostics']
  yearsOfExperience: number;
  workingHours: {
    from: string;   // '09:00'
    to: string;     // '18:00'
  };
  workingDays: string[];  // ['mon','tue','wed','thu','fri']
}
```

---

## Static Data (Mock)

```typescript
const MOCK_ONBOARDING_DATA: ProfessionalOnboardingData = {
  fullName: 'Aziz Ismoilov',
  dateOfBirth: '14 / 02 / 1991',
  phone: '+998 90 123 45 67',
  email: 'aziz.karimov@masters.uz',
  languages: ['uzbek', 'russian'],
  specializations: ['engine', 'electrical', 'diagnostics'],
  yearsOfExperience: 12,
  workingHours: { from: '09:00', to: '18:00' },
  workingDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
};
```

---

## Implementation Order

1. Create shared `OnboardingStepper.vue` component
2. Create Pinia store `useOnboardingStore` for cross-step data
3. Create onboarding routes
4. Implement Step 1 (Personal Info)
5. Implement Step 2 (Professional Info)
6. Wire up navigation between steps
7. Run `pnpm dlx ultracite fix`
