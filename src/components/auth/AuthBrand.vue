<script
  setup
  lang="ts"
>
import type { Component } from 'vue';

defineProps<{
  icon: Component;
  iconBg: string;
  label: string;
}>();
</script>

<template>
  <div class="auth-brand">
    <div
      class="brand-icon"
      :style="{ background: iconBg }"
    >
      <component
        :is="icon"
        :size="20"
        color="#FFFFFF"
      />
    </div>
    <span class="brand-label">{{ label }}</span>
  </div>
</template>

<style scoped>
.auth-brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
}

.brand-label {
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #2a2933;
}
</style>
