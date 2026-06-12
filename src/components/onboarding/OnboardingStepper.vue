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
          color="#FFFFFF"
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
          color="#FFFFFF"
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
  color: #ffffff;
  background: #5749f4;
  border: none;
}

.step-item:not(.active):not(.completed) .step-circle {
  font-weight: 500;
  color: #616167;
  background: transparent;
  border: 1px solid #c5c5cb;
}

.step-label {
  font-family: Inter, sans-serif;
  font-size: 13px;
  white-space: nowrap;
}

.step-item.active .step-label {
  font-weight: 600;
  color: #2a2933;
}

.step-item.completed .step-label,
.step-item:not(.active):not(.completed) .step-label {
  font-weight: 500;
  color: #616167;
}

.step-line {
  flex: 1;
  min-width: 40px;
  height: 1px;
  background: #c5c5cb;
}
</style>
