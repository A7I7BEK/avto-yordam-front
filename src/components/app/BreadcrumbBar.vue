<script
  setup
  lang="ts"
>
import { ChevronRight } from 'lucide-vue-next';

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
        color="#616167"
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
  color: #616167;
}

.crumb.active {
  font-weight: 500;
  color: #2a2933;
}
</style>
