<script
  setup
  lang="ts"
>
import { ArrowRight, Check, ChevronDown, UserRound } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthBrand from '@/components/auth/AuthBrand.vue';
import OnboardingStepper from '@/components/onboarding/OnboardingStepper.vue';
import { useProfessionalOnboardingStore } from '@/stores/onboarding';

const router = useRouter();
const store = useProfessionalOnboardingStore();

const allSpecializations = [
  'Engine',
  'Transmission',
  'Bodywork',
  'Paint',
  'Electrical',
  'Diagnostics',
  'Tires',
  'A/C',
  'Suspension',
  'Glass',
];

const selectedSpecs = ref<string[]>([
  ...store.professionalInfo.specializations.map(
    (s) => s.charAt(0).toUpperCase() + s.slice(1),
  ),
]);

const yearsOfExperience = ref(store.professionalInfo.yearsOfExperience);
const workingFrom = ref(store.professionalInfo.workingHours.from);
const workingTo = ref(store.professionalInfo.workingHours.to);

const allDays = [
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
  { value: 'sat', label: 'Sat' },
  { value: 'sun', label: 'Sun' },
];

const selectedDays = ref<string[]>([...store.professionalInfo.workingDays]);

const selectedCount = computed(() => selectedSpecs.value.length);

function toggleSpecialization(spec: string) {
  const idx = selectedSpecs.value.indexOf(spec);
  if (idx >= 0) {
    selectedSpecs.value.splice(idx, 1);
  } else {
    selectedSpecs.value.push(spec);
  }
}

function toggleDay(day: string) {
  const idx = selectedDays.value.indexOf(day);
  if (idx >= 0) {
    selectedDays.value.splice(idx, 1);
  } else {
    selectedDays.value.push(day);
  }
}

function goBack() {
  router.push({ name: 'professional-onboarding-step1' });
}

function goNext() {
  store.updateProfessionalInfo({
    specializations: selectedSpecs.value.map((s) => s.toLowerCase()),
    yearsOfExperience: yearsOfExperience.value,
    workingHours: {
      from: workingFrom.value,
      to: workingTo.value,
    },
    workingDays: selectedDays.value,
  });
  // Navigate to dashboard after onboarding
  router.push({ name: 'home' });
}
</script>

<template>
  <div class="onboarding-page">
    <AuthBrand
      :icon="UserRound"
      icon-bg="#5749F4"
      label="Professional"
    />

    <OnboardingStepper :current-step="2" />

    <div class="onboarding-card">
      <div class="card-header-text">
        <h1 class="card-title">Your professional details</h1>
        <p class="card-subtitle">
          Shown to customers on your public profile. You can edit these any time
          later.
        </p>
      </div>

      <!-- Specialization -->
      <div class="section bordered">
        <div class="section-header">
          <span class="section-label">Specialization</span>
          <span class="section-counter">{{ selectedCount }} selected</span>
        </div>
        <p class="section-hint">
          Pick everything you confidently work on — you can always adjust later.
        </p>
        <div class="chips-grid">
          <button
            v-for="spec in allSpecializations"
            :key="spec"
            class="chip"
            :class="{ selected: selectedSpecs.includes(spec) }"
            type="button"
            @click="toggleSpecialization(spec)"
          >
            <Check
              v-if="selectedSpecs.includes(spec)"
              :size="12"
              color="#FFFFFF"
            />
            {{ spec }}
          </button>
        </div>
      </div>

      <!-- Years of Experience -->
      <div class="section bordered">
        <div class="section-header">
          <span class="section-label">Years of experience</span>
        </div>
        <p class="section-hint">
          How long have you been doing this work? Self-reported — we'll also
          track your verified time on the platform separately.
        </p>
        <div class="experience-row">
          <div class="experience-input">
            <input
              v-model.number="yearsOfExperience"
              class="exp-number"
              type="number"
              min="0"
              max="70"
            >
            <span class="exp-label">years</span>
          </div>
          <span class="exp-separator">·</span>
          <span class="exp-hint">You can edit this on your profile later.</span>
        </div>
      </div>

      <!-- Working Time -->
      <div class="section">
        <div class="section-header">
          <span class="section-label">Working time</span>
        </div>
        <p class="section-hint">
          Your default working hours. Each organization you work for can
          override these on its own schedule.
        </p>

        <div class="time-row">
          <div class="time-picker">
            <span class="time-label">FROM</span>
            <div class="time-input">
              <input
                v-model="workingFrom"
                class="time-value"
                type="time"
              >
              <ChevronDown
                :size="14"
                color="#616167"
              />
            </div>
          </div>
          <span class="time-dash">—</span>
          <div class="time-picker">
            <span class="time-label">TO</span>
            <div class="time-input">
              <input
                v-model="workingTo"
                class="time-value"
                type="time"
              >
              <ChevronDown
                :size="14"
                color="#616167"
              />
            </div>
          </div>
        </div>

        <div class="days-section">
          <span class="days-label">DAYS</span>
          <div class="days-row">
            <button
              v-for="day in allDays"
              :key="day.value"
              class="day-chip"
              :class="{ selected: selectedDays.includes(day.value) }"
              type="button"
              @click="toggleDay(day.value)"
            >
              {{ day.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer-buttons">
        <button
          class="btn btn-back"
          type="button"
          @click="goBack"
        >
          Back
        </button>
        <button
          class="btn btn-next"
          type="button"
          @click="goNext"
        >
          <span>Continue</span>
          <ArrowRight :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.onboarding-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  padding: 40px 80px;
  background: #ffffff;
}

.onboarding-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  max-width: 680px;
  padding: 32px;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 40px;
  box-shadow: 0 10px 8.75px rgba(0, 0, 0, 0.039);
}

.card-header-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #2a2933;
}

.card-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #616167;
}

.section {
  width: 100%;
}

.section.bordered {
  padding-bottom: 16px;
  border-bottom: 1px solid #c5c5cb;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-label {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #2a2933;
}

.section-counter {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-style: italic;
  color: #616167;
}

.section-hint {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  color: #616167;
}

.chips-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.chip {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #2a2933;
  cursor: pointer;
  background: transparent;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
  transition: all 0.15s;
}

.chip.selected {
  color: #ffffff;
  background: #5749f4;
  border-color: #5749f4;
}

.experience-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 8px;
}

.experience-input {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 16px;
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.exp-number {
  width: 50px;
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #2a2933;
  text-align: center;
  outline: none;
  background: transparent;
  border: none;
}

.exp-number::-webkit-inner-spin-button,
.exp-number::-webkit-outer-spin-button {
  opacity: 1;
}

.exp-label {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #616167;
}

.exp-separator {
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
}

.exp-hint {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-style: italic;
  color: #616167;
}

.time-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  margin-top: 8px;
}

.time-picker {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.time-label {
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: #616167;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.time-input {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 140px;
  padding: 10px 16px;
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.time-value {
  width: 100%;
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #2a2933;
  outline: none;
  background: transparent;
  border: none;
}

.time-dash {
  padding-bottom: 10px;
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: #616167;
}

.days-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 12px;
}

.days-label {
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: #616167;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.days-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.day-chip {
  padding: 8px 12px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #2a2933;
  cursor: pointer;
  background: transparent;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
  transition: all 0.15s;
}

.day-chip.selected {
  color: #ffffff;
  background: #5749f4;
  border-color: #5749f4;
}

.footer-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: 4px;
}

.btn {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 999px;
  transition: opacity 0.15s;
}

.btn-back {
  color: #2a2933;
  background: #f5f5f5;
}

.btn-next {
  color: #ffffff;
  background: #5749f4;
}
</style>
