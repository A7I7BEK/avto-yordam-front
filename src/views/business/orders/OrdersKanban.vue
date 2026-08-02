<script
  setup
  lang="ts"
>
import {
  Check,
  CheckCircle,
  Eye,
  Play,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  XCircle,
} from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ConfirmDialog from '@/components/app/ConfirmDialog.vue';
import { isMockMode } from '@/config';
import { getEmployees } from '@/services/employeesService';
import {
  acceptOrder,
  cancelOrder,
  completeOrder,
  createOrderByOwner,
  createOrderWithMaster,
  deleteOrder,
  getOrders,
  rejectOrder,
  sendOrderToMaster,
  startOrder,
} from '@/services/ordersService';
import { getOrganizationServices } from '@/services/organizationService';
import type { Order } from '@/types/business';
import type { OrganizationServiceResponse } from '@/types/user';

const router = useRouter();

// Authentication role/org details (mock or decoded from token)
const orgId = ref<any>('1');
const isOwner = ref(true);
const isMaster = ref(false);

function decodeUserToken() {
  const token = localStorage.getItem('token');
  if (!token || isMockMode()) {
    orgId.value = '1';
    isOwner.value = true;
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
      orgId.value = payload.organizationId || '1';
      isOwner.value =
        payload.organizationRole === 'OWNER' ||
        payload.platformRole === 'OWNER';
      isMaster.value =
        payload.organizationRole === 'MASTER' ||
        payload.platformRole === 'MASTER';
    }
  } catch (_) {
    orgId.value = '1';
    isOwner.value = true;
    isMaster.value = false;
  }
}

// State
const loading = ref(true);
const orders = ref<Order[]>([]);
const activeDragCol = ref<string | null>(null);
const draggedOrderId = ref<string | null>(null);

// Modal states
const rejectModalOpen = ref(false);
const rejectReason = ref('');
const activeRejectOrderId = ref<string | null>(null);
const confirmDeleteOrder = ref<Order | null>(null);

const createModalOpen = ref(false);
const createLoading = ref(false);
const services = ref<OrganizationServiceResponse[]>([]);
const masters = ref<any[]>([]);
const searchQuery = ref('');

const createForm = ref({
  clientName: '',
  clientNumber: '',
  serviceId: '',
  masterId: '',
  slotDate: '',
  startTime: '',
  endTime: '',
  estimatedPrice: '',
  finalPrice: '',
  problemDescription: '',
});

// Toast alerts state
const showToast = ref(false);
const toastMsg = ref('');
const toastType = ref<'success' | 'error'>('success');

function triggerToast(msg: string, type: 'success' | 'error' = 'success') {
  toastMsg.value = msg;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
}

// Kanban columns config
type ColumnId =
  | 'CREATED'
  | 'PENDING_MASTER_CONFIRMATION'
  | 'PENDING_USER_CONFIRMATION'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'OTHER';

const columns: { id: ColumnId; title: string; class: string }[] = [
  { id: 'CREATED', title: 'Created', class: 'kanban-col--created' },
  {
    id: 'PENDING_MASTER_CONFIRMATION',
    title: 'Pending (Master)',
    class: 'kanban-col--pending-master',
  },
  {
    id: 'PENDING_USER_CONFIRMATION',
    title: 'Pending (Client)',
    class: 'kanban-col--pending-client',
  },
  { id: 'CONFIRMED', title: 'Confirmed', class: 'kanban-col--confirmed' },
  { id: 'IN_PROGRESS', title: 'In Progress', class: 'kanban-col--progress' },
  { id: 'COMPLETED', title: 'Completed', class: 'kanban-col--completed' },
  { id: 'REJECTED', title: 'Rejected', class: 'kanban-col--rejected' },
  { id: 'CANCELLED', title: 'Cancelled', class: 'kanban-col--cancelled' },
];

// Normalize status string from API to ColumnId
function getColumnId(status: string): ColumnId {
  const s = (status || '').toUpperCase();
  if (s === 'NEW' || s === 'CREATED') {
    return 'CREATED';
  }
  if (s === 'PENDING' || s === 'PENDING_MASTER_CONFIRMATION') {
    return 'PENDING_MASTER_CONFIRMATION';
  }
  if (s === 'PENDING_USER_CONFIRMATION') {
    return 'PENDING_USER_CONFIRMATION';
  }
  if (s === 'CONFIRMED') {
    return 'CONFIRMED';
  }
  if (s === 'IN_PROGRESS' || s === 'PROGRESS') {
    return 'IN_PROGRESS';
  }
  if (s === 'DONE' || s === 'COMPLETED') {
    return 'COMPLETED';
  }
  if (s === 'REJECTED') {
    return 'REJECTED';
  }
  if (s === 'CANCELLED') {
    return 'CANCELLED';
  }
  return 'OTHER';
}

// Load function
async function load() {
  loading.value = true;
  try {
    const list = await getOrders();
    orders.value = list;
  } catch (err: any) {
    triggerToast(err.message || 'Failed to load orders', 'error');
  } finally {
    loading.value = false;
  }
}

// Fetch helper items (services/masters) for creation modal
async function loadModalHelpers() {
  try {
    const svcList = await getOrganizationServices(orgId.value);
    services.value = svcList || [];
    const empList = await getEmployees();
    masters.value = empList || [];
  } catch (_) {}
}

onMounted(() => {
  decodeUserToken();
  load();
  loadModalHelpers();
});

// Grouped orders for columns
const filteredOrders = computed(() => {
  let result = orders.value;
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.service.toLowerCase().includes(q),
    );
  }
  return result;
});

const groupedOrders = computed(() => {
  const map: Record<ColumnId, Order[]> = {
    CREATED: [],
    PENDING_MASTER_CONFIRMATION: [],
    PENDING_USER_CONFIRMATION: [],
    CONFIRMED: [],
    IN_PROGRESS: [],
    COMPLETED: [],
    REJECTED: [],
    CANCELLED: [],
    OTHER: [],
  };
  for (const o of filteredOrders.value) {
    const colId = getColumnId(o.status);
    map[colId].push(o);
  }
  return map;
});

// Action triggers
async function handleAction(
  order: Order,
  action:
    | 'accept'
    | 'start'
    | 'complete'
    | 'cancel'
    | 'sendToMaster'
    | 'delete',
) {
  try {
    const backendId = order.backendId || order.id;
    if (action === 'accept') {
      await acceptOrder(backendId);
      triggerToast('Order accepted');
    } else if (action === 'start') {
      await startOrder(backendId);
      triggerToast('Order started');
    } else if (action === 'complete') {
      await completeOrder(backendId);
      triggerToast('Order completed');
    } else if (action === 'cancel') {
      await cancelOrder(backendId);
      triggerToast('Order cancelled');
    } else if (action === 'sendToMaster') {
      await sendOrderToMaster(backendId);
      triggerToast('Order sent to master');
    } else if (action === 'delete') {
      confirmDeleteOrder.value = order;
      return;
    }
    await load();
  } catch (err: any) {
    triggerToast(err.message || 'Operation failed', 'error');
  }
}

async function performDeleteOrder() {
  const order = confirmDeleteOrder.value;
  if (!order) {
    return;
  }
  try {
    const backendId = order.backendId || order.id;
    await deleteOrder(backendId);
    triggerToast('Order deleted');
    confirmDeleteOrder.value = null;
    await load();
  } catch (err: any) {
    triggerToast(err.message || 'Operation failed', 'error');
  }
}

// Reject logic
function openRejectModal(order: Order) {
  activeRejectOrderId.value = order.backendId || order.id;
  rejectReason.value = '';
  rejectModalOpen.value = true;
}

async function confirmReject() {
  if (!activeRejectOrderId.value) {
    return;
  }
  if (!rejectReason.value.trim()) {
    triggerToast('Please enter a reject reason', 'error');
    return;
  }
  try {
    await rejectOrder(activeRejectOrderId.value, rejectReason.value.trim());
    triggerToast('Order rejected successfully');
    rejectModalOpen.value = false;
    await load();
  } catch (err: any) {
    triggerToast(err.message || 'Failed to reject order', 'error');
  }
}

// Create order logic
function openCreateModal() {
  createForm.value = {
    clientName: '',
    clientNumber: '',
    serviceId: '',
    masterId: '',
    slotDate: '',
    startTime: '',
    endTime: '',
    estimatedPrice: '',
    finalPrice: '',
    problemDescription: '',
  };
  createModalOpen.value = true;
}

async function handleCreateOrder() {
  const f = createForm.value;
  if (
    !(
      f.clientName.trim() &&
      f.clientNumber.trim() &&
      f.serviceId &&
      f.slotDate &&
      f.startTime &&
      f.endTime
    )
  ) {
    triggerToast('Please fill in all required fields', 'error');
    return;
  }
  if (isOwner.value && !f.masterId) {
    triggerToast('Please select a master', 'error');
    return;
  }

  createLoading.value = true;
  try {
    const slotData = {
      organizationId: Number(orgId.value) || 1,
      slotDate: f.slotDate,
      startTime: f.startTime + ':00',
      endTime: f.endTime + ':00',
      isBooked: true,
    };

    if (isOwner.value) {
      await createOrderByOwner({
        organizationId: Number(orgId.value) || 1,
        masterId: f.masterId,
        clientName: f.clientName.trim(),
        clientNumber: f.clientNumber.trim(),
        organizationServicesId: f.serviceId,
        slot: slotData,
        status: 'CREATED',
        estimatedPrice: f.estimatedPrice ? Number(f.estimatedPrice) : undefined,
        finalPrice: f.finalPrice ? Number(f.finalPrice) : undefined,
        problemDescription: f.problemDescription || undefined,
      });
    } else {
      await createOrderWithMaster({
        organizationId: Number(orgId.value) || 1,
        clientName: f.clientName.trim(),
        clientNumber: f.clientNumber.trim(),
        organizationServicesId: f.serviceId,
        slot: slotData,
        status: 'CREATED',
        estimatedPrice: f.estimatedPrice ? Number(f.estimatedPrice) : undefined,
        finalPrice: f.finalPrice ? Number(f.finalPrice) : undefined,
        problemDescription: f.problemDescription || undefined,
      });
    }
    triggerToast('Order created successfully');
    createModalOpen.value = false;
    await load();
  } catch (err: any) {
    triggerToast(err.message || 'Failed to create order', 'error');
  } finally {
    createLoading.value = false;
  }
}

// Drag & Drop HTML5 handlers
function onDragStart(event: DragEvent, orderId: string) {
  draggedOrderId.value = orderId;
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', orderId);
    event.dataTransfer.effectAllowed = 'move';
  }
}

function onDragEnter(colId: string) {
  activeDragCol.value = colId;
}

function onDragLeave() {
  // Can be used to clear styling
}

async function onDrop(event: DragEvent, targetColId: ColumnId) {
  activeDragCol.value = null;
  const orderId =
    draggedOrderId.value || event.dataTransfer?.getData('text/plain');
  if (!orderId) {
    return;
  }

  draggedOrderId.value = null;

  // Find current order
  const order = orders.value.find((o) => o.id === orderId);
  if (!order) {
    return;
  }

  const currentColId = getColumnId(order.status);
  if (currentColId === targetColId) {
    return;
  }

  // Check valid status transitions
  const actionByTarget: Partial<
    Record<
      ColumnId,
      'accept' | 'sendToMaster' | 'start' | 'complete' | 'cancel'
    >
  > = {
    CONFIRMED: 'accept',
    PENDING_MASTER_CONFIRMATION: 'sendToMaster',
    IN_PROGRESS: 'start',
    COMPLETED: 'complete',
    CANCELLED: 'cancel',
  };

  if (targetColId === 'REJECTED') {
    openRejectModal(order);
    return;
  }

  const action = actionByTarget[targetColId];
  if (!action) {
    triggerToast(`Invalid status transition to ${targetColId}`, 'error');
    return;
  }

  // Optimistic UI updates
  const previousStatus = order.status;
  order.status = targetColId.toLowerCase(); // update locally

  try {
    await handleAction(order, action);
  } catch (_) {
    // revert
    order.status = previousStatus;
  }
}

function viewOrder(id: string) {
  router.push(`/business/orders/${encodeURIComponent(id)}`);
}
</script>

<template>
  <div class="kanban-wrapper">
    <!-- Toolbar / Search inside Kanban -->
    <div class="kanban-toolbar">
      <div class="search-wrapper">
        <Search
          :size="16"
          class="search-icon"
        />
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Filter board..."
        >
      </div>
      <div class="kanban-actions">
        <button
          type="button"
          class="btn btn--outline"
          @click="load"
          title="Refresh board"
        >
          <RefreshCw :size="16" />
        </button>
        <button
          type="button"
          class="btn btn--primary"
          @click="openCreateModal"
        >
          <Plus :size="16" />
          Create Order
        </button>
      </div>
    </div>

    <!-- Spinner -->
    <div
      v-if="loading"
      class="loading-container"
    >
      <div class="spinner" />
      <span class="loading-text">Loading Kanban Board...</span>
    </div>

    <!-- Board -->
    <div
      v-else
      class="kanban-board"
    >
      <div
        v-for="col in columns"
        :key="col.id"
        class="kanban-column"
        :class="{ 'kanban-column--dragover': activeDragCol === col.id }"
        @dragover.prevent
        @dragenter="onDragEnter(col.id)"
        @dragleave="onDragLeave"
        @drop="onDrop($event, col.id)"
      >
        <div class="kanban-column__header">
          <div class="kanban-column__title-row">
            <span
              class="bullet"
              :class="col.class"
            ></span>
            <span class="title">{{ col.title }}</span>
          </div>
          <span class="count">{{ groupedOrders[col.id]?.length || 0 }}</span>
        </div>

        <div class="kanban-column__cards">
          <!-- Cards -->
          <div
            v-for="order in groupedOrders[col.id]"
            :key="order.id"
            class="order-card"
            draggable="true"
            @dragstart="onDragStart($event, order.id)"
            @dblclick="viewOrder(order.backendId || order.id)"
          >
            <div class="order-card__header">
              <span
                class="order-card__id"
                @click="viewOrder(order.backendId || order.id)"
                >{{ order.id }}</span
              >
              <span class="order-card__amount">{{ order.amount }}</span>
            </div>

            <div class="order-card__body">
              <span class="order-card__service">{{ order.service }}</span>
              <div class="order-card__customer">
                <div class="avatar-xs">{{ order.initials }}</div>
                <span class="name">{{ order.customer }}</span>
              </div>
            </div>

            <div class="order-card__meta">
              <span class="date">{{ order.date }}</span>
              <span class="master">Master: {{ order.master || '—' }}</span>
            </div>

            <!-- Quick Action buttons (non-draggable click areas) -->
            <div
              class="order-card__actions"
              @mousedown.stop
              @pointerdown.stop
            >
              <!-- Created status actions -->
              <template v-if="getColumnId(order.status) === 'CREATED'">
                <button
                  type="button"
                  class="action-btn"
                  title="Send to Master"
                  @click="handleAction(order, 'sendToMaster')"
                >
                  <Send :size="12" />
                </button>
                <button
                  type="button"
                  class="action-btn text-warning"
                  title="Cancel"
                  @click="handleAction(order, 'cancel')"
                >
                  <XCircle :size="12" />
                </button>
                <button
                  type="button"
                  class="action-btn text-danger"
                  title="Delete"
                  @click="handleAction(order, 'delete')"
                >
                  <Trash2 :size="12" />
                </button>
              </template>

              <!-- Pending Master actions -->
              <template
                v-else-if="getColumnId(order.status) === 'PENDING_MASTER_CONFIRMATION'"
              >
                <button
                  type="button"
                  class="action-btn text-success"
                  title="Accept"
                  @click="handleAction(order, 'accept')"
                >
                  <Check :size="12" />
                </button>
                <button
                  type="button"
                  class="action-btn text-danger"
                  title="Reject"
                  @click="openRejectModal(order)"
                >
                  <XCircle :size="12" />
                </button>
                <button
                  type="button"
                  class="action-btn text-warning"
                  title="Cancel"
                  @click="handleAction(order, 'cancel')"
                >
                  <XCircle :size="12" />
                </button>
              </template>

              <!-- Pending user confirmation -->
              <template
                v-else-if="getColumnId(order.status) === 'PENDING_USER_CONFIRMATION'"
              >
                <button
                  type="button"
                  class="action-btn text-warning"
                  title="Cancel"
                  @click="handleAction(order, 'cancel')"
                >
                  <XCircle :size="12" />
                </button>
              </template>

              <!-- Confirmed status actions -->
              <template v-else-if="getColumnId(order.status) === 'CONFIRMED'">
                <button
                  type="button"
                  class="action-btn text-primary"
                  title="Start Job"
                  @click="handleAction(order, 'start')"
                >
                  <Play :size="12" />
                </button>
                <button
                  type="button"
                  class="action-btn text-warning"
                  title="Cancel"
                  @click="handleAction(order, 'cancel')"
                >
                  <XCircle :size="12" />
                </button>
              </template>

              <!-- In progress status actions -->
              <template v-else-if="getColumnId(order.status) === 'IN_PROGRESS'">
                <button
                  type="button"
                  class="action-btn text-success"
                  title="Complete"
                  @click="handleAction(order, 'complete')"
                >
                  <CheckCircle :size="12" />
                </button>
                <button
                  type="button"
                  class="action-btn text-warning"
                  title="Cancel"
                  @click="handleAction(order, 'cancel')"
                >
                  <XCircle :size="12" />
                </button>
              </template>

              <!-- Completed/rejected/cancelled status actions -->
              <template v-else>
                <button
                  type="button"
                  class="action-btn text-danger"
                  title="Delete"
                  @click="handleAction(order, 'delete')"
                >
                  <Trash2 :size="12" />
                </button>
              </template>

              <!-- View details always -->
              <button
                type="button"
                class="action-btn ml-auto"
                title="View details"
                @click="viewOrder(order.backendId || order.id)"
              >
                <Eye :size="12" />
              </button>
            </div>
          </div>

          <div
            v-if="!groupedOrders[col.id]?.length"
            class="empty-column-state"
          >
            Drag orders here
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div
      v-if="rejectModalOpen"
      class="modal-backdrop"
      @click="rejectModalOpen = false"
    >
      <div
        class="modal-content"
        @click.stop
      >
        <h3 class="modal-title">Reject Order</h3>
        <p class="modal-desc">
          Please provide a reason for rejecting this booking.
        </p>
        <textarea
          v-model="rejectReason"
          rows="3"
          placeholder="e.g. Master unavailable / Time conflict"
          class="modal-input textarea"
        />
        <div class="modal-actions">
          <button
            type="button"
            class="btn btn--outline"
            @click="rejectModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn--danger"
            @click="confirmReject"
          >
            Reject Order
          </button>
        </div>
      </div>
    </div>

    <!-- Create Order Modal -->
    <div
      v-if="createModalOpen"
      class="modal-backdrop"
      @click="createModalOpen = false"
    >
      <div
        class="modal-content modal-content--wide"
        @click.stop
      >
        <h3 class="modal-title">Create New Order</h3>
        <div class="create-form-grid">
          <div class="form-group">
            <label>Client Name *</label>
            <input
              v-model="createForm.clientName"
              type="text"
              class="modal-input"
              placeholder="e.g. John Doe"
            >
          </div>
          <div class="form-group">
            <label>Client Phone *</label>
            <input
              v-model="createForm.clientNumber"
              type="text"
              class="modal-input"
              placeholder="e.g. +998901234567"
            >
          </div>
          <div class="form-group">
            <label>Service *</label>
            <select
              v-model="createForm.serviceId"
              class="modal-input select"
            >
              <option value="">Select Service</option>
              <option
                v-for="s in services"
                :key="s.id"
                :value="s.id"
              >
                {{ s.name }}
                ({{ s.minPrice || s.maxPrice ? `UZS ${(s.minPrice ?? 0).toLocaleString()} – ${(s.maxPrice ?? 0).toLocaleString()}` : '—' }})
              </option>
            </select>
          </div>
          <div
            class="form-group"
            v-if="isOwner"
          >
            <label>Master *</label>
            <select
              v-model="createForm.masterId"
              class="modal-input select"
            >
              <option value="">Select Master</option>
              <option
                v-for="m in masters"
                :key="m.id"
                :value="m.id"
              >
                {{ m.name }}
                ({{ m.role }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Date *</label>
            <input
              v-model="createForm.slotDate"
              type="date"
              class="modal-input"
            >
          </div>
          <div class="form-group-split">
            <div class="form-group">
              <label>Start Time *</label>
              <input
                v-model="createForm.startTime"
                type="time"
                class="modal-input"
              >
            </div>
            <div class="form-group">
              <label>End Time *</label>
              <input
                v-model="createForm.endTime"
                type="time"
                class="modal-input"
              >
            </div>
          </div>
          <div class="form-group-split">
            <div class="form-group">
              <label>Estimated Price (UZS)</label>
              <input
                v-model="createForm.estimatedPrice"
                type="number"
                class="modal-input"
                placeholder="0"
              >
            </div>
            <div class="form-group">
              <label>Final Price (UZS)</label>
              <input
                v-model="createForm.finalPrice"
                type="number"
                class="modal-input"
                placeholder="0"
              >
            </div>
          </div>
          <div class="form-group full-width">
            <label>Problem Description</label>
            <textarea
              v-model="createForm.problemDescription"
              rows="2"
              class="modal-input textarea"
              placeholder="e.g. Brake noise when turning"
            />
          </div>
        </div>

        <div class="modal-actions mt-4">
          <button
            type="button"
            class="btn btn--outline"
            @click="createModalOpen = false"
            :disabled="createLoading"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn--primary"
            @click="handleCreateOrder"
            :disabled="createLoading"
          >
            {{ createLoading ? 'Creating...' : 'Create Order' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Order confirmation -->
    <ConfirmDialog
      :is-open="confirmDeleteOrder !== null"
      title="Delete this order?"
      message="This permanently removes the order and all its details. This action can't be undone."
      confirm-label="Delete"
      @cancel="confirmDeleteOrder = null"
      @confirm="performDeleteOrder"
    />

    <!-- Success Toast -->
    <div
      v-if="showToast"
      class="success-toast"
      :class="{ 'success-toast--error': toastType === 'error' }"
    >
      {{ toastMsg }}
    </div>
  </div>
</template>

<style scoped>
.kanban-wrapper {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 180px);
}

.kanban-toolbar {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--muted-icon);
  pointer-events: none;
}

.search-input {
  width: 260px;
  padding: 8px 12px 8px 36px;
  font-family: var(--font-primary);
  font-size: 13px;
  color: var(--foreground);
  outline: none;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: border-color 0.15s;
}

.search-input:focus {
  border-color: var(--primary);
}

.kanban-actions {
  display: flex;
  gap: 8px;
}

.btn {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 10px 20px;
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-pill);
  transition: background 0.15s;
}

.btn--primary {
  color: var(--primary-foreground);
  background: var(--primary);
}

.btn--primary:hover {
  background: #4739df;
}

.btn--outline {
  color: var(--primary);
  background: var(--background);
  border: 1px solid var(--border);
}

.btn--outline:hover {
  background: var(--accent);
}

.btn--danger {
  color: #ffffff;
  background: var(--destructive);
}

.btn--danger:hover {
  background: #b5270e;
}

/* Loading container */
.loading-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-family: var(--font-primary);
  font-size: 14px;
  color: var(--muted-foreground);
}

/* Board columns style */
.kanban-board {
  display: flex;
  flex: 1;
  gap: 16px;
  padding-bottom: 8px;
  overflow-x: auto;
}

.kanban-column {
  display: flex;
  flex: 0 0 280px;
  flex-direction: column;
  background: #f7f7f8;
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
}

.kanban-column--dragover {
  background: #eef0ff;
  border-color: var(--primary);
}

.kanban-column__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}

.kanban-column__title-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.bullet {
  width: 8px;
  height: 8px;
  background: var(--muted-icon);
  border-radius: 50%;
}

.kanban-col--created .bullet {
  background: #64748b;
}
.kanban-col--pending-master .bullet {
  background: #f59e0b;
}
.kanban-col--pending-client .bullet {
  background: #d97706;
}
.kanban-col--confirmed .bullet {
  background: #10b981;
}
.kanban-col--progress .bullet {
  background: var(--primary);
}
.kanban-col--completed .bullet {
  background: #16a34a;
}
.kanban-col--rejected .bullet {
  background: var(--destructive);
}
.kanban-col--cancelled .bullet {
  background: #94a3b8;
}

.kanban-column__header .title {
  font-family: var(--font-primary);
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.kanban-column__header .count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 700;
  color: var(--muted-foreground);
  background: var(--accent);
  border-radius: var(--radius-pill);
}

.kanban-column__cards {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  overflow-y: auto;
}

/* Card premium styling */
.order-card {
  padding: 12px;
  cursor: grab;
  user-select: none;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.order-card:active {
  cursor: grabbing;
}

.order-card__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.order-card__id {
  font-size: 12px;
  font-weight: 700;
  color: var(--primary);
  cursor: pointer;
}

.order-card__id:hover {
  text-decoration: underline;
}

.order-card__amount {
  font-size: 11px;
  font-weight: 700;
  color: var(--foreground);
}

.order-card__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}

.order-card__service {
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.order-card__customer {
  display: flex;
  gap: 8px;
  align-items: center;
}

.avatar-xs {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  font-size: 9px;
  font-weight: 700;
  color: #ffffff;
  background: var(--primary);
  border-radius: 50%;
}

.order-card__customer .name {
  font-size: 12px;
  color: var(--muted-foreground);
}

.order-card__meta {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  margin-bottom: 8px;
  font-size: 10px;
  color: var(--muted-icon);
  border-top: 1px dashed var(--accent);
}

/* Card buttons area */
.order-card__actions {
  display: flex;
  gap: 4px;
  padding-top: 8px;
  border-top: 1px solid var(--accent);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--muted-foreground);
  cursor: pointer;
  background: var(--accent);
  border: none;
  border-radius: var(--radius-sm);
  transition: all 0.1s;
}

.action-btn:hover {
  color: var(--foreground);
  background: var(--border);
}

.text-success:hover {
  color: #25603a;
  background: #e8faf0;
}
.text-danger:hover {
  color: var(--destructive);
  background: #fee9e5;
}
.text-warning:hover {
  color: var(--warning);
  background: #fff8e5;
}
.text-primary:hover {
  color: var(--primary);
  background: #eef0ff;
}

.ml-auto {
  margin-left: auto;
}

.empty-column-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  font-size: 12px;
  color: var(--muted-icon);
  text-align: center;
  border: 2px dashed var(--border);
  border-radius: var(--radius-md);
}

/* Modals premium styling */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 420px;
  padding: 24px;
  background: var(--background);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-modal);
}

.modal-content--wide {
  max-width: 600px;
}

.modal-title {
  margin: 0;
  font-family: var(--font-primary);
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
}

.modal-desc {
  margin: 0;
  font-family: var(--font-primary);
  font-size: 13px;
  color: var(--muted-foreground);
}

.modal-input {
  width: 100%;
  padding: 10px 14px;
  font-family: var(--font-primary);
  font-size: 13px;
  color: var(--foreground);
  outline: none;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: border-color 0.15s;
}

.modal-input:focus {
  border-color: var(--primary);
}

.textarea {
  resize: vertical;
}

.select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23939399' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* Form grid */
.create-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-family: var(--font-primary);
  font-size: 12px;
  font-weight: 600;
  color: var(--foreground);
}

.form-group-split {
  display: flex;
  gap: 10px;
}

.form-group-split .form-group {
  flex: 1;
}

.full-width {
  grid-column: span 2;
}

.mt-4 {
  margin-top: 16px;
}

/* Success toast */
.success-toast {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1000;
  padding: 12px 24px;
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background: var(--success);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease;
}

.success-toast--error {
  background: var(--destructive);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
