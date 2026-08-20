<script
  setup
  lang="ts"
>
import { ArrowRight, Check, UserRound } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthBrand from '@/components/auth/AuthBrand.vue';
import OnboardingStepper from '@/components/onboarding/OnboardingStepper.vue';
import {
  addUserLanguage,
  getAllLanguages,
  getAllMasterSpecializations,
  getUserProfile,
  saveMasterInfo,
} from '@/services/userService';
import { useProfessionalOnboardingStore } from '@/stores/onboarding';
import type {
  LanguageResponse,
  MasterSpecializationResponse,
} from '@/types/user';

const router = useRouter();
const store = useProfessionalOnboardingStore();

const specializations = ref<MasterSpecializationResponse[]>([]);
const loadingSpecializations = ref(true);
const selectedSpecializationId = ref(store.professionalInfo.specializationId);

const languages = ref<LanguageResponse[]>([]);
const loadingLanguages = ref(true);
const selectedLanguageIds = ref<string[]>([
  ...store.professionalInfo.languages,
]);

const selectedCount = computed(() => (selectedSpecializationId.value ? 1 : 0));
const selectedLanguagesCount = computed(() => selectedLanguageIds.value.length);

onMounted(async () => {
  try {
    const [specs, allLanguages] = await Promise.all([
      getAllMasterSpecializations(),
      getAllLanguages(),
    ]);
    specializations.value = specs;
    languages.value = allLanguages;
    if (!specs.some((s) => s.id === selectedSpecializationId.value)) {
      selectedSpecializationId.value = '';
    }
  } finally {
    loadingSpecializations.value = false;
    loadingLanguages.value = false;
  }

  try {
    // Prefill the languages the user already has on their profile
    const user = await getUserProfile();
    const userLanguageIds = (user.languages ?? [])
      .map((lang) => lang.id)
      .filter((id): id is string => Boolean(id));
    if (userLanguageIds.length > 0) {
      selectedLanguageIds.value = userLanguageIds;
    }
  } catch {
    // Keep the store values when the profile cannot be loaded
  }
});

function toggleSpecialization(spec: MasterSpecializationResponse) {
  selectedSpecializationId.value =
    selectedSpecializationId.value === spec.id ? '' : spec.id;
}

function toggleLanguage(lang: LanguageResponse) {
  const idx = selectedLanguageIds.value.indexOf(lang.id);
  if (idx >= 0) {
    selectedLanguageIds.value.splice(idx, 1);
  } else {
    selectedLanguageIds.value.push(lang.id);
  }
}

function calcYearsToDate(years: number): string | null {
  if (!years || years < 1) {
    return null;
  }
  const now = new Date();
  const start = new Date(
    now.getFullYear() - years,
    now.getMonth(),
    now.getDate(),
  );
  return start.toISOString().split('T')[0] ?? null;
}

function goBack() {
  router.push({ name: 'professional-onboarding-step1' });
}

async function goNext() {
  store.updateProfessionalInfo({
    specializationId: selectedSpecializationId.value,
    languages: selectedLanguageIds.value,
  });

  try {
    await saveMasterInfo({
      experienceStartDate: calcYearsToDate(
        store.personalInfo.yearsOfExperience,
      ),
      description: '',
      specializationId: selectedSpecializationId.value,
      workingTimeStart: null,
      workingTimeEnd: null,
    });
  } catch {
    // Continue to the dashboard even if the API call fails
  }

  // Persist newly selected languages (already-present ones are skipped)
  try {
    const user = await getUserProfile();
    const currentIds = new Set((user.languages ?? []).map((l) => l.id));
    const toAdd = selectedLanguageIds.value.filter((id) => !currentIds.has(id));
    await Promise.all(toAdd.map((id) => addUserLanguage(id)));
  } catch {
    // Language persistence failure should not block onboarding
  }

  // Navigate to dashboard after onboarding
  router.push({ name: 'pro-dashboard' });
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
      <div class="section">
        <div class="section-header">
          <span class="section-label">Specialization</span>
          <span class="section-counter">{{ selectedCount }} selected</span>
        </div>
        <p class="section-hint">
          Choose your primary specialization. You can adjust it later from your
          profile settings.
        </p>
        <div
          v-if="loadingSpecializations"
          class="chips-loading"
        >
          Loading specializations…
        </div>
        <div
          v-else
          class="chips-grid"
        >
          <button
            v-for="spec in specializations"
            :key="spec.id"
            class="chip"
            :class="{ selected: selectedSpecializationId === spec.id }"
            type="button"
            @click="toggleSpecialization(spec)"
          >
            <Check
              v-if="selectedSpecializationId === spec.id"
              :size="12"
              color="#FFFFFF"
            />
            {{ spec.name }}
          </button>
        </div>
      </div>

      <!-- Languages -->
      <div class="section">
        <div class="section-header">
          <span class="section-label">Languages</span>
          <span class="section-counter"
            >{{ selectedLanguagesCount }}
            selected</span
          >
        </div>
        <p class="section-hint">
          Select the languages you speak. Shown to customers on your public
          profile.
        </p>
        <div
          v-if="loadingLanguages"
          class="chips-loading"
        >
          Loading languages…
        </div>
        <div
          v-else
          class="chips-grid"
        >
          <button
            v-for="lang in languages"
            :key="lang.id"
            class="chip"
            :class="{ selected: selectedLanguageIds.includes(lang.id) }"
            type="button"
            @click="toggleLanguage(lang)"
          >
            <Check
              v-if="selectedLanguageIds.includes(lang.id)"
              :size="12"
              color="#FFFFFF"
            />
            {{ lang.name }}
          </button>
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

.chips-loading {
  margin-top: 8px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #616167;
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
