# Page Prompt: Transactions List

> **Design Node ID**: `yHYpb`
> **Page Name**: Transactions List
> **Route**: `/business/transactions`
> **View File**: `src/views/business/Transactions.vue`
> **Uses Layout**: `AppShell.vue` (with Business sidebar + header from `01-layouts-components`)

---

## 1. Overview

The Transactions page displays all online and cash payments across the business in a filterable data table. Each transaction shows the payment provider, amount, status, customer, and related order. An eye icon on each row navigates to the Transaction Detail page (`02-transaction-detail.md`). Filter and export controls are available.

---

## 2. Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Finance > Transactions                                           │
│ Transactions                   [Filters ▾]  [Export CSV]         │
│ Online and cash payments tied to your orders.                    │
├─────────────────────────────────────────────────────────────────┤
│ [All ▾]  [All providers ▾]  [📅 Last 30 days]                  │
├─────────────────────────────────────────────────────────────────┤
│ TRANSACTION  ORDER  CUSTOMER      AMOUNT    PROVIDER  STATUS DATE│
│ PM-8472913  #10342 ● AN Akmal N.  850K UZS  ● PayMe   Paid  …  │
│ CL-39872041 #10341 ● SK Saida K. 1.24M UZS  ● Click   Paid  …  │
│ —           #10340 ● OT Otabek T. 420K UZS  💵 Cash   Coll. …  │
│ PN-77129834 #10339 ● DR Dilshod R.680K UZS  ● Paynet  Pend. …  │
│ PM-8439112  #10338 ● NK Nilufar K.1.95M UZS ● PayMe   Failed … │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Header Section

### 3.1 Breadcrumb

```
Finance > Transactions
```

- "Finance": Inter 12px normal, `#616167`
- Chevron-right 12px
- "Transactions": Inter 12px 500, `#2A2933`
- Gap: 6px

### 3.2 Title Row (space-between)

**Left** (vertical, gap 4px):
- "Transactions" — Inter 24px 700, `#2A2933`
- "Online and cash payments tied to your orders." — Inter 13px normal, `#616167`

**Right** (horizontal, gap 8px):
- Filters button: pill, white bg, border `#C5C5CB`, padding 8px 14px
  - `sliders-horizontal` icon 14px + "Filters" Inter 13px 500, gap 6px
- Export CSV button: pill, white bg, border `#C5C5CB`, padding 8px 14px
  - `download` icon 14px + "Export CSV" Inter 13px 500, gap 6px

---

## 4. Filter Bar

Horizontal, gap 8px. Three pill dropdowns:

| Filter | Icon | Label | Options |
|--------|------|-------|---------|
| Status | — | Status: **All** | All, Paid, Collected, Pending, Failed |
| Provider | — | Provider: **All** | All, PayMe, Click, Paynet, Cash |
| Date | `calendar` 12px | **Last 30 days** | Today, Last 7 days, Last 30 days, This month, Custom |

Each pill: radius 999, white bg, border `#C5C5CB`, padding 8px 14px, gap 6px, `chevron-down` 12px.

---

## 5. Data Table

### 5.1 Table Container

```css
.transactions-table {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
  overflow: hidden;
}
```

### 5.2 Table Header

Row with `#F5F5F5` bg, padding 14px 18px, gap 12px, bottom border `#C5C5CB`.

| Column | Width | Font |
|--------|-------|------|
| Transaction | 140px | Inter 11px 600, `#616167` |
| Order | 100px | Inter 11px 600, `#616167` |
| Customer | 170px | Inter 11px 600, `#616167` |
| Amount | 140px | Inter 11px 600, `#616167` |
| Provider | 120px | Inter 11px 600, `#616167` |
| Status | 120px | Inter 11px 600, `#616167` |
| Date | fill | Inter 11px 600, `#616167` |
| Actions | 50px | centered, Inter 11px 600 |

### 5.3 Table Row

Padding 14px 18px, gap 12px, bottom border `#C5C5CB` (except last row).

**Transaction ID**:
- Inter 12px 500, `#2A2933`. For cash payments, shows "—" in `#616167`.

**Order**:
- Inter 12px 500, `#5749F4` (purple, clickable link to `/business/orders/{id}`)

**Customer** (horizontal, gap 8px):
- Avatar: 24×24px circle, colored bg, white initials Inter 9px 600
- Name: Inter 12px normal, `#2A2933`

**Amount**:
- Inter 12px 600, `#2A2933`

**Provider** (pill badge):
- Colored dot 6px + provider name Inter 11px 600
- Pill: radius 999, padding 3px 8px, gap 6px

| Provider | Dot Color | Badge Bg | Text Color |
|----------|----------|----------|------------|
| PayMe | `#00A0E9` | `#C9D6F0` | `#001133` |
| Click | `#1D7DE0` | `#FFD9B2` | `#4D2700` |
| Paynet | `#7A4BFF` | `#C9D6F0` | `#001133` |
| Cash | banknote icon | `#F5F5F5` with border | `#2A2933` |

**Status** (pill badge):
- Pill: radius 999, padding 3px 8px, gap 6px, Inter 11px 600

| Status | Bg | Text Color |
|--------|----|-----------|
| Paid | `#A1E5A1` | `#003300` |
| Collected | `#A1E5A1` | `#003300` |
| Pending | `#FFD9B2` | `#4D2700` |
| Failed | `#FFBFB2` | `#590F00` |

**Date**:
- Inter 12px normal, `#616167`

**Actions**:
- Eye icon button: 32×32px circle, border `#C5C5CB`, `eye` icon 16px
- Click navigates to transaction detail page

### 5.4 Data

```typescript
// src/data/transactions.ts
export const transactions = [
  { id: 'PM-8472913', orderId: '#10342', customerName: 'Akmal Nazarov', customerInitials: 'AN', avatarColor: '#5749F4', amount: '850 000 UZS', provider: 'PayMe', providerDot: '#00A0E9', providerBg: '#C9D6F0', status: 'Paid', date: 'Apr 12, 14:32' },
  { id: 'CL-39872041', orderId: '#10341', customerName: 'Saida Karimova', customerInitials: 'SK', avatarColor: '#FF7A4B', amount: '1 240 000 UZS', provider: 'Click', providerDot: '#1D7DE0', providerBg: '#FFD9B2', status: 'Paid', date: 'Apr 12, 11:08' },
  { id: null, orderId: '#10340', customerName: 'Otabek Tursunov', customerInitials: 'OT', avatarColor: '#1FAA59', amount: '420 000 UZS', provider: 'Cash', providerDot: null, providerBg: '#F5F5F5', status: 'Collected', date: 'Apr 11, 17:55' },
  { id: 'PN-77129834', orderId: '#10339', customerName: 'Dilshod Rakhmonov', customerInitials: 'DR', avatarColor: '#A35BFF', amount: '680 000 UZS', provider: 'Paynet', providerDot: '#7A4BFF', providerBg: '#C9D6F0', status: 'Pending', date: 'Apr 11, 09:12' },
  { id: 'PM-8439112', orderId: '#10338', customerName: 'Nilufar Khasanova', customerInitials: 'NK', avatarColor: '#F77E40', amount: '1 950 000 UZS', provider: 'PayMe', providerDot: '#00A0E9', providerBg: '#C9D6F0', status: 'Failed', date: 'Apr 10, 16:45' },
];
```

---

## 6. Component Tree

```
Transactions.vue
├── BreadcrumbBar.vue            ← Finance > Transactions
├── HeaderRow.vue                ← Title + Filters + Export buttons
├── FilterBar.vue                ← Status / Provider / Date dropdowns
│   └── FilterPill.vue ×3
└── DataTable.vue                ← Transactions table
    ├── TableHeader.vue           ← Column headers
    └── TableRow.vue ×5           ← Individual transaction rows
        ├── CustomerCell.vue      ← Avatar + name
        ├── ProviderBadge.vue     ← Provider pill
        └── StatusBadge.vue       ← Status pill
```

---

## 7. Vue Component

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getTransactions } from '@/services/transactionsService';

const router = useRouter();
const data = ref<any[]>([]);
const statusFilter = ref('All');
const providerFilter = ref('All');
const dateFilter = ref('Last 30 days');

onMounted(async () => { data.value = await getTransactions(); });

const filtered = computed(() => {
  let result = data.value;
  if (statusFilter.value !== 'All') result = result.filter(t => t.status === statusFilter.value);
  if (providerFilter.value !== 'All') result = result.filter(t => t.provider === providerFilter.value);
  return result;
});

function viewDetail(txId: string | null) {
  if (txId) router.push(`/business/transactions/${txId}`);
}
</script>
```

---

## 8. Navigation

- Sidebar **Transactions** nav item is **active**
- Eye icon → `/business/transactions/{id}` (Transaction Detail page)
- Order link → `/business/orders/{id}`
- Breadcrumb: Finance > Transactions
