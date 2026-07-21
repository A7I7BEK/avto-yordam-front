<script
  setup
  lang="ts"
>
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  Download,
  Eye,
} from '@lucide/vue';
import { computed, ref } from 'vue';
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
  providerIcon: string;
  status: string;
  date: string;
}

const router = useRouter();
const transactions = ref<Transaction[]>([]);
const loading = ref(true);
const statusFilter = ref('');
const providerFilter = ref('');
const currentPage = ref(1);
const pageSize = 6;

async function loadTransactions() {
  try {
    loading.value = true;
    const data = await getTransactions();
    transactions.value = (data ?? []).map((t) => ({
      ...t,
      providerIcon: getProviderIcon(t.provider),
    }));
  } finally {
    loading.value = false;
  }
}

loadTransactions();

function getProviderIcon(provider: string): string {
  if (provider === 'Cash') {
    return 'circle-dollar-sign';
  }
  return 'credit-card';
}

const statuses = computed(() => {
  const unique = new Set(transactions.value.map((t) => t.status));
  return Array.from(unique);
});

const providers = computed(() => {
  const unique = new Set(transactions.value.map((t) => t.provider));
  return Array.from(unique);
});

const filteredTransactions = computed(() =>
  transactions.value.filter((t) => {
    const matchStatus = !statusFilter.value || t.status === statusFilter.value;
    const matchProvider =
      !providerFilter.value || t.provider === providerFilter.value;
    return matchStatus && matchProvider;
  }),
);

// Pagination (copied from EmployeesList)
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredTransactions.value.length / pageSize)),
);

const pagedTransactions = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredTransactions.value.slice(start, start + pageSize);
});

const showingStart = computed(() => {
  if (filteredTransactions.value.length === 0) {
    return 0;
  }
  return (currentPage.value - 1) * pageSize + 1;
});

const showingEnd = computed(() =>
  Math.min(currentPage.value * pageSize, filteredTransactions.value.length),
);

const visiblePages = computed(() => {
  const pages: number[] = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) {
    pages.push(-1);
  }
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (end < total - 1) {
    pages.push(-1);
  }
  pages.push(total);

  return pages;
});

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) {
    return;
  }
  currentPage.value = page;
}

function goToPrev() {
  goToPage(currentPage.value - 1);
}

function goToNext() {
  goToPage(currentPage.value + 1);
}

function viewTransaction(id: string | null) {
  if (id) {
    router.push(`/business/transactions/${id}`);
  }
}

function statusClass(status: string): string {
  switch (status) {
    case 'Paid':
    case 'Collected':
      return 'status-badge--success';
    case 'Pending':
      return 'status-badge--warning';
    case 'Failed':
      return 'status-badge--error';
    default:
      return '';
  }
}
</script>

<template>
  <div class="transactions-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-text">
        <h1 class="page-title">Transactions</h1>
        <p class="page-subtitle">
          Online and cash payments tied to your orders.
        </p>
      </div>
      <button
        type="button"
        class="btn-export"
      >
        <Download :size="14" />
        Export CSV
      </button>
    </div>

    <!-- Filter bar -->
    <div class="filter-bar">
      <div class="filter-pill">
        <span class="filter-label">Status:</span>
        <span class="filter-value">{{ statusFilter || 'All' }}</span>
        <ChevronDown :size="12" />
        <select
          v-model="statusFilter"
          class="filter-select"
        >
          <option value="">All</option>
          <option
            v-for="s in statuses"
            :key="s"
            :value="s"
          >
            {{ s }}
          </option>
        </select>
      </div>
      <div class="filter-pill">
        <span class="filter-label">Provider:</span>
        <span class="filter-value">{{ providerFilter || 'All' }}</span>
        <ChevronDown :size="12" />
        <select
          v-model="providerFilter"
          class="filter-select"
        >
          <option value="">All</option>
          <option
            v-for="p in providers"
            :key="p"
            :value="p"
          >
            {{ p }}
          </option>
        </select>
      </div>
      <div class="filter-pill">
        <ChevronDown :size="12" />
        <span class="filter-value">Last 30 days</span>
      </div>
    </div>

    <!-- Table card -->
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr class="column-headers">
            <th>Transaction</th>
            <th>Order</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Provider</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="!loading && pagedTransactions.length === 0"
            class="empty-row"
          >
            <td
              colspan="8"
              class="empty-state"
            >
              No transactions found
            </td>
          </tr>
          <tr
            v-for="tx in pagedTransactions"
            :key="tx.id ?? tx.orderId"
            class="data-row"
          >
            <!-- Transaction ID -->
            <td class="cell-transaction">
              {{ tx.id ?? '—' }}
            </td>

            <!-- Order -->
            <td class="cell-order">
              {{ tx.orderId }}
            </td>

            <!-- Customer -->
            <td>
              <div class="customer-cell">
                <div
                  class="avatar"
                  :style="{ background: tx.avatarColor }"
                >
                  {{ tx.customerInitials }}
                </div>
                <span class="customer-name">{{ tx.customerName }}</span>
              </div>
            </td>

            <!-- Amount -->
            <td class="cell-amount">
              {{ tx.amount }}
            </td>

            <!-- Provider -->
            <td>
              <div class="provider-pill">
                <component
                  :is="tx.providerIcon === 'circle-dollar-sign' ? CircleDollarSign : CreditCard"
                  :size="15"
                />
                <span>{{ tx.provider }}</span>
              </div>
            </td>

            <!-- Status -->
            <td>
              <span
                class="status-badge"
                :class="statusClass(tx.status)"
              >
                {{ tx.status }}
              </span>
            </td>

            <!-- Date -->
            <td class="cell-date">
              {{ tx.date }}
            </td>

            <!-- Actions -->
            <td>
              <button
                type="button"
                class="action-btn"
                title="View transaction"
                @click="viewTransaction(tx.id)"
              >
                <Eye :size="16" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="table-footer">
        <span class="table-footer__text">
          Showing {{ showingStart }}–{{ showingEnd }}
          of {{ filteredTransactions.length }} transactions
        </span>
        <div class="pagination">
          <button
            type="button"
            class="page-btn"
            :disabled="currentPage === 1"
            aria-label="Previous page"
            @click="goToPrev"
          >
            <ChevronLeft :size="14" />
          </button>
          <template
            v-for="page in visiblePages"
            :key="page"
          >
            <span
              v-if="page === -1"
              class="page-btn page-btn--ellipsis"
              >…</span
            >
            <button
              v-else
              type="button"
              class="page-btn"
              :class="{ 'page-btn--active': page === currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </template>
          <button
            type="button"
            class="page-btn"
            :disabled="currentPage === totalPages"
            aria-label="Next page"
            @click="goToNext"
          >
            <ChevronRight :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== Page layout ===== */
.transactions-page {
  padding: 24px 32px;
}

/* ===== Header ===== */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 18px;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
}

.page-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Export button ===== */
.btn-export {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
  cursor: pointer;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  transition: opacity 0.15s;
}

.btn-export:hover {
  opacity: 0.8;
}

/* ===== Filter bar ===== */
.filter-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
}

.filter-pill {
  position: relative;
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 14px;
  color: var(--foreground);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
}

.filter-label {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.filter-value {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
}

.filter-select {
  position: absolute;
  inset: 0;
  width: 100%;
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  border: none;
  border-radius: var(--radius-pill);
  opacity: 0;
}

.filter-select option {
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
  background: var(--card);
}

/* ===== Table card ===== */
.table-card {
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

/* ===== Data table ===== */
.data-table {
  width: 100%;
  border-collapse: collapse;
}

/* ===== Column headers ===== */
.column-headers th {
  padding: 14px 18px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-foreground);
  text-align: left;
  letter-spacing: 0.3px;
  white-space: nowrap;
  background: var(--muted);
  border-bottom: 1px solid var(--border);
}

/* ===== Data rows ===== */
.data-row td {
  padding: 14px 18px;
  vertical-align: middle;
  border-bottom: 1px solid var(--border);
}

.data-row:last-of-type td {
  border-bottom: none;
}

/* ===== Transaction cell ===== */
.cell-transaction {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
}

/* ===== Order cell ===== */
.cell-order {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--primary);
}

/* ===== Customer cell ===== */
.customer-cell {
  display: flex;
  gap: 8px;
  align-items: center;
}

.avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-family: Inter, sans-serif;
  font-size: 9px;
  font-weight: 600;
  color: var(--primary-foreground);
  border-radius: var(--radius-pill);
}

.customer-name {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--foreground);
}

/* ===== Amount cell ===== */
.cell-amount {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--foreground);
}

/* ===== Provider pill ===== */
.provider-pill {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  padding: 4px 10px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
}

/* ===== Status badge ===== */
.status-badge {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 4px 10px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  border-radius: var(--radius-pill);
}

.status-badge--success {
  color: var(--color-success-foreground);
  background: var(--color-success);
}

.status-badge--warning {
  color: var(--color-warning-foreground);
  background: var(--color-warning);
}

.status-badge--error {
  color: var(--color-error-foreground);
  background: var(--color-error);
}

/* ===== Date cell ===== */
.cell-date {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
  white-space: nowrap;
}

/* ===== Actions cell ===== */
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: var(--muted-foreground);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 999px;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;
}

.action-btn:hover {
  color: var(--foreground);
  background: var(--accent);
  border-color: var(--foreground);
}

/* ===== Table footer ===== */
.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background: var(--muted);
  border-top: 1px solid var(--border);
}

.table-footer__text {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Pagination ===== */
.pagination {
  display: flex;
  gap: 4px;
  align-items: center;
}

.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
  cursor: pointer;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  transition:
    border-color 0.15s,
    background 0.15s,
    color 0.15s;
}

.page-btn:hover:not(:disabled):not(.page-btn--active):not(.page-btn--ellipsis) {
  background: color-mix(in srgb, var(--primary) 10%, white);
  border-color: var(--primary);
}

.page-btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.page-btn--active {
  font-weight: 600;
  color: var(--primary-foreground);
  background: var(--primary);
  border-color: var(--primary);
}

.page-btn--ellipsis {
  cursor: default;
  background: none;
  border: none;
}

/* ===== Empty state ===== */
.empty-state {
  padding: 40px 18px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--muted-foreground);
  text-align: center;
}
</style>
