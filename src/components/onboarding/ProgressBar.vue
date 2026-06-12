<script
  setup
  lang="ts"
>
defineProps<{
  currentStep: number;
  totalSteps: number;
}>();
</script>

<template>
  <div class="progress-bar">
    <div
      v-for="i in totalSteps"
      :key="i"
      class="progress-segment"
      :class="{ active: i <= currentStep }"
    />
  </div>
</template>

<style scoped>
.progress-bar {
  display: flex;
  gap: 6px;
  width: 100%;
}

.progress-segment {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  transition: background 0.3s;
}

.progress-segment.active {
  background: #5749f4;
}

.progress-segment:not(.active) {
  background: #f5f5f5;
}
</style>
