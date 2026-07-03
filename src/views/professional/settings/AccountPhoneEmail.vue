<script
  setup
  lang="ts"
>
import { ref } from 'vue';
import {
  Check,
  Clock,
  Mail,
  MessageSquare,
  RefreshCw,
  Send,
  Shield,
  BadgeCheck,
} from '@lucide/vue';

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
      <p class="card-description">Used for SMS alerts about new jobs and incoming customer calls.</p>

      <!-- Current Phone Row -->
      <div class="current-info-box">
        <div class="info-label-group">
          <span class="info-label">Current number</span>
          <span class="info-value">{{ currentPhone }}</span>
        </div>
        <div class="badge badge-verified">
          <BadgeCheck :size="16" class="badge-icon" />
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
          />
        </div>
        <button class="action-btn" type="button">
          <MessageSquare :size="16" />
          <span>Send code</span>
        </button>
      </div>

      <!-- SMS Verification alert Box -->
      <div class="alert-box alert-warning">
        <div class="alert-left-bar" />
        <div class="alert-content">
          <div class="alert-header">
            <Shield :size="18" class="alert-icon" />
            <h3 class="alert-title">SMS verification required</h3>
          </div>
          <p class="alert-description">
            We sent a 6-digit code to +998 90 ••• 45 67. Your number is not saved until this code is confirmed.
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
            />
          </div>

          <div class="alert-footer">
            <span class="timer-text">Resend code in {{ otpTimeLeft }}</span>
            <button class="confirm-btn" type="button" @click="handleConfirmNumber">
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
      <p class="card-description">Used for receipts, security alerts and password recovery.</p>

      <!-- Current Email Row -->
      <div class="current-info-box">
        <div class="info-label-group">
          <span class="info-label">Current email</span>
          <span class="info-value">{{ currentEmail }}</span>
        </div>
        <div class="badge badge-verified">
          <BadgeCheck :size="16" class="badge-icon" />
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
          />
        </div>
        <button class="action-btn" type="button" @click="handleSendLink">
          <Send :size="14" />
          <span>Send link</span>
        </button>
      </div>

      <!-- Confirmation email alert Box -->
      <div class="alert-box alert-info">
        <div class="alert-left-bar" />
        <div class="alert-content">
          <div class="alert-header">
            <Mail :size="18" class="alert-icon" />
            <h3 class="alert-title">Confirmation link sent</h3>
            <div class="badge badge-awaiting">
              <Clock :size="12" class="badge-icon" />
              <span>Awaiting confirmation</span>
            </div>
          </div>
          <p class="alert-description">
            We emailed a confirmation link to a.ismoilov@workmail.uz. The new address only becomes active after you open that link.
          </p>

          <div class="alert-actions">
            <button class="resend-email-btn" type="button" @click="handleResendOtp">
              <RefreshCw :size="12" />
              <span>Resend email</span>
            </button>
            <button class="change-address-btn" type="button">
              Change address
            </button>
          </div>
        </div>
      </div>

      <div class="info-footer-row">
        <span class="info-dot">i</span>
        <span class="info-footer-text">The new email becomes active only once verified.</span>
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
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 20px;
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
  align-items: center;
  gap: 6px;
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
  color: #9a3412;
  background: #ffedd5;
  padding: 4px 10px;
  font-size: 11px;
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
  flex-direction: column;
  gap: 6px;
  flex: 1;
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
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  transition: border 0.15s;
}

.styled-input:focus {
  border-color: #5749f4;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 46px;
  padding: 0 20px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  background: #5749f4;
  border: none;
  border-radius: 8px;
  cursor: pointer;
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
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 8px;
}

.alert-left-bar {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
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
  align-items: center;
  gap: 8px;
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
  background: #fffbeb;
  color: #78350f;
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
  background: #eff6ff;
  color: #1e3a8a;
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
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
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
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  background: #5749f4;
  border: none;
  border-radius: 999px;
  cursor: pointer;
}

.alert-actions {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 8px;
}

.resend-email-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
}

.change-address-btn {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
  background: none;
  border: none;
  cursor: pointer;
}

/* Info Footer Row */
.info-footer-row {
  display: flex;
  align-items: center;
  gap: 8px;
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
</style>
