<script
  setup
  lang="ts"
>
import { ArrowLeft, Sparkles, Upload, UserPlus, UserRound } from '@lucide/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface RoleOption {
  id: string;
  name: string;
}

const router = useRouter();

const roles = ref<RoleOption[]>([
  { id: 'role-master', name: 'Master' },
  { id: 'role-receptionist', name: 'Receptionist' },
  { id: 'role-admin', name: 'Admin' },
  { id: 'role-manager', name: 'Manager' },
  { id: 'role-accountant', name: 'Accountant' },
  { id: 'role-mechanic', name: 'Mechanic' },
]);

const fullName = ref('');
const email = ref('');
const password = ref('');
const selectedRole = ref('');

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

function createEmployee() {
  // Create logic
  router.push('/business/team/employees');
}
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
        @click="createEmployee"
      >
        <UserPlus :size="15" />
        Create employee
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
            <button
              type="button"
              class="btn btn--outline"
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

        <!-- Role -->
        <div class="field-group">
          <label
            class="field-label"
            for="role"
            >Role</label
          >
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
