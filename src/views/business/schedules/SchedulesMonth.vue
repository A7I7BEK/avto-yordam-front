<script
  setup
  lang="ts"
>
import { ChevronDown, ChevronLeft, ChevronRight } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { masterColors } from '@/data/schedules';
import { getMonthBookings } from '@/services/schedulesService';

const router = useRouter();
const bookings = ref<any[]>([]);

async function loadBookings() {
  bookings.value = await getMonthBookings();
}

onMounted(() => {
  loadBookings();
});

const now = new Date(2026, 3, 1);
const currentYear = ref(now.getFullYear());
const currentMonth = ref(now.getMonth());

const masters = ['All masters', 'Aziz K.', 'Bekzod R.', 'Jasur T.'];
const selectedMaster = ref('All masters');
const masterDropdownOpen = ref(false);

function selectMaster(m: string) {
  selectedMaster.value = m;
  masterDropdownOpen.value = false;
}

const viewMode = ref<'month' | 'week' | 'day' | 'slots'>('month');

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

const monthLabel = computed(
  () => `${monthNames[currentMonth.value]} ${currentYear.value}`,
);

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value -= 1;
  } else {
    currentMonth.value -= 1;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value += 1;
  } else {
    currentMonth.value += 1;
  }
}

function goToToday() {
  const today = new Date();
  currentYear.value = today.getFullYear();
  currentMonth.value = today.getMonth();
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  // First day of month (0=Sun, 1=Mon, ... 6=Sat)
  // We want Mon=0, Tue=1, ..., Sun=6
  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: { date: Date; dayNumber: number; isCurrentMonth: boolean }[] = [];

  // Previous month's trailing days
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    days.push({
      date: new Date(year, month - 1, d),
      dayNumber: d,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      date: new Date(year, month, d),
      dayNumber: d,
      isCurrentMonth: true,
    });
  }

  // Next month's leading days to fill 6 rows × 7 cols = 42
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push({
      date: new Date(year, month + 1, d),
      dayNumber: d,
      isCurrentMonth: false,
    });
  }

  return days;
});

const todayStr = computed(() => {
  const t = new Date();
  return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
});

function dateStr(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function getBookingsForDate(date: Date) {
  const ds = dateStr(date);
  let res = bookings.value.filter((b) => b.date === ds);
  if (selectedMaster.value !== 'All masters') {
    res = res.filter((b) => b.master === selectedMaster.value);
  }
  return res;
}

function clickDay(date: Date) {
  router.push(`/business/schedules/day?date=${dateStr(date)}`);
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
</script>

<template>
  <div class="schedules-page">
    <!-- Header -->
    <div class="header-row">
      <div class="header-row__left">
        <h1 class="page-title">Schedules</h1>
      </div>
    </div>

    <!-- View toggle + Date nav + Filter -->
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

        <!-- Date navigation -->
        <div class="date-nav">
          <button
            type="button"
            class="icon-btn"
            title="Previous month"
            @click="prevMonth"
          >
            <ChevronLeft :size="18" />
          </button>
          <span class="date-nav__label">{{ monthLabel }}</span>
          <button
            type="button"
            class="icon-btn"
            title="Next month"
            @click="nextMonth"
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

      <!-- Master filter -->
      <div class="filter-wrap">
        <button
          type="button"
          class="filter-btn"
          @click="masterDropdownOpen = !masterDropdownOpen"
        >
          {{ selectedMaster }}
          <ChevronDown :size="14" />
        </button>
        <div
          v-if="masterDropdownOpen"
          class="filter-dropdown"
        >
          <button
            v-for="m in masters"
            :key="m"
            type="button"
            class="filter-dropdown__item"
            :class="{ selected: selectedMaster === m }"
            @click="selectMaster(m)"
          >
            {{ m }}
          </button>
        </div>
      </div>
    </div>

    <!-- Calendar grid -->
    <div class="calendar">
      <!-- Day headers -->
      <div class="calendar__day-headers">
        <span
          v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
          :key="day"
          class="calendar__day-header"
        >
          {{ day }}
        </span>
      </div>

      <!-- Day cells (6 rows × 7 cols) -->
      <div class="calendar__grid">
        <div
          v-for="(day, i) in calendarDays"
          :key="i"
          class="calendar__cell"
          :class="{
            'calendar__cell--outside': !day.isCurrentMonth,
            'calendar__cell--today': dateStr(day.date) === todayStr,
          }"
          @click="clickDay(day.date)"
        >
          <span class="calendar__day-num">{{ day.dayNumber }}</span>
          <div class="calendar__bookings">
            <template
              v-for="bk in getBookingsForDate(day.date).slice(0, 3)"
              :key="bk.orderId"
            >
              <div
                class="booking-chip"
                :style="{
                  borderLeftColor: masterColors[bk.master as keyof typeof masterColors]?.bar ?? '#5749F4',
                  background: masterColors[bk.master as keyof typeof masterColors]?.bg ?? 'var(--primary-tint)',
                }"
                @click.stop="clickBooking(bk.orderId)"
              >
                <span class="booking-chip__time">{{ bk.time }}</span>
                <span class="booking-chip__service">{{ bk.service }}</span>
              </div>
            </template>
            <button
              v-if="getBookingsForDate(day.date).length > 3"
              type="button"
              class="booking-more"
              @click.stop="clickDay(day.date)"
            >
              +{{ getBookingsForDate(day.date).length - 3 }}
              more
            </button>
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

/* Header */
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-row__left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  margin: 0;
  font-family: var(--font-primary);
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
}

/* Controls row */
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
  color: var(--primary-foreground);
  background: var(--primary);
  border-color: var(--primary);
}

/* Date navigation */
.date-nav {
  display: flex;
  gap: 6px;
  align-items: center;
}

.date-nav__label {
  min-width: 120px;
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

/* Calendar grid */
.calendar {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.calendar__day-headers {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  min-width: 640px;
  border-bottom: 1px solid var(--border);
}

.calendar__day-header {
  padding: 10px 12px;
  font-family: var(--font-primary);
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-foreground);
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  min-width: 640px;
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
}

.calendar__cell {
  min-height: 100px;
  padding: 6px 8px;
  cursor: pointer;
  border-right: 1px solid var(--border-soft);
  border-bottom: 1px solid var(--border-soft);
  transition: background 0.1s;
}

.calendar__cell:nth-child(7n) {
  border-right: none;
}

.calendar__cell:hover {
  background: var(--accent);
}

.calendar__cell--outside {
  background: var(--accent);
}

.calendar__day-num {
  display: block;
  margin-bottom: 4px;
  font-family: var(--font-primary);
  font-size: 12px;
  font-weight: 600;
  color: var(--foreground);
}

.calendar__cell--outside .calendar__day-num {
  color: var(--muted-icon);
}

.calendar__cell--today .calendar__day-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--primary-foreground);
  background: var(--primary);
  border-radius: 50%;
}

.calendar__bookings {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* Booking chip */
.booking-chip {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 2px 6px;
  overflow: hidden;
  cursor: pointer;
  border-left: 4px solid var(--primary);
  border-radius: 3px;
  transition: opacity 0.15s;
}

.booking-chip:hover {
  opacity: 0.8;
}

.booking-chip__time {
  font-family: var(--font-primary);
  font-size: 10px;
  font-weight: 600;
  color: var(--foreground);
  white-space: nowrap;
}

.booking-chip__service {
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--font-primary);
  font-size: 10px;
  color: var(--muted-foreground);
  white-space: nowrap;
}

.booking-more {
  padding: 0;
  font-family: var(--font-primary);
  font-size: 10px;
  font-weight: 600;
  color: var(--primary);
  text-align: left;
  cursor: pointer;
  background: none;
  border: none;
}

.booking-more:hover {
  text-decoration: underline;
}
</style>
