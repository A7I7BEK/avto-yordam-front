<script
  setup
  lang="ts"
>
import { ArrowLeft, Calendar, Check, Clock, X } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { isMockMode } from '@/config';
import {
  acceptOrder,
  getOrder,
  proposeOrderTime,
  rejectOrder,
} from '@/services/ordersService';
import type { OrderResponse } from '@/types/user';

const route = useRoute();
const router = useRouter();
const order = ref<OrderResponse | null>(null);
const loading = ref(true);

// ── Role detection ──
const isMaster = ref(false);

function decodeUserToken() {
  const token = localStorage.getItem('token');
  if (!token || isMockMode()) {
    isMaster.value = false;
    return;
  }
  try {
    const parts = token.split('.');
    const payloadPart = parts[1];
    if (parts.length === 3 && payloadPart) {
      const payload = JSON.parse(
        atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')),
      );
      isMaster.value =
        payload.organizationRole === 'MASTER' ||
        payload.platformRole === 'MASTER';
    }
  } catch {
    isMaster.value = false;
  }
}

// ── Status display ──
const statusMap: Record<string, { label: string; class: string }> = {
  created: { label: 'Created', class: 'status-badge--new' },
  pending_master_confirmation: {
    label: 'Pending Master',
    class: 'status-badge--pending',
  },
  pending_user_confirmation: {
    label: 'Pending User',
    class: 'status-badge--pending',
  },
  confirmed: { label: 'Confirmed', class: 'status-badge--confirmed' },
  in_progress: { label: 'In Progress', class: 'status-badge--progress' },
  completed: { label: 'Completed', class: 'status-badge--done' },
  cancelled: { label: 'Cancelled', class: 'status-badge--cancelled' },
  rejected: { label: 'Rejected', class: 'status-badge--cancelled' },
};

const displayStatus = computed(() => {
  const key = order.value?.status?.toLowerCase() ?? '';
  return statusMap[key] ?? { label: order.value?.status ?? '', class: '' };
});

const displayAmount = computed(() => {
  if (order.value?.finalPrice != null) {
    return `${(order.value.finalPrice / 1000).toLocaleString()}K UZS`;
  }
  if (order.value?.estimatedPrice != null) {
    return `${(order.value.estimatedPrice / 1000).toLocaleString()}K UZS`;
  }
  return '—';
});

// ── Action visibility ──
const canAccept = computed(
  () => order.value?.status === 'PENDING_MASTER_CONFIRMATION',
);

const canReschedule = computed(
  () => order.value?.status === 'PENDING_MASTER_CONFIRMATION',
);

const canReject = computed(
  () =>
    order.value?.status === 'PENDING_MASTER_CONFIRMATION' ||
    order.value?.status === 'PENDING_USER_CONFIRMATION' ||
    order.value?.status === 'CONFIRMED',
);

// ── Reject modal ──
const rejectModalOpen = ref(false);
const rejectReason = ref('');
const rejectLoading = ref(false);

function openRejectModal() {
  rejectReason.value = '';
  rejectModalOpen.value = true;
}

async function handleReject() {
  if (!(order.value && rejectReason.value.trim())) {
    return;
  }
  rejectLoading.value = true;
  try {
    await rejectOrder(order.value.id, rejectReason.value.trim());
    order.value = await getOrder(order.value.id);
    rejectModalOpen.value = false;
  } finally {
    rejectLoading.value = false;
  }
}

// ── Accept ──
const acceptLoading = ref(false);

async function handleAccept() {
  if (!order.value) {
    return;
  }
  acceptLoading.value = true;
  try {
    await acceptOrder(order.value.id);
    order.value = await getOrder(order.value.id);
  } finally {
    acceptLoading.value = false;
  }
}

// ── Reschedule modal ──
const rescheduleModalOpen = ref(false);
const slotDate = ref('');
const startTime = ref('');
const rescheduleLoading = ref(false);

function openRescheduleModal() {
  slotDate.value = '';
  startTime.value = '';
  rescheduleModalOpen.value = true;
}

async function handleReschedule() {
  if (!(order.value && slotDate.value && startTime.value)) {
    return;
  }
  rescheduleLoading.value = true;
  try {
    await proposeOrderTime(order.value.id, slotDate.value, startTime.value);
    order.value = await getOrder(order.value.id);
    rescheduleModalOpen.value = false;
  } finally {
    rescheduleLoading.value = false;
  }
}

// ── Lifecycle ──
async function loadOrder() {
  try {
    // `route` can be undefined if the component is ever mounted outside the
    // router context (e.g. transient HMR state) — fail gracefully instead of
    // throwing "Cannot read properties of undefined (reading 'params')".
    const id = route?.params?.id as string | undefined;
    if (!id) {
      order.value = null;
      return;
    }
    order.value = await getOrder(id);
  } catch {
    // Invalid/unknown id (400/404) → show the "Order not found" state.
    order.value = null;
  } finally {
    loading.value = false;
  }
}

decodeUserToken();
onMounted(loadOrder);

function goBack() {
  if (router) {
    router.push('/business/orders');
  }
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
            :class="displayStatus.class"
          >
            {{ displayStatus.label }}
          </span>
        </div>
        <div class="detail-header__actions">
          <button
            v-if="canAccept"
            type="button"
            class="btn btn--primary"
            :disabled="acceptLoading"
            @click="handleAccept"
          >
            <Check :size="16" />
            {{ acceptLoading ? 'Accepting...' : 'Accept' }}
          </button>
          <button
            v-if="canReschedule"
            type="button"
            class="btn btn--outline"
            @click="openRescheduleModal"
          >
            <Calendar :size="16" />
            Reschedule
          </button>
          <button
            v-if="canReject"
            type="button"
            class="btn btn--danger-outline"
            @click="openRejectModal"
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
            <div class="avatar-sm">
              {{ (order.client?.fullName ?? 'C').charAt(0) }}
            </div>
            <span>{{ order.client?.fullName ?? 'Client' }}</span>
          </div>
        </div>
        <div class="info-card">
          <span class="info-card__label">Service</span>
          <span class="info-card__value"
            >{{ order.organizationServices?.name ?? order.problemDescription ?? 'General Repair' }}</span
          >
        </div>
        <div class="info-card">
          <span class="info-card__label">Date / Time</span>
          <span class="info-card__value"
            >{{ order.createdDate ? new Date(order.createdDate).toLocaleString() : 'Just now' }}</span
          >
        </div>
        <div class="info-card">
          <span class="info-card__label">Master</span>
          <span class="info-card__value"
            >{{ order.master?.fullName ?? '—' }}</span
          >
        </div>
        <div class="info-card">
          <span class="info-card__label">Amount</span>
          <span class="info-card__value info-card__value--amount"
            >{{ displayAmount }}</span
          >
        </div>
        <div class="info-card">
          <span class="info-card__label">Status</span>
          <span
            class="status-badge"
            :class="displayStatus.class"
          >
            {{ displayStatus.label }}
          </span>
        </div>
      </div>

      <!-- Service Details -->
      <div class="section-card">
        <h2 class="section-title">Service Details</h2>
        <div class="section-body">
          <div class="detail-row">
            <span class="detail-label">Service name</span>
            <span class="detail-value"
              >{{ order.organizationServices?.name ?? order.problemDescription ?? 'General Repair' }}</span
            >
          </div>
          <div class="detail-row">
            <span class="detail-label">Assigned master</span>
            <span class="detail-value"
              >{{ order.master?.fullName ?? 'Not assigned' }}</span
            >
          </div>
          <div class="detail-row">
            <span class="detail-label">Total amount</span>
            <span class="detail-value detail-value--amount"
              >{{ displayAmount }}</span
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

  <!-- ── Reject modal ── -->
  <Teleport to="body">
    <div
      v-if="rejectModalOpen"
      class="modal-backdrop"
      @click.self="rejectModalOpen = false"
    >
      <div class="modal-card">
        <div class="modal-card__icon">
          <X :size="22" />
        </div>
        <div class="modal-card__text">
          <h2 class="modal-card__title">Reject order</h2>
          <p class="modal-card__desc">
            Provide a reason for rejecting this order.
          </p>
          <textarea
            v-model="rejectReason"
            class="modal-textarea"
            placeholder="Enter reason for rejection..."
            rows="3"
          />
        </div>
        <div class="modal-card__actions">
          <button
            type="button"
            class="modal-btn modal-btn--cancel"
            @click="rejectModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="modal-btn modal-btn--danger"
            :disabled="rejectLoading || !rejectReason.trim()"
            @click="handleReject"
          >
            {{ rejectLoading ? 'Rejecting...' : 'Reject order' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ── Reschedule modal ── -->
  <Teleport to="body">
    <div
      v-if="rescheduleModalOpen"
      class="modal-backdrop"
      @click.self="rescheduleModalOpen = false"
    >
      <div class="modal-card">
        <div class="modal-card__icon">
          <Clock :size="22" />
        </div>
        <div class="modal-card__text">
          <h2 class="modal-card__title">Reschedule order</h2>
          <p class="modal-card__desc">
            Choose a new date and time for this order.
          </p>
          <div class="modal-fields">
            <div class="modal-field">
              <label class="modal-field__label">Date</label>
              <input
                v-model="slotDate"
                type="date"
                class="modal-input"
              >
            </div>
            <div class="modal-field">
              <label class="modal-field__label">Time</label>
              <input
                v-model="startTime"
                type="time"
                class="modal-input"
              >
            </div>
          </div>
        </div>
        <div class="modal-card__actions">
          <button
            type="button"
            class="modal-btn modal-btn--cancel"
            @click="rescheduleModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="modal-btn modal-btn--primary"
            :disabled="rescheduleLoading || !slotDate || !startTime"
            @click="handleReschedule"
          >
            {{ rescheduleLoading ? 'Rescheduling...' : 'Reschedule' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
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

/* ── Modal ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.6);
}

.modal-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  width: 440px;
  max-width: calc(100vw - 48px);
  padding: 24px;
  background: #ffffff;
  border: 1px solid #d9d9db;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.24);
}

.modal-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: #cc3314;
  background: #fee9e5;
  border-radius: 999px;
}

.modal-card__icon:has(.lucide-clock) {
  color: #5749f4;
  background: #eef0ff;
}

.modal-card__text {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  text-align: center;
}

.modal-card__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #2a2933;
}

.modal-card__desc {
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  color: #616167;
}

.modal-textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 10px 12px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #2a2933;
  resize: vertical;
  border: 1px solid #d9d9db;
  border-radius: 8px;
}

.modal-textarea:focus {
  outline: none;
  border-color: #5749f4;
}

.modal-fields {
  display: flex;
  gap: 12px;
  width: 100%;
}

.modal-field {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
}

.modal-field__label {
  font-size: 12px;
  font-weight: 600;
  color: #616167;
  text-align: left;
}

.modal-input {
  box-sizing: border-box;
  padding: 10px 12px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #2a2933;
  border: 1px solid #d9d9db;
  border-radius: 8px;
}

.modal-input:focus {
  outline: none;
  border-color: #5749f4;
}

.modal-card__actions {
  display: flex;
  gap: 8px;
  width: 100%;
}

.modal-btn {
  flex: 1;
  padding: 10px 18px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 999px;
  transition: all 0.15s;
}

.modal-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.modal-btn--cancel {
  color: #616167;
  background: #f5f5f5;
}

.modal-btn--cancel:hover:not(:disabled) {
  background: #e8e8e8;
}

.modal-btn--danger {
  color: #ffffff;
  background: #cc3314;
}

.modal-btn--danger:hover:not(:disabled) {
  background: #a8280f;
}

.modal-btn--primary {
  color: #ffffff;
  background: #5749f4;
}

.modal-btn--primary:hover:not(:disabled) {
  background: #4639d4;
}
</style>
