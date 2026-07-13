<script
  setup
  lang="ts"
>
import {
  BadgeCheck,
  Check,
  Mail,
  MessageSquare,
  RefreshCw,
  Send,
  Shield,
} from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';

// State
const currentPhone = ref('');
const currentEmail = ref('');
const isLoading = ref(false);

const showPhoneInput = ref(false);
const showEmailInput = ref(false);

const newPhone = ref('');
const newEmail = ref('');

const isPhoneOtpSent = ref(false);
const isEmailOtpSent = ref(false);

const phoneOtpInputs = ref(['', '', '', '', '', '']);
const emailOtpInputs = ref(['', '', '', '', '', '']);

const phoneTimerLeft = ref(60);
const emailTimerLeft = ref(60);

const phoneErrorMessage = ref('');
const phoneSuccessMessage = ref('');
const emailErrorMessage = ref('');
const emailSuccessMessage = ref('');

const isSendingPhoneOtp = ref(false);
const isVerifyingPhone = ref(false);
const isSendingEmailOtp = ref(false);
const isVerifyingEmail = ref(false);

let phoneInterval: number | null = null;
let emailInterval: number | null = null;

function formatTimer(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function startPhoneTimer() {
  phoneTimerLeft.value = 60;
  if (phoneInterval) {
    clearInterval(phoneInterval);
  }
  phoneInterval = window.setInterval(() => {
    if (phoneTimerLeft.value > 0) {
      phoneTimerLeft.value--;
    } else if (phoneInterval) {
      clearInterval(phoneInterval);
    }
  }, 1000);
}

function startEmailTimer() {
  emailTimerLeft.value = 60;
  if (emailInterval) {
    clearInterval(emailInterval);
  }
  emailInterval = window.setInterval(() => {
    if (emailTimerLeft.value > 0) {
      emailTimerLeft.value--;
    } else if (emailInterval) {
      clearInterval(emailInterval);
    }
  }, 1000);
}

async function loadData() {
  if (isMockMode()) {
    currentPhone.value = '+998 90 123 45 67';
    currentEmail.value = 'aziz.ismoilov@gmail.com';
    return;
  }

  isLoading.value = true;
  try {
    const masterRes = await apiClient.get('/master-info/get-own');
    const masterInfo = Array.isArray(masterRes) ? masterRes[0] : masterRes;
    const user = masterInfo?.master;
    if (user) {
      currentPhone.value = user.phone || '';
      currentEmail.value = user.email || '';
    }
  } catch {
    // Fallback if needed
  } finally {
    isLoading.value = false;
  }
}

async function sendPhoneOtp() {
  phoneErrorMessage.value = '';
  phoneSuccessMessage.value = '';

  const cleanPhone = newPhone.value.replace(/[^0-9+]/g, '');
  if (!cleanPhone) {
    phoneErrorMessage.value = 'Please enter a valid phone number.';
    return;
  }

  isSendingPhoneOtp.value = true;
  try {
    if (isMockMode()) {
      isPhoneOtpSent.value = true;
      startPhoneTimer();
      phoneSuccessMessage.value = 'Verification code sent (mock mode).';
      return;
    }

    await apiClient.post(`/user/send-otp-phone/${cleanPhone}`);
    isPhoneOtpSent.value = true;
    startPhoneTimer();
    phoneSuccessMessage.value =
      'Verification code has been sent to your phone.';
  } catch (err: unknown) {
    const errorVal = err as Record<string, unknown> | null;
    phoneErrorMessage.value =
      String(errorVal?.message || '') || 'Failed to send OTP code.';
  } finally {
    isSendingPhoneOtp.value = false;
  }
}

async function confirmPhone() {
  phoneErrorMessage.value = '';
  phoneSuccessMessage.value = '';

  const code = phoneOtpInputs.value.join('');
  if (code.length < 6) {
    phoneErrorMessage.value = 'Please enter all 6 digits.';
    return;
  }

  const cleanPhone = newPhone.value.replace(/[^0-9+]/g, '');

  isVerifyingPhone.value = true;
  try {
    if (isMockMode()) {
      currentPhone.value = newPhone.value;
      showPhoneInput.value = false;
      isPhoneOtpSent.value = false;
      phoneSuccessMessage.value = 'Phone number updated successfully!';
      return;
    }

    const result = await apiClient.put(
      `/user/change-phone?phone=${cleanPhone}&otp=${code}`,
    );
    const newToken = result?.accessToken || result?.token;
    if (newToken) {
      localStorage.setItem('token', newToken);
    }
    currentPhone.value = newPhone.value;
    showPhoneInput.value = false;
    isPhoneOtpSent.value = false;
    phoneSuccessMessage.value = 'Phone number updated successfully!';
  } catch (err: unknown) {
    const errorVal = err as Record<string, unknown> | null;
    phoneErrorMessage.value =
      String(errorVal?.message || '') || 'Invalid or expired OTP code.';
  } finally {
    isVerifyingPhone.value = false;
  }
}

async function sendEmailOtp() {
  emailErrorMessage.value = '';
  emailSuccessMessage.value = '';

  if (!newEmail.value) {
    emailErrorMessage.value = 'Please enter a valid email address.';
    return;
  }

  isSendingEmailOtp.value = true;
  try {
    if (isMockMode()) {
      isEmailOtpSent.value = true;
      startEmailTimer();
      emailSuccessMessage.value = 'Verification code sent (mock mode).';
      return;
    }

    await apiClient.post(`/user/send-otp-email/${newEmail.value}`);
    isEmailOtpSent.value = true;
    startEmailTimer();
    emailSuccessMessage.value =
      'Verification code has been sent to your email.';
  } catch (err: unknown) {
    const errorVal = err as Record<string, unknown> | null;
    emailErrorMessage.value =
      String(errorVal?.message || '') || 'Failed to send OTP code.';
  } finally {
    isSendingEmailOtp.value = false;
  }
}

async function confirmEmail() {
  emailErrorMessage.value = '';
  emailSuccessMessage.value = '';

  const code = emailOtpInputs.value.join('');
  if (code.length < 6) {
    emailErrorMessage.value = 'Please enter all 6 digits.';
    return;
  }

  isVerifyingEmail.value = true;
  try {
    if (isMockMode()) {
      currentEmail.value = newEmail.value;
      showEmailInput.value = false;
      isEmailOtpSent.value = false;
      emailSuccessMessage.value = 'Email address updated successfully!';
      return;
    }

    const result = await apiClient.put(
      `/user/change-email?email=${newEmail.value}&otp=${code}`,
    );
    const newToken = result?.accessToken || result?.token;
    if (newToken) {
      localStorage.setItem('token', newToken);
    }
    currentEmail.value = newEmail.value;
    showEmailInput.value = false;
    isEmailOtpSent.value = false;
    emailSuccessMessage.value = 'Email address updated successfully!';
  } catch (err: unknown) {
    const errorVal = err as Record<string, unknown> | null;
    emailErrorMessage.value =
      String(errorVal?.message || '') || 'Invalid or expired OTP code.';
  } finally {
    isVerifyingEmail.value = false;
  }
}

function handleOtpInput(event: Event, index: number, type: 'phone' | 'email') {
  const input = event.target as HTMLInputElement;
  const val = input.value;
  const inputs = type === 'phone' ? phoneOtpInputs.value : emailOtpInputs.value;

  inputs[index] = val.slice(-1);

  if (val && index < 5) {
    const nextInput = input.nextElementSibling as HTMLInputElement | null;
    if (nextInput) {
      nextInput.focus();
    }
  }
}

function handleOtpKeydown(
  event: KeyboardEvent,
  index: number,
  type: 'phone' | 'email',
) {
  const input = event.target as HTMLInputElement;
  const inputs = type === 'phone' ? phoneOtpInputs.value : emailOtpInputs.value;

  if (event.key === 'Backspace' && !inputs[index] && index > 0) {
    inputs[index - 1] = '';
    const prevInput = input.previousElementSibling as HTMLInputElement | null;
    if (prevInput) {
      prevInput.focus();
    }
  }
}

function cancelPhoneChange() {
  showPhoneInput.value = false;
  isPhoneOtpSent.value = false;
  phoneErrorMessage.value = '';
  phoneSuccessMessage.value = '';
}

function cancelEmailChange() {
  showEmailInput.value = false;
  isEmailOtpSent.value = false;
  emailErrorMessage.value = '';
  emailSuccessMessage.value = '';
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="settings-container">
    <div
      v-if="isLoading"
      class="loading-state"
    >
      Loading security settings...
    </div>

    <template v-else>
      <!-- Phone Section -->
      <section class="settings-card">
        <h2 class="card-title">Phone number</h2>
        <p class="card-description">
          Used for SMS alerts about new jobs and incoming customer calls.
        </p>

        <!-- Feedback banners -->
        <div
          v-if="phoneSuccessMessage"
          class="success-banner"
        >
          {{ phoneSuccessMessage }}
        </div>
        <div
          v-if="phoneErrorMessage"
          class="error-banner"
        >
          {{ phoneErrorMessage }}
        </div>

        <!-- Current Phone Row -->
        <div class="current-info-box">
          <div class="info-label-group">
            <span class="info-label">Current number</span>
            <span class="info-value">{{ currentPhone || 'Not set' }}</span>
          </div>
          <div
            v-if="currentPhone"
            class="badge badge-verified"
          >
            <BadgeCheck
              :size="16"
              class="badge-icon"
            />
            <span>Verified</span>
          </div>
        </div>

        <!-- Change Phone Trigger Button -->
        <div
          v-if="!showPhoneInput"
          class="actions-row"
        >
          <button
            class="change-btn"
            type="button"
            @click="showPhoneInput = true"
          >
            Change phone number
          </button>
        </div>

        <!-- New Phone Input Row -->
        <div
          v-if="showPhoneInput && !isPhoneOtpSent"
          class="input-row"
        >
          <div class="input-field-group">
            <label class="input-label">New phone number</label>
            <input
              v-model="newPhone"
              type="text"
              class="styled-input"
              placeholder="+998 90 123 45 67"
            >
          </div>
          <div class="button-group">
            <button
              class="cancel-link"
              type="button"
              @click="cancelPhoneChange"
            >
              Cancel
            </button>
            <button
              class="action-btn"
              type="button"
              :disabled="isSendingPhoneOtp"
              @click="sendPhoneOtp"
            >
              <MessageSquare :size="16" />
              <span>{{ isSendingPhoneOtp ? 'Sending...' : 'Send code' }}</span>
            </button>
          </div>
        </div>

        <!-- SMS Verification alert Box -->
        <div
          v-if="showPhoneInput && isPhoneOtpSent"
          class="alert-box alert-warning"
        >
          <div class="alert-left-bar" />
          <div class="alert-content">
            <div class="alert-header">
              <Shield
                :size="18"
                class="alert-icon"
              />
              <h3 class="alert-title">SMS verification required</h3>
            </div>
            <p class="alert-description">
              We sent a 6-digit code to {{ newPhone }}. Your number is not saved
              until this code is confirmed.
            </p>

            <!-- OTP inputs -->
            <div class="otp-container">
              <input
                v-for="(val, idx) in phoneOtpInputs"
                :key="idx"
                v-model="phoneOtpInputs[idx]"
                type="text"
                maxlength="1"
                class="otp-box"
                @input="handleOtpInput($event, idx, 'phone')"
                @keydown="handleOtpKeydown($event, idx, 'phone')"
              >
            </div>

            <div class="alert-footer">
              <span class="timer-text">
                <template v-if="phoneTimerLeft > 0">
                  Resend code in {{ formatTimer(phoneTimerLeft) }}
                </template>
                <template v-else>
                  <button
                    class="resend-link"
                    type="button"
                    @click="sendPhoneOtp"
                  >
                    Resend code
                  </button>
                </template>
              </span>
              <div class="button-group">
                <button
                  class="cancel-link"
                  type="button"
                  @click="cancelPhoneChange"
                >
                  Cancel
                </button>
                <button
                  class="confirm-btn"
                  type="button"
                  :disabled="isVerifyingPhone"
                  @click="confirmPhone"
                >
                  <Check :size="16" />
                  <span
                    >{{ isVerifyingPhone ? 'Verifying...' : 'Confirm number' }}</span
                  >
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

        <!-- Feedback banners -->
        <div
          v-if="emailSuccessMessage"
          class="success-banner"
        >
          {{ emailSuccessMessage }}
        </div>
        <div
          v-if="emailErrorMessage"
          class="error-banner"
        >
          {{ emailErrorMessage }}
        </div>

        <!-- Current Email Row -->
        <div class="current-info-box">
          <div class="info-label-group">
            <span class="info-label">Current email</span>
            <span class="info-value">{{ currentEmail || 'Not set' }}</span>
          </div>
          <div
            v-if="currentEmail"
            class="badge badge-verified"
          >
            <BadgeCheck
              :size="16"
              class="badge-icon"
            />
            <span>Verified</span>
          </div>
        </div>

        <!-- Change Email Trigger Button -->
        <div
          v-if="!showEmailInput"
          class="actions-row"
        >
          <button
            class="change-btn"
            type="button"
            @click="showEmailInput = true"
          >
            Change email address
          </button>
        </div>

        <!-- New Email Input Row -->
        <div
          v-if="showEmailInput && !isEmailOtpSent"
          class="input-row"
        >
          <div class="input-field-group">
            <label class="input-label">New email address</label>
            <input
              v-model="newEmail"
              type="email"
              class="styled-input"
              placeholder="you@example.com"
            >
          </div>
          <div class="button-group">
            <button
              class="cancel-link"
              type="button"
              @click="cancelEmailChange"
            >
              Cancel
            </button>
            <button
              class="action-btn"
              type="button"
              :disabled="isSendingEmailOtp"
              @click="sendEmailOtp"
            >
              <Send :size="14" />
              <span>{{ isSendingEmailOtp ? 'Sending...' : 'Send code' }}</span>
            </button>
          </div>
        </div>

        <!-- Confirmation email alert Box -->
        <div
          v-if="showEmailInput && isEmailOtpSent"
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
            </div>
            <p class="alert-description">
              We sent a 6-digit confirmation code to {{ newEmail }}. Your new
              address only becomes active after you enter this code below.
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
                @input="handleOtpInput($event, idx, 'email')"
                @keydown="handleOtpKeydown($event, idx, 'email')"
              >
            </div>

            <div class="alert-footer">
              <span class="timer-text">
                <template v-if="emailTimerLeft > 0">
                  Resend code in {{ formatTimer(emailTimerLeft) }}
                </template>
                <template v-else>
                  <button
                    class="resend-link"
                    type="button"
                    @click="sendEmailOtp"
                  >
                    Resend code
                  </button>
                </template>
              </span>
              <div class="button-group">
                <button
                  class="cancel-link"
                  type="button"
                  @click="cancelEmailChange"
                >
                  Cancel
                </button>
                <button
                  class="confirm-btn"
                  type="button"
                  :disabled="isVerifyingEmail"
                  @click="confirmEmail"
                >
                  <Check :size="16" />
                  <span
                    >{{ isVerifyingEmail ? 'Verifying...' : 'Confirm email' }}</span
                  >
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
  padding: 28px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
}

.card-title {
  margin: 0 0 6px 0;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.card-description {
  margin: 0 0 20px 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #6b7280;
}

/* Info Box */
.current-info-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  margin-bottom: 20px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.info-label-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

/* Badges */
.badge {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 6px 14px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  border-radius: 999px;
}

.badge-verified {
  color: #166534;
  background: #dcfce7;
}

.badge-awaiting {
  padding: 4px 10px;
  font-size: 11px;
  color: #9a3412;
  background: #ffedd5;
}

.badge-icon {
  flex-shrink: 0;
}

/* Inputs */
.input-row {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 20px;
}

.input-field-group {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
}

.styled-input {
  width: 100%;
  padding: 12px 18px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #111827;
  outline: none;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: border 0.15s;
}

.styled-input:focus {
  border-color: #5749f4;
}

.action-btn {
  display: flex;
  gap: 8px;
  align-items: center;
  height: 46px;
  padding: 0 20px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  background: #5749f4;
  border: none;
  border-radius: 8px;
  transition: opacity 0.15s;
}

.action-btn:hover {
  opacity: 0.9;
}

/* Alert Boxes */
.alert-box {
  position: relative;
  display: flex;
  padding: 20px;
  margin-bottom: 8px;
  overflow: hidden;
  border-radius: 12px;
}

.alert-left-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 4px;
}

.alert-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-left: 8px;
}

.alert-header {
  display: flex;
  gap: 8px;
  align-items: center;
}

.alert-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 700;
}

.alert-description {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  line-height: 1.5;
}

/* Warning State */
.alert-warning {
  color: #78350f;
  background: #fffbeb;
  border: 1px solid #fde68a;
}

.alert-warning .alert-left-bar {
  background: #f59e0b;
}

.alert-warning .alert-icon {
  color: #d97706;
}

/* Info State */
.alert-info {
  color: #1e3a8a;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.alert-info .alert-left-bar {
  background: #3b82f6;
}

.alert-info .alert-icon {
  color: #2563eb;
}

/* OTP boxes */
.otp-container {
  display: flex;
  gap: 12px;
  margin: 8px 0;
}

.otp-box {
  width: 48px;
  height: 48px;
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  text-align: center;
  outline: none;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

.otp-box:focus {
  border-color: #5749f4;
}

/* Alert footer and buttons */
.alert-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.timer-text {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
}

.confirm-btn {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 22px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  background: #5749f4;
  border: none;
  border-radius: 999px;
}

.alert-actions {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 8px;
}

.resend-email-btn {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 16px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

.change-address-btn {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
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
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  font-family: Inter, sans-serif;
  font-size: 9px;
  font-weight: 700;
  color: #6b7280;
  border: 1px solid #9ca3af;
  border-radius: 999px;
}

.info-footer-text {
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #6b7280;
}

/* Custom Interactive Additions */
.actions-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.change-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #5749f4;
  cursor: pointer;
  background: #f5f4ff;
  border: 1px solid #c7c2ff;
  border-radius: 8px;
  transition: all 0.15s;
}

.change-btn:hover {
  background: #e8e6ff;
  border-color: #5749f4;
}

.button-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.cancel-link {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  background: none;
  border: none;
  transition: color 0.15s;
}

.cancel-link:hover {
  color: #374151;
}

.resend-link {
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #5749f4;
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;
}

.loading-state {
  padding: 24px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #6b7280;
  text-align: center;
}

.success-banner {
  padding: 12px 16px;
  margin-bottom: 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #15803d;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
}

.error-banner {
  padding: 12px 16px;
  margin-bottom: 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}
</style>
