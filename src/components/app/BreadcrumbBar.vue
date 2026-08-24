<script
  setup
  lang="ts"
>
import { ChevronRight } from '@lucide/vue';

defineProps<{
  items: string[];
}>();
</script>

<template>
  <div class="breadcrumb">
    <template
      v-for="(item, idx) in items"
      :key="idx"
    >
      <span
        class="crumb"
        :class="{ active: idx === items.length - 1 }"
      >
        {{ item }}
      </span>
      <ChevronRight
        v-if="idx < items.length - 1"
        :size="14"
        color="var(--muted-foreground)"
      />
    </template>
  </div>
</template>

<style scoped>
.breadcrumb {
  display: flex;
  gap: 8px;
  align-items: center;
}

.crumb {
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--muted-foreground);
}

.crumb.active {
  font-weight: 500;
  color: var(--foreground);
}
</style>
