<script
  setup
  lang="ts"
>
defineProps<{
  status: string;
  variant?: 'green' | 'amber' | 'grey';
}>();

const variants: Record<string, { dot: string; text: string }> = {
  green: { dot: '#25603A', text: '#25603A' },
  amber: { dot: '#B45309', text: '#B45309' },
  grey: { dot: '#616167', text: '#616167' },
};
</script>

<template>
  <div
    class="status-badge"
    :style="{
      '--dot-color': variants[variant || 'grey']?.dot || '#616167',
      '--text-color': variants[variant || 'grey']?.text || '#616167',
    }"
  >
    <span class="dot" />
    <span>{{ status }}</span>
  </div>
</template>

<style scoped>
.status-badge {
  display: flex;
  gap: 6px;
  align-items: center;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-color);
}

.dot {
  width: 6px;
  height: 6px;
  background: var(--dot-color);
  border-radius: 999px;
}
</style>
