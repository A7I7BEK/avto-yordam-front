<script
  setup
  lang="ts"
>
import { ArrowLeft, ChevronLeft, ChevronRight } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { masterColors } from '@/data/schedules';
import { getDayBookings } from '@/services/schedulesService';

const router = useRouter();
const route = useRoute();
const bookings = ref<any[]>([]);

async function loadBookings() {
  bookings.value = await getDayBookings();
}

onMounted(() => {
  loadBookings();
});

const queryDate = route.query.date as string | undefined;

const today = new Date(2026, 3, 12);
const currentDate = ref(queryDate ? new Date(queryDate) : today);

const viewMode = ref<'month' | 'week' | 'day' | 'slots'>('day');

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function dateStr(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const dayLabel = computed(() => {
  const d = currentDate.value;
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
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return `${dayNames[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
});

const todayStr = computed(() => dateStr(new Date()));

function prevDay() {
  const d = currentDate.value;
  currentDate.value = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
}

function nextDay() {
  const d = currentDate.value;
  currentDate.value = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
}

function goToToday() {
  currentDate.value = new Date();
}

function goBack() {
  router.push('/business/schedules');
}

const timeSlots = Array.from({ length: 21 }, (_, i) => {
  const totalMinutes = (i + 8) * 60;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
});

function getSlotPosition(time: string): number {
  const [h = 0, m = 0] = time.split(':').map(Number);
  return (h - 8) * 60 + m;
}

function bookingTop(time: string): string {
  return `${getSlotPosition(time) * 0.5}px`;
}

function bookingHeight(start: string, end: string): string {
  const startMin = getSlotPosition(start);
  const endMin = getSlotPosition(end);
  return `${(endMin - startMin) * 0.5}px`;
}

function getBookings() {
  const ds = dateStr(currentDate.value);
  return bookings.value.filter((b) => b.date === ds);
}

function clickBooking(orderId: string) {
  router.push(`/business/orders/${encodeURIComponent(orderId)}`);
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

const statusMap: Record<string, { label: string; class: string }> = {
  confirmed: { label: 'Confirmed', class: 'status--confirmed' },
  progress: { label: 'In Progress', class: 'status--progress' },
  done: { label: 'Done', class: 'status--done' },
  cancelled: { label: 'Cancelled', class: 'status--cancelled' },
};

function getStatus(status?: string): string {
  if (!status) {
    return 'confirmed';
  }
  const s = status.toLowerCase();
  if (s === 'in_progress') {
    return 'progress';
  }
  if (s === 'completed' || s === 'done') {
    return 'done';
  }
  if (s === 'cancelled' || s === 'rejected') {
    return 'cancelled';
  }
  return 'confirmed';
}
</script>

<template>
  <div class="schedules-page">
    <!-- Header -->
    <div class="header-row">
      <div class="header-row__left">
        <button
          type="button"
          class="icon-btn"
          title="Back to schedules"
          @click="goBack"
        >
          <ArrowLeft :size="20" />
        </button>
        <div>
          <h1 class="page-title">Schedules</h1>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="controls-row">
      <div class="controls-left">
        <!-- View toggle -->
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

        <!-- Date nav -->
        <div class="date-nav">
          <button
            type="button"
            class="icon-btn"
            title="Previous day"
            @click="prevDay"
          >
            <ChevronLeft :size="18" />
          </button>
          <span class="date-nav__label">{{ dayLabel }}</span>
          <button
            type="button"
            class="icon-btn"
            title="Next day"
            @click="nextDay"
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
    </div>

    <!-- Day calendar -->
    <div class="day-calendar">
      <!-- Time gutter + bookings -->
      <div class="day-calendar__body">
        <div class="day-calendar__time-gutter">
          <div
            v-for="slot in timeSlots"
            :key="slot"
            class="day-calendar__time-label"
          >
            {{ slot }}
          </div>
        </div>

        <div class="day-calendar__content">
          <!-- Hour lines -->
          <div
            v-for="slot in timeSlots"
            :key="slot"
            class="day-calendar__hour-line"
          />

          <!-- Booking cards -->
          <div
            v-for="bk in getBookings()"
            :key="bk.orderId"
            class="day-booking"
            :style="{
              top: bookingTop(bk.time),
              height: bookingHeight(bk.time, bk.endTime),
              borderLeftColor: masterColors[bk.master as keyof typeof masterColors]?.bar ?? '#5749F4',
            }"
            @click="clickBooking(bk.orderId)"
          >
            <div class="day-booking__top">
              <span class="day-booking__time"
                >{{ bk.time }}
                – {{ bk.endTime }}</span
              >
              <span
                class="day-booking__status"
                :class="statusMap[getStatus(bk.status)]?.class ?? ''"
              >
                {{ statusMap[getStatus(bk.status)]?.label ?? getStatus(bk.status) }}
              </span>
            </div>
            <div class="day-booking__customer">{{ bk.customer }}</div>
            <div class="day-booking__meta">
              <span class="day-booking__service">{{ bk.service }}</span>
              <span class="day-booking__sep">·</span>
              <span class="day-booking__master">{{ bk.master }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.schedules-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 32px;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-row__left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.page-title {
  margin: 0;
  font-family: var(--font-primary);
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
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
  color: var(--primary-foreground);
  background: var(--primary);
  border-color: var(--primary);
}

.date-nav {
  display: flex;
  gap: 6px;
  align-items: center;
}

.date-nav__label {
  min-width: 280px;
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

/* Day calendar */
.day-calendar {
  overflow: hidden;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.day-calendar__body {
  position: relative;
  display: grid;
  grid-template-columns: 60px 1fr;
  max-height: 700px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .schedules-page {
    padding: 16px 12px;
  }

  .controls-row {
    flex-direction: column;
    align-items: stretch;
  }

  .controls-left {
    flex-direction: column;
    align-items: stretch;
  }

  .view-toggle {
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }

  .date-nav {
    justify-content: space-between;
  }

  .date-nav__label {
    min-width: 0;
    font-size: 13px;
  }
}

.day-calendar__time-gutter {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border);
}

.day-calendar__time-label {
  height: 30px;
  padding: 2px 8px;
  font-family: var(--font-primary);
  font-size: 10px;
  font-weight: 500;
  color: var(--muted-icon);
  text-align: right;
  border-bottom: 1px solid var(--accent);
}

.day-calendar__content {
  position: relative;
  min-height: 630px;
}

.day-calendar__hour-line {
  height: 30px;
  border-bottom: 1px solid var(--accent);
}

/* Day booking cards */
.day-booking {
  position: absolute;
  right: 8px;
  left: 8px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  overflow: hidden;
  cursor: pointer;
  background: var(--accent);
  border: 1px solid var(--border-soft);
  border-left: 4px solid var(--primary);
  border-radius: 6px;
  transition: box-shadow 0.15s;
}

.day-booking:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.day-booking__top {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}

.day-booking__time {
  font-family: var(--font-primary);
  font-size: 11px;
  font-weight: 600;
  color: var(--foreground);
  white-space: nowrap;
}

.day-booking__status {
  padding: 1px 8px;
  font-family: var(--font-primary);
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  border-radius: var(--radius-pill);
}

.status--confirmed {
  color: var(--success);
  background: var(--success-bg);
}

.status--progress {
  color: var(--info-strong);
  background: var(--info-soft);
}

.status--done {
  color: var(--muted-foreground);
  background: var(--hover);
}

.status--cancelled {
  color: var(--destructive);
  background: var(--destructive-soft);
}

.day-booking__customer {
  font-family: var(--font-primary);
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.day-booking__meta {
  display: flex;
  gap: 4px;
  align-items: center;
  font-family: var(--font-primary);
  font-size: 11px;
  color: var(--muted-foreground);
}

.day-booking__sep {
  color: var(--muted-icon);
}
</style>
