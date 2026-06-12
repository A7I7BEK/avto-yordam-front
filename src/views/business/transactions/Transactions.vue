<script
  setup
  lang="ts"
>
import { Download, Eye, Filter } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getTransactions } from '@/services/transactionsService';

interface Transaction {
  id: string | null;
  orderId: string;
  customerName: string;
  customerInitials: string;
  avatarColor: string;
  amount: string;
  provider: string;
  providerDot: string | null;
  providerBg: string;
  status: string;
  date: string;
}

const router = useRouter();
const transactions = ref<Transaction[]>([]);
const statusFilter = ref('All');
const providerFilter = ref('All');
const dateFilter = ref('Last 30 days');

onMounted(async () => {
  transactions.value = await getTransactions();
});

function viewTransaction(id: string | null) {
  if (id) {
    router.push(`/business/transactions/${id}`);
  }
}

function statusClass(status: string): string {
  switch (status) {
    case 'Paid':
      return 'badge--success';
    case 'Pending':
      return 'badge--warning';
    case 'Failed':
      return 'badge--danger';
    case 'Collected':
      return 'badge--info';
    default:
      return '';
  }
}
</script>

<template>
  <div class="transactions-page">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <span class="breadcrumb__item">Finance</span>
      <span class="breadcrumb__separator">-</span>
      <span class="breadcrumb__item breadcrumb__item--active"
        >Transactions</span
      >
    </nav>

    <!-- Header -->
    <div class="page-header">
      <div class="page-header__left">
        <h1 class="page-title">Transactions</h1>
        <p class="page-subtitle">View and manage all payment transactions</p>
      </div>
      <div class="page-header__right">
        <button
          type="button"
          class="btn btn--outline"
        >
          <Filter :size="16" />
          <span class="btn__text">Filters</span>
        </button>
        <button
          type="button"
          class="btn btn--primary"
        >
          <Download :size="16" />
          <span class="btn__text">Export CSV</span>
        </button>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <button
        type="button"
        class="filter-pill"
        :class="{ 'filter-pill--active': statusFilter === 'All' }"
        @click="statusFilter = 'All'"
      >
        Status: All
      </button>
      <button
        type="button"
        class="filter-pill"
        :class="{ 'filter-pill--active': providerFilter === 'All' }"
        @click="providerFilter = 'All'"
      >
        Provider: All
      </button>
      <button
        type="button"
        class="filter-pill"
        :class="{ 'filter-pill--active': dateFilter === 'Last 30 days' }"
        @click="dateFilter = 'Last 30 days'"
      >
        Date: Last 30 days
      </button>
    </div>

    <!-- Data Table -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Order</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Provider</th>
            <th>Status</th>
            <th>Date</th>
            <th class="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(tx, index) in transactions"
            :key="index"
          >
            <td class="cell-id">{{ tx.id ?? '—' }}</td>
            <td class="cell-order">{{ tx.orderId }}</td>
            <td>
              <div class="customer-cell">
                <div
                  class="avatar"
                  :style="{ background: tx.avatarColor }"
                >
                  {{ tx.customerInitials }}
                </div>
                <span>{{ tx.customerName }}</span>
              </div>
            </td>
            <td class="cell-amount">{{ tx.amount }}</td>
            <td>
              <div class="provider-cell">
                <span
                  v-if="tx.providerDot"
                  class="provider-dot"
                  :style="{ background: tx.providerDot }"
                />
                <span
                  class="provider-badge"
                  :style="{ background: tx.providerBg }"
                >
                  {{ tx.provider }}
                </span>
              </div>
            </td>
            <td>
              <span
                class="badge"
                :class="statusClass(tx.status)"
                >{{ tx.status }}</span
              >
            </td>
            <td class="cell-date">{{ tx.date }}</td>
            <td class="cell-actions">
              <button
                type="button"
                class="icon-btn"
                title="View transaction"
                @click="viewTransaction(tx.id)"
              >
                <Eye
                  :size="16"
                  color="#616167"
                />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.transactions-page {
  padding: 24px 32px;
  font-family: var(--font-primary);
  color: var(--foreground);
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 20px;
  font-size: 13px;
}

.breadcrumb__item {
  color: var(--muted-foreground);
}

.breadcrumb__item--active {
  font-weight: 500;
  color: var(--foreground);
}

.breadcrumb__separator {
  color: var(--muted-icon);
}

/* Page Header */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-header__left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--foreground);
}

.page-subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--muted-foreground);
}

.page-header__right {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* Buttons */
.btn {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 8px 16px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-md);
  transition: opacity 0.15s;
}

.btn--outline {
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
}

.btn--primary {
  color: #ffffff;
  background: var(--primary);
}

.btn__text {
  font-family: inherit;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.filter-pill {
  padding: 6px 14px;
  font-family: inherit;
  font-size: 13px;
  color: var(--muted-foreground);
  cursor: pointer;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  transition: all 0.15s;
}

.filter-pill--active {
  color: var(--foreground);
  background: var(--accent);
  border-color: var(--border-soft);
}

/* Table */
.table-wrapper {
  overflow: hidden;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.data-table {
  width: 100%;
  font-size: 13px;
  border-collapse: collapse;
}

.data-table th {
  padding: 12px 16px;
  font-weight: 500;
  color: var(--muted-foreground);
  text-align: left;
  white-space: nowrap;
  background: var(--accent);
  border-bottom: 1px solid var(--border);
}

.data-table td {
  padding: 14px 16px;
  color: var(--foreground);
  border-bottom: 1px solid var(--border);
}

.data-table tr:last-child td {
  border-bottom: none;
}

.col-actions {
  width: 60px;
  text-align: center;
}

.cell-id {
  font-family: "SF Mono", "Fira Code", monospace;
  font-size: 12px;
  color: var(--muted-foreground);
}

.cell-order {
  font-weight: 500;
}

.cell-amount {
  font-weight: 600;
}

.cell-date {
  color: var(--muted-foreground);
  white-space: nowrap;
}

.cell-actions {
  text-align: center;
}

/* Customer Cell */
.customer-cell {
  display: flex;
  gap: 10px;
  align-items: center;
}

.avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
  border-radius: 50%;
}

/* Provider Cell */
.provider-cell {
  display: flex;
  gap: 6px;
  align-items: center;
}

.provider-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.provider-badge {
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 500;
  border-radius: var(--radius-pill);
}

/* Status Badge */
.badge {
  display: inline-block;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 500;
  border-radius: var(--radius-pill);
}

.badge--success {
  color: var(--success);
  background: var(--success-bg);
}

.badge--warning {
  color: var(--warning);
  background: var(--warning-bg);
}

.badge--danger {
  color: var(--destructive);
  background: #fee8e3;
}

.badge--info {
  color: var(--muted-foreground);
  background: var(--accent);
}

/* Icon Button */
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  cursor: pointer;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: background 0.15s;
}

.icon-btn:hover {
  background: var(--accent);
}
</style>
