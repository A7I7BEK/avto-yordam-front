<script
  setup
  lang="ts"
>
import {
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  createPaymentTransaction,
  deletePaymentTransaction,
  getPaymentTransactionPage,
  updatePaymentTransaction,
} from '@/services/transactionsService';
import { getOrders } from '@/services/ordersService';
import type {
  PaymentMethod,
  PaymentStatus,
  PaymentTransaction,
  PaymentTransactionRequest,
} from '@/types/payment';
import { PAYMENT_METHODS } from '@/types/payment';

const router = useRouter();

// ── List state ──
const transactions = ref<PaymentTransaction[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const currentPage = ref(0);
const pageSize = 10;
const totalElements = ref(0);
const totalPages = ref(1);

// ── Dialog state ──
const showDialog = ref(false);
const editingId = ref<string | null>(null);
const saving = ref(false);
const formError = ref('');
const orders = ref<{ id: string; label: string }[]>([]);
const loadingOrders = ref(false);

const form = ref<PaymentTransactionRequest>({
  orderId: '',
  amount: 0,
  method: 'PAYME',
  status: undefined,
  externalTransactionId: '',
  paidAt: '',
});

// ── Load list from /api/payment-transaction/page ──
async function loadTransactions() {
  loading.value = true;
  try {
    const pageData = await getPaymentTransactionPage({
      page: currentPage.value,
      size: pageSize,
      search: searchQuery.value.trim(),
    });
    transactions.value = pageData?.content ?? [];
    totalElements.value = pageData?.totalElements ?? 0;
    totalPages.value = Math.max(1, pageData?.totalPages ?? 1);
  } finally {
    loading.value = false;
  }
}

// ── Load orders for the create/edit dropdown ──
async function loadOrders() {
  loadingOrders.value = true;
  try {
    const list = await getOrders();
    orders.value = (list ?? []).map((o: any) => ({
      id: o.backendId ?? o.id ?? '',
      label: `${o.id ?? o.backendId ?? ''} — ${o.customer ?? 'Client'}`,
    }));
  } finally {
    loadingOrders.value = false;
  }
}

function openCreate() {
  editingId.value = null;
  form.value = {
    orderId: '',
    amount: 0,
    method: 'PAYME',
    status: undefined,
    externalTransactionId: '',
    paidAt: '',
  };
  formError.value = '';
  showDialog.value = true;
}

function openEdit(tx: PaymentTransaction) {
  editingId.value = tx.id;
  form.value = {
    id: tx.id,
    orderId: tx.orderId,
    amount: tx.amount,
    method: tx.method,
    status: tx.status,
    externalTransactionId: tx.externalTransactionId ?? '',
    paidAt: tx.paidAt ?? '',
  };
  formError.value = '';
  showDialog.value = true;
}

function closeDialog() {
  showDialog.value = false;
}

function validateForm(): boolean {
  if (!form.value.orderId) {
    formError.value = 'Please select an order.';
    return false;
  }
  if (
    form.value.amount == null ||
    Number.isNaN(Number(form.value.amount)) ||
    Number(form.value.amount) <= 0
  ) {
    formError.value = 'Amount must be a positive number.';
    return false;
  }
  if (!form.value.method) {
    formError.value = 'Please select a payment method.';
    return false;
  }
  return true;
}

async function save() {
  if (!validateForm()) {
    return;
  }
  saving.value = true;
  formError.value = '';
  try {
    const payload: PaymentTransactionRequest = {
      id: form.value.id,
      orderId: form.value.orderId,
      amount: Number(form.value.amount),
      method: form.value.method as PaymentMethod,
      status: form.value.status as PaymentStatus | undefined,
      externalTransactionId:
        form.value.externalTransactionId?.trim() || undefined,
      paidAt: form.value.paidAt || undefined,
    };
    if (editingId.value) {
      await updatePaymentTransaction(editingId.value, payload);
    } else {
      await createPaymentTransaction(payload);
    }
    showDialog.value = false;
    await loadTransactions();
  } catch (e: any) {
    formError.value =
      e.message || 'Failed to save transaction. Please review the fields.';
  } finally {
    saving.value = false;
  }
}

async function handleDelete(tx: PaymentTransaction) {
  if (!tx.id) {
    return;
  }
  try {
    await deletePaymentTransaction(tx.id);
    await loadTransactions();
  } catch (e: any) {
    formError.value = e.message || 'Failed to delete transaction.';
  }
}

function goToPage(page: number) {
  if (page < 0 || page >= totalPages.value) {
    return;
  }
  currentPage.value = page;
  loadTransactions();
}

function viewTransaction(id: string) {
  if (id) {
    router.push(`/business/transactions/${id}`);
  }
}

// ── Formatting helpers ──
function formatAmount(amount: number): string {
  return `${Number(amount || 0).toLocaleString('uz-UZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} UZS`;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) {
    return '—';
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '—';
  }
  return d.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function statusClass(status: PaymentStatus): string {
  switch (status) {
    case 'PAID':
      return 'status-badge--success';
    case 'PENDING':
      return 'status-badge--warning';
    case 'FAILED':
    case 'CANCELLED':
    case 'EXPIRED':
      return 'status-badge--error';
    case 'REFUNDED':
      return 'status-badge--info';
    default:
      return '';
  }
}

function methodLabel(method: PaymentMethod): string {
  return method.charAt(0) + method.slice(1).toLowerCase();
}

// Pagination helpers
const showingStart = computed(() => {
  if (totalElements.value === 0) {
    return 0;
  }
  return currentPage.value * pageSize + 1;
});

const showingEnd = computed(() =>
  Math.min((currentPage.value + 1) * pageSize, totalElements.value),
);

const visiblePages = computed(() => {
  const pages: number[] = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 5) {
    for (let i = 0; i < total; i++) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(0);
  const start = Math.max(1, current - 1);
  const end = Math.min(total - 2, current + 1);

  if (start > 1) {
    pages.push(-1);
  }
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (end < total - 2) {
    pages.push(-1);
  }
  pages.push(total - 1);

  return pages;
});

function runSearch() {
  currentPage.value = 0;
  loadTransactions();
}

onMounted(() => {
  loadTransactions();
  loadOrders();
});
</script>

<template>
  <div class="transactions-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-text">
        <h1 class="page-title">Transactions</h1>
        <p class="page-subtitle">
          Payments tied to your orders.
        </p>
      </div>
      <button
        type="button"
        class="btn-export"
        @click="openCreate"
      >
        <Plus :size="14" />
        New transaction
      </button>
    </div>

    <!-- Search bar -->
    <div class="search-bar">
      <Search
        :size="15"
        class="search-bar__icon"
      />
      <input
        v-model="searchQuery"
        type="text"
        class="search-bar__input"
        placeholder="Search transactions..."
        @keyup.enter="runSearch"
      >
    </div>

    <!-- Table card -->
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr class="column-headers">
            <th>Transaction</th>
            <th>Order</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Paid at</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="loading"
            class="empty-row"
          >
            <td
              colspan="8"
              class="empty-state"
            >
              <Loader2
                :size="16"
                class="spin"
              />
              Loading transactions...
            </td>
          </tr>
          <tr
            v-else-if="transactions.length === 0"
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
            v-for="tx in transactions"
            :key="tx.id"
            class="data-row"
          >
            <!-- Transaction ID -->
            <td class="cell-transaction">
              {{ tx.id }}
            </td>

            <!-- Order -->
            <td class="cell-order">
              {{ tx.orderId }}
            </td>

            <!-- Amount -->
            <td class="cell-amount">
              {{ formatAmount(tx.amount) }}
            </td>

            <!-- Method -->
            <td>
              <div class="provider-pill">
                <CircleDollarSign :size="14" />
                {{ methodLabel(tx.method) }}
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

            <!-- Paid at -->
            <td class="cell-date">
              {{ formatDate(tx.paidAt) }}
            </td>

            <!-- Created -->
            <td class="cell-date">
              {{ formatDate(tx.createdDate) }}
            </td>

            <!-- Actions -->
            <td>
              <div class="actions-cell">
                <button
                  type="button"
                  class="action-btn"
                  title="Edit transaction"
                  @click="openEdit(tx)"
                >
                  <Pencil :size="15" />
                </button>
                <button
                  type="button"
                  class="action-btn"
                  title="View transaction"
                  @click="viewTransaction(tx.id)"
                >
                  <Eye :size="15" />
                </button>
                <button
                  type="button"
                  class="action-btn action-btn--danger"
                  title="Delete transaction"
                  @click="handleDelete(tx)"
                >
                  <Trash2 :size="15" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="table-footer">
        <span class="table-footer__text">
          Showing {{ showingStart }}–{{ showingEnd }}
          of {{ totalElements }} transactions
        </span>
        <div class="pagination">
          <button
            type="button"
            class="page-btn"
            :disabled="currentPage === 0"
            aria-label="Previous page"
            @click="goToPage(currentPage - 1)"
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
              {{ page + 1 }}
            </button>
          </template>
          <button
            type="button"
            class="page-btn"
            :disabled="currentPage >= totalPages - 1"
            aria-label="Next page"
            @click="goToPage(currentPage + 1)"
          >
            <ChevronRight :size="14" />
          </button>
        </div>
      </div>
    </div>

    <!-- Create / Edit Dialog -->
    <Teleport to="body">
      <div
        v-if="showDialog"
        class="modal-backdrop"
        @click.self="closeDialog"
      >
        <div class="modal">
          <div class="modal__header">
            <h2 class="modal__title">
              {{ editingId ? 'Edit transaction' : 'New transaction' }}
            </h2>
            <button
              type="button"
              class="modal__close"
              aria-label="Close"
              @click="closeDialog"
            >
              <X :size="18" />
            </button>
          </div>

          <div class="modal__body">
            <div
              v-if="formError"
              class="form-error"
            >
              {{ formError }}
            </div>

            <div class="field-group">
              <label class="field-label">Order</label>
              <select
                v-model="form.orderId"
                class="field-input"
                :disabled="loadingOrders"
              >
                <option value="">
                  {{ loadingOrders ? 'Loading orders...' : 'Select an order' }}
                </option>
                <option
                  v-for="o in orders"
                  :key="o.id"
                  :value="o.id"
                >
                  {{ o.label }}
                </option>
              </select>
            </div>

            <div class="field-row">
              <div class="field-group">
                <label class="field-label">Amount (UZS)</label>
                <input
                  v-model.number="form.amount"
                  type="number"
                  min="0"
                  step="0.01"
                  class="field-input"
                  placeholder="250000.00"
                >
              </div>
              <div class="field-group">
                <label class="field-label">Payment method</label>
                <select
                  v-model="form.method"
                  class="field-input"
                >
                  <option
                    v-for="m in PAYMENT_METHODS"
                    :key="m"
                    :value="m"
                  >
                    {{ methodLabel(m) }}
                  </option>
                </select>
              </div>
            </div>

            <div class="field-row">
              <div class="field-group">
                <label class="field-label">Status</label>
                <select
                  v-model="form.status"
                  class="field-input"
                >
                  <option value="">
                    Default (PENDING)
                  </option>
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="FAILED">FAILED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="EXPIRED">EXPIRED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>
              <div class="field-group">
                <label class="field-label">Paid at</label>
                <input
                  v-model="form.paidAt"
                  type="datetime-local"
                  class="field-input"
                >
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">External transaction ID (optional)</label>
              <input
                v-model="form.externalTransactionId"
                type="text"
                class="field-input"
                placeholder="e.g. provider reference"
              >
            </div>
          </div>

          <div class="modal__footer">
            <button
              type="button"
              class="btn-modal btn-modal--cancel"
              :disabled="saving"
              @click="closeDialog"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn-modal btn-modal--primary"
              :disabled="saving"
              @click="save"
            >
              <Loader2
                v-if="saving"
                :size="14"
                class="spin"
              />
              {{ saving ? 'Saving…' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
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

/* ===== New transaction button ===== */
.btn-export {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--primary-foreground);
  cursor: pointer;
  background: var(--primary);
  border: 1px solid var(--primary);
  border-radius: var(--radius-pill);
  transition: opacity 0.15s;
}

.btn-export:hover {
  opacity: 0.85;
}

/* ===== Search bar ===== */
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}

.search-bar__icon {
  position: absolute;
  left: 14px;
  color: var(--muted-foreground);
}

.search-bar__input {
  width: 100%;
  padding: 10px 14px 10px 40px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--foreground);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  outline: none;
}

.search-bar__input:focus {
  border-color: var(--primary);
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
  white-space: nowrap;
}

/* ===== Order cell ===== */
.cell-order {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--primary);
  white-space: nowrap;
}

/* ===== Amount cell ===== */
.cell-amount {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--foreground);
  white-space: nowrap;
}

/* ===== Provider pill ===== */
.provider-pill {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  padding: 5px 10px;
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

.status-badge--info {
  color: #ffffff;
  background: #3b82f6;
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
.actions-cell {
  display: flex;
  gap: 6px;
  align-items: center;
}

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

.action-btn--danger:hover {
  color: var(--color-error-foreground);
  background: var(--color-error);
  border-color: var(--color-error);
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
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 40px 18px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--muted-foreground);
  text-align: center;
}

/* ===== Modal ===== */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.45);
}

.modal {
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--card);
  border-radius: var(--radius-xl);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid var(--border);
}

.modal__title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
}

.modal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: var(--muted-foreground);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 999px;
}

.modal__close:hover {
  background: var(--accent);
}

.modal__body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px;
}

.modal__footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 16px 22px;
  border-top: 1px solid var(--border);
}

/* ===== Form fields ===== */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.field-row {
  display: flex;
  gap: 12px;
}

.field-label {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-foreground);
}

.field-input {
  width: 100%;
  padding: 9px 12px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-m);
  outline: none;
}

.field-input:focus {
  border-color: var(--primary);
}

.form-error {
  padding: 10px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--color-error-foreground);
  background: var(--color-error);
  border-radius: var(--radius-m);
}

.btn-modal {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 9px 18px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border-radius: var(--radius-pill);
  transition: opacity 0.15s;
}

.btn-modal:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-modal--cancel {
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
}

.btn-modal--primary {
  color: var(--primary-foreground);
  background: var(--primary);
  border: 1px solid var(--primary);
}

/* ===== Spinner ===== */
.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 720px) {
  .field-row {
    flex-direction: column;
  }
}
</style>
