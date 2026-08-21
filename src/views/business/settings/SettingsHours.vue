<script
  setup
  lang="ts"
>
import { ChevronDown, Globe, LoaderCircle, Timer } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import {
  getSettingsHours,
  saveSettingsHours,
} from '@/services/settingsService';
import type { DaySchedule } from '@/types/settings';

interface TimezoneOption {
  value: string;
  label: string;
}

const days = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

const defaultSchedule: Record<string, DaySchedule> = {
  monday: { open: '09:00', close: '18:00', closed: false },
  tuesday: { open: '09:00', close: '18:00', closed: false },
  wednesday: { open: '09:00', close: '18:00', closed: false },
  thursday: { open: '09:00', close: '18:00', closed: false },
  friday: { open: '09:00', close: '18:00', closed: false },
  saturday: { open: '09:00', close: '18:00', closed: true },
  sunday: { open: '09:00', close: '18:00', closed: true },
};

const schedule = ref<Record<string, DaySchedule>>({ ...defaultSchedule });
const initialSchedule = ref<Record<string, DaySchedule>>({
  ...defaultSchedule,
});
const loading = ref(true);
const saving = ref(false);

const timezones: TimezoneOption[] = [
  { value: 'Asia/Tashkent', label: 'Asia/Tashkent  (GMT +05:00)' },
  { value: 'Asia/Almaty', label: 'Asia/Almaty  (GMT +05:00)' },
  { value: 'Asia/Dushanbe', label: 'Asia/Dushanbe  (GMT +05:00)' },
  { value: 'Asia/Bishkek', label: 'Asia/Bishkek  (GMT +06:00)' },
  { value: 'Europe/Moscow', label: 'Europe/Moscow  (GMT +03:00)' },
];

const selectedTimezone = ref('Asia/Tashkent');

onMounted(async () => {
  const data = await getSettingsHours();
  if (data) {
    schedule.value = { ...data };
    initialSchedule.value = JSON.parse(JSON.stringify(data));
  }
  loading.value = false;
});

function toggleDay(dayKey: string) {
  schedule.value[dayKey].closed = !schedule.value[dayKey].closed;
}

function hasChanges(): boolean {
  return (
    JSON.stringify(schedule.value) !== JSON.stringify(initialSchedule.value)
  );
}

async function save() {
  if (saving.value) {
    return;
  }

  saving.value = true;
  try {
    await saveSettingsHours(schedule.value);
    initialSchedule.value = JSON.parse(JSON.stringify(schedule.value));
  } catch {
    // Error toast could be added here
  } finally {
    saving.value = false;
  }
}

function cancel() {
  schedule.value = JSON.parse(JSON.stringify(initialSchedule.value));
}
</script>

<template>
  <div class="operating-hours">
    <!-- Page header -->
    <div class="page-header">
      <h1 class="page-title">Operating hours</h1>
      <p class="page-subtitle">
        The organization's default opening hours, applied across the whole
        business.
      </p>
    </div>

    <div class="cards-stack">
      <!-- Weekly hours card -->
      <div class="card">
        <div class="card-section-header">
          <h2 class="card-section-title">Weekly hours</h2>
          <p class="card-section-desc">
            Default opening hours applied to the whole organization.
          </p>
        </div>

        <!-- Column headers -->
        <div class="column-headers">
          <div class="col col--day">
            <span class="col-label">Day</span>
          </div>
          <div class="col col--hours">
            <span class="col-label">Opening hours</span>
          </div>
          <div class="col col--status">
            <span class="col-label">Status</span>
          </div>
        </div>

        <!-- Day rows -->
        <div
          v-for="day in days"
          :key="day.key"
          class="day-row"
        >
          <!-- Day name -->
          <div class="col col--day">
            <span class="day-name">{{ day.label }}</span>
          </div>

          <!-- Hours area -->
          <div class="col col--hours">
            <label
              class="time-picker"
              :class="{ 'time-picker--muted': schedule[day.key].closed }"
              :for="`time-open-${day.key}`"
            >
              <Timer
                :size="13"
                class="time-picker-icon"
              />
              <span class="time-picker-value"
                >{{ schedule[day.key].open }}</span
              >
              <ChevronDown
                :size="14"
                class="time-picker-chevron"
              />
              <input
                :id="`time-open-${day.key}`"
                v-model="schedule[day.key].open"
                type="time"
                class="time-picker-input"
                :disabled="schedule[day.key].closed"
              >
            </label>
            <span class="time-separator">to</span>
            <label
              class="time-picker"
              :class="{ 'time-picker--muted': schedule[day.key].closed }"
              :for="`time-close-${day.key}`"
            >
              <Timer
                :size="13"
                class="time-picker-icon"
              />
              <span class="time-picker-value"
                >{{ schedule[day.key].close }}</span
              >
              <ChevronDown
                :size="14"
                class="time-picker-chevron"
              />
              <input
                :id="`time-close-${day.key}`"
                v-model="schedule[day.key].close"
                type="time"
                class="time-picker-input"
                :disabled="schedule[day.key].closed"
              >
            </label>
          </div>

          <!-- Status toggle -->
          <div class="col col--status">
            <span
              class="status-label"
              :class="{ 'status-label--muted': schedule[day.key].closed }"
            >
              {{ schedule[day.key].closed ? 'Closed' : 'Open' }}
            </span>
            <button
              type="button"
              class="toggle-switch"
              :class="{ 'toggle-switch--on': !schedule[day.key].closed }"
              :aria-label="`Toggle ${day.label} hours`"
              @click="toggleDay(day.key)"
            >
              <span class="toggle-switch-knob" />
            </button>
          </div>
        </div>
      </div>

      <!-- Timezone card -->
      <div class="card">
        <h2 class="card-section-title">Timezone</h2>

        <div class="timezone-selector">
          <Globe
            :size="13"
            class="timezone-icon"
          />
          <select
            v-model="selectedTimezone"
            class="timezone-select"
          >
            <option
              v-for="tz in timezones"
              :key="tz.value"
              :value="tz.value"
            >
              {{ tz.label }}
            </option>
          </select>
          <ChevronDown
            :size="14"
            class="timezone-chevron"
          />
        </div>

        <p class="info-text">
          Individual team members and branches can override these default hours
          with their own schedules.
        </p>
      </div>

      <!-- Action bar -->
      <div
        v-if="!loading"
        class="action-bar"
      >
        <button
          type="button"
          class="btn btn--secondary"
          :disabled="!hasChanges() || saving"
          @click="cancel"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn btn--primary"
          :disabled="!hasChanges() || saving"
          @click="save"
        >
          <LoaderCircle
            v-if="saving"
            :size="16"
            class="btn-spinner"
          />
          {{ saving ? 'Saving…' : 'Save changes' }}
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div
      v-if="loading"
      class="loading-state"
    >
      <LoaderCircle
        :size="24"
        class="loading-spinner"
      />
      <span>Loading operating hours…</span>
    </div>
  </div>
</template>

<style scoped>
/* ===== Page header ===== */
.page-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--foreground);
}

.page-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Cards stack ===== */
.cards-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ===== Card ===== */
.card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

/* ===== Card section header ===== */
.card-section-header {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.card-section-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.card-section-desc {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Column headers ===== */
.column-headers {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 0 2px;
}

.col {
  display: flex;
  align-items: center;
}

.col--day {
  flex-shrink: 0;
  width: 120px;
}

.col--hours {
  flex: 1;
  gap: 10px;
  min-width: 0;
}

.col--status {
  flex-shrink: 0;
  gap: 10px;
  justify-content: flex-end;
  width: 150px;
}

.col-label {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-foreground);
  text-transform: none;
}

/* ===== Day rows ===== */
.day-row {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 14px 2px;
  border-bottom: 1px solid var(--border);
}

.day-row:last-child {
  border-bottom: none;
}

.day-name {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

/* ===== Time picker ===== */
.time-picker {
  position: relative;
  display: flex;
  gap: 8px;
  align-items: center;
  width: 136px;
  padding: 9px 12px;
  cursor: pointer;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition: border-color 0.15s;
}

.time-picker:hover {
  border-color: var(--primary);
}

.time-picker-icon {
  flex-shrink: 0;
  color: var(--muted-foreground);
}

.time-picker-value {
  flex: 1;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--foreground);
  white-space: nowrap;
}

.time-picker-chevron {
  flex-shrink: 0;
  color: var(--muted-foreground);
}

.time-picker-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
}

.time-picker-input::-webkit-calendar-picker-indicator {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
}

/* ===== Muted (closed day) state ===== */
.time-picker--muted {
  cursor: default;
  background: transparent;
}

.time-picker--muted:hover {
  border-color: var(--border);
}

.time-picker--muted .time-picker-value,
.time-picker--muted .time-picker-icon,
.time-picker--muted .time-picker-chevron {
  color: var(--muted-foreground);
}

.time-picker-input:disabled {
  cursor: default;
}

/* ===== Action bar ===== */
.action-bar {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid var(--border);
}

.btn {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 9px 20px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  transition:
    background 0.15s,
    border-color 0.15s,
    opacity 0.15s;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn--primary {
  color: #fff;
  background: var(--primary);
  border-color: var(--primary);
}

.btn--primary:hover:not(:disabled) {
  background: var(--primary-hover, #2563eb);
}

.btn--secondary {
  color: var(--foreground);
  background: transparent;
  border-color: var(--border);
}

.btn--secondary:hover:not(:disabled) {
  background: var(--accent);
}

.btn-spinner {
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== Loading state ===== */
.loading-state {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: var(--muted-foreground);
}

.loading-spinner {
  color: var(--primary);
  animation: spin 0.7s linear infinite;
}

.time-separator {
  flex-shrink: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Status area ===== */
.status-label {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
}

.status-label--muted {
  color: var(--muted-foreground);
}

/* ===== Toggle switch ===== */
.toggle-switch {
  position: relative;
  display: flex;
  align-items: center;
  width: 40px;
  height: 22px;
  padding: 3px;
  cursor: pointer;
  background: #d9d9db;
  border: none;
  border-radius: var(--radius-pill);
  transition: background 0.2s ease;
}

.toggle-switch--on {
  justify-content: flex-end;
  background: var(--primary);
}

.toggle-switch-knob {
  display: block;
  width: 16px;
  height: 16px;
  background: var(--background);
  border-radius: var(--radius-pill);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

/* ===== Timezone selector ===== */
.timezone-selector {
  position: relative;
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 9px 12px;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition: border-color 0.15s;
}

.timezone-selector:hover {
  border-color: var(--primary);
}

.timezone-icon {
  flex-shrink: 0;
  color: var(--muted-foreground);
}

.timezone-select {
  flex: 1;
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--foreground);
  appearance: none;
  cursor: pointer;
  outline: none;
  background: transparent;
  border: none;
}

.timezone-chevron {
  flex-shrink: 0;
  color: var(--muted-foreground);
  pointer-events: none;
}

/* ===== Info text ===== */
.info-text {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}
</style>
