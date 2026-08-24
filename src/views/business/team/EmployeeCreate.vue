<script
  setup
  lang="ts"
>
import {
  ArrowLeft,
  ChevronDown,
  Sparkles,
  Upload,
  UserPlus,
  UserRound,
} from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { createEmployee as apiCreateEmployee } from '@/services/employeesService';
import { getRoles } from '@/services/rolesService';

const router = useRouter();

const roles = ref<{ id: string; name: string }[]>([]);
const rolesLoading = ref(true);

const fullName = ref('');
const phone = ref('');
const email = ref('');
const password = ref('');
const selectedRole = ref('');
const fileInput = ref<HTMLInputElement | null>(null);
const saving = ref(false);
const createError = ref('');

function triggerFileUpload() {
  fileInput.value?.click();
}

function goBack() {
  router.push('/business/team/employees');
}

function generatePassword() {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  password.value = result;
}

async function createEmployee() {
  createError.value = '';
  if (!fullName.value.trim()) {
    createError.value = 'Full name is required';
    return;
  }
  if (!password.value.trim()) {
    createError.value = 'Password is required';
    return;
  }
  if (!selectedRole.value) {
    createError.value = 'Role is required';
    return;
  }
  saving.value = true;
  try {
    await apiCreateEmployee({
      fullName: fullName.value,
      phone: phone.value || undefined,
      email: email.value || undefined,
      password: password.value,
      roleId: selectedRole.value,
    });
    router.push('/business/team/employees');
  } catch (e: any) {
    createError.value = e.message ?? 'Failed to create employee';
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  try {
    const data = await getRoles();
    roles.value = data.map((r) => ({ id: r.id, name: r.name }));
  } finally {
    rolesLoading.value = false;
  }
});
</script>

<template>
  <div class="add-employee-page">
    <!-- Back link -->
    <button
      type="button"
      class="back-link"
      @click="goBack"
    >
      <ArrowLeft :size="14" />
      Back
    </button>

    <!-- Page header -->
    <div class="page-header">
      <div class="header-text">
        <h1 class="page-title">Add employee</h1>
        <p class="page-subtitle">
          Create a new team member and set their access level.
        </p>
      </div>
      <button
        type="button"
        class="btn btn--primary"
        :disabled="saving"
        @click="createEmployee"
      >
        <UserPlus
          v-if="!saving"
          :size="15"
        />
        <span>{{ saving ? 'Creating...' : 'Create employee' }}</span>
      </button>
    </div>

    <!-- Form card -->
    <div class="form-card">
      <!-- Avatar section -->
      <div class="avatar-section">
        <div class="avatar-circle">
          <UserRound :size="32" />
        </div>
        <div class="avatar-info">
          <span class="avatar-title">Profile photo</span>
          <span class="avatar-desc">
            Upload a clear photo of the team member. PNG or JPG, up to 2MB.
          </span>
          <div class="avatar-actions">
            <input
              ref="fileInput"
              type="file"
              accept="image/png, image/jpeg"
              class="file-input-hidden"
            >
            <button
              type="button"
              class="btn btn--outline"
              @click="triggerFileUpload"
            >
              <Upload :size="13" />
              Upload photo
            </button>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="form-divider" />

      <!-- Details heading -->
      <div class="details-heading">
        <h2 class="details-title">Employee details</h2>
        <p class="details-desc">
          Basic profile information and login credentials for this team member.
        </p>
      </div>

      <!-- Fields -->
      <div class="fields-stack">
        <!-- Full name -->
        <div class="field-group">
          <label
            class="field-label"
            for="full-name"
            >Full name</label
          >
          <input
            id="full-name"
            v-model="fullName"
            type="text"
            class="field-input"
            placeholder="e.g. Azizbek Karimov"
          >
          <span class="field-hint">
            Enter the employee's real name as it should appear across the
            workspace.
          </span>
        </div>

        <!-- Email -->
        <div class="field-group">
          <label
            class="field-label"
            for="email"
            >Email address</label
          >
          <input
            id="email"
            v-model="email"
            type="email"
            class="field-input"
            placeholder="name@autofix.uz"
          >
          <span class="field-hint">
            Used for signing in and receiving account notifications.
          </span>
        </div>

        <!-- Phone -->
        <div class="field-group">
          <label
            class="field-label"
            for="phone"
            >Phone number</label
          >
          <input
            id="phone"
            v-model="phone"
            type="tel"
            class="field-input"
            placeholder="+998 90 123 45 67"
          >
          <span class="field-hint">
            Optional. Used for account recovery and notifications.
          </span>
        </div>

        <!-- Password -->
        <div class="field-group">
          <label
            class="field-label"
            for="password"
            >Password</label
          >
          <input
            id="password"
            v-model="password"
            type="text"
            class="field-input"
            placeholder="Create a secure password"
          >
          <button
            type="button"
            class="generate-link"
            @click="generatePassword"
          >
            <Sparkles :size="13" />
            Generate a strong password
          </button>
        </div>

        <!-- Error -->
        <div
          v-if="createError"
          class="field-error"
        >
          {{ createError }}
        </div>

        <!-- Role -->
        <div class="field-group">
          <label
            class="field-label"
            for="role"
            >Role</label
          >
          <div class="select-wrapper">
            <select
              id="role"
              v-model="selectedRole"
              class="field-select"
            >
              <option
                value=""
                disabled
              >
                Select a role
              </option>
              <option
                v-for="role in roles"
                :key="role.id"
                :value="role.id"
              >
                {{ role.name }}
              </option>
            </select>
            <ChevronDown
              :size="16"
              class="select-chevron"
            />
          </div>
          <span class="field-hint">
            Controls which areas of the app this employee can access.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== Page layout ===== */
.add-employee-page {
  max-width: 720px;
  padding: 24px 0;
  margin: auto;
}

/* ===== Back link ===== */
.back-link {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 0;
  margin-bottom: 18px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
  cursor: pointer;
  background: none;
  border: none;
}

.back-link:hover {
  color: var(--foreground);
}

/* ===== Page header ===== */
.page-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
}

.page-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Buttons ===== */
.btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-pill);
  transition: opacity 0.15s;
}

.btn--primary {
  color: var(--primary-foreground);
  background: var(--primary);
}

.btn--primary:hover {
  opacity: 0.9;
}

.btn--primary:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn--outline {
  font-size: 13px;
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
}

.btn--outline:hover {
  border-color: var(--primary);
}

/* ===== Form card ===== */
.form-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

/* ===== Avatar section ===== */
.avatar-section {
  display: flex;
  gap: 20px;
  align-items: center;
}

.avatar-circle {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  color: var(--muted-foreground);
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
}

.avatar-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.avatar-title {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.avatar-desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.avatar-actions {
  display: flex;
  gap: 8px;
}

/* ===== Divider ===== */
.form-divider {
  height: 1px;
  background: var(--border);
}

/* ===== Details heading ===== */
.details-heading {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.details-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
}

.details-desc {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Fields stack ===== */
.fields-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ===== Field group ===== */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
}

.field-input {
  padding: 18px 24px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--foreground);
  outline: none;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  transition: border-color 0.15s;
}

.field-input::placeholder {
  color: var(--muted-foreground);
}

.field-input:focus {
  border-color: var(--primary);
}

.field-select {
  padding: 18px 24px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--foreground);
  appearance: none;
  cursor: pointer;
  outline: none;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  transition: border-color 0.15s;
}

.field-select:focus {
  border-color: var(--primary);
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.select-wrapper .field-select {
  width: 100%;
}

.select-chevron {
  position: absolute;
  right: 18px;
  color: var(--muted-foreground);
  pointer-events: none;
}

.file-input-hidden {
  display: none;
}

.field-error {
  padding: 10px 14px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: var(--destructive);
  background: var(--destructive-soft);
  border: 1px solid var(--destructive);
  border-radius: 6px;
}

.field-hint {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Generate password link ===== */
.generate-link {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  align-self: flex-start;
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--primary);
  cursor: pointer;
  background: none;
  border: none;
}

.generate-link:hover {
  text-decoration: underline;
}
</style>
