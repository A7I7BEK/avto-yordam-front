<script
  setup
  lang="ts"
>
import { ArrowLeft, Calendar, Check, X } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getOrder } from '@/services/ordersService';
import type { Order } from '@/types/business';

const route = useRoute();
const router = useRouter();
const order = ref<Order | null>(null);
const loading = ref(true);

const statusMap: Record<string, { label: string; class: string }> = {
  new: { label: 'New', class: 'status-badge--new' },
  pending: { label: 'Pending', class: 'status-badge--pending' },
  confirmed: { label: 'Confirmed', class: 'status-badge--confirmed' },
  'in-progress': { label: 'In Progress', class: 'status-badge--progress' },
  done: { label: 'Done', class: 'status-badge--done' },
  cancelled: { label: 'Cancelled', class: 'status-badge--cancelled' },
};

async function loadOrder() {
  try {
    const id = route.params.id as string;
    order.value = await getOrder(id);
  } finally {
    loading.value = false;
  }
}

onMounted(loadOrder);

function goBack() {
  router.push('/business/orders');
}
</script>

<template>
  <div class="detail-page">
    <!-- Loading -->
    <div
      v-if="loading"
      class="loading-state"
    >
      Loading...
    </div>

    <!-- Not found -->
    <div
      v-else-if="!order"
      class="loading-state"
    >
      Order not found.
    </div>

    <template v-else>
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <button
          type="button"
          class="breadcrumb-back"
          @click="goBack"
        >
          <ArrowLeft :size="16" />
        </button>
        <span class="breadcrumb-item">Orders</span>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-item breadcrumb-item--current"
          >{{ order.id }}</span
        >
      </div>

      <!-- Header -->
      <div class="detail-header">
        <div class="detail-header__left">
          <h1 class="detail-title">{{ order.id }}</h1>
          <span
            class="status-badge"
            :class="statusMap[order.status]?.class"
          >
            {{ statusMap[order.status]?.label || order.status }}
          </span>
        </div>
        <div class="detail-header__actions">
          <button
            type="button"
            class="btn btn--primary"
          >
            <Check :size="16" />
            Accept
          </button>
          <button
            type="button"
            class="btn btn--outline"
          >
            <Calendar :size="16" />
            Reschedule
          </button>
          <button
            type="button"
            class="btn btn--danger-outline"
          >
            <X :size="16" />
            Decline
          </button>
        </div>
      </div>

      <!-- Info cards -->
      <div class="info-grid">
        <div class="info-card">
          <span class="info-card__label">Customer</span>
          <div class="info-card__value customer-info">
            <div class="avatar-sm">{{ order.initials }}</div>
            <span>{{ order.customer }}</span>
          </div>
        </div>
        <div class="info-card">
          <span class="info-card__label">Service</span>
          <span class="info-card__value">{{ order.service }}</span>
        </div>
        <div class="info-card">
          <span class="info-card__label">Date / Time</span>
          <span class="info-card__value">{{ order.date }}</span>
        </div>
        <div class="info-card">
          <span class="info-card__label">Master</span>
          <span class="info-card__value">{{ order.master || '—' }}</span>
        </div>
        <div class="info-card">
          <span class="info-card__label">Amount</span>
          <span class="info-card__value info-card__value--amount"
            >{{ order.amount }}</span
          >
        </div>
        <div class="info-card">
          <span class="info-card__label">Status</span>
          <span
            class="status-badge"
            :class="statusMap[order.status]?.class"
          >
            {{ statusMap[order.status]?.label || order.status }}
          </span>
        </div>
      </div>

      <!-- Service Details -->
      <div class="section-card">
        <h2 class="section-title">Service Details</h2>
        <div class="section-body">
          <div class="detail-row">
            <span class="detail-label">Service name</span>
            <span class="detail-value">{{ order.service }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Assigned master</span>
            <span class="detail-value"
              >{{ order.master || 'Not assigned' }}</span
            >
          </div>
          <div class="detail-row">
            <span class="detail-label">Total amount</span>
            <span class="detail-value detail-value--amount"
              >{{ order.amount }}</span
            >
          </div>
        </div>
      </div>

      <!-- Payment Info -->
      <div class="section-card">
        <h2 class="section-title">Payment Info</h2>
        <div class="section-body">
          <div class="detail-row">
            <span class="detail-label">Payment method</span>
            <span class="detail-value">—</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Payment status</span>
            <span class="detail-value">—</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.detail-page {
  padding: 24px 32px;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #939399;
}

.breadcrumb {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 20px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #939399;
}

.breadcrumb-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  color: #616167;
  cursor: pointer;
  background: #f5f5f5;
  border: none;
  border-radius: 6px;
  transition: background 0.15s;
}

.breadcrumb-back:hover {
  background: #e8e8e8;
}

.breadcrumb-item {
  color: #939399;
}

.breadcrumb-item--current {
  font-weight: 600;
  color: #2a2933;
}

.breadcrumb-sep {
  color: #d9d9db;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.detail-header__left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.detail-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #2a2933;
}

.detail-header__actions {
  display: flex;
  gap: 8px;
}

.btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 9px 18px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 999px;
  transition: all 0.15s;
}

.btn--primary {
  color: #ffffff;
  background: #5749f4;
}

.btn--primary:hover {
  background: #4639d4;
}

.btn--outline {
  color: #616167;
  background: #ffffff;
  border: 1px solid #d9d9db;
}

.btn--outline:hover {
  background: #f5f5f5;
}

.btn--danger-outline {
  color: #cc3314;
  background: #ffffff;
  border: 1px solid #d9d9db;
}

.btn--danger-outline:hover {
  background: #fee9e5;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.info-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  border: 1px solid #d9d9db;
  border-radius: 10px;
}

.info-card__label {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #939399;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-card__value {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #2a2933;
}

.info-card__value--amount {
  font-weight: 700;
  color: #25603a;
}

.customer-info {
  display: flex;
  gap: 8px;
  align-items: center;
}

.avatar-sm {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
  background: #5749f4;
  border-radius: 50%;
}

.section-card {
  margin-bottom: 20px;
  overflow: hidden;
  border: 1px solid #d9d9db;
  border-radius: 10px;
}

.section-title {
  padding: 16px 20px;
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #2a2933;
  border-bottom: 1px solid #f0f0f0;
}

.section-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detail-label {
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
}

.detail-value {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #2a2933;
}

.detail-value--amount {
  font-weight: 700;
  color: #25603a;
}

.status-badge {
  display: inline-flex;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 999px;
}

.status-badge--new {
  color: #5749f4;
  background: #eef0ff;
}

.status-badge--pending {
  color: #b45309;
  background: #fff8e5;
}

.status-badge--confirmed {
  color: #25603a;
  background: #e8faf0;
}

.status-badge--progress {
  color: #1e40af;
  background: #dbeafe;
}

.status-badge--done {
  color: #25603a;
  background: #e8faf0;
}

.status-badge--cancelled {
  color: #cc3314;
  background: #fee9e5;
}
</style>
