# Page Prompt: Transaction Detail

> **Design Node ID**: `PpWoq`
> **Page Name**: Transaction Detail — "41 — Transaction Detail"
> **Route**: `/business/transactions/:id`
> **View File**: `src/views/business/TransactionDetail.vue`
> **Uses Layout**: `AppShell.vue`

---

## 1. Overview

The Transaction Detail page shows full information about a single transaction. It's a two-column layout: the left shows transaction fields and a timeline of events, the right shows a financial summary with amount, fees, net payout, and settlement timeline.

---

## 2. Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Finance > Transactions > PM-8472913                              │
│ ← Back to transactions                                           │
├──────────────────────────────────┬──────────────────────────────┤
│ Transaction details              │ Summary                      │
│ ┌──────────────────────────────┐ │ 850 000 UZS                 │
│ │ Transaction  PM-8472913      │ │ ─────────────────           │
│ │ Order        #10342  ↗       │ │ Status    [Paid]            │
│ │ Service      Brake pads      │ │ ─────────────────           │
│ │ Payer        Akmal Nazarov   │ │ Related order  #10342 Brakes│
│ │              +99890***4827   │ │ Initiated  Apr 12, 14:32:08 │
│ │ Card         Humo •••• 4127 │ │ Completed  Apr 12, 14:32:45 │
│ │ Receipt      [Download PDF]  │ │ Settlement  Apr 14 (T+2)    │
│ └──────────────────────────────┘ │ Provider fee  −21 250 UZS   │
│                                  │ Platform fee  −8 500 UZS    │
│ Timeline                         │ ─────────────────           │
│ ┌──────────────────────────────┐ │ Net payout  820 250 UZS     │
│ │ ● Payment initiated          │ └──────────────────────────────┤
│ │   Apr 12, 14:32:08           │ ┌──────────────────────────────┐
│ │ ● Processing                 │ │ ℹ Refunds coming soon       │
│ │   Apr 12, 14:32:12           │ │ Provider refunds will be     │
│ │ ● Completed                  │ │ available in May...          │
│ │   Apr 12, 14:32:45           │ └──────────────────────────────┘
│ │ ● Settlement expected        │
│ │   Apr 14, 2026 (T+2)         │
│ └──────────────────────────────┘
└──────────────────────────────────┴──────────────────────────────┘
```

---

## 3. Header

### 3.1 Breadcrumb

```
Finance > Transactions > PM-8472913
```

- "Finance": Inter 12px normal, `#616167`
- Chevron-right 12px
- "Transactions": Inter 12px normal, `#616167` (link back)
- Chevron-right 12px
- "PM-8472913": Inter 12px 500, `#2A2933`
- Gap: 6px

### 3.2 Back Link

"← Back to transactions" — Inter 13px, `#5749F4`, clickable, links to `/business/transactions`.

---

## 4. Content Layout

```css
.detail-body {
  display: flex;
  gap: 16px;
  padding: 24px 32px;
}
.detail-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.detail-right {
  width: 380px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

---

## 5. Transaction Details Card (Left Top)

Card: radius 24px, white bg, border `#C5C5CB`, padding 24px, gap 12px.

### Fields (space-between rows)

Each row: label Inter 12px normal `#616167` + value Inter 12px 500 `#2A2933`.

| Label | Value |
|-------|-------|
| Transaction | **PM-8472913** |
| Order | **#10342** ↗ (purple link) |
| Service | **Brake pads exchange** |
| Payer | **Akmal Nazarov** • +998 90 *** 4827 |
| Card | **Humo** •••• 4127 |
| Receipt | **[Download PDF]** link with download icon |

---

## 6. Timeline Card (Left Bottom)

Card: radius 24px, white bg, border `#C5C5CB`, padding 24px.

Title: "Timeline" — Inter 15px 600, `#2A2933`.

### Timeline Events (×4)

Each event: horizontal, gap 12px.

**Dot column** (20px wide):
- Circle: 12×12px, `#5749F4` fill, radius 999
- Vertical line connecting to next dot: 1px wide, `#D9D9DB`, fills remaining height
- Last event: no line

**Content** (vertical, gap 2px):
- Event title: Inter 13px 600, `#2A2933`
- Timestamp: Inter 12px normal, `#616167`

| # | Title | Timestamp |
|---|-------|-----------|
| 1 | Payment initiated | Apr 12, 2026 · 14:32:08 |
| 2 | Processing | Apr 12, 2026 · 14:32:12 |
| 3 | Completed | Apr 12, 2026 · 14:32:45 |
| 4 | Settlement expected | Apr 14, 2026 (T+2) |

---

## 7. Summary Card (Right)

Card: radius 24px, white bg, border `#C5C5CB`, padding 24px, gap 14px.

### 7.1 Header

"Summary" — Inter 13px 500, `#616167`

### 7.2 Big Amount

"850 000 UZS" — Inter 32px 700, `#2A2933`

### 7.3 Status Row

Space-between, padding 12px 0, top+bottom border `#C5C5CB`.

"Status" — Inter 12px normal, `#616167`
[Paid] pill: radius 999, `#A1E5A1` bg, `#003300` text, padding 3px 8px, Inter 11px 600

### 7.4 Related Order

Vertical, gap 6px:
- "Related order" — Inter 12px normal, `#616167`
- "#10342 Brake pads exchange" — Inter 13px 500, `#5749F4`, with arrow icon

### 7.5 Date Fields

Vertical, gap 2px each:

| Label | Value |
|-------|-------|
| Initiated | **Apr 12, 2026 • 14:32:08** |
| Completed | **Apr 12, 2026 • 14:32:45** |
| Settlement date | **Apr 14, 2026 (T+2)** |

Labels: Inter 12px normal, `#616167`. Values: Inter 13px 500, `#2A2933`.

### 7.6 Fee Lines

| Label | Value |
|-------|-------|
| Provider fee (2.5%) | **−21 250 UZS** |
| Platform fee (1%) | **−8 500 UZS** |

Labels: Inter 12px normal, `#616167`. Values: Inter 13px 500, `#2A2933`.

### 7.7 Net Payout

| Label | Value |
|-------|-------|
| Net payout | **820 250 UZS** |

Label: Inter 12px 600, `#616167`. Value: Inter 16px 700, `#2A2933`.

---

## 8. Info Banner (Right Bottom)

```css
.info-banner {
  display: flex;
  gap: 10px;
  padding: 14px;
  border-radius: 24px;
  background: #C9D6F0;
  border: 1px solid #001133;
}
```

- `info` icon 16px, `#001133`
- Title: "Refunds coming soon" — Inter 12px 600, `#001133`
- Description: "Provider refunds will be available in May. Until then, refunds can be issued manually." — Inter 11px normal, `#001133`

---

## 9. Mock Data

```typescript
// src/data/transactionDetail.ts
export const transactionDetail = {
  id: 'PM-8472913',
  orderId: '#10342',
  orderRoute: '/business/orders/10342',
  service: 'Brake pads exchange',
  amount: '850 000 UZS',
  amountNum: 850000,
  payerName: 'Akmal Nazarov',
  payerPhone: '+998 90 *** 4827',
  cardBank: 'Humo',
  cardLast4: '4127',
  receiptUrl: '#',
  status: 'Paid',
  statusBg: '#A1E5A1',
  statusColor: '#003300',
  initiatedAt: 'Apr 12, 2026 • 14:32:08',
  completedAt: 'Apr 12, 2026 • 14:32:45',
  settlementDate: 'Apr 14, 2026 (T+2)',
  providerFeePercent: 2.5,
  providerFee: '−21 250 UZS',
  platformFeePercent: 1,
  platformFee: '−8 500 UZS',
  netPayout: '820 250 UZS',
  timeline: [
    { title: 'Payment initiated', time: 'Apr 12, 2026 · 14:32:08' },
    { title: 'Processing', time: 'Apr 12, 2026 · 14:32:12' },
    { title: 'Completed', time: 'Apr 12, 2026 · 14:32:45' },
    { title: 'Settlement expected', time: 'Apr 14, 2026 (T+2)' },
  ],
};
```

---

## 10. Component Tree

```
TransactionDetail.vue
├── BreadcrumbBar.vue              ← Finance > Transactions > PM-8472913
├── BackLink.vue                   ← ← Back to transactions
├── DetailBody.vue
│   ├── DetailLeft.vue
│   │   ├── TransactionInfoCard.vue ← Transaction, Order, Service, Payer, Card, Receipt
│   │   └── TimelineCard.vue       ← 4 timeline events
│   └── DetailRight.vue
│       ├── SummaryCard.vue         ← Amount, Status, Order, Dates, Fees, Net
│       └── InfoBanner.vue          ← Refunds coming soon
```

---

## 11. Navigation

- "← Back to transactions" → `/business/transactions`
- Order link → `/business/orders/{id}`
- Sidebar **Transactions** nav item remains **active**
- Accessed from eye icon on Transactions List page
