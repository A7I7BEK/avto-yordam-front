<script
  setup
  lang="ts"
>
import { ArrowLeft, Building2, Check } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthBrand from '@/components/auth/AuthBrand.vue';
import AuthCard from '@/components/auth/AuthCard.vue';
import AuthPageLayout from '@/components/auth/AuthPageLayout.vue';
import BackButton from '@/components/auth/BackButton.vue';
import TabSwitcher from '@/components/auth/TabSwitcher.vue';
import { businessAuth } from '@/services/auth/businessAuthService';

const router = useRouter();
const route = useRoute();
const activeTab = computed(() => (route.query.tab as string) || 'signup');

const orgName = ref('');
const adminEmail = ref('admin@yourgarage.uz');
const password = ref('');
const confirmPassword = ref('');
const agreedToTerms = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const tabs = [
  { label: 'Sign in', value: 'signin' },
  { label: 'Create workspace', value: 'signup' },
];

const canSubmit = computed(
  () =>
    orgName.value.trim() &&
    adminEmail.value.trim() &&
    password.value.length >= 8 &&
    confirmPassword.value.length >= 8 &&
    password.value === confirmPassword.value &&
    agreedToTerms.value,
);

function switchTab(tab: string) {
  if (tab === 'signin') {
    router.push({ name: 'business-auth-signin', query: { tab: 'signin' } });
  }
}

function goBack() {
  router.push({ name: 'business-auth' });
}

async function signUp() {
  if (!canSubmit.value) {
    return;
  }
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const result = await businessAuth.signUp({
      orgName: orgName.value,
      adminEmail: adminEmail.value,
      password: password.value,
    });
    localStorage.setItem('token', result.token);
    router.push({ name: 'business-onboarding-step1' });
  } catch {
    errorMessage.value = 'Registration failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <AuthPageLayout>
    <AuthBrand
      :icon="Building2"
      icon-bg="#2A2933"
      label="Business"
    />

    <AuthCard
      width="480px"
      padding="32px"
      gap="16px"
    >
      <div class="top-row">
        <BackButton @click="goBack" />
      </div>

      <TabSwitcher
        :tabs="tabs"
        :active-tab="activeTab"
        @switch="switchTab"
      />

      <div class="header-text">
        <h1 class="title">Set up your shop</h1>
        <p class="subtitle">
          Create your workspace and invite your team in minutes
        </p>
      </div>

      <div class="field-group">
        <label class="field-label">Organization name</label>
        <input
          v-model="orgName"
          class="field-input"
          type="text"
          placeholder="e.g. AutoMaster Garage"
        >
      </div>

      <div class="field-group">
        <label class="field-label">Admin email</label>
        <input
          v-model="adminEmail"
          class="field-input"
          type="email"
          placeholder="admin@yourgarage.uz"
        >
      </div>

      <div class="field-group">
        <label class="field-label">Password</label>
        <input
          v-model="password"
          class="field-input"
          type="password"
          placeholder="At least 8 characters"
        >
      </div>

      <div class="field-group">
        <label class="field-label">Confirm password</label>
        <input
          v-model="confirmPassword"
          class="field-input"
          type="password"
          placeholder="Repeat your password"
        >
      </div>

      <label class="checkbox-row">
        <div class="checkbox-custom">
          <input
            v-model="agreedToTerms"
            type="checkbox"
            class="checkbox-hidden"
          >
          <div
            class="checkbox-box"
            :class="{ checked: agreedToTerms }"
          >
            <Check
              v-if="agreedToTerms"
              :size="12"
              color="#FFFFFF"
            />
          </div>
        </div>
        <span class="checkbox-label">
          I agree to the Business Terms and Data Processing Agreement
        </span>
      </label>

      <div
        v-if="errorMessage"
        class="error-text"
      >
        {{ errorMessage }}
      </div>

      <button
        class="btn btn-primary"
        type="button"
        :disabled="!canSubmit || isLoading"
        @click="signUp"
      >
        {{ isLoading ? 'Creating...' : 'Create workspace' }}
      </button>
    </AuthCard>
  </AuthPageLayout>
</template>

<style scoped>
.top-row {
  display: flex;
  width: 100%;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  text-align: center;
}

.title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #2a2933;
}

.subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  color: #616167;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.field-label {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #2a2933;
}

.field-input {
  box-sizing: border-box;
  width: 100%;
  padding: 18px 24px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #2a2933;
  outline: none;
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.field-input::placeholder {
  color: #939399;
}

.checkbox-row {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  cursor: pointer;
}

.checkbox-custom {
  flex-shrink: 0;
}

.checkbox-hidden {
  display: none;
}

.checkbox-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 6px;
  transition: background 0.15s;
}

.checkbox-box.checked {
  background: #5749f4;
  border-color: #5749f4;
}

.checkbox-label {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #2a2933;
}

.btn {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 16px 24px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 999px;
  transition: opacity 0.15s;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-primary {
  color: #ffffff;
  background: #5749f4;
}

.error-text {
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #cc3314;
  text-align: center;
}
</style>
