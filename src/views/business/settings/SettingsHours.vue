<script
  setup
  lang="ts"
>
import { onMounted, ref } from 'vue';
import { getSettingsHours } from '@/services/settingsService';

interface DaySchedule {
  open: string;
  close: string;
  closed: boolean;
}

const dayLabels: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

const schedule = ref<Record<string, DaySchedule>>({});

onMounted(async () => {
  const data = await getSettingsHours();
  if (data) {
    schedule.value = { ...data };
  }
});

function save() {
  // Save logic
}
</script>

<template>
  <div class="settings-page">
    <div class="header-row">
      <h1 class="page-title">Operating hours</h1>
    </div>

    <div class="hours-card">
      <div
        v-for="(daySchedule, dayKey) in schedule"
        :key="dayKey"
        class="day-row"
        :class="{ 'day-row--closed': daySchedule.closed }"
      >
        <span class="day-name">{{ dayLabels[dayKey] || dayKey }}</span>

        <div class="day-controls">
          <div
            v-if="!daySchedule.closed"
            class="time-fields"
          >
            <input
              v-model="daySchedule.open"
              type="time"
              class="time-input"
            >
            <span class="time-sep">—</span>
            <input
              v-model="daySchedule.close"
              type="time"
              class="time-input"
            >
          </div>
          <label class="closed-toggle">
            <input
              v-model="daySchedule.closed"
              type="checkbox"
              class="toggle-checkbox"
            >
            <span class="toggle-label">Closed</span>
          </label>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button
        type="button"
        class="btn btn--primary"
        @click="save"
      >
        Save
      </button>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  max-width: 600px;
  padding: 24px 32px;
}

.header-row {
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #2a2933;
}

.hours-card {
  overflow: hidden;
  border: 1px solid #d9d9db;
  border-radius: 10px;
}

.day-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.15s;
}

.day-row:last-child {
  border-bottom: none;
}

.day-row--closed {
  background: #fafafa;
}

.day-name {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #2a2933;
}

.day-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.time-fields {
  display: flex;
  gap: 8px;
  align-items: center;
}

.time-input {
  padding: 6px 10px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #2a2933;
  outline: none;
  background: #ffffff;
  border: 1px solid #d9d9db;
  border-radius: 6px;
  transition: border-color 0.15s;
}

.time-input:focus {
  border-color: #5749f4;
}

.time-sep {
  color: #939399;
}

.closed-toggle {
  display: flex;
  gap: 6px;
  align-items: center;
  cursor: pointer;
}

.toggle-checkbox {
  width: 14px;
  height: 14px;
  accent-color: #5749f4;
  cursor: pointer;
}

.toggle-label {
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #939399;
}

.form-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 10px 24px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 999px;
  transition: background 0.15s;
}

.btn--primary {
  color: #ffffff;
  background: #5749f4;
}

.btn--primary:hover {
  background: #4639d4;
}
</style>
