<script
  setup
  lang="ts"
>
import { ArrowLeft, ExternalLink } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getTransactionDetail } from '@/services/transactionsService';

interface TransactionDetailData {
  id: string;
  orderId: string;
  customerName: string;
  customerInitials: string;
  amount: number;
  amountFormatted: string;
  provider: string;
  providerDot: string;
  providerBg: string;
  status: string;
  date: string;
  service: string;
  masterName: string;
  description: string;
}

const route = useRoute();
const router = useRouter();
const detail = ref<TransactionDetailData | null>(null);
const loading = ref(true);

onMounted(async () => {
  const id = route.params.id as string;
  detail.value = await getTransactionDetail(id);
  loading.value = false;
});

function goBack() {
  router.push('/business/transactions');
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
  <div class="detail-page">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <span class="breadcrumb__item">Finance</span>
      <span class="breadcrumb__separator">-</span>
      <router-link
        to="/business/transactions"
        class="breadcrumb__item breadcrumb__link"
        >Transactions</router-link
      >
      <span class="breadcrumb__separator">-</span>
      <span class="breadcrumb__item breadcrumb__item--active"
        >{{ detail?.id ?? route.params.id }}</span
      >
    </nav>

    <!-- Back Button -->
    <button
      type="button"
      class="back-btn"
      @click="goBack"
    >
      <ArrowLeft :size="18" />
      <span>Back</span>
    </button>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="loading"
    >
      Loading transaction details...
    </div>

    <!-- Detail Card -->
    <div
      v-else-if="detail"
      class="detail-card"
    >
      <div class="detail-card__header">
        <h1 class="detail-card__title">Transaction {{ detail.id }}</h1>
        <span
          class="badge detail-card__status"
          :class="statusClass(detail.status)"
        >
          {{ detail.status }}
        </span>
      </div>

      <div class="detail-card__divider" />

      <div class="detail-grid">
        <div class="detail-row">
          <span class="detail-row__label">Transaction ID</span>
          <span class="detail-row__value detail-row__value--mono"
            >{{ detail.id }}</span
          >
        </div>
        <div class="detail-row">
          <span class="detail-row__label">Order</span>
          <router-link
            :to="`/business/orders/${detail.orderId}`"
            class="detail-row__value detail-row__value--link"
          >
            {{ detail.orderId }}
            <ExternalLink :size="14" />
          </router-link>
        </div>
        <div class="detail-row">
          <span class="detail-row__label">Customer</span>
          <div class="customer-info">
            <div
              class="avatar"
              :style="{ background: '#5749F4' }"
            >
              {{ detail.customerInitials }}
            </div>
            <span>{{ detail.customerName }}</span>
          </div>
        </div>
        <div class="detail-row">
          <span class="detail-row__label">Amount</span>
          <span class="detail-row__value detail-row__value--amount"
            >{{ detail.amountFormatted }}</span
          >
        </div>
        <div class="detail-row">
          <span class="detail-row__label">Provider</span>
          <div class="provider-info">
            <span
              class="provider-dot"
              :style="{ background: detail.providerDot }"
            />
            <span
              class="provider-badge"
              :style="{ background: detail.providerBg }"
              >{{ detail.provider }}</span
            >
          </div>
        </div>
        <div class="detail-row">
          <span class="detail-row__label">Date</span>
          <span class="detail-row__value">{{ detail.date }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-row__label">Service</span>
          <span class="detail-row__value">{{ detail.service }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-row__label">Master</span>
          <span class="detail-row__value">{{ detail.masterName }}</span>
        </div>
        <div class="detail-row detail-row--full">
          <span class="detail-row__label">Description</span>
          <span class="detail-row__value">{{ detail.description }}</span>
        </div>
      </div>
    </div>

    <!-- Back Link -->
    <div class="back-link-wrapper">
      <router-link
        to="/business/transactions"
        class="back-link"
      >
        <ArrowLeft :size="16" />
        <span>Back to transactions</span>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
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
  text-decoration: none;
}

.breadcrumb__link {
  color: var(--primary);
  cursor: pointer;
}

.breadcrumb__link:hover {
  text-decoration: underline;
}

.breadcrumb__item--active {
  font-weight: 500;
  color: var(--foreground);
}

.breadcrumb__separator {
  color: var(--muted-icon);
}

/* Back Button */
.back-btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 6px 14px;
  margin-bottom: 24px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
  cursor: pointer;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: background 0.15s;
}

.back-btn:hover {
  background: var(--accent);
}

/* Loading */
.loading {
  padding: 40px 0;
  font-size: 14px;
  color: var(--muted-foreground);
  text-align: center;
}

/* Detail Card */
.detail-card {
  max-width: 720px;
  padding: 28px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.detail-card__header {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.detail-card__title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--foreground);
}

.detail-card__status {
  padding: 4px 14px;
  font-size: 13px;
}

.detail-card__divider {
  height: 1px;
  margin: 20px 0;
  background: var(--border);
}

/* Detail Grid */
.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.detail-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row--full {
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
}

.detail-row__label {
  flex-shrink: 0;
  width: 140px;
  font-size: 13px;
  color: var(--muted-foreground);
}

.detail-row__value {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 13px;
  color: var(--foreground);
}

.detail-row__value--mono {
  font-family: "SF Mono", "Fira Code", monospace;
  font-size: 12px;
  color: var(--muted-foreground);
}

.detail-row__value--link {
  font-weight: 500;
  color: var(--primary);
  text-decoration: none;
}

.detail-row__value--link:hover {
  text-decoration: underline;
}

.detail-row__value--amount {
  font-size: 15px;
  font-weight: 700;
}

/* Customer Info */
.customer-info {
  display: flex;
  gap: 10px;
  align-items: center;
}

.avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 10px;
  font-weight: 600;
  color: #ffffff;
  border-radius: 50%;
}

/* Provider Info */
.provider-info {
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

/* Badge */
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

/* Back Link */
.back-link-wrapper {
  margin-top: 24px;
}

.back-link {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: var(--primary);
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
