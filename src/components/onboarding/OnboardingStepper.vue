<script
  setup
  lang="ts"
>
import { Check, UserRound } from '@lucide/vue';

defineProps<{
  currentStep: number;
}>();

const steps = ['Personal info', 'Professional info'];
</script>

<template>
  <div class="stepper">
    <!-- Step 1 -->
    <div
      class="step-item"
      :class="{
        active: currentStep === 1,
        completed: currentStep > 1,
      }"
    >
      <div class="step-circle">
        <Check
          v-if="currentStep > 1"
          :size="12"
          color="var(--primary-foreground)"
        />
        <span v-else>1</span>
      </div>
      <span class="step-label">{{ steps[0] }}</span>
    </div>

    <div class="step-line" />

    <!-- Step 2 -->
    <div
      class="step-item"
      :class="{
        active: currentStep === 2,
        completed: currentStep > 2,
      }"
    >
      <div class="step-circle">
        <Check
          v-if="currentStep > 2"
          :size="12"
          color="var(--primary-foreground)"
        />
        <span v-else>2</span>
      </div>
      <span class="step-label">{{ steps[1] }}</span>
    </div>
  </div>
</template>

<style scoped>
.stepper {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
  max-width: 920px;
}

.step-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.step-circle {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  border-radius: 999px;
}

.step-item.active .step-circle,
.step-item.completed .step-circle {
  color: var(--primary-foreground);
  background: var(--primary);
  border: none;
}

.step-item:not(.active):not(.completed) .step-circle {
  font-weight: 500;
  color: var(--muted-foreground);
  background: transparent;
  border: 1px solid var(--border-soft);
}

.step-label {
  font-family: Inter, sans-serif;
  font-size: 13px;
  white-space: nowrap;
}

.step-item.active .step-label {
  font-weight: 600;
  color: var(--foreground);
}

.step-item.completed .step-label,
.step-item:not(.active):not(.completed) .step-label {
  font-weight: 500;
  color: var(--muted-foreground);
}

.step-line {
  flex: 1;
  min-width: 40px;
  height: 1px;
  background: var(--border-soft);
}
</style>
