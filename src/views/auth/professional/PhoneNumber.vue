<script
  setup
  lang="ts"
>
import { ChevronDown, ShieldCheck, UserRound } from '@lucide/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthBrand from '@/components/auth/AuthBrand.vue';
import AuthCard from '@/components/auth/AuthCard.vue';
import AuthPageLayout from '@/components/auth/AuthPageLayout.vue';
import BackButton from '@/components/auth/BackButton.vue';
import { professionalAuth } from '@/services/auth/professionalAuthService';

const router = useRouter();
const phoneNumber = ref('90 555 12 34');
const countryCode = ref('+998');
const isLoading = ref(false);
const errorMessage = ref('');

function goBack() {
  router.push({ name: 'professional-auth' });
}

async function sendCode() {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const fullPhone = `${countryCode.value} ${phoneNumber.value}`;
    const result = await professionalAuth.loginWithPhone({
      phone: fullPhone,
    });
    router.push({
      name: 'professional-auth-otp',
      query: { phone: fullPhone, otpId: result.otpId },
    });
  } catch {
    errorMessage.value = 'Failed to send code. Please try again.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <AuthPageLayout>
    <AuthBrand
      :icon="UserRound"
      icon-bg="#5749F4"
      label="Professional"
    />

    <AuthCard
      width="460px"
      padding="40px"
      gap="24px"
    >
      <BackButton @click="goBack" />

      <div class="header-text">
        <h1 class="title">What's your number?</h1>
        <p class="subtitle">
          We'll send a verification code so you can get back to your craft.
        </p>
      </div>

      <div class="field-group">
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
        @click="sendCode"
      >
        {{ isLoading ? 'Sending...' : 'Send code' }}
      </button>

      <div class="privacy-notice">
        <ShieldCheck
          :size="14"
          color="#616167"
        />
        <span>Your number stays private — we use it only to verify you.</span>
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

.phone-input-row {
  display: flex;
  gap: 8px;
  width: 100%;
}

.country-code {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 18px 20px;
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

.privacy-notice {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.privacy-notice span {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #616167;
}

.error-text {
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #cc3314;
  text-align: center;
}
</style>
