<script
  setup
  lang="ts"
>
import { ArrowLeft, CheckCircle2, ExternalLink } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPaymentTransaction } from '@/services/transactionsService';
import type {
  PaymentMethod,
  PaymentStatus,
  PaymentTransaction,
} from '@/types/payment';

const route = useRoute();
const router = useRouter();
const detail = ref<PaymentTransaction | null>(null);
const loading = ref(true);

function goBack() {
  router.push('/business/transactions');
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

const statusIcon = computed(() => {
  const s = detail.value?.status;
  if (s === 'PAID') {
    return CheckCircle2;
  }
  return CheckCircle2;
});

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

function methodLabel(method: PaymentMethod): string {
  return method.charAt(0) + method.slice(1).toLowerCase();
}

onMounted(async () => {
  try {
    const id = route.params.id as string;
    detail.value = await getPaymentTransaction(id);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="detail-page">
    <!-- Loading -->
    <div
      v-if="loading"
      class="loading"
    >
      Loading transaction details...
    </div>

    <!-- Not found -->
    <div
      v-else-if="!detail"
      class="loading"
    >
      Transaction not found
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Header -->
      <div class="detail-header">
        <div class="detail-header__left">
          <!-- Back button -->
          <button
            type="button"
            class="detail-back-btn"
            @click="goBack"
          >
            <ArrowLeft :size="16" />
          </button>

          <div class="detail-header__text">
            <div class="detail-header__title-row">
              <h1 class="detail-header__id">{{ detail.id }}</h1>
              <span
                class="status-badge"
                :class="statusClass(detail.status)"
              >
                <component
                  :is="statusIcon"
                  :size="11"
                />
                {{ detail.status }}
              </span>
            </div>
            <p class="detail-header__meta">
              Order {{ detail.orderId }} • {{ methodLabel(detail.method) }}
            </p>
          </div>
        </div>
      </div>

      <div class="detail-grid">
        <!-- Left Column -->
        <div class="detail-left">
          <!-- Transaction details card -->
          <div class="info-card">
            <h2 class="info-card__title">Transaction details</h2>
            <div class="info-rows">
              <div class="info-row">
                <span class="info-row__label">Transaction ID</span>
                <span class="info-row__value info-row__value--mono"
                  >{{ detail.id }}</span
                >
              </div>
              <div class="info-row">
                <span class="info-row__label">Order</span>
                <span class="info-row__value"
                  >{{ detail.orderId }}</span
                >
              </div>
              <div class="info-row">
                <span class="info-row__label">Payment method</span>
                <span class="info-row__value"
                  >{{ methodLabel(detail.method) }}</span
                >
              </div>
              <div class="info-row">
                <span class="info-row__label">External transaction ID</span>
                <span class="info-row__value info-row__value--mono"
                  >{{ detail.externalTransactionId ?? '—' }}</span
                >
              </div>
              <div class="info-row">
                <span class="info-row__label">Paid at</span>
                <span class="info-row__value"
                  >{{ formatDate(detail.paidAt) }}</span
                >
              </div>
              <div class="info-row">
                <span class="info-row__label">Created</span>
                <span class="info-row__value"
                  >{{ formatDate(detail.createdDate) }}</span
                >
              </div>
            </div>
          </div>

          <!-- Receipt link (optional) -->
          <div
            v-if="detail.externalTransactionId"
            class="info-card"
          >
            <h2 class="info-card__title">Reference</h2>
            <div class="info-rows">
              <div class="info-row">
                <span class="info-row__label">Receipt reference</span>
                <span class="info-row__value">
                  <span class="receipt-link">
                    {{ detail.externalTransactionId }}
                    <ExternalLink :size="11" />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Summary -->
        <div class="detail-right">
          <div class="summary-card">
            <span class="summary-card__label">Summary</span>
            <span class="summary-card__amount"
              >{{ formatAmount(detail.amount) }}</span
            >
            <div class="summary-card__status">
              <span class="summary-card__status-label">Status</span>
              <span
                class="status-badge"
                :class="statusClass(detail.status)"
              >
                {{ detail.status }}
              </span>
            </div>
            <div class="summary-card__divider" />
            <div class="summary-card__section">
              <span class="summary-card__section-label">Related order</span>
              <span class="summary-card__section-value"
                >{{ detail.orderId }}</span
              >
            </div>
            <div class="summary-card__section">
              <span class="summary-card__section-label">Method</span>
              <span class="summary-card__section-value"
                >{{ methodLabel(detail.method) }}</span
              >
            </div>
            <div class="summary-card__section">
              <span class="summary-card__section-label">Paid at</span>
              <span class="summary-card__section-value"
                >{{ formatDate(detail.paidAt) }}</span
              >
            </div>
            <div class="summary-card__section">
              <span class="summary-card__section-label">Created</span>
              <span class="summary-card__section-value"
                >{{ formatDate(detail.createdDate) }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* ===== Page layout ===== */
.detail-page {
  padding: 24px 32px;
}

/* ===== Back button ===== */
.detail-back-btn {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  color: var(--foreground);
  cursor: pointer;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  transition: background 0.15s;
}

.detail-back-btn:hover {
  background: var(--accent);
}

/* ===== Loading ===== */
.loading {
  padding: 40px 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: var(--muted-foreground);
  text-align: center;
}

/* ===== Two-column grid ===== */
.detail-grid {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.detail-left {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.detail-right {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 16px;
  width: 30%;
}

/* ===== Header ===== */
.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.detail-header__left {
  display: flex;
  gap: 16px;
  align-items: center;
}

.detail-header__text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-header__title-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.detail-header__id {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--foreground);
}

.detail-header__meta {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Refund button ===== */
.btn-refund {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted-foreground);
  cursor: pointer;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  transition: opacity 0.15s;
}

.btn-refund:hover {
  opacity: 0.8;
}

/* ===== Info card ===== */
.info-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

.info-card__title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
}

/* ===== Info rows ===== */
.info-rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.info-row__label {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
  white-space: nowrap;
}

.info-row__value {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
  text-align: right;
}

.info-row__value--mono {
  font-family: "SF Mono", "Fira Code", monospace;
  font-size: 11px;
  word-break: break-all;
}

/* ===== Provider pill ===== */
.provider-pill {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 10px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--foreground);
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
}

.provider-pill__logo {
  height: 16px;
}

/* ===== Receipt link ===== */
.receipt-link {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--primary);
  text-decoration: none;
}

.receipt-link:hover {
  text-decoration: underline;
}

/* ===== Timeline ===== */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timeline-item {
  display: flex;
  gap: 12px;
}

.timeline-item__dot-line {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  width: 20px;
}

.timeline-dot {
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  background: var(--color-success-foreground);
  border-radius: var(--radius-pill);
}

.timeline-item--last .timeline-dot {
  background: var(--primary);
}

.timeline-line {
  flex: 1;
  width: 1px;
  min-height: 32px;
  background: var(--border);
}

.timeline-item__content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.timeline-item__title {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.timeline-item__desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Status badge ===== */
.status-badge {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 4px 10px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
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

/* ===== Summary card ===== */
.summary-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

.summary-card__label {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted-foreground);
}

.summary-card__amount {
  font-family: Inter, sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--foreground);
}

.summary-card__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.summary-card__status-label {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.summary-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-card__row-label {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.summary-card__row-value {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
}

.summary-card__divider {
  height: 1px;
  background: var(--border);
}

.summary-card__section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.summary-card__section-label {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.summary-card__section-value {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
}

.summary-card__order-link {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
}

.summary-card__order-link:hover {
  text-decoration: underline;
}

.summary-card__section--net {
  margin-top: 4px;
}

.summary-card__section-label--net {
  font-weight: 600;
}

.summary-card__section-value--net {
  font-size: 16px;
  font-weight: 700;
}

/* ===== Info notice ===== */
.info-notice {
  display: flex;
  gap: 10px;
  padding: 14px 16px;
  color: var(--color-info-foreground);
  background: var(--color-info);
  border-radius: var(--radius-xl);
}

.info-notice__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-notice__title {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
}

.info-notice__desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  opacity: 0.8;
}
</style>
