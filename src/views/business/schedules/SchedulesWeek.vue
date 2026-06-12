<script
  setup
  lang="ts"
>
import { ChevronDown, ChevronLeft, ChevronRight } from '@lucide/vue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { masterColors, weekBookings } from '@/data/schedules';

const router = useRouter();

const today = new Date(2026, 3, 12);
const currentDate = ref(new Date(today));

const viewMode = ref<'month' | 'week' | 'day'>('week');

const masters = ['All masters', 'Aziz K.', 'Bekzod R.', 'Jasur T.'];
const selectedMaster = ref('All masters');
const masterDropdownOpen = ref(false);

function selectMaster(m: string) {
  selectedMaster.value = m;
  masterDropdownOpen.value = false;
}

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

function getBookingsForDay(date: Date) {
  const ds = dateStr(date);
  let bookings = weekBookings.filter((b) => b.date === ds);
  if (selectedMaster.value !== 'All masters') {
    bookings = bookings.filter((b) => b.master === selectedMaster.value);
  }
  return bookings;
}

function clickBooking(orderId: string) {
  router.push(`/business/orders/${encodeURIComponent(orderId)}`);
}

function switchView(view: 'month' | 'week' | 'day') {
  if (view === 'month') {
    router.push('/business/schedules');
  } else if (view === 'week') {
    router.push('/business/schedules/week');
  } else {
    router.push('/business/schedules/day');
  }
}

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
</script>

<template>
  <div class="schedules-page">
    <!-- Header -->
    <div class="header-row">
      <div class="header-row__left">
        <h1 class="page-title">Schedules</h1>
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
        </div>

        <!-- Date nav -->
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

    <!-- Week calendar -->
    <div class="week-calendar">
      <!-- Column headers -->
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
            >{{ day.dayNumber }}</span
          >
        </div>
      </div>

      <!-- Time grid -->
      <div class="week-calendar__body">
        <!-- Time gutter -->
        <div class="week-calendar__time-gutter">
          <div
            v-for="slot in timeSlots"
            :key="slot"
            class="week-calendar__time-label"
          >
            {{ slot }}
          </div>
        </div>

        <!-- Day columns -->
        <div
          v-for="day in weekDays"
          :key="dateStr(day.date)"
          class="week-calendar__day-col"
        >
          <!-- Hour lines -->
          <div
            v-for="slot in timeSlots"
            :key="slot"
            class="week-calendar__hour-line"
          />

          <!-- Booking cards -->
          <div
            v-for="bk in getBookingsForDay(day.date)"
            :key="bk.orderId"
            class="week-booking"
            :style="{
              top: bookingTop(bk.time),
              height: bookingHeight(bk.time, bk.endTime),
              borderLeftColor: masterColors[bk.master as keyof typeof masterColors]?.bar ?? '#5749F4',
              background: masterColors[bk.master as keyof typeof masterColors]?.bg ?? '#EEF0FF',
            }"
            @click="clickBooking(bk.orderId)"
          >
            <span class="week-booking__time">{{ bk.time }}</span>
            <span class="week-booking__service">{{ bk.service }}</span>
            <span class="week-booking__master">{{ bk.master }}</span>
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
  color: #ffffff;
  background: #5749f4;
  border-color: #5749f4;
}

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

/* Week calendar */
.week-calendar {
  overflow: hidden;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.week-calendar__headers {
  display: grid;
  grid-template-columns: 60px repeat(7, 1fr);
  border-bottom: 1px solid var(--border);
}

.week-calendar__time-gutter {
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
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
}

.week-calendar__day-num--today {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: #ffffff;
  background: var(--primary);
  border-radius: 50%;
}

.week-calendar__body {
  position: relative;
  display: grid;
  grid-template-columns: 60px repeat(7, 1fr);
  max-height: 600px;
  overflow-y: auto;
}

.week-calendar__time-gutter {
  display: flex;
  flex-direction: column;
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
  border-bottom: 1px solid var(--accent);
}

/* Booking cards */
.week-booking {
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
  transition: opacity 0.15s;
}

.week-booking:hover {
  opacity: 0.85;
}

.week-booking__time {
  font-family: var(--font-primary);
  font-size: 10px;
  font-weight: 600;
  color: var(--foreground);
}

.week-booking__service {
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--font-primary);
  font-size: 10px;
  font-weight: 500;
  color: var(--foreground);
  white-space: nowrap;
}

.week-booking__master {
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--font-primary);
  font-size: 9px;
  color: var(--muted-foreground);
  white-space: nowrap;
}
</style>
