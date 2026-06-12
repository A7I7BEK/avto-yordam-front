<script
  setup
  lang="ts"
>
import { TrendingUp } from 'lucide-vue-next';
import type { Component } from 'vue';

defineProps<{
  label: string;
  value: string;
  trend: string;
  icon: Component;
  iconBg: string;
  iconColor: string;
}>();
</script>

<template>
  <div class="kpi-card">
    <div class="kpi-top">
      <span class="kpi-label">{{ label }}</span>
      <div
        class="kpi-icon"
        :style="{ background: iconBg }"
      >
        <component
          :is="icon"
          :size="16"
          :color="iconColor"
        />
      </div>
    </div>
    <span class="kpi-value">{{ value }}</span>
    <div class="kpi-trend">
      <div class="trend-badge">
        <TrendingUp
          :size="11"
          color="#1F8F3D"
        />
        <span>{{ trend }}</span>
      </div>
      <span class="trend-label">vs last month</span>
    </div>
  </div>
</template>

<style scoped>
.kpi-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 16px;
}

.kpi-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kpi-label {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #616167;
}

.kpi-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
}

.kpi-value {
  font-family: Inter, sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: #2a2933;
}

.kpi-trend {
  display: flex;
  gap: 6px;
  align-items: center;
}

.trend-badge {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 3px 8px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #1f8f3d;
  background: rgba(161, 229, 161, 0.2);
  border-radius: 999px;
}

.trend-label {
  font-family: Inter, sans-serif;
  font-size: 11px;
  color: #616167;
}
</style>
