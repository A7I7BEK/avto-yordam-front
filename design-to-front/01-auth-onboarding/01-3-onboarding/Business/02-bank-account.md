# Page Prompt: Step 2 — Bank Account

> **Design Node ID**: `toYVY` | **Route**: `/onboarding/business/bank-account` | **Viewport**: 1440×900px  
> **Incoming from**: Step 1 (Organization Type) | **Leads to**: Dashboard

---

## 1. Overview

The business enters its bank account details for receiving online payments. Includes a warning notice, 5 form fields (account holder, bank, MFO, INN, account number), and a read-only currency indicator.

---

## 2. Page Layout

```
1440×900px, bg #FFFFFF, padding 40px 80px, flex column, gap 24px

┌──────────────────────────────────────────────┐
│ [🏢 Business]       Organization · Step 2 of 2 │  ← header
├──────────────────────────────────────────────┤
│ ██████████████████████████████████████████████ │  ← progress bar (both active)
├──────────────────────────────────────────────┤
│  Bank account                                │
│  Where online payments will be deposited...  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ ⚠ Account holder must match legal     │  │  ← warning notice
│  │   entity...                            │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ Account holder: "AutoFix" MChJ         │  │
│  │ Bank: Hamkorbank — Tashkent City...    │  │
│  │ ┌──────────┐ ┌──────────┐             │  │  ← Bank Card
│  │ │ MFO:0832 │ │ INN:...  │             │  │
│  │ └──────────┘ └──────────┘             │  │
│  │ Account number: 20208 000 9001...      │  │
│  │ ─────────────────────────────────────  │  │
│  │ Currency: [UZS] · Only UZS supported   │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  [← Back]                    [Continue →]    │
└──────────────────────────────────────────────┘
```

---

## 3. Header Row

Same as Step 1, but step label: "Organization · Step 2 of 2".

---

## 4. Progress Bar

Both segments `#5749F4` (step 1 complete, step 2 active).

---

## 5. Title Section (gap 8px)

- **Title**: "Bank account", Inter 24px 600, `#2A2933`
- **Subtitle**: "Where online payments will be deposited. Funds settle T+2 to this account.", Inter 14px, `#616167`

---

## 6. Warning Notice

Orange alert box before the bank card:

| Property | Value |
|----------|-------|
| Layout | `display:flex; align-items:center; gap:10px;` |
| Background | `#FFD9B2` (--color-warning) |
| Border | 1px solid `#4D2700` (--color-warning-foreground) |
| Border-radius | 24px (--radius-m) |
| Padding | 14px |

**Icon**: `shield-alert` (Lucide), 16px, `#4D2700`

**Text block** (gap 2px):
- **Bold**: "Account holder must match legal entity", Inter 13px 600, `#4D2700`
- **Regular**: "The bank account must be in the same legal name as your organization's tax registration.", Inter 12px, `#4D2700`

---

## 7. Bank Card

Card styling: border-radius 40px, `#FFFFFF` bg, 1px `#C5C5CB` border, shadow `0 10px 8.75px #0000000a`, padding 32px, gap 20px, full width.

### 7.1 Row 1 — Account Holder

**Input Group/Filled** (`VeIJB` ref):
- Label: "Account holder (legal name)"
- Value: `"AutoFix" Mas'uliyati Cheklangan Jamiyati`
- Pill input styling

### 7.2 Row 2 — Bank

- Label: "Bank"
- Value: `Hamkorbank — Tashkent City (Yunusobod)`
- Pill input

### 7.3 Row 3 — MFO + INN (side by side)

`display:flex; gap:16px;`

| Field | Label | Mock Value |
|-------|-------|------------|
| Left | "MFO (bank code)" | `00832` |
| Right | "INN (tax ID)" | `307284921` |

Both: 50% width each (`flex:1`), pill input styling.

### 7.4 Row 4 — Account Number

- Label: "Account number"
- Value: `20208 000 9001 2347 8965`
- Pill input

### 7.5 Row 5 — Currency (Read-only)

Top border separator: `padding-top: 8px; border-top: 1px solid #C5C5CB;`

`display:flex; align-items:center; gap:8px;`

| Element | Spec |
|---------|------|
| Label | "Currency", Inter 11px 500, `#616167` |
| UZS chip | Pill, padding 4px 10px, `#F5F5F5` bg, 1px `#C5C5CB` border. Text: "UZS", Inter 12px 700, `#2A2933` |
| Hint | "· Only UZS settlement is supported.", Inter 11px italic, `#616167` |

---

## 8. Footer

Same as Step 1: space-between.

**Back**: Secondary button → Step 1  
**Continue**: Primary button → Dashboard (saves all data)

---

## 9. Vue Component

### File: `src/views/onboarding/business/BankAccount.vue`

### Icons (Lucide): `Building2`, `ShieldAlert`, `ArrowLeft`, `ArrowRight`

### Mock Data

```typescript
const form = reactive({
  accountHolder: '"AutoFix" Mas\'uliyati Cheklangan Jamiyati',
  bank: 'Hamkorbank — Tashkent City (Yunusobod)',
  mfo: '00832',
  inn: '307284921',
  accountNumber: '20208 000 9001 2347 8965',
  currency: 'UZS',
});
```

### Interactions

| Trigger | Action |
|---------|--------|
| "Back" | Navigate to Step 1 |
| "Continue" | Save to store → submit onboarding → navigate to dashboard |
| Form fields | Editable in mock — no real validation needed yet |

### Implementation Checklist

1. [ ] Create `src/views/onboarding/business/BankAccount.vue`
2. [ ] Header + progress bar (both segments purple)
3. [ ] Title section
4. [ ] Warning notice (orange, shield-alert icon)
5. [ ] Bank card with all 5 form rows
6. [ ] Row 3: MFO + INN side by side
7. [ ] Row 5: Currency read-only chip + italic hint with top border
8. [ ] Footer: Back + Continue buttons
9. [ ] Read data from onboarding store
10. [ ] Run `pnpm dlx ultracite fix`

**Screenshot**: `02-bank-account.png`
