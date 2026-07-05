<script
  setup
  lang="ts"
>
import {
  Check,
  Clock,
  Mail,
  MessageSquare,
  RefreshCw,
  Send,
  ShieldAlert,
  ShieldCheck,
} from '@lucide/vue';
import { ref } from 'vue';

// State
const currentPhone = ref('+998 90 123 45 67');
const newPhone = ref('+998 90 123 45 67');
const isPhoneVerified = ref(true);

const otpInputs = ref(['4', '8', '2', '9', '', '']);
const otpTimeLeft = ref('0:42');

const currentEmail = ref('aziz.ismoilov@gmail.com');
const newEmail = ref('you@example.com');

function handleResendOtp() {
  // Stub for action
}

function handleConfirmNumber() {
  isPhoneVerified.value = true;
}

function handleSendLink() {
  // Stub for action
}
</script>

<template>
  <div class="settings-container">
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
        <div class="badge badge-verified">
          <ShieldCheck
            :size="12"
            class="badge-icon"
          />
          <span>Verified</span>
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
          type="button"
        >
          <MessageSquare :size="16" />
          <span>Send code</span>
        </button>
      </div>

      <!-- SMS Verification alert Box -->
      <div class="alert-box alert-warning">
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
            We sent a 6-digit code to +998 90 ••• 45 67. Your number is not
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
            >
          </div>

          <div class="alert-footer">
            <span class="timer-text">Resend code in {{ otpTimeLeft }}</span>
            <button
              class="confirm-btn"
              type="button"
              @click="handleConfirmNumber"
            >
              <Check :size="16" />
              <span>Confirm number</span>
            </button>
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
        <div class="badge badge-verified">
          <ShieldCheck
            :size="12"
            class="badge-icon"
          />
          <span>Verified</span>
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
          type="button"
          @click="handleSendLink"
        >
          <Send :size="14" />
          <span>Send link</span>
        </button>
      </div>

      <!-- Confirmation email alert Box -->
      <div class="alert-box alert-info">
        <div class="alert-left-bar" />
        <div class="alert-content">
          <div class="alert-header">
            <Mail
              :size="18"
              class="alert-icon"
            />
            <h3 class="alert-title">Confirmation link sent</h3>
            <div class="badge badge-awaiting">
              <Clock
                :size="12"
                class="badge-icon"
              />
              <span>Awaiting confirmation</span>
            </div>
          </div>
          <p class="alert-description">
            We emailed a confirmation link to a.ismoilov@workmail.uz. The new
            address only becomes active after you open that link.
          </p>

          <div class="alert-actions">
            <button
              class="resend-email-btn"
              type="button"
              @click="handleResendOtp"
            >
              <RefreshCw :size="12" />
              <span>Resend email</span>
            </button>
            <button
              class="change-address-btn"
              type="button"
            >
              Change address
            </button>
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
</style>
