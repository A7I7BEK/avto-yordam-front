<script
  setup
  lang="ts"
>
import type { Component } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

defineProps<{
  to: RouteLocationRaw;
  icon: Component;
  label: string;
  badge?: number;
  isActive?: boolean;
}>();
</script>

<template>
  <router-link
    :to="to"
    class="nav-item"
    :class="{ active: isActive }"
  >
    <component
      :is="icon"
      :size="18"
    />
    <span class="label">{{ label }}</span>
    <span
      v-if="badge !== undefined && badge > 0"
      class="badge"
    >
      {{ badge }}
    </span>
  </router-link>
</template>

<style scoped>
.nav-item {
  display: flex;
  gap: 12px;
  align-items: center;
  height: 40px;
  padding: 10px 12px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #939399;
  text-decoration: none;
  cursor: pointer;
  border-radius: 10px;
  transition:
    background 0.15s,
    color 0.15s;
}

.nav-item:hover {
  color: #2a2933;
  background: rgba(245, 245, 245, 0.5);
}

.nav-item.active {
  color: #2a2933;
  background: #f5f5f5;
}

.label {
  flex: 1;
}

.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
  background: #5749f4;
  border-radius: 999px;
}
</style>
