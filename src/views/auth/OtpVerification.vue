<script
  setup
  lang="ts"
>
import { ArrowLeft, Mail, MessageCircleMore, Phone, Timer } from '@lucide/vue';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthBrand from '@/components/auth/AuthBrand.vue';
import AuthCard from '@/components/auth/AuthCard.vue';
import AuthPageLayout from '@/components/auth/AuthPageLayout.vue';
import BackButton from '@/components/auth/BackButton.vue';
import { businessAuth } from '@/services/auth/businessAuthService';
import { professionalAuth } from '@/services/auth/professionalAuthService';

const router = useRouter();
const route = useRoute();

const contact = (route.query.contact as string) || '+998 90 123 45 67';
const contactType = (route.query.contactType as string) || 'phone';
const otpId = (route.query.otpId as string) || 'mock-otp-id';
const accountType = (route.query.type as string) || 'professional';
const mode = (route.query.mode as string) || 'login';
const onboardingRoute =
  (route.query.onboarding as string) || 'professional-onboarding-step1';

const isBusiness = computed(() => accountType === 'business');
const isEmail = computed(() => contactType === 'email');
const isLogin = computed(() => mode === 'login');

const otpValues = ref(['', '', '', '', '', '']);
const timeLeft = ref(60);
const canResend = computed(() => timeLeft.value <= 0);
const isLoading = ref(false);
const errorMessage = ref('');
let timer: ReturnType<typeof setInterval> | null = null;

const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60);
  const s = timeLeft.value % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
});

function startTimer() {
  timeLeft.value = 60;
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else if (timer) {
      clearInterval(timer);
    }
  }, 1000);
}

function goBack() {
  if (isLogin.value) {
    router.push({ name: 'auth-login', query: { type: accountType } });
  } else {
    router.push({ name: 'auth-register', query: { type: accountType } });
  }
}

function onOtpInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement;
  const val = input.value.replace(/\D/g, '');
  if (val) {
    otpValues.value[index] = val.slice(-1);
    if (index < 5) {
      const nextInput = document.querySelector<HTMLInputElement>(
        `.otp-box:nth-child(${index + 2}) input`,
      );
      if (nextInput) {
        nextInput.focus();
      }
    }
  }
}

function onOtpKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !otpValues.value[index] && index > 0) {
    const prevInput = document.querySelector<HTMLInputElement>(
      `.otp-box:nth-child(${index}) input`,
    );
    if (prevInput) {
      prevInput.focus();
    }
  }
}

async function verify() {
  const code = otpValues.value.join('');
  if (code.length !== 6) {
    return;
  }
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const auth = isBusiness.value ? businessAuth : professionalAuth;
    const result = await auth.verifyOtp({ otpId, code });
    localStorage.setItem('token', result.token);

    if (isLogin.value) {
      const userType = String(result.user?.type || '').toUpperCase();
      const isOrg = userType === 'ORGANIZATION' || userType === 'ORGANIZATION_ADMIN' || isBusiness.value;
      router.push(
        result.user.isOnboarded
          ? { name: isOrg ? 'biz-dashboard-overview' : 'pro-dashboard' }
          : {
              name: isOrg
                ? 'business-onboarding-step1'
                : 'professional-onboarding-step1',
            },
      );
    } else {
      // After registration OTP, go to onboarding
      router.push({ name: onboardingRoute });
    }
  } catch {
    errorMessage.value = 'Invalid code. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

async function resendCode() {
  try {
    const auth = isBusiness.value ? businessAuth : professionalAuth;
    if (isEmail.value) {
      await auth.resendOtp({ contact, contactType: 'email' });
    } else {
      await auth.loginWithPhone({ phone: contact });
    }
    startTimer();
    errorMessage.value = '';
  } catch {
    errorMessage.value = 'Failed to resend code.';
  }
}

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<template>
  <AuthPageLayout>
    <AuthBrand
      :icon="isEmail ? Mail : MessageCircleMore"
      :icon-bg="isBusiness ? '#2A2933' : '#5749F4'"
      :label="isBusiness ? 'Business' : 'Professional'"
    />

    <AuthCard
      width="500px"
      padding="40px"
      gap="24px"
    >
      <BackButton @click="goBack" />

      <div class="icon-circle">
        <component
          :is="isEmail ? Mail : Phone"
          :size="28"
          :color="isBusiness ? '#2A2933' : '#5749F4'"
        />
      </div>

      <div class="header-text">
        <h1 class="title">Almost there...</h1>
        <p class="subtitle">
          We sent a 6-digit code to
          <strong>{{ contact }}</strong>
        </p>
      </div>

      <div class="otp-label">Verification code</div>
      <div class="otp-row">
        <div
          v-for="(val, idx) in otpValues"
          :key="idx"
          class="otp-box"
        >
          <input
            v-model="otpValues[idx]"
            class="otp-input"
            type="text"
            inputmode="numeric"
            maxlength="1"
            @input="(e: Event) => onOtpInput(idx, e)"
            @keydown="(e: KeyboardEvent) => onOtpKeydown(idx, e)"
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
        :disabled="isLoading || otpValues.join('').length !== 6"
        @click="verify"
      >
        {{ isLoading ? 'Verifying...' : 'Verify code' }}
      </button>

      <div class="timer-row">
        <Timer
          :size="14"
          color="#616167"
        />
        <span class="timer-text">{{ formattedTime }}</span>
      </div>

      <button
        class="resend-link"
        type="button"
        :disabled="!canResend"
        @click="resendCode"
      >
        Resend code
      </button>
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

.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: #f5f5f5;
  border-radius: 50%;
}

.otp-label {
  align-self: flex-start;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #2a2933;
}

.otp-row {
  display: flex;
  gap: 10px;
  justify-content: center;
  width: 100%;
}

.otp-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 64px;
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
  border-radius: 12px;
}

.otp-box:focus-within {
  border-color: #5749f4;
  box-shadow: 0 0 0 3px rgba(87, 73, 244, 0.12);
}

.otp-input {
  width: 100%;
  height: 100%;
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #2a2933;
  text-align: center;
  outline: none;
  background: transparent;
  border: none;
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

.timer-row {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
}

.timer-text {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #616167;
}

.resend-link {
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #5749f4;
  cursor: pointer;
  background: none;
  border: none;
}

.resend-link:disabled {
  color: #939399;
  cursor: not-allowed;
}

.resend-link:hover:not(:disabled) {
  text-decoration: underline;
}
</style>
