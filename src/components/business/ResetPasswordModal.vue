<script
  setup
  lang="ts"
>
import {
  Check,
  CircleCheckBig,
  Eye,
  KeyRound,
  Lock,
  RefreshCw,
  Wrench,
} from '@lucide/vue';
import { computed, ref, watch } from 'vue';

interface EmployeeData {
  id: string;
  name: string;
  initials: string;
  email?: string;
  role: string;
  avatarColor: string;
}

const props = defineProps<{
  isOpen: boolean;
  employee: EmployeeData | null;
}>();

const emit = defineEmits<{
  cancel: [];
  confirm: [];
}>();

const orgName = 'AutoFix MCHJ';
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const requireChangeAtSignIn = ref(true);

const employeeEmail = computed(() => {
  if (!props.employee) {
    return '';
  }
  return (
    props.employee.email ??
    `${props.employee.name.toLowerCase().replace(/\s+/g, '.')}@autofix.uz`
  );
});

const passwordsMatch = computed(
  () =>
    confirmPassword.value.length > 0 &&
    password.value === confirmPassword.value,
);

const passwordStrength = computed(() => {
  const p = password.value;
  if (p.length < 8) {
    return { level: 1, label: 'Weak', color: '#CC3314' };
  }
  if (p.length < 12) {
    return { level: 3, label: 'Strong', color: '#1FAA59' };
  }
  return { level: 4, label: 'Strong', color: '#1FAA59' };
});

function generatePassword() {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%&*';
  let result = '';
  for (let i = 0; i < 14; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  password.value = result;
  confirmPassword.value = result;
}

function onCancel() {
  emit('cancel');
}

function onConfirm() {
  emit('confirm');
}

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      password.value = '';
      confirmPassword.value = '';
      showPassword.value = false;
      generatePassword();
    }
  },
);
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen && employee"
      class="modal-overlay"
      @click.self="onCancel"
    >
      <div class="modal-card">
        <!-- Icon + Title -->
        <div class="modal-header">
          <div class="icon-circle">
            <KeyRound :size="26" />
          </div>
          <div class="modal-text">
            <h2 class="modal-title">Reset password</h2>
            <p class="modal-desc">
              Set a new password for this employee. They'll use it the next time
              they sign in to {{ orgName }}.
            </p>
          </div>
        </div>

        <!-- Employee card -->
        <div class="employee-card">
          <div class="emp-card-left">
            <div
              class="emp-avatar"
              :style="{ background: employee.avatarColor }"
            >
              {{ employee.initials }}
            </div>
            <div class="emp-info">
              <span class="emp-name">{{ employee.name }}</span>
              <span class="emp-email">{{ employeeEmail }}</span>
            </div>
          </div>
          <div class="emp-role-badge">
            <Wrench :size="12" />
            {{ employee.role }}
          </div>
        </div>

        <!-- Divider -->
        <div class="modal-divider" />

        <!-- New password -->
        <div class="field-group">
          <span class="field-label">New password</span>
          <div class="password-input-wrap">
            <Lock :size="16" />
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="password-input"
            >
            <button
              type="button"
              class="icon-btn"
              @click="showPassword = !showPassword"
            >
              <Eye :size="16" />
            </button>
            <button
              type="button"
              class="generate-btn"
              @click="generatePassword"
            >
              <RefreshCw :size="12" />
              Generate
            </button>
          </div>
          <div class="strength-row">
            <div class="strength-bar">
              <div
                v-for="n in 4"
                :key="n"
                class="strength-segment"
                :style="{
                  background:
                    n <= passwordStrength.level ? passwordStrength.color : 'var(--border)',
                }"
              />
            </div>
            <span
              class="strength-label"
              :style="{ color: passwordStrength.color }"
            >
              {{ passwordStrength.label }}
              password
            </span>
          </div>
        </div>

        <!-- Confirm password -->
        <div class="field-group">
          <span class="field-label">Confirm new password</span>
          <div class="password-input-wrap">
            <Lock :size="16" />
            <input
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              class="password-input"
            >
            <CircleCheckBig
              v-if="passwordsMatch"
              :size="16"
              class="match-icon"
            />
          </div>
          <div
            v-if="passwordsMatch"
            class="match-text"
          >
            <Check :size="13" />
            Both passwords match
          </div>
        </div>

        <!-- Checkbox -->
        <label class="checkbox-row">
          <span class="checkbox-box">
            <input
              v-model="requireChangeAtSignIn"
              type="checkbox"
              class="checkbox-hidden"
            >
            <Check
              v-if="requireChangeAtSignIn"
              :size="11"
              class="checkbox-check"
            />
          </span>
          Require a password change at next sign-in
        </label>

        <!-- Actions -->
        <div class="modal-actions">
          <button
            type="button"
            class="btn btn--secondary"
            @click="onCancel"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn--primary"
            @click="onConfirm"
          >
            <Check :size="15" />
            Update password
          </button>
        </div>

        <!-- Footer note -->
        <p class="footer-note">
          The employee will be notified by email at {{ employeeEmail }} once the
          password changes.
        </p>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* ===== Overlay ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 20px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.6);
}

/* ===== Modal card ===== */
.modal-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 560px;
  max-width: 90vw;
  padding: 36px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

/* ===== Header ===== */
.modal-header {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
}

.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  color: var(--primary-foreground);
  background: var(--primary);
  border-radius: var(--radius-pill);
}

.modal-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
}

.modal-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--foreground);
}

.modal-desc {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--muted-foreground);
}

/* ===== Employee card ===== */
.employee-card {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  background: var(--accent);
  border-radius: var(--radius-xl);
}

.emp-card-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.emp-avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--primary-foreground);
  border-radius: var(--radius-pill);
}

.emp-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.emp-name {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.emp-email {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.emp-role-badge {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 5px 12px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #001133;
  white-space: nowrap;
  background: #c9d6f0;
  border-radius: var(--radius-pill);
}

/* ===== Divider ===== */
.modal-divider {
  height: 1px;
  background: var(--border);
}

/* ===== Field group ===== */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
}

.password-input-wrap {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 16px;
  color: var(--muted-foreground);
  background: var(--background);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-pill);
}

.password-input {
  flex: 1;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  outline: none;
  background: transparent;
  border: none;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  color: var(--muted-foreground);
  cursor: pointer;
  background: none;
  border: none;
}

.icon-btn:hover {
  color: var(--foreground);
}

.generate-btn {
  display: inline-flex;
  gap: 5px;
  align-items: center;
  padding: 5px 10px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--foreground);
  cursor: pointer;
  background: var(--accent);
  border: none;
  border-radius: var(--radius-pill);
}

.generate-btn:hover {
  opacity: 0.85;
}

/* ===== Strength ===== */
.strength-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.strength-bar {
  display: flex;
  gap: 4px;
  width: 140px;
}

.strength-segment {
  flex: 1;
  height: 5px;
  border-radius: var(--radius-pill);
}

.strength-label {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
}

.match-icon {
  flex-shrink: 0;
  color: #1faa59;
}

.match-text {
  display: flex;
  gap: 6px;
  align-items: center;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #1faa59;
}

/* ===== Checkbox ===== */
.checkbox-row {
  display: flex;
  gap: 10px;
  align-items: center;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--foreground);
  cursor: pointer;
}

.checkbox-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: var(--primary);
  border-radius: var(--radius-sm);
}

.checkbox-hidden {
  position: absolute;
  inset: 0;
  cursor: pointer;
  opacity: 0;
}

.checkbox-check {
  color: var(--primary-foreground);
}

/* ===== Actions ===== */
.modal-actions {
  display: flex;
  gap: 12px;
}

.btn {
  display: inline-flex;
  flex: 1;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-pill);
  transition: opacity 0.15s;
}

.btn--secondary {
  color: var(--foreground);
  background: var(--accent);
}

.btn--secondary:hover {
  opacity: 0.85;
}

.btn--primary {
  font-weight: 600;
  color: var(--primary-foreground);
  background: var(--primary);
}

.btn--primary:hover {
  opacity: 0.9;
}

/* ===== Footer note ===== */
.footer-note {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.45;
  color: var(--muted-foreground);
  text-align: center;
}
</style>
