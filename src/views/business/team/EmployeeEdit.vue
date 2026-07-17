<script
  setup
  lang="ts"
>
import { ArrowLeft, Check, ChevronDown, ImageUp, Trash2 } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getEmployee } from '@/services/employeesService';
import type { Employee } from '@/types/business';

interface RoleOption {
  id: string;
  name: string;
}

const route = useRoute();
const router = useRouter();

const employee = ref<Employee | null>(null);
const loading = ref(true);
const fileInput = ref<HTMLInputElement | null>(null);

const roles = ref<RoleOption[]>([
  { id: 'Master', name: 'Master' },
  { id: 'Receptionist', name: 'Receptionist' },
  { id: 'Admin', name: 'Admin' },
  { id: 'Manager', name: 'Manager' },
  { id: 'Accountant', name: 'Accountant' },
  { id: 'Mechanic', name: 'Mechanic' },
]);

const fullName = ref('');
const email = ref('');
const selectedRole = ref('');

onMounted(async () => {
  try {
    const id = route.params.id as string;
    const data = await getEmployee(id);
    if (data) {
      employee.value = data;
      fullName.value = data.name;
      email.value = `${data.name.toLowerCase().replace(/\s+/g, '.')}@autofix.uz`;
      selectedRole.value = data.role;
    }
  } finally {
    loading.value = false;
  }
});

function goBack() {
  router.push('/business/team/employees');
}

function triggerFileUpload() {
  fileInput.value?.click();
}

function removePhoto() {
  // Remove photo logic
}

function saveChanges() {
  router.push('/business/team/employees');
}
</script>

<template>
  <div
    v-if="loading"
    class="loading-state"
  >
    Loading...
  </div>

  <div
    v-else
    class="edit-employee-page"
  >
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
        <h1 class="page-title">Edit employee</h1>
        <p class="page-subtitle">
          Update this team member's details and access level.
        </p>
      </div>
      <button
        type="button"
        class="btn btn--primary"
        @click="saveChanges"
      >
        <Check :size="15" />
        Save changes
      </button>
    </div>

    <!-- Form card -->
    <div class="form-card">
      <!-- Avatar section -->
      <div class="avatar-section">
        <div
          class="avatar-circle"
          :style="{ background: employee?.avatarColor ?? 'var(--primary)' }"
        >
          <span class="avatar-initials">{{ employee?.initials ?? '' }}</span>
        </div>
        <div class="avatar-info">
          <span class="avatar-title">Profile photo</span>
          <span class="avatar-desc">
            Update the team member's photo. PNG or JPG, up to 2MB.
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
              <ImageUp :size="13" />
              Change photo
            </button>
            <button
              type="button"
              class="btn btn--outline"
              @click="removePhoto"
            >
              <Trash2 :size="13" />
              Remove
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
          Update this team member's profile information and access level.
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
          >
          <span class="field-hint">
            The name shown across the workspace and on customer-facing screens.
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
          >
          <span class="field-hint">
            Used for signing in and receiving account notifications.
          </span>
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
/* ===== Loading ===== */
.loading-state {
  padding: 40px 32px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: var(--muted-foreground);
}

/* ===== Page layout ===== */
.edit-employee-page {
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
  font-size: 14px;
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
  border-radius: var(--radius-pill);
}

.avatar-initials {
  font-family: Inter, sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-foreground);
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

.file-input-hidden {
  display: none;
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

.field-hint {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}
</style>
