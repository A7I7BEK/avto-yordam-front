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
} from '@lucide/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import logoUrl from '@/assets/logo/avto-yordam-logo.png';
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
    iconBg: 'var(--color-info)',
    iconColor: 'var(--color-info-foreground)',
    badgeBg: 'var(--color-info)',
    badgeColor: 'var(--color-info-foreground)',
  },
  {
    value: 'YATT' as OrganizationType,
    title: 'Individual Entrepreneur',
    badge: 'YTT',
    description:
      'YTT (Yakka Tartibdagi Tadbirkor) — a sole-trader format with simplified tax and direct personal liability.',
    icon: Briefcase,
    iconBg: 'var(--color-warning)',
    iconColor: 'var(--color-warning-foreground)',
    badgeBg: 'var(--color-warning)',
    badgeColor: 'var(--color-warning-foreground)',
  },
  {
    value: 'SELF_EMPLOYED' as OrganizationType,
    title: 'Solo Master',
    badge: 'Self Employed',
    description:
      'For one-person setups working without a formal company. Lowest paperwork, fastest start.',
    icon: UserRound,
    iconBg: 'var(--color-success)',
    iconColor: 'var(--color-success-foreground)',
    badgeBg: 'var(--color-success)',
    badgeColor: 'var(--color-success-foreground)',
  },
];

function selectType(value: OrganizationType) {
  selectedType.value = value;
  store.updateOrganizationType(value);
}

function goBack() {
  router.push({ name: 'auth-register' });
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
        <img
          class="brand-logo"
          :src="logoUrl"
          alt="Avto Yordam logo"
        >
        <div class="brand-text">
          <span class="brand-name">Avto Yordam</span>
          <span class="brand-caption">Business</span>
        </div>
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
  background: var(--background);
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

.brand-logo {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: 9px;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.brand-name {
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.15;
  color: var(--foreground);
}

.brand-caption {
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.step-label {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--muted-foreground);
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
  color: var(--foreground);
}

.page-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: var(--muted-foreground);
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
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 40px;
  transition: border-color 0.15s;
}

.org-card.selected {
  border: 2px solid var(--primary);
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
  color: var(--foreground);
}

.org-desc {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--muted-foreground);
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
  color: var(--primary-foreground);
  background: var(--primary);
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
  color: var(--foreground);
  border: 1px solid var(--border-soft);
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
  color: var(--foreground);
  background: var(--border);
}

.btn-next {
  color: var(--primary-foreground);
  background: var(--primary);
}
</style>
