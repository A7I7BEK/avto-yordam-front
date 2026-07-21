<script
  setup
  lang="ts"
>
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Info,
  Undo2,
} from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getTransactionDetail } from '@/services/transactionsService';

interface TimelineItem {
  title: string;
  description: string;
  time: string;
  isLast: boolean;
}

interface TransactionDetailData {
  id: string;
  orderId: string;
  orderTitle: string;
  customerName: string;
  customerInitials: string;
  amount: number;
  amountFormatted: string;
  provider: string;
  providerColor: string;
  status: string;
  date: string;
  time: string;
  providerTransactionId: string;
  merchantId: string;
  payerName: string;
  payerPhone: string;
  cardType: string;
  cardLast4: string;
  receiptUrl: string;
  feePercentage: string;
  feeAmount: string;
  netAmount: string;
  platformFee: string;
  platformFeePct: string;
  providerFee: string;
  providerFeePct: string;
  netPayout: string;
  settlementDate: string;
  completedDate: string;
  completedTime: string;
  initiatedTime: string;
  timeline: TimelineItem[];
}

const route = useRoute();
const router = useRouter();
const detail = ref<TransactionDetailData | null>(null);
const loading = ref(true);

function goBack() {
  router.push('/business/transactions');
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

const statusIcon = computed(() => {
  const s = detail.value?.status;
  if (s === 'Paid' || s === 'Collected') {
    return CheckCircle2;
  }
  return CheckCircle2;
});

onMounted(async () => {
  try {
    const id = route.params.id as string;
    detail.value = (await getTransactionDetail(id)) as TransactionDetailData;
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
              Initiated {{ detail.date }} • {{ detail.time }} • Order
              {{ detail.orderId }}
            </p>
          </div>
        </div>

        <button
          type="button"
          class="btn-refund"
        >
          <Undo2 :size="14" />
          Refund
        </button>
      </div>

      <div class="detail-grid">
        <!-- Left Column -->
        <div class="detail-left">
          <!-- Provider response card -->
          <div class="info-card">
            <h2 class="info-card__title">Provider response</h2>
            <div class="info-rows">
              <div class="info-row">
                <span class="info-row__label">Provider</span>
                <span class="info-row__value">
                  <span class="provider-pill">
                    <span
                      class="provider-dot"
                      :style="{ background: detail.providerColor }"
                    />
                    {{ detail.provider }}
                  </span>
                </span>
              </div>
              <div class="info-row">
                <span class="info-row__label">Provider transaction ID</span>
                <span class="info-row__value info-row__value--mono"
                  >{{ detail.providerTransactionId }}</span
                >
              </div>
              <div class="info-row">
                <span class="info-row__label">Merchant ID</span>
                <span class="info-row__value info-row__value--mono"
                  >{{ detail.merchantId }}</span
                >
              </div>
              <div class="info-row">
                <span class="info-row__label">Payer</span>
                <span class="info-row__value"
                  >{{ detail.payerName }}
                  • {{ detail.payerPhone }}</span
                >
              </div>
              <div class="info-row">
                <span class="info-row__label">Card</span>
                <span class="info-row__value"
                  >{{ detail.cardType }}
                  •••• {{ detail.cardLast4 }}</span
                >
              </div>
              <div class="info-row">
                <span class="info-row__label">Receipt</span>
                <span class="info-row__value">
                  <a
                    :href="detail.receiptUrl"
                    class="receipt-link"
                    target="_blank"
                    rel="noopener"
                  >
                    Open in {{ detail.provider }}
                    <ExternalLink :size="11" />
                  </a>
                </span>
              </div>
            </div>
          </div>

          <!-- Timeline card -->
          <div class="info-card">
            <h2 class="info-card__title">Timeline</h2>
            <div class="timeline">
              <div
                v-for="(item, i) in detail.timeline"
                :key="i"
                class="timeline-item"
                :class="{ 'timeline-item--last': item.isLast }"
              >
                <div class="timeline-item__dot-line">
                  <div class="timeline-dot" />
                  <div
                    v-if="!item.isLast"
                    class="timeline-line"
                  />
                </div>
                <div class="timeline-item__content">
                  <span class="timeline-item__title">{{ item.title }}</span>
                  <span class="timeline-item__desc"
                    >{{ item.description }}
                    • {{ item.time }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Summary -->
        <div class="detail-right">
          <div class="summary-card">
            <span class="summary-card__label">Summary</span>
            <span class="summary-card__amount"
              >{{ detail.amountFormatted }}</span
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
            <div class="summary-card__row">
              <span class="summary-card__row-label">Fee</span>
              <span class="summary-card__row-value"
                >{{ detail.feePercentage }}
                • {{ detail.feeAmount }}</span
              >
            </div>
            <div class="summary-card__row">
              <span class="summary-card__row-label">Net</span>
              <span class="summary-card__row-value"
                >{{ detail.netAmount }}</span
              >
            </div>
            <div class="summary-card__divider" />
            <div class="summary-card__section">
              <span class="summary-card__section-label">Related order</span>
              <a
                class="summary-card__order-link"
                href="#"
              >
                {{ detail.orderId }}
                — {{ detail.orderTitle }}
                <ArrowUpRight :size="12" />
              </a>
            </div>
            <div class="summary-card__section">
              <span class="summary-card__section-label">Initiated</span>
              <span class="summary-card__section-value"
                >{{ detail.date }}
                • {{ detail.initiatedTime }}</span
              >
            </div>
            <div class="summary-card__section">
              <span class="summary-card__section-label">Completed</span>
              <span class="summary-card__section-value"
                >{{ detail.completedDate }}
                • {{ detail.completedTime }}</span
              >
            </div>
            <div class="summary-card__section">
              <span class="summary-card__section-label">Settlement date</span>
              <span class="summary-card__section-value"
                >{{ detail.settlementDate }}
                (T+2)</span
              >
            </div>
            <div class="summary-card__section">
              <span class="summary-card__section-label"
                >Provider fee ({{ detail.providerFeePct }})</span
              >
              <span class="summary-card__section-value"
                >−{{ detail.providerFee }}</span
              >
            </div>
            <div class="summary-card__section">
              <span class="summary-card__section-label"
                >Platform fee ({{ detail.platformFeePct }})</span
              >
              <span class="summary-card__section-value"
                >−{{ detail.platformFee }}</span
              >
            </div>
            <div class="summary-card__section summary-card__section--net">
              <span
                class="summary-card__section-label summary-card__section-label--net"
                >Net payout</span
              >
              <span
                class="summary-card__section-value summary-card__section-value--net"
                >{{ detail.netPayout }}</span
              >
            </div>
          </div>

          <!-- Refunds notice -->
          <div class="info-notice">
            <Info :size="16" />
            <div class="info-notice__text">
              <span class="info-notice__title">Refunds coming soon</span>
              <span class="info-notice__desc"
                >Automated refund processing will be available in the next
                update.</span
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
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 3px 8px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-info-foreground);
  background: var(--color-info);
  border-radius: var(--radius-pill);
}

.provider-dot {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: var(--radius-pill);
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
