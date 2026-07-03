<script
  setup
  lang="ts"
>
import { ChevronDown, Eye, EyeOff, UserRound } from '@lucide/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthBrand from '@/components/auth/AuthBrand.vue';
import AuthCard from '@/components/auth/AuthCard.vue';
import AuthPageLayout from '@/components/auth/AuthPageLayout.vue';
import TabSwitcher from '@/components/auth/TabSwitcher.vue';
import { professionalAuth } from '@/services/auth/professionalAuthService';

const router = useRouter();

const contactMethod = ref<'email' | 'phone'>('email');
const email = ref('');
const phoneNumber = ref('');
const countryCode = ref('+998');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const stubMessage = ref('');

const contactTabs = [
  { label: 'Email', value: 'email' },
  { label: 'Tel. number', value: 'phone' },
];

const brandIcon = UserRound;
const brandIconBg = '#5749F4';
const brandLabel = 'Professional';

function goToRegister() {
  router.push({ name: 'auth-register' });
}

function goToForgotPassword() {
  const queryEmail = contactMethod.value === 'email' ? email.value : '';
  router.push({
    name: 'auth-forgot-password',
    query: queryEmail ? { email: queryEmail } : {},
  });
}

function handleGoogleLogin() {
  stubMessage.value = 'Google login coming soon';
}

function handleAppleLogin() {
  stubMessage.value = 'Apple login coming soon';
}

async function signIn() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    let result: { token: string; user: { type?: string; isOnboarded: boolean } };

    if (contactMethod.value === 'email') {
      result = await professionalAuth.signIn({
        email: email.value,
        password: password.value,
      });
    } else {
      const fullPhone = `${countryCode.value} ${phoneNumber.value}`;
      result = await professionalAuth.signInWithPhone({
        phone: fullPhone,
        password: password.value,
      });
    }

    localStorage.setItem('token', result.token);
    const userType = String(result.user?.type || '').toUpperCase();
    if (userType === 'ORGANIZATION' || userType === 'ORGANIZATION_ADMIN') {
      router.push({ name: 'biz-dashboard-overview' });
    } else {
      router.push({ name: 'pro-dashboard' });
    }
  } catch {
    errorMessage.value = 'Invalid credentials. Please try again.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <AuthPageLayout>
    <AuthBrand
      :icon="brandIcon"
      :icon-bg="brandIconBg"
      :label="brandLabel"
    />

    <AuthCard
      width="460px"
      padding="36px"
      gap="22px"
    >
      <div
        v-if="stubMessage"
        class="stub-message"
      >
        {{ stubMessage }}
      </div>

      <div class="header-text">
        <h1 class="title">Welcome back</h1>
        <p class="subtitle">Your craft, your hours — start earning today</p>
      </div>

      <TabSwitcher
        :tabs="contactTabs"
        :active-tab="contactMethod"
        @switch="(v: string) => contactMethod = v as 'email' | 'phone'"
      />

      <!-- Email input -->
      <div
        v-if="contactMethod === 'email'"
        class="field-group"
      >
        <label class="field-label">Email</label>
        <input
          v-model="email"
          class="field-input"
          type="email"
          placeholder="aziz.karimov@masters.uz"
        >
      </div>

      <!-- Phone input -->
      <div
        v-else
        class="field-group"
      >
        <label class="field-label">Phone number</label>
        <div class="phone-input-row">
          <div class="country-code">
            <span>{{ countryCode }}</span>
            <ChevronDown
              :size="14"
              color="#616167"
            />
          </div>
          <input
            v-model="phoneNumber"
            class="phone-input"
            type="tel"
            placeholder="90 555 12 34"
          >
        </div>
      </div>

      <!-- Password -->
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
              color="#616167"
            />
            <EyeOff
              v-else
              :size="16"
              color="#616167"
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
        <button
          class="forgot-link"
          type="button"
          @click="goToForgotPassword"
        >
          Forgot password?
        </button>
      </div>

      <div class="or-divider">
        <div class="line" />
        <span>or</span>
        <div class="line" />
      </div>

      <div class="social-row">
        <button
          class="btn btn-social"
          type="button"
          @click="handleGoogleLogin"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </button>
        <button
          class="btn btn-social"
          type="button"
          @click="handleAppleLogin"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.61 6.24.52 7.44-.62 1.64-1.42 3.26-2.57 4.77zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
              fill="#2A2933"
            />
          </svg>
          Apple
        </button>
      </div>

      <div class="switch-row">
        <span class="switch-text">Don't have an account?</span>
        <button
          class="switch-link"
          type="button"
          @click="goToRegister"
        >
          Register
        </button>
      </div>
    </AuthCard>
  </AuthPageLayout>
</template>

<style scoped>
.header-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  text-align: center;
}

.title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #2a2933;
}

.subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
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

.field-input:focus {
  border-color: #5749f4;
  box-shadow: 0 0 0 3px rgba(87, 73, 244, 0.12);
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper .field-input {
  padding-right: 48px;
}

.toggle-password {
  position: absolute;
  right: 18px;
  display: flex;
  padding: 0;
  cursor: pointer;
  background: none;
  border: none;
}

.phone-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.country-code {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 18px 16px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #2a2933;
  white-space: nowrap;
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.phone-input {
  flex: 1;
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

.phone-input::placeholder {
  color: #939399;
}

.phone-input:focus {
  border-color: #5749f4;
  box-shadow: 0 0 0 3px rgba(87, 73, 244, 0.12);
}

.error-text {
  width: 100%;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #cc3314;
  text-align: center;
  background: #ffbfb2;
  border-radius: 12px;
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

.btn:hover {
  opacity: 0.9;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-primary {
  color: #ffffff;
  background: #5749f4;
}

.forgot-row {
  display: flex;
  justify-content: center;
  width: 100%;
}

.forgot-link {
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #5749f4;
  cursor: pointer;
  background: none;
  border: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.or-divider {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
}

.or-divider .line {
  flex: 1;
  height: 1px;
  background: #c5c5cb;
}

.or-divider span {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #616167;
}

.social-row {
  display: flex;
  gap: 10px;
  width: 100%;
}

.btn-social {
  flex: 1;
  gap: 8px;
  padding: 14px 16px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #2a2933;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.switch-row {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
}

.switch-text {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #616167;
}

.switch-link {
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #5749f4;
  cursor: pointer;
  background: none;
  border: none;
}

.switch-link:hover {
  text-decoration: underline;
}

.stub-message {
  width: 100%;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
  text-align: center;
  background: #f5f5f5;
  border-radius: 12px;
}
</style>
