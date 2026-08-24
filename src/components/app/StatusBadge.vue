<script
  setup
  lang="ts"
>
defineProps<{
  status: string;
  variant?: 'green' | 'amber' | 'grey';
}>();

const variants: Record<string, { dot: string; text: string }> = {
  green: { dot: 'var(--success)', text: 'var(--success)' },
  amber: { dot: 'var(--warning)', text: 'var(--warning)' },
  grey: { dot: 'var(--muted-foreground)', text: 'var(--muted-foreground)' },
};
</script>

<template>
  <div
    class="status-badge"
    :style="{
      '--dot-color': variants[variant || 'grey']?.dot || 'var(--muted-foreground)',
      '--text-color': variants[variant || 'grey']?.text || 'var(--muted-foreground)',
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
