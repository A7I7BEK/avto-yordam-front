<script
  setup
  lang="ts"
>
import {
  Check,
  Clock,
  Loader2,
  Mail,
  MessageSquare,
  RefreshCw,
  Send,
  ShieldAlert,
  ShieldCheck,
} from '@lucide/vue';
import { onMounted, ref } from 'vue';
import {
  changeEmail,
  changePhone,
  getUserProfile,
  sendOtpToEmail,
  sendOtpToPhone,
} from '@/services/userService';

// Phone state
const currentPhone = ref('+998 90 123 45 67');
const newPhone = ref('');
const isPhoneVerified = ref(true);
const phoneSending = ref(false);
const phoneConfirming = ref(false);
const phoneOtpSent = ref(false);
const phoneError = ref('');

const otpInputs = ref<string[]>(Array(6).fill(''));
const otpTimeLeft = ref(0);
const otpTimerInterval = ref<ReturnType<typeof setInterval> | null>(null);

// Email state
const currentEmail = ref('aziz.ismoilov@gmail.com');
const newEmail = ref('');
const isEmailVerified = ref(true);
const emailSending = ref(false);
const emailConfirming = ref(false);
const emailOtpSent = ref(false);
const emailError = ref('');

const emailOtpInputs = ref<string[]>(Array(6).fill(''));

// Loading
const loading = ref(true);

function startOtpTimer() {
  otpTimeLeft.value = 120;
  if (otpTimerInterval.value) {
    clearInterval(otpTimerInterval.value);
  }
  otpTimerInterval.value = setInterval(() => {
    if (otpTimeLeft.value > 0) {
      otpTimeLeft.value--;
    } else if (otpTimerInterval.value) {
      clearInterval(otpTimerInterval.value);
      otpTimerInterval.value = null;
    }
  }, 1000);
}

function formatOtpTime(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

async function handleSendCode() {
  if (!newPhone.value.trim()) {
    phoneError.value = 'Please enter a new phone number';
    return;
  }
  phoneError.value = '';
  phoneSending.value = true;
  try {
    await sendOtpToPhone(newPhone.value);
    phoneOtpSent.value = true;
    otpInputs.value = Array(6).fill('');
    startOtpTimer();
  } catch (e: any) {
    phoneError.value = e.message ?? 'Failed to send OTP';
  } finally {
    phoneSending.value = false;
  }
}

async function handleConfirmNumber() {
  const otp = otpInputs.value.join('');
  if (otp.length < 6) {
    phoneError.value = 'Please enter the full 6-digit code';
    return;
  }
  phoneError.value = '';
  phoneConfirming.value = true;
  try {
    await changePhone(newPhone.value, otp);
    isPhoneVerified.value = true;
    currentPhone.value = newPhone.value;
    phoneOtpSent.value = false;
    if (otpTimerInterval.value) {
      clearInterval(otpTimerInterval.value);
      otpTimerInterval.value = null;
    }
  } catch (e: any) {
    phoneError.value = e.message ?? 'Failed to confirm number';
  } finally {
    phoneConfirming.value = false;
  }
}

async function handleResendPhoneOtp() {
  phoneSending.value = true;
  try {
    await sendOtpToPhone(newPhone.value);
    startOtpTimer();
  } catch (e: any) {
    phoneError.value = e.message ?? 'Failed to resend OTP';
  } finally {
    phoneSending.value = false;
  }
}

function handleCancelPhoneChange() {
  phoneOtpSent.value = false;
  newPhone.value = '';
  phoneError.value = '';
  if (otpTimerInterval.value) {
    clearInterval(otpTimerInterval.value);
    otpTimerInterval.value = null;
  }
}

async function handleSendEmailOtp() {
  if (!newEmail.value.trim()) {
    emailError.value = 'Please enter a new email address';
    return;
  }
  emailError.value = '';
  emailSending.value = true;
  try {
    await sendOtpToEmail(newEmail.value);
    emailOtpSent.value = true;
    emailOtpInputs.value = Array(6).fill('');
    startOtpTimer();
  } catch (e: any) {
    emailError.value = e.message ?? 'Failed to send OTP';
  } finally {
    emailSending.value = false;
  }
}

async function handleConfirmEmail() {
  const otp = emailOtpInputs.value.join('');
  if (otp.length < 6) {
    emailError.value = 'Please enter the full 6-digit code';
    return;
  }
  emailError.value = '';
  emailConfirming.value = true;
  try {
    await changeEmail(newEmail.value, otp);
    isEmailVerified.value = true;
    currentEmail.value = newEmail.value;
    emailOtpSent.value = false;
    if (otpTimerInterval.value) {
      clearInterval(otpTimerInterval.value);
      otpTimerInterval.value = null;
    }
  } catch (e: any) {
    emailError.value = e.message ?? 'Failed to confirm email';
  } finally {
    emailConfirming.value = false;
  }
}

async function handleResendEmailOtp() {
  emailSending.value = true;
  try {
    await sendOtpToEmail(newEmail.value);
    startOtpTimer();
  } catch (e: any) {
    emailError.value = e.message ?? 'Failed to resend OTP';
  } finally {
    emailSending.value = false;
  }
}

function handleCancelEmailChange() {
  emailOtpSent.value = false;
  newEmail.value = '';
  emailError.value = '';
  if (otpTimerInterval.value) {
    clearInterval(otpTimerInterval.value);
    otpTimerInterval.value = null;
  }
}

function onOtpInput(
  event: Event,
  index: number,
  inputs: string[],
) {
  const input = event.target as HTMLInputElement;
  if (input.value && index < 5) {
    const nextInput = input.parentElement?.children[index + 1] as HTMLInputElement | undefined;
    nextInput?.focus();
  }
}

onMounted(async () => {
  try {
    const user = await getUserProfile();
    currentPhone.value = user.phone;
    currentEmail.value = user.email;
    isPhoneVerified.value = user.isVerified;
    isEmailVerified.value = user.isVerified;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="settings-container">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="loading-state"
    >
      <Loader2
        :size="20"
        color="#616167"
        class="spin"
      />
      <span>Loading contact info...</span>
    </div>

    <template v-else>
      <!-- Phone Section -->
      <section class="settings-card">
        <h2 class="card-title">Phone number</h2>
        <p class="card-description">
          Used for SMS alerts about new jobs and incoming customer calls.
        </p>

        <!-- Current Phone Row -->
        <div class="current-info-box">
          <div class="info-label-group">
            <span class="info-label">Current number</span>
            <span class="info-value">{{ currentPhone }}</span>
          </div>
          <div
            v-if="isPhoneVerified"
            class="badge badge-verified"
          >
            <ShieldCheck
              :size="12"
              class="badge-icon"
            />
            <span>Verified</span>
          </div>
          <div
            v-else
            class="badge badge-awaiting"
          >
            <Clock
              :size="12"
              class="badge-icon"
            />
            <span>Not verified</span>
          </div>
        </div>

        <!-- New Phone Input Row -->
        <div class="input-row">
          <div class="input-field-group">
            <label class="input-label">New phone number</label>
            <input
              v-model="newPhone"
              type="text"
              class="styled-input"
              placeholder="+998 _ _  _ _ _  _ _  _ _"
            >
          </div>
          <button
            class="action-btn"
            :disabled="phoneSending"
            type="button"
            @click="handleSendCode"
          >
            <Loader2
              v-if="phoneSending"
              :size="16"
              class="spin"
            />
            <MessageSquare
              v-else
              :size="16"
            />
            <span>{{ phoneSending ? 'Sending...' : 'Send code' }}</span>
          </button>
        </div>

        <!-- Error message -->
        <div
          v-if="phoneError"
          class="error-message"
        >
          {{ phoneError }}
        </div>

        <!-- SMS Verification alert Box -->
        <div
          v-if="phoneOtpSent"
          class="alert-box alert-warning"
        >
          <div class="alert-left-bar" />
          <div class="alert-content">
            <div class="alert-header">
              <ShieldAlert
                :size="16"
                class="alert-icon"
              />
              <h3 class="alert-title">SMS verification required</h3>
            </div>
            <p class="alert-description">
              We sent a 6-digit code to {{ newPhone }}. Your number is not
              saved until this code is confirmed.
            </p>

            <!-- OTP inputs -->
            <div class="otp-container">
              <input
                v-for="(val, idx) in otpInputs"
                :key="idx"
                v-model="otpInputs[idx]"
                type="text"
                maxlength="1"
                class="otp-box"
                @input="onOtpInput($event, idx, otpInputs)"
              >
            </div>

            <div class="alert-footer">
              <div class="timer-group">
                <span
                  v-if="otpTimeLeft > 0"
                  class="timer-text"
                >Resend code in {{ formatOtpTime(otpTimeLeft) }}</span>
                <button
                  v-else
                  class="resend-btn"
                  :disabled="phoneSending"
                  type="button"
                  @click="handleResendPhoneOtp"
                >
                  <RefreshCw
                    :size="12"
                    :class="{ spin: phoneSending }"
                  />
                  <span>Resend code</span>
                </button>
              </div>
              <div class="otp-actions">
                <button
                  class="cancel-btn"
                  type="button"
                  @click="handleCancelPhoneChange"
                >
                  Cancel
                </button>
                <button
                  class="confirm-btn"
                  :disabled="phoneConfirming"
                  type="button"
                  @click="handleConfirmNumber"
                >
                  <Loader2
                    v-if="phoneConfirming"
                    :size="16"
                    class="spin"
                  />
                  <Check
                    v-else
                    :size="16"
                  />
                  <span>{{ phoneConfirming ? 'Confirming...' : 'Confirm number' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Email Section -->
      <section class="settings-card">
        <h2 class="card-title">Email address</h2>
        <p class="card-description">
          Used for receipts, security alerts and password recovery.
        </p>

        <!-- Current Email Row -->
        <div class="current-info-box">
          <div class="info-label-group">
            <span class="info-label">Current email</span>
            <span class="info-value">{{ currentEmail }}</span>
          </div>
          <div
            v-if="isEmailVerified"
            class="badge badge-verified"
          >
            <ShieldCheck
              :size="12"
              class="badge-icon"
            />
            <span>Verified</span>
          </div>
          <div
            v-else
            class="badge badge-awaiting"
          >
            <Clock
              :size="12"
              class="badge-icon"
            />
            <span>Not verified</span>
          </div>
        </div>

        <!-- New Email Input Row -->
        <div class="input-row">
          <div class="input-field-group">
            <label class="input-label">New email address</label>
            <input
              v-model="newEmail"
              type="email"
              class="styled-input"
              placeholder="you@example.com"
            >
          </div>
          <button
            class="action-btn"
            :disabled="emailSending"
            type="button"
            @click="handleSendEmailOtp"
          >
            <Loader2
              v-if="emailSending"
              :size="14"
              class="spin"
            />
            <Send
              v-else
              :size="14"
            />
            <span>{{ emailSending ? 'Sending...' : 'Send code' }}</span>
          </button>
        </div>

        <!-- Error message -->
        <div
          v-if="emailError"
          class="error-message"
        >
          {{ emailError }}
        </div>

        <!-- Email OTP Verification alert Box -->
        <div
          v-if="emailOtpSent"
          class="alert-box alert-info"
        >
          <div class="alert-left-bar" />
          <div class="alert-content">
            <div class="alert-header">
              <Mail
                :size="18"
                class="alert-icon"
              />
              <h3 class="alert-title">Email verification required</h3>
              <div class="badge badge-awaiting">
                <Clock
                  :size="12"
                  class="badge-icon"
                />
                <span>Awaiting confirmation</span>
              </div>
            </div>
            <p class="alert-description">
              We sent a 6-digit code to {{ newEmail }}. The new email
              only becomes active after this code is confirmed.
            </p>

            <!-- OTP inputs -->
            <div class="otp-container">
              <input
                v-for="(val, idx) in emailOtpInputs"
                :key="idx"
                v-model="emailOtpInputs[idx]"
                type="text"
                maxlength="1"
                class="otp-box"
                @input="onOtpInput($event, idx, emailOtpInputs)"
              >
            </div>

            <div class="alert-footer">
              <div class="timer-group">
                <span
                  v-if="otpTimeLeft > 0"
                  class="timer-text"
                >Resend code in {{ formatOtpTime(otpTimeLeft) }}</span>
                <button
                  v-else
                  class="resend-btn"
                  :disabled="emailSending"
                  type="button"
                  @click="handleResendEmailOtp"
                >
                  <RefreshCw
                    :size="12"
                    :class="{ spin: emailSending }"
                  />
                  <span>Resend code</span>
                </button>
              </div>
              <div class="otp-actions">
                <button
                  class="cancel-btn"
                  type="button"
                  @click="handleCancelEmailChange"
                >
                  Cancel
                </button>
                <button
                  class="confirm-btn"
                  :disabled="emailConfirming"
                  type="button"
                  @click="handleConfirmEmail"
                >
                  <Loader2
                    v-if="emailConfirming"
                    :size="16"
                    class="spin"
                  />
                  <Check
                    v-else
                    :size="16"
                  />
                  <span>{{ emailConfirming ? 'Confirming...' : 'Confirm email' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="info-footer-row">
          <span class="info-dot">i</span>
          <span class="info-footer-text"
            >The new email becomes active only once verified.</span
          >
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.settings-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.settings-card {
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 24px;
}

.card-title {
  margin: 0 0 3px 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #2a2933;
}

.card-description {
  margin: 0 0 14px 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #616167;
}

/* Info Box */
.current-info-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  margin-bottom: 14px;
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
  border-radius: 6px;
}

.info-label-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.info-label {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #616167;
}

.info-value {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #2a2933;
}

/* Badges */
.badge {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 6px 10px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  border-radius: 999px;
}

.badge-verified {
  color: #003300;
  background: #a1e5a1;
}

.badge-awaiting {
  padding: 4px 10px;
  font-size: 11px;
  color: #4d2700;
  background: #ffd9b2;
}

.badge-icon {
  flex-shrink: 0;
}

/* Inputs */
.input-row {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  margin-bottom: 14px;
}

.input-field-group {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #616167;
}

.styled-input {
  width: 100%;
  padding: 10px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #2a2933;
  outline: none;
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
  border-radius: 6px;
  transition: border 0.15s;
}

.styled-input:focus {
  border-color: #5749f4;
}

.action-btn {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  background: #5749f4;
  border: none;
  border-radius: 999px;
}

/* Alert Boxes */
.alert-box {
  display: flex;
  padding: 16px;
  margin-bottom: 0;
  border-radius: 6px;
}

.alert-left-bar {
  display: none;
}

.alert-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.alert-header {
  display: flex;
  gap: 8px;
  align-items: center;
}

.alert-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
}

.alert-description {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  line-height: 1.5;
}

/* Warning State */
.alert-warning {
  color: #4d2700;
  background: #ffd9b2;
  border-left: 3px solid #4d2700;
}

.alert-warning .alert-icon {
  color: #4d2700;
}

/* Info State */
.alert-info {
  color: #001133;
  background: #c9d6f0;
  border-left: 3px solid #001133;
}

.alert-info .alert-icon {
  color: #001133;
}

/* OTP boxes */
.otp-container {
  display: flex;
  gap: 8px;
  margin: 4px 0;
}

.otp-box {
  width: 38px;
  height: 44px;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2a2933;
  text-align: center;
  outline: none;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 6px;
}

.otp-box:focus {
  border-color: #5749f4;
  border-width: 1.5px;
}

/* Alert footer and buttons */
.alert-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.timer-text {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
}

.confirm-btn {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  background: #5749f4;
  border: none;
  border-radius: 999px;
}

.alert-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 4px;
}

.resend-email-btn {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #2a2933;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.change-address-btn {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #616167;
  cursor: pointer;
  background: none;
  border: none;
}

/* Info Footer Row */
.info-footer-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 16px;
}

.info-dot {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
  background: #616167;
  border-radius: 999px;
}

.info-footer-text {
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #616167;
}

/* Loading State */
.loading-state {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Error message */
.error-message {
  padding: 8px 14px;
  margin-bottom: 14px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #cc3314;
  background: #fff5f5;
  border: 1px solid #cc3314;
  border-radius: 6px;
}

/* Timer group */
.timer-group {
  display: flex;
  align-items: center;
}

.resend-btn {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 6px 12px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #5749f4;
  cursor: pointer;
  background: transparent;
  border: none;
}

.resend-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* OTP actions */
.otp-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.cancel-btn {
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #616167;
  cursor: pointer;
  background: transparent;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
