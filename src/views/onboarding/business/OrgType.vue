<script
  setup
  lang="ts"
>
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  UserRound,
} from 'lucide-vue-next';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ProgressBar from '@/components/onboarding/ProgressBar.vue';
import { useBusinessOnboardingStore } from '@/stores/onboarding';
import type { OrganizationType } from '@/types/onboarding';

const router = useRouter();
const store = useBusinessOnboardingStore();

const selectedType = ref<OrganizationType>(store.data.organizationType);

const orgTypes = [
  {
    value: 'MCHJ' as OrganizationType,
    title: 'Limited Liability Company',
    badge: 'MCHJ',
    description:
      'MChJ is the most common form for small and mid-size service businesses. Founders share liability up to capital contribution.',
    icon: Building2,
    iconBg: '#C9D6F0',
    iconColor: '#001133',
    badgeBg: '#C9D6F0',
    badgeColor: '#001133',
  },
  {
    value: 'YTT' as OrganizationType,
    title: 'Individual Entrepreneur',
    badge: 'YTT',
    description:
      'YTT (Yakka Tartibdagi Tadbirkor) — a sole-trader format with simplified tax and direct personal liability.',
    icon: Briefcase,
    iconBg: '#FFD9B2',
    iconColor: '#4D2700',
    badgeBg: '#FFD9B2',
    badgeColor: '#4D2700',
  },
  {
    value: 'SELF_EMPLOYED' as OrganizationType,
    title: 'Solo Master',
    badge: 'Self Employed',
    description:
      'For one-person setups working without a formal company. Lowest paperwork, fastest start.',
    icon: UserRound,
    iconBg: '#A1E5A1',
    iconColor: '#003300',
    badgeBg: '#A1E5A1',
    badgeColor: '#003300',
  },
];

function selectType(value: OrganizationType) {
  selectedType.value = value;
  store.updateOrganizationType(value);
}

function goBack() {
  router.push({ name: 'business-auth' });
}

function goNext() {
  store.updateOrganizationType(selectedType.value);
  router.push({ name: 'business-onboarding-step2' });
}
</script>

<template>
  <div class="onboarding-page">
    <!-- Header -->
    <div class="header-row">
      <div class="brand-header">
        <div class="brand-icon-box">
          <Building2
            :size="20"
            color="#FFFFFF"
          />
        </div>
        <span class="brand-text">Business</span>
      </div>
      <span class="step-label">Organization · Step 1 of 2</span>
    </div>

    <ProgressBar
      :current-step="1"
      :total-steps="2"
    />

    <!-- Body -->
    <div class="body-section">
      <div class="title-section">
        <h1 class="page-title">Choose your organization type</h1>
        <p class="page-subtitle">
          Pick the legal structure that matches how your business is registered.
        </p>
      </div>

      <div class="cards-row">
        <div
          v-for="org in orgTypes"
          :key="org.value"
          class="org-card"
          :class="{ selected: selectedType === org.value }"
          role="button"
          tabindex="0"
          @click="selectType(org.value)"
          @keydown.enter="selectType(org.value)"
        >
          <div class="card-top-row">
            <div
              class="org-icon-box"
              :style="{
                background: org.iconBg,
              }"
            >
              <component
                :is="org.icon"
                :size="24"
                :color="org.iconColor"
              />
            </div>
            <span
              class="org-badge"
              :style="{
                background: org.badgeBg,
                color: org.badgeColor,
              }"
            >
              {{ org.badge }}
            </span>
          </div>

          <h3 class="org-title">{{ org.title }}</h3>
          <p class="org-desc">{{ org.description }}</p>

          <div
            v-if="selectedType === org.value"
            class="cta-selected"
          >
            <Check :size="16" />
            Selected
          </div>
          <div
            v-else
            class="cta-select"
          >
            Select
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-row">
      <button
        class="btn btn-back"
        type="button"
        @click="goBack"
      >
        <ArrowLeft :size="14" />
        Back
      </button>
      <button
        class="btn btn-next"
        type="button"
        @click="goNext"
      >
        Continue
        <ArrowRight :size="14" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.onboarding-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  min-height: 100vh;
  padding: 40px 80px;
  background: #ffffff;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.brand-header {
  display: flex;
  gap: 10px;
  align-items: center;
}

.brand-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #2a2933;
  border-radius: 10px;
}

.brand-text {
  font-family: Inter, sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #2a2933;
}

.step-label {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #616167;
}

.body-section {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 36px;
  align-items: center;
  justify-content: center;
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: #2a2933;
}

.page-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: #616167;
}

.cards-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.org-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 340px;
  max-width: 100%;
  padding: 28px;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 40px;
  transition: border-color 0.15s;
}

.org-card.selected {
  border: 2px solid #5749f4;
}

.card-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.org-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 24px;
}

.org-badge {
  padding: 8px 12px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  border-radius: 999px;
}

.org-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #2a2933;
}

.org-desc {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  color: #616167;
}

.cta-selected {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background: #5749f4;
  border-radius: 999px;
}

.cta-select {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #2a2933;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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
  background: #d9d9db;
}

.btn-next {
  color: #ffffff;
  background: #5749f4;
}
</style>
