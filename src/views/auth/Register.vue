<script
  setup
  lang="ts"
>
import {
  Building2,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  UserRound,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthBrand from '@/components/auth/AuthBrand.vue';
import AuthCard from '@/components/auth/AuthCard.vue';
import AuthPageLayout from '@/components/auth/AuthPageLayout.vue';
import TabSwitcher from '@/components/auth/TabSwitcher.vue';
import { businessAuth } from '@/services/auth/businessAuthService';
import { professionalAuth } from '@/services/auth/professionalAuthService';

const router = useRouter();
const route = useRoute();

const accountType = ref<'professional' | 'business'>(
  (route.query.type as 'professional' | 'business') || 'professional',
);
const contactMethod = ref<'email' | 'phone'>('email');

// Name field for both
const fullName = ref('');

// Contact fields
const email = ref('');
const phoneNumber = ref('');
const countryCode = ref('+998');

// Password fields
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const agreedToTerms = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const accountTypeTabs = [
  { label: 'Professional', value: 'professional' },
  { label: 'Business', value: 'business' },
];

const contactTabs = [
  { label: 'Email', value: 'email' },
  { label: 'Tel. number', value: 'phone' },
];

const isBusiness = computed(() => accountType.value === 'business');
const brandIcon = computed(() => (isBusiness.value ? Building2 : UserRound));
const brandIconBg = computed(() => (isBusiness.value ? '#2A2933' : '#5749F4'));
const brandLabel = computed(() =>
  isBusiness.value ? 'Business' : 'Professional',
);

const canSubmit = computed(() => {
  const nameOk = fullName.value.trim().length > 0;

  const contactOk =
    contactMethod.value === 'email'
      ? email.value.trim().length > 0
      : phoneNumber.value.trim().length > 0;

  const passwordOk =
    password.value.length >= 8 && password.value === confirmPassword.value;

  return nameOk && contactOk && passwordOk && agreedToTerms.value;
});

function goToLogin() {
  router.push({ name: 'auth-login' });
}

async function signUp() {
  if (!canSubmit.value) {
    return;
  }
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const contact =
      contactMethod.value === 'email'
        ? email.value
        : `${countryCode.value} ${phoneNumber.value}`;
    const contactType = contactMethod.value;

    let otpId: string;

    if (isBusiness.value) {
      const result = await businessAuth.registerInit({
        orgName: fullName.value,
        contact,
        contactType,
        password: password.value,
      });
      otpId = result.otpId;
    } else {
      const result = await professionalAuth.registerInit({
        fullName: fullName.value,
        contact,
        contactType,
        password: password.value,
      });
      otpId = result.otpId;
    }

    router.push({
      name: 'auth-verify',
      query: {
        contact,
        contactType,
        otpId,
        type: accountType.value,
        mode: 'register',
        onboarding: isBusiness.value
          ? 'business-onboarding-step1'
          : 'professional-onboarding-step1',
      },
    });
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
      :icon="brandIcon"
      :icon-bg="brandIconBg"
      :label="brandLabel"
    />

    <AuthCard
      width="480px"
      padding="32px"
      gap="18px"
    >
      <TabSwitcher
        :tabs="accountTypeTabs"
        :active-tab="accountType"
        @switch="(v: string) => accountType = v as 'professional' | 'business'"
      />

      <div class="header-text">
        <h1 class="title">
          {{ isBusiness ? 'Set up your shop' : 'Create your profile' }}
        </h1>
        <p class="subtitle">
          {{ isBusiness
              ? 'Create your workspace and invite your team in minutes'
              : 'Your craft, your hours — join thousands of masters earning on their terms.' }}
        </p>
      </div>

      <!-- Name field: Full name -->
      <div class="field-group">
        <label class="field-label"> Full name </label>
        <input
          v-model="fullName"
          class="field-input"
          type="text"
          placeholder="Aziz Karimov"
        >
      </div>

      <!-- Contact method selector -->
      <div class="field-group">
        <label class="field-label">Contact method</label>
        <TabSwitcher
          :tabs="contactTabs"
          :active-tab="contactMethod"
          @switch="(v: string) => contactMethod = v as 'email' | 'phone'"
        />
      </div>

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
            placeholder="At least 8 characters"
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

      <!-- Confirm password -->
      <div class="field-group">
        <label class="field-label">Confirm password</label>
        <div class="password-wrapper">
          <input
            v-model="confirmPassword"
            class="field-input"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Repeat your password"
          >
          <button
            class="toggle-password"
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <Eye
              v-if="!showConfirmPassword"
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

      <!-- Terms checkbox -->
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
          I agree to the
          <a
            href="#"
            class="terms-link"
            >Terms of Service</a
          >
          and
          <a
            href="#"
            class="terms-link"
            >Privacy Policy</a
          >
        </span>
      </label>

      <button
        class="btn btn-primary"
        type="button"
        :disabled="!canSubmit || isLoading"
        @click="signUp"
      >
        {{ isLoading ? 'Creating account...' : 'Create account' }}
      </button>

      <div class="switch-row">
        <span class="switch-text">Already have an account?</span>
        <button
          class="switch-link"
          type="button"
          @click="goToLogin"
        >
          Sign in
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

.checkbox-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  width: 100%;
  cursor: pointer;
}

.checkbox-custom {
  display: flex;
  align-items: center;
  height: 20px;
}

.checkbox-hidden {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

.checkbox-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
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
  line-height: 1.5;
  color: #616167;
}

.terms-link {
  color: #5749f4;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
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
</style>
