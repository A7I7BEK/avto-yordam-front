<script
  setup
  lang="ts"
>
import { ArrowLeft, ArrowRight, Building2, ShieldAlert } from '@lucide/vue';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import ProgressBar from '@/components/onboarding/ProgressBar.vue';
import { useBusinessOnboardingStore } from '@/stores/onboarding';

const router = useRouter();
const store = useBusinessOnboardingStore();

const form = reactive({
  accountHolder: store.data.accountHolder,
  bank: store.data.bank,
  mfo: store.data.mfo,
  inn: store.data.inn,
  accountNumber: store.data.accountNumber,
});

function goBack() {
  router.push({ name: 'business-onboarding-step1' });
}

function goNext() {
  store.updateBankData({
    accountHolder: form.accountHolder,
    bank: form.bank,
    mfo: form.mfo,
    inn: form.inn,
    accountNumber: form.accountNumber,
  });
  // Navigate to business dashboard after onboarding
  router.push({ name: 'biz-dashboard-overview' });
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
            color="var(--background)"
          />
        </div>
        <span class="brand-text">Business</span>
      </div>
      <span class="step-label">Organization · Step 2 of 2</span>
    </div>

    <ProgressBar
      :current-step="2"
      :total-steps="2"
    />

    <!-- Title -->
    <div class="title-section">
      <h1 class="page-title">Bank account</h1>
      <p class="page-subtitle">
        Where online payments will be deposited. Funds settle T+2 to this
        account.
      </p>
    </div>

    <!-- Warning Notice -->
    <div class="warning-notice">
      <ShieldAlert
        :size="16"
        color="var(--color-warning-foreground)"
      />
      <div class="warning-text">
        <span class="warning-bold">Account holder must match legal entity</span>
        <span class="warning-regular"
          >The bank account must be in the same legal name as your
          organization's tax registration.</span
        >
      </div>
    </div>

    <!-- Bank Card -->
    <div class="bank-card">
      <!-- Account Holder -->
      <div class="field-group">
        <label class="field-label">Account holder (legal name)</label>
        <input
          v-model="form.accountHolder"
          class="field-input"
          type="text"
        >
      </div>

      <!-- Bank -->
      <div class="field-group">
        <label class="field-label">Bank</label>
        <input
          v-model="form.bank"
          class="field-input"
          type="text"
        >
      </div>

      <!-- MFO + INN -->
      <div class="field-row">
        <div class="field-group">
          <label class="field-label">MFO (bank code)</label>
          <input
            v-model="form.mfo"
            class="field-input"
            type="text"
          >
        </div>
        <div class="field-group">
          <label class="field-label">INN (tax ID)</label>
          <input
            v-model="form.inn"
            class="field-input"
            type="text"
          >
        </div>
      </div>

      <!-- Account Number -->
      <div class="field-group">
        <label class="field-label">Account number</label>
        <input
          v-model="form.accountNumber"
          class="field-input"
          type="text"
        >
      </div>

      <!-- Currency (Read-only) -->
      <div class="currency-row">
        <span class="currency-label">Currency</span>
        <div class="currency-chip">UZS</div>
        <span class="currency-hint">· Only UZS settlement is supported.</span>
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
  gap: 24px;
  width: 100%;
  max-width: 1440px;
  min-height: 100vh;
  padding: 40px 80px;
  margin: 0 auto;
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

.brand-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--foreground);
  border-radius: 10px;
}

.brand-text {
  font-family: Inter, sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: var(--foreground);
}

.step-label {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: var(--foreground);
}

.page-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.warning-notice {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 14px;
  background: var(--color-warning);
  border: 1px solid var(--color-warning-foreground);
  border-radius: 24px;
}

.warning-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.warning-bold {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-warning-foreground);
}

.warning-regular {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--color-warning-foreground);
}

.bank-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 32px;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 40px;
  box-shadow: 0 10px 8.75px rgba(0, 0, 0, 0.039);
}

.field-group {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.field-input {
  box-sizing: border-box;
  width: 100%;
  padding: 18px 24px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--foreground);
  outline: none;
  background: var(--muted);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
}

.field-row {
  display: flex;
  gap: 16px;
  width: 100%;
}

.currency-row {
  display: flex;
  gap: 8px;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid var(--border-soft);
}

.currency-label {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: var(--muted-foreground);
}

.currency-chip {
  padding: 4px 10px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: var(--foreground);
  background: var(--muted);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
}

.currency-hint {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-style: italic;
  color: var(--muted-foreground);
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
