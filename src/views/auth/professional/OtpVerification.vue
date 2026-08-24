<script
  setup
  lang="ts"
>
import { ArrowLeft, MessageCircleMore, Timer, UserRound } from '@lucide/vue';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthBrand from '@/components/auth/AuthBrand.vue';
import AuthCard from '@/components/auth/AuthCard.vue';
import AuthPageLayout from '@/components/auth/AuthPageLayout.vue';
import BackButton from '@/components/auth/BackButton.vue';
import { professionalAuth } from '@/services/auth/professionalAuthService';

const router = useRouter();
const route = useRoute();

const phone = (route.query.phone as string) || '+998 90 123 45 67';
const otpId = (route.query.otpId as string) || 'mock-otp-id';

const otpValues = ref(['0', '0', '0', '0', '0', '0']);
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
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else if (timer) {
      clearInterval(timer);
    }
  }, 1000);
}

function goBack() {
  router.push({ name: 'professional-auth-phone' });
}

function onOtpInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement;
  const val = input.value.replace(/\D/g, '');
  if (val) {
    otpValues.value[index] = val.slice(-1);
    const nextInput = document.querySelector<HTMLInputElement>(
      `.otp-box:nth-child(${index + 2}) input`,
    );
    if (nextInput) {
      nextInput.focus();
    }
  }
}

function onOtpKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !otpValues.value[index]) {
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
    const result = await professionalAuth.verifyOtp({ otpId, code });
    localStorage.setItem('token', result.token);
    const userType = String(result.user?.type || '').toUpperCase();
    const isOrg =
      userType === 'ORGANIZATION' || userType === 'ORGANIZATION_ADMIN';
    if (result.user.isOnboarded) {
      router.push({ name: isOrg ? 'biz-dashboard-overview' : 'pro-dashboard' });
    } else {
      router.push({
        name: isOrg
          ? 'business-onboarding-step1'
          : 'professional-onboarding-step1',
      });
    }
  } catch {
    errorMessage.value = 'Invalid code. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

async function resendCode() {
  try {
    await professionalAuth.loginWithPhone({ phone });
    startTimer();
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
      :icon="UserRound"
      icon-bg="var(--primary)"
      label="Professional"
    />

    <AuthCard
      width="500px"
      padding="40px"
      gap="24px"
    >
      <BackButton @click="goBack" />

      <div class="icon-circle">
        <MessageCircleMore
          :size="28"
          color="var(--primary)"
        />
      </div>

      <div class="header-text">
        <h1 class="title">Almost there...</h1>
        <p class="subtitle">We sent a 6-digit code to {{ phone }}</p>
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
            type="text"
            inputmode="numeric"
            pattern="[0-9]"
            maxlength="1"
            :ref="(el) => { if (idx === 0 && el) { (el as HTMLInputElement).focus(); } }"
            @input="onOtpInput(idx, $event)"
            @keydown="onOtpKeydown(idx, $event)"
          >
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="error-text"
      >
        {{ errorMessage }}
      </div>

      <div
        v-if="!canResend"
        class="timer-row"
      >
        <Timer
          :size="14"
          color="var(--muted-foreground)"
        />
        <span>Resend code in {{ formattedTime }}</span>
      </div>

      <button
        class="btn btn-primary"
        type="button"
        :disabled="isLoading"
        @click="verify"
      >
        {{ isLoading ? 'Verifying...' : 'Verify and continue' }}
      </button>

      <div
        v-if="canResend"
        class="resend-row"
      >
        <span class="resend-text">Didn't receive the code?</span>
        <button
          class="resend-link"
          type="button"
          @click="resendCode"
        >
          Resend
        </button>
      </div>
    </AuthCard>
  </AuthPageLayout>
</template>

<style scoped>
.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: var(--muted);
  border-radius: 999px;
}

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

.otp-label {
  align-self: flex-start;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.otp-row {
  display: flex;
  gap: 8px;
  justify-content: center;
  width: 100%;
}

.otp-box input {
  width: 48px;
  height: 56px;
  font-family: Inter, sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: var(--foreground);
  text-align: center;
  outline: none;
  background: var(--muted);
  border: 1px solid var(--border-soft);
  border-radius: 24px;
}

.otp-box input:focus {
  border-color: var(--primary);
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
  background: var(--primary);
}

.timer-row {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.timer-row span {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.resend-row {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
}

.resend-text {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.resend-link {
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
