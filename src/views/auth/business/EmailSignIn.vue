<script
  setup
  lang="ts"
>
import { ArrowLeft, Building2, Eye, EyeOff } from '@lucide/vue';
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
const activeTab = computed(() => (route.query.tab as string) || 'signin');

const email = ref('admin@yourgarage.uz');
const password = ref('password123');
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const tabs = [
  { label: 'Sign in', value: 'signin' },
  { label: 'Create workspace', value: 'signup' },
];

function switchTab(tab: string) {
  if (tab === 'signup') {
    router.push({ name: 'business-auth-signup', query: { tab: 'signup' } });
  }
}

function goBack() {
  router.push({ name: 'business-auth' });
}

async function signIn() {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const result = await businessAuth.signIn({
      email: email.value,
      password: password.value,
    });
    localStorage.setItem('token', result.token);
    router.push(
      result.user.isOnboarded
        ? { name: 'biz-dashboard-overview' }
        : { name: 'business-onboarding-step1' },
    );
  } catch {
    errorMessage.value = 'Invalid email or password.';
  } finally {
    isLoading.value = false;
  }
}

function goToForgotPassword() {
  router.push({
    name: 'business-auth-forgot',
    query: { email: email.value },
  });
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
      width="460px"
      padding="36px"
      gap="22px"
    >
      <BackButton @click="goBack" />

      <TabSwitcher
        :tabs="tabs"
        :active-tab="activeTab"
        @switch="switchTab"
      />

      <div class="header-text">
        <h1 class="title">Welcome back, admin</h1>
        <p class="subtitle">Sign in to manage your team and bookings</p>
      </div>

      <div class="field-group">
        <label class="field-label">Work email</label>
        <input
          v-model="email"
          class="field-input"
          type="email"
          placeholder="admin@yourgarage.uz"
        >
      </div>

      <div class="field-group">
        <label class="field-label">Password</label>
        <div class="password-wrapper">
          <input
            v-model="password"
            class="field-input"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
          >
          <button
            class="toggle-password"
            type="button"
            @click="showPassword = !showPassword"
          >
            <Eye
              v-if="!showPassword"
              :size="16"
              color="var(--muted-foreground)"
            />
            <EyeOff
              v-else
              :size="16"
              color="var(--muted-foreground)"
            />
          </button>
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="error-text"
      >
        {{ errorMessage }}
      </div>

      <button
        class="btn btn-primary"
        type="button"
        :disabled="isLoading"
        @click="signIn"
      >
        {{ isLoading ? 'Signing in...' : 'Sign in' }}
      </button>

      <div class="forgot-row">
        <span class="forgot-text">Forgot password?</span>
        <button
          class="forgot-link"
          type="button"
          @click="goToForgotPassword"
        >
          Go to Reset Password
        </button>
      </div>
    </AuthCard>
  </AuthPageLayout>
</template>

<style scoped>
.header-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  text-align: center;
}

.title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--foreground);
}

.subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--muted-foreground);
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

.field-input::placeholder {
  color: var(--muted-icon);
}

.password-wrapper {
  position: relative;
  width: 100%;
}

.password-wrapper .field-input {
  padding-right: 48px;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 20px;
  display: flex;
  padding: 0;
  cursor: pointer;
  background: none;
  border: none;
  transform: translateY(-50%);
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
  color: var(--primary-foreground);
  background: var(--primary);
}

.forgot-row {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
}

.forgot-text {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.forgot-link {
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--primary);
  cursor: pointer;
  background: none;
  border: none;
}

.error-text {
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--destructive);
  text-align: center;
}
</style>
