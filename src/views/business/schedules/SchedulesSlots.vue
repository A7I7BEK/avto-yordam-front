<script
  setup
  lang="ts"
>
import {
  Activity,
  ArrowLeft,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Trash2,
  User,
  XCircle,
} from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import { getCategories } from '@/services/categoriesService';
import { getEmployees } from '@/services/employeesService';
import {
  createTimeSlot,
  deleteTimeSlot,
  getTimeSlots,
  type MasterTimeSlotResponse,
} from '@/services/masterTimeSlotService';
import {
  acceptOrder,
  createOrderByOwner,
  createOrderWithMaster,
  getOrders,
  proposeOrderTime,
  rejectOrder,
} from '@/services/ordersService';
import { getMyOrg } from '@/services/settingsService';
import type { Order } from '@/types/business';

const router = useRouter();

// Auth context decodes
const isOwner = ref(true);
const isMaster = ref(false);

function decodeUserToken() {
  const token = localStorage.getItem('token');
  if (!token || isMockMode()) {
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
      isOwner.value =
        payload.organizationRole === 'OWNER' ||
        payload.platformRole === 'OWNER';
      isMaster.value =
        payload.organizationRole === 'MASTER' ||
        payload.platformRole === 'MASTER';
    }
  } catch (_) {
    isOwner.value = true;
    isMaster.value = false;
  }
}

// State
const loading = ref(true);
const viewMode = ref<'month' | 'week' | 'day' | 'slots'>('slots');
const slots = ref<MasterTimeSlotResponse[]>([]);
const orders = ref<Order[]>([]);

const selectedOrder = ref<Order | null>(null);
const selectedSlot = ref<MasterTimeSlotResponse | null>(null);

// Modal/UI States
const rejectOpen = ref(false);
const rejectReason = ref('');
const deleteSlotOpen = ref(false);
const rescheduleMode = ref(false);
const createSlotOpen = ref(false);

const createOrderLoading = ref(false);
const services = ref<any[]>([]);
const masters = ref<any[]>([]);

// Forms
const createSlotForm = ref({
  slotDate: '',
  startTime: '09:00',
  endTime: '10:00',
});

const createOrderForm = ref({
  clientName: '',
  clientNumber: '',
  serviceId: '',
  estimatedPrice: '',
  problemDescription: '',
});

// Filter
const selectedMasterFilter = ref('All masters');
const masterDropdownOpen = ref(false);

const allMastersList = computed(() => {
  const list = ['All masters'];
  const uniqueMasters = new Set(
    orders.value.map((o) => o.master).filter((m) => m && m !== '—'),
  );
  for (const m of uniqueMasters) {
    list.push(m);
  }
  return list;
});

function selectMaster(m: string) {
  selectedMasterFilter.value = m;
  masterDropdownOpen.value = false;
}

// Date tracking
const today = new Date(2026, 3, 12);
const currentDate = ref(new Date(today));

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function dateStr(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const weekDays = computed(() => {
  const d = new Date(currentDate.value);
  const day = d.getDay();
  const startOffset = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - startOffset);

  const days: { date: Date; label: string; dayNumber: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(d);
    date.setDate(d.getDate() + i);
    days.push({
      date,
      label: dayNames[i] ?? '',
      dayNumber: date.getDate(),
    });
  }
  return days;
});

const weekLabel = computed(() => {
  const first = weekDays.value[0]?.date ?? new Date();
  const last = weekDays.value[6]?.date ?? new Date();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const firstMonth = monthNames[first.getMonth()];
  const lastMonth = monthNames[last.getMonth()];
  if (first.getMonth() === last.getMonth()) {
    return `${firstMonth} ${first.getDate()} – ${last.getDate()}, ${first.getFullYear()}`;
  }
  return `${firstMonth} ${first.getDate()} – ${lastMonth} ${last.getDate()}, ${first.getFullYear()}`;
});

const todayStr = computed(() => dateStr(new Date()));

function prevWeek() {
  const d = currentDate.value;
  currentDate.value = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7);
}

function nextWeek() {
  const d = currentDate.value;
  currentDate.value = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7);
}

function goToToday() {
  currentDate.value = new Date();
}

function switchView(view: 'month' | 'week' | 'day' | 'slots') {
  if (view === 'month') {
    router.push('/business/schedules');
  } else if (view === 'week') {
    router.push('/business/schedules/week');
  } else if (view === 'day') {
    router.push('/business/schedules/day');
  } else {
    router.push('/business/schedules/slots');
  }
}

// Calendar positions helpers
const timeSlots = Array.from({ length: 11 }, (_, i) => {
  const hour = i + 8;
  return `${hour.toString().padStart(2, '0')}:00`;
});

function getSlotPosition(time: string): number {
  const [h = 0, m = 0] = time.split(':').map(Number);
  return (h - 8) * 60 + m;
}

function bookingTop(time: string): string {
  return `${(getSlotPosition(time) / 60) * 60}px`;
}

function bookingHeight(start: string, end: string): string {
  const startMin = getSlotPosition(start);
  const endMin = getSlotPosition(end);
  return `${((endMin - startMin) / 60) * 60}px`;
}

// Toasts
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

// API Loader
async function refreshAll() {
  loading.value = true;
  try {
    const [slotList, orderList] = await Promise.all([
      getTimeSlots(),
      getOrders(),
    ]);
    // Mark slots as booked if their id matches an order's masterTimeSlotId
    // or if the backend already returned isBooked=true
    const bookedSlotIds = new Set(
      orderList
        .filter(
          (o: any) => o.status !== 'CANCELLED' && o.status !== 'cancelled',
        )
        .map((o: any) => o.masterTimeSlotId || o.slotId)
        .filter(Boolean),
    );
    slots.value = slotList.map((s: any) => ({
      ...s,
      isBooked: s.isBooked || bookedSlotIds.has(s.id),
    }));
    orders.value = orderList;
  } catch (err: any) {
    triggerToast(err.message || 'Failed to load calendar data', 'error');
  } finally {
    loading.value = false;
  }
}

async function loadModalHelpers() {
  try {
    if (isMockMode()) {
      const { services: svcList } = await getCategories();
      services.value = svcList || [];
      const empList = await getEmployees();
      masters.value = empList || [];
      return;
    }

    const org = await getMyOrg();
    const [orgSvcList, baseSvcList, empList] = await Promise.all([
      apiClient.get(
        `/organization-catalog/get-by-organization-id/${org?.id ?? ''}`,
      ),
      apiClient.get('/catalog'),
      getEmployees(),
    ]);

    if (Array.isArray(orgSvcList) && Array.isArray(baseSvcList)) {
      services.value = orgSvcList.map((os: any) => {
        const baseSvc = baseSvcList.find((bs: any) => bs.id === os.serviceId);
        return {
          id: os.id,
          name:
            os.catalogName || (baseSvc ? baseSvc.name : `Service #${os.serviceId}`),
        };
      });
    } else {
      const { services: svcList } = await getCategories();
      services.value = svcList || [];
    }

    masters.value = empList || [];
  } catch (_) {
    try {
      const { services: svcList } = await getCategories();
      services.value = svcList || [];
    } catch (_) {}
  }
}

onMounted(() => {
  decodeUserToken();
  refreshAll();
  loadModalHelpers();
});

// Incoming orders (status: pending)
const incomingOrders = computed(() =>
  orders.value.filter((o) => {
    const s = o.status.toLowerCase();
    return s === 'pending' || s === 'pending_master_confirmation';
  }),
);

// Filter slots for week
function getSlotsForDay(date: Date) {
  const ds = dateStr(date);
  return slots.value.filter((s) => s.slotDate === ds);
}

// Slot click handlers
function clickCell(dayDate: Date, hourStr: string) {
  if (rescheduleMode.value && selectedOrder.value) {
    // Propose reschedule date and time
    confirmReschedule(dayDate, hourStr);
    return;
  }

  // Open Create Slot Modal
  createSlotForm.value = {
    slotDate: dateStr(dayDate),
    startTime: hourStr,
    endTime: `${(Number(hourStr.split(':')[0]) + 1).toString().padStart(2, '0')}:00`,
  };
  createSlotOpen.value = true;
}

function clickSlot(slot: MasterTimeSlotResponse) {
  selectedSlot.value = slot;
  selectedOrder.value = null;
}

// Confirm Reschedule
async function confirmReschedule(dayDate: Date, hourStr: string) {
  if (!selectedOrder.value) {
    return;
  }
  try {
    const ds = dateStr(dayDate);
    const ts = `${hourStr}:00`;
    await proposeOrderTime(selectedOrder.value.id, ds, ts);
    triggerToast('Reschedule proposed successfully');
    rescheduleMode.value = false;
    selectedOrder.value = null;
    await refreshAll();
  } catch (err: any) {
    triggerToast(err.message || 'Failed to propose reschedule', 'error');
  }
}

// Accept Order
async function acceptSelected() {
  if (!selectedOrder.value?.id) {
    return;
  }
  try {
    await acceptOrder(selectedOrder.value.id);
    triggerToast('Order accepted');
    selectedOrder.value = null;
    await refreshAll();
  } catch (err: any) {
    triggerToast(err.message || 'Failed to accept order', 'error');
  }
}

// Reject Order
function openRejectOpen() {
  rejectReason.value = '';
  rejectOpen.value = true;
}

async function rejectSelected() {
  if (!selectedOrder.value?.id) {
    return;
  }
  if (!rejectReason.value.trim()) {
    triggerToast('Please enter a reject reason', 'error');
    return;
  }
  try {
    await rejectOrder(selectedOrder.value.id, rejectReason.value.trim());
    triggerToast('Order rejected');
    rejectOpen.value = false;
    selectedOrder.value = null;
    await refreshAll();
  } catch (err: any) {
    triggerToast(err.message || 'Failed to reject order', 'error');
  }
}

// Delete Slot
async function performDeleteSlot() {
  if (!selectedSlot.value?.id) {
    return;
  }
  try {
    await deleteTimeSlot(selectedSlot.value.id);
    triggerToast('Time slot deleted');
    deleteSlotOpen.value = false;
    selectedSlot.value = null;
    await refreshAll();
  } catch (err: any) {
    triggerToast(err.message || 'Failed to delete slot', 'error');
  }
}

// Create Slot Form Submit
async function submitCreateSlot() {
  const f = createSlotForm.value;
  if (!(f.slotDate && f.startTime && f.endTime)) {
    triggerToast('All fields are required', 'error');
    return;
  }
  try {
    await createTimeSlot({
      slotDate: f.slotDate,
      startTime: f.startTime + ':00',
      endTime: f.endTime + ':00',
      isBooked: false,
    });
    triggerToast('Time slot created');
    createSlotOpen.value = false;
    await refreshAll();
  } catch (err: any) {
    triggerToast(err.message || 'Failed to create slot', 'error');
  }
}

// Create Order in Slot Form Submit
async function submitCreateOrderInSlot() {
  if (!selectedSlot.value) {
    return;
  }
  const f = createOrderForm.value;
  if (!(f.clientName.trim() && f.clientNumber.trim() && f.serviceId)) {
    triggerToast('Client name, phone and service are required', 'error');
    return;
  }
  createOrderLoading.value = true;
  try {
    const payload = {
      clientName: f.clientName.trim(),
      clientNumber: f.clientNumber.trim(),
      organizationCatalogId: f.serviceId,
      masterTimeSlotId: selectedSlot.value.id,
      status: 'CREATED',
      estimatedPrice: f.estimatedPrice ? Number(f.estimatedPrice) : undefined,
      problemDescription: f.problemDescription || undefined,
    };

    if (isOwner.value) {
      await createOrderByOwner(payload);
    } else {
      await createOrderWithMaster(payload);
    }
    triggerToast('Order created inside slot');
    createOrderForm.value = {
      clientName: '',
      clientNumber: '',
      serviceId: '',
      estimatedPrice: '',
      problemDescription: '',
    };
    selectedSlot.value = null;
    await refreshAll();
  } catch (err: any) {
    triggerToast(err.message || 'Failed to create order', 'error');
  } finally {
    createOrderLoading.value = false;
  }
}

function closeFlyout() {
  selectedSlot.value = null;
}
</script>

<template>
  <div class="schedules-page">
    <!-- Header -->
    <div class="header-row">
      <div class="header-row__left">
        <h1 class="page-title">Schedules</h1>
      </div>
      <div class="header-actions">
        <button
          class="btn"
          :class="rescheduleMode ? 'btn--primary' : 'btn--outline'"
          :disabled="!selectedOrder?.id"
          @click="rescheduleMode = !rescheduleMode"
          :title="!selectedOrder?.id ? 'Select an incoming order first' : 'Propose new time on calendar'"
        >
          {{ rescheduleMode ? 'Cancel Reschedule' : 'Reschedule Order' }}
        </button>
        <button
          class="btn btn--outline"
          @click="refreshAll"
        >
          Refresh
        </button>
      </div>
    </div>

    <!-- View switcher -->
    <div class="controls-row">
      <div class="controls-left">
        <div class="view-toggle">
          <button
            type="button"
            class="view-toggle__btn"
            :class="{ active: viewMode === 'month' }"
            @click="switchView('month')"
          >
            Month
          </button>
          <button
            type="button"
            class="view-toggle__btn"
            :class="{ active: viewMode === 'week' }"
            @click="switchView('week')"
          >
            Week
          </button>
          <button
            type="button"
            class="view-toggle__btn"
            :class="{ active: viewMode === 'day' }"
            @click="switchView('day')"
          >
            Day
          </button>
          <button
            type="button"
            class="view-toggle__btn"
            :class="{ active: viewMode === 'slots' }"
            @click="switchView('slots')"
          >
            Slots
          </button>
        </div>

        <!-- Date navigation -->
        <div class="date-nav">
          <button
            type="button"
            class="icon-btn"
            title="Previous week"
            @click="prevWeek"
          >
            <ChevronLeft :size="18" />
          </button>
          <span class="date-nav__label">{{ weekLabel }}</span>
          <button
            type="button"
            class="icon-btn"
            title="Next week"
            @click="nextWeek"
          >
            <ChevronRight :size="18" />
          </button>
          <button
            type="button"
            class="btn btn--ghost"
            @click="goToToday"
          >
            Today
          </button>
        </div>
      </div>

      <!-- Master Filter -->
      <div class="filter-wrap">
        <button
          type="button"
          class="filter-btn"
          @click="masterDropdownOpen = !masterDropdownOpen"
        >
          {{ selectedMasterFilter }}
          <ChevronDown :size="14" />
        </button>
        <div
          v-if="masterDropdownOpen"
          class="filter-dropdown"
        >
          <button
            v-for="m in allMastersList"
            :key="m"
            type="button"
            class="filter-dropdown__item"
            :class="{ selected: selectedMasterFilter === m }"
            @click="selectMaster(m)"
          >
            {{ m }}
          </button>
        </div>
      </div>
    </div>

    <!-- Spinner -->
    <div
      v-if="loading"
      class="loading-container"
    >
      <div class="spinner" />
      <span class="loading-text">Loading master slots calendar...</span>
    </div>

    <!-- Main Grid layout -->
    <div
      v-else
      class="master-calendar-grid"
    >
      <!-- Left Panel: Incoming Orders -->
      <div class="master-calendar-panel">
        <div class="panel-title">Incoming Orders</div>

        <div
          v-if="incomingOrders.length === 0"
          class="panel-empty"
        >
          No pending orders
        </div>

        <div
          v-else
          class="order-list"
        >
          <button
            v-for="o in incomingOrders"
            :key="o.id"
            type="button"
            class="order-list-item"
            :class="{ active: selectedOrder?.id === o.id }"
            @click="selectedOrder = o; selectedSlot = null"
          >
            <div class="order-row">
              <span class="order-title">Order {{ o.id }}</span>
              <span class="order-badge">PENDING</span>
            </div>
            <div class="order-sub">
              Svc: {{ o.service }} · Client: {{ o.customer }}
            </div>
          </button>
        </div>

        <!-- Selected Order Details -->
        <div
          v-if="selectedOrder"
          class="order-details"
        >
          <div class="details-title">Order Details</div>
          <div class="details-grid">
            <div class="detail-item">
              <span>Status</span><b>{{ selectedOrder.status }}</b>
            </div>
            <div class="detail-item">
              <span>Service</span><b>{{ selectedOrder.service }}</b>
            </div>
            <div class="detail-item">
              <span>Client</span><b>{{ selectedOrder.customer }}</b>
            </div>
            <div class="detail-item">
              <span>Est. Price</span><b>{{ selectedOrder.amount }}</b>
            </div>
          </div>
          <div class="details-actions">
            <button
              class="btn btn--primary flex-1"
              @click="acceptSelected"
            >
              Accept
            </button>
            <button
              class="btn btn--danger flex-1"
              @click="openRejectOpen"
            >
              Reject
            </button>
          </div>
          <div
            v-if="rescheduleMode"
            class="details-hint animate-pulse"
          >
            Reschedule mode active! Click an empty hour on the calendar grid to
            propose that slot.
          </div>
          <div
            v-else
            class="details-hint"
          >
            Tip: click <b>Reschedule Order</b> then select an empty time cell on
            the calendar.
          </div>
        </div>
      </div>

      <!-- Right Panel: Time Slots Weekly Calendar -->
      <div class="master-calendar-calendar">
        <div class="week-calendar">
          <!-- Headers -->
          <div class="week-calendar__headers">
            <div class="week-calendar__time-gutter" />
            <div
              v-for="day in weekDays"
              :key="dateStr(day.date)"
              class="week-calendar__col-header"
              :class="{ 'week-calendar__col-header--today': dateStr(day.date) === todayStr }"
            >
              <span class="week-calendar__day-name">{{ day.label }}</span>
              <span
                class="week-calendar__day-num"
                :class="{ 'week-calendar__day-num--today': dateStr(day.date) === todayStr }"
              >
                {{ day.dayNumber }}
              </span>
            </div>
          </div>

          <!-- Body -->
          <div class="week-calendar__body">
            <!-- Time labels -->
            <div class="week-calendar__time-gutter">
              <div
                v-for="slot in timeSlots"
                :key="slot"
                class="week-calendar__time-label"
              >
                {{ slot }}
              </div>
            </div>

            <!-- Columns -->
            <div
              v-for="day in weekDays"
              :key="dateStr(day.date)"
              class="week-calendar__day-col"
            >
              <!-- Hour interaction zones -->
              <div
                v-for="slot in timeSlots"
                :key="slot"
                class="week-calendar__hour-line"
                @click="clickCell(day.date, slot)"
                title="Click to create slot here"
              />

              <!-- Slots rendered on top -->
              <div
                v-for="s in getSlotsForDay(day.date)"
                :key="s.id"
                class="slot-chip"
                :class="s.isBooked ? 'slot-chip--booked' : 'slot-chip--available'"
                :style="{
                  top: bookingTop(s.startTime),
                  height: bookingHeight(s.startTime, s.endTime),
                }"
                @click.stop="clickSlot(s)"
              >
                <div class="slot-chip__time">
                  {{ s.startTime.slice(0, 5) }}
                  - {{ s.endTime.slice(0, 5) }}
                </div>
                <div class="slot-chip__title">
                  {{ s.isBooked ? 'Booked' : 'Available' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Slot detail/actions flyout overlay -->
        <div
          v-if="selectedSlot"
          class="slot-flyout"
        >
          <div class="slot-flyout-header">
            <h4 class="slot-flyout-title">Time Slot details</h4>
            <button
              type="button"
              class="close-btn"
              @click="closeFlyout"
            >
              ✕
            </button>
          </div>
          <div class="slot-flyout-body">
            <div class="flyout-row">
              <span>Date</span>
              <b>{{ selectedSlot.slotDate }}</b>
            </div>
            <div class="flyout-row">
              <span>Time</span>
              <b
                >{{ selectedSlot.startTime.slice(0, 5) }}
                - {{ selectedSlot.endTime.slice(0, 5) }}</b
              >
            </div>
            <div class="flyout-row">
              <span>Status</span>
              <span
                class="status-indicator"
                :class="selectedSlot.isBooked ? 'status-indicator--booked' : 'status-indicator--available'"
              >
                {{ selectedSlot.isBooked ? 'Booked' : 'Available' }}
              </span>
            </div>

            <!-- Quick Delete slot -->
            <button
              v-if="!selectedSlot.isBooked"
              type="button"
              class="btn btn--danger w-full mt-2"
              @click="deleteSlotOpen = true"
            >
              <Trash2 :size="14" />
              Delete Slot
            </button>

            <!-- Book order inside slot if available -->
            <div
              v-if="!selectedSlot.isBooked"
              class="slot-book-section"
            >
              <h5 class="section-title">Create Order in Slot</h5>
              <div class="form-grid">
                <input
                  v-model="createOrderForm.clientName"
                  type="text"
                  class="input-sm"
                  placeholder="Client name"
                >
                <input
                  v-model="createOrderForm.clientNumber"
                  type="text"
                  class="input-sm"
                  placeholder="Client phone"
                >
                <select
                  v-model="createOrderForm.serviceId"
                  class="input-sm select-sm"
                >
                  <option value="">Select Service</option>
                  <option
                    v-for="svc in services"
                    :key="svc.id"
                    :value="svc.id"
                  >
                    {{ svc.name }}
                  </option>
                </select>
                <input
                  v-model="createOrderForm.estimatedPrice"
                  type="number"
                  class="input-sm"
                  placeholder="Est Price (UZS)"
                >
                <textarea
                  v-model="createOrderForm.problemDescription"
                  rows="2"
                  class="input-sm textarea-sm"
                  placeholder="Problem description"
                />
              </div>
              <button
                type="button"
                class="btn btn--primary w-full mt-2"
                :disabled="createOrderLoading || !createOrderForm.clientName || !createOrderForm.clientNumber || !createOrderForm.serviceId"
                @click="submitCreateOrderInSlot"
              >
                {{ createOrderLoading ? 'Booking...' : 'Create Order' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Reject Modal -->
    <div
      v-if="rejectOpen"
      class="modal-backdrop"
      @click="rejectOpen = false"
    >
      <div
        class="modal-content"
        @click.stopPropagation
      >
        <h3 class="modal-title">Reject Order</h3>
        <p class="modal-desc">
          Please provide a reject reason to send to client.
        </p>
        <textarea
          v-model="rejectReason"
          rows="3"
          placeholder="e.g. Schedule fully booked"
          class="modal-input textarea"
        />
        <div class="modal-actions">
          <button
            type="button"
            class="btn btn--outline"
            @click="rejectOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn--danger"
            @click="rejectSelected"
          >
            Reject
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Slot Modal -->
    <div
      v-if="deleteSlotOpen"
      class="modal-backdrop"
      @click="deleteSlotOpen = false"
    >
      <div
        class="modal-content"
        @click.stopPropagation
      >
        <h3 class="modal-title">Delete Time Slot</h3>
        <p class="modal-desc">
          Are you sure you want to delete this availability slot? Clients will
          no longer be able to book it.
        </p>
        <div class="modal-actions">
          <button
            type="button"
            class="btn btn--outline"
            @click="deleteSlotOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn--danger"
            @click="performDeleteSlot"
          >
            Delete Slot
          </button>
        </div>
      </div>
    </div>

    <!-- Create Slot Modal -->
    <div
      v-if="createSlotOpen"
      class="modal-backdrop"
      @click="createSlotOpen = false"
    >
      <div
        class="modal-content"
        @click.stopPropagation
      >
        <h3 class="modal-title">Create Availability Slot</h3>
        <div class="form-group">
          <label>Date</label>
          <input
            v-model="createSlotForm.slotDate"
            type="date"
            class="modal-input"
          >
        </div>
        <div class="form-group-split">
          <div class="form-group flex-1">
            <label>Start Time</label>
            <input
              v-model="createSlotForm.startTime"
              type="time"
              class="modal-input"
            >
          </div>
          <div class="form-group flex-1">
            <label>End Time</label>
            <input
              v-model="createSlotForm.endTime"
              type="time"
              class="modal-input"
            >
          </div>
        </div>
        <div class="modal-actions mt-2">
          <button
            type="button"
            class="btn btn--outline"
            @click="createSlotOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn--primary"
            @click="submitCreateSlot"
          >
            Create Slot
          </button>
        </div>
      </div>
    </div>

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
.schedules-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: calc(100vh - 80px);
  padding: 24px 32px;
  overflow-y: auto;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  margin: 0;
  font-family: var(--font-primary);
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
}

.header-actions {
  display: flex;
  gap: 8px;
}

.controls-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.controls-left {
  display: flex;
  gap: 16px;
  align-items: center;
}

/* View toggle pills */
.view-toggle {
  display: flex;
  gap: 8px;
}

.view-toggle__btn {
  padding: 6px 16px;
  font-family: var(--font-primary);
  font-size: 13px;
  font-weight: 500;
  color: var(--muted-foreground);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  transition: all 0.15s;
}

.view-toggle__btn:hover {
  color: var(--foreground);
  background: var(--accent);
}

.view-toggle__btn.active {
  color: #ffffff;
  background: #5749f4;
  border-color: #5749f4;
}

/* Date navigation */
.date-nav {
  display: flex;
  gap: 6px;
  align-items: center;
}

.date-nav__label {
  min-width: 240px;
  font-family: var(--font-primary);
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
  text-align: center;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--foreground);
  cursor: pointer;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: background 0.15s;
}

.icon-btn:hover {
  background: var(--accent);
}

.btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 6px 14px;
  font-family: var(--font-primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-md);
  transition: background 0.15s;
}

.btn--ghost {
  color: var(--primary);
  background: transparent;
}

.btn--ghost:hover {
  background: var(--accent);
}

.btn--primary {
  color: #ffffff;
  background: var(--primary);
}

.btn--primary:hover {
  background: #4739df;
}

.btn--outline {
  color: var(--foreground);
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

/* Master filter */
.filter-wrap {
  position: relative;
}

.filter-btn {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 8px 14px;
  font-family: var(--font-primary);
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
  cursor: pointer;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: background 0.15s;
}

.filter-btn:hover {
  background: var(--accent);
}

.filter-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 20;
  min-width: 180px;
  overflow: hidden;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-modal);
}

.filter-dropdown__item {
  display: block;
  width: 100%;
  padding: 10px 14px;
  font-family: var(--font-primary);
  font-size: 13px;
  color: var(--foreground);
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: none;
  transition: background 0.1s;
}

.filter-dropdown__item:hover {
  background: var(--accent);
}

.filter-dropdown__item.selected {
  font-weight: 600;
  color: var(--primary);
}

/* Grid Layout */
.master-calendar-grid {
  display: grid;
  flex: 1;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  min-height: 0;
}

/* Panel Incoming */
.master-calendar-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  overflow-y: auto;
  background: #f7f7f8;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.panel-title {
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 700;
  color: var(--foreground);
}

.panel-empty {
  padding: 32px 8px;
  font-family: var(--font-primary);
  font-size: 12px;
  color: var(--muted-foreground);
  text-align: center;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order-list-item {
  display: block;
  width: 100%;
  padding: 10px 12px;
  text-align: left;
  cursor: pointer;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: all 0.15s;
}

.order-list-item:hover {
  background: var(--accent);
  border-color: var(--primary);
}

.order-list-item.active {
  background: #eef0ff;
  border-color: var(--primary);
  box-shadow: 0 0 0 1px var(--primary);
}

.order-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.order-title {
  font-family: var(--font-primary);
  font-size: 12px;
  font-weight: 700;
  color: var(--foreground);
}

.order-badge {
  padding: 2px 6px;
  font-size: 9px;
  font-weight: 700;
  color: var(--warning);
  background: var(--warning-bg);
  border-radius: var(--radius-pill);
}

.order-sub {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
  color: var(--muted-foreground);
  white-space: nowrap;
}

/* Order detail cards */
.order-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.details-title {
  font-family: var(--font-primary);
  font-size: 13px;
  font-weight: 700;
  color: var(--foreground);
}

.details-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.detail-item span {
  color: var(--muted-foreground);
}

.detail-item b {
  color: var(--foreground);
}

.details-actions {
  display: flex;
  gap: 8px;
}

.flex-1 {
  flex: 1;
}

.details-hint {
  padding: 8px 12px;
  font-size: 11px;
  line-height: 1.4;
  color: var(--primary);
  background: #eef0ff;
  border-radius: var(--radius-sm);
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Weekly calendar */
.master-calendar-calendar {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.week-calendar {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.week-calendar__headers {
  display: grid;
  flex-shrink: 0;
  grid-template-columns: 60px repeat(7, 1fr);
  background: #fafafa;
  border-bottom: 1px solid var(--border);
}

.week-calendar__time-gutter {
  flex-shrink: 0;
  border-right: 1px solid var(--border);
}

.week-calendar__col-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
  padding: 10px 4px;
  border-right: 1px solid var(--border);
}

.week-calendar__col-header:last-child {
  border-right: none;
}

.week-calendar__col-header--today {
  background: var(--accent);
}

.week-calendar__day-name {
  font-family: var(--font-primary);
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-foreground);
  text-transform: uppercase;
}

.week-calendar__day-num {
  font-family: var(--font-primary);
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
}

.week-calendar__day-num--today {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #ffffff;
  background: var(--primary);
  border-radius: 50%;
}

.week-calendar__body {
  position: relative;
  display: grid;
  flex: 1;
  grid-template-columns: 60px repeat(7, 1fr);
  overflow-y: auto;
}

.week-calendar__time-label {
  height: 60px;
  padding: 2px 8px;
  font-family: var(--font-primary);
  font-size: 11px;
  font-weight: 500;
  color: var(--muted-icon);
  text-align: right;
  border-bottom: 1px solid var(--accent);
}

.week-calendar__day-col {
  position: relative;
  border-right: 1px solid var(--border);
}

.week-calendar__day-col:last-child {
  border-right: none;
}

.week-calendar__hour-line {
  height: 60px;
  cursor: cell;
  border-bottom: 1px solid var(--accent);
}

.week-calendar__hour-line:hover {
  background: rgba(87, 73, 244, 0.04);
}

/* Time Slot Chips */
.slot-chip {
  position: absolute;
  right: 4px;
  left: 4px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 8px;
  overflow: hidden;
  cursor: pointer;
  border-left: 4px solid var(--primary);
  border-radius: 4px;
  transition:
    transform 0.15s,
    opacity 0.15s;
}

.slot-chip:hover {
  opacity: 0.9;
  transform: scale(1.01);
}

.slot-chip--available {
  color: #25603a;
  background: #e8faf0;
  border-left-color: #16a34a;
}

.slot-chip--booked {
  color: var(--destructive);
  background: #fee9e5;
  border-left-color: var(--destructive);
}

.slot-chip__time {
  font-family: var(--font-primary);
  font-size: 10px;
  font-weight: 700;
}

.slot-chip__title {
  font-size: 10px;
  font-weight: 600;
}

/* Slot flyout detail overlay */
.slot-flyout {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 280px;
  padding: 16px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-modal);
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slot-flyout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--accent);
}

.slot-flyout-title {
  margin: 0;
  font-family: var(--font-primary);
  font-size: 13px;
  font-weight: 700;
  color: var(--foreground);
}

.close-btn {
  font-size: 14px;
  color: var(--muted-icon);
  cursor: pointer;
  background: none;
  border: none;
}

.close-btn:hover {
  color: var(--foreground);
}

.slot-flyout-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.flyout-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.flyout-row span {
  color: var(--muted-foreground);
}

.flyout-row b {
  color: var(--foreground);
}

.status-indicator {
  padding: 1px 6px;
  font-size: 10px;
  font-weight: 700;
  border-radius: var(--radius-pill);
}

.status-indicator--available {
  color: #25603a;
  background: #e8faf0;
}

.status-indicator--booked {
  color: var(--destructive);
  background: #fee9e5;
}

.w-full {
  width: 100%;
}

.mt-2 {
  margin-top: 8px;
}

/* Quick booking section */
.slot-book-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px dashed var(--border);
}

.section-title {
  margin: 0 0 4px 0;
  font-family: var(--font-primary);
  font-size: 11px;
  font-weight: 700;
  color: var(--foreground);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-sm {
  width: 100%;
  padding: 6px 10px;
  font-family: var(--font-primary);
  font-size: 11px;
  color: var(--foreground);
  outline: none;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.input-sm:focus {
  border-color: var(--primary);
}

.textarea-sm {
  resize: none;
}

.select-sm {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23939399' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 10px;
}

/* Spinner and loading overlay */
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

/* Modals */
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
  max-width: 400px;
  padding: 24px;
  background: var(--background);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-modal);
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

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
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

/* Toast */
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
