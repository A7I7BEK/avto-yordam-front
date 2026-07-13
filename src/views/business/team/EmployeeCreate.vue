<script
  setup
  lang="ts"
>
import { Eye, EyeOff } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface RoleOption {
  id: string;
  name: string;
  code?: string;
}

const rolesList = ref<RoleOption[]>([]);

async function fetchRoles() {
  if (isMockMode()) {
    rolesList.value = [
      { id: 'role-master-id', name: 'Master', code: 'MASTER' },
      {
        id: 'role-receptionist-id',
        name: 'Receptionist',
        code: 'RECEPTIONIST',
      },
      { id: 'role-admin-id', name: 'Admin', code: 'ADMIN' },
    ];
    return;
  }
  try {
    const list = await apiClient.get('/role/get-for-organization');
    if (Array.isArray(list)) {
      rolesList.value = list.map((r: unknown) => {
        const item = r as Record<string, unknown>;
        return {
          id: String(item.id || ''),
          name: String(item.name || ''),
          code: String(item.code || ''),
        };
      });
    }
  } catch {
    try {
      const list = await apiClient.get('/role');
      if (Array.isArray(list)) {
        rolesList.value = list.map((r: unknown) => {
          const item = r as Record<string, unknown>;
          return {
            id: String(item.id || ''),
            name: String(item.name || ''),
            code: String(item.code || ''),
          };
        });
      }
    } catch {
      rolesList.value = [];
    }
  }
}

onMounted(() => {
  fetchRoles();
});

const router = useRouter();

const form = ref({
  fullName: '',
  password: '',
  phone: '',
  email: '',
  birthday: '',
  role: '',
  specialization: '',
});

const errors = ref<Record<string, string>>({});
const errorMessage = ref('');
const submitted = ref(false);
const showPassword = ref(false);
const isSaving = ref(false);

function validate() {
  const errs: Record<string, string> = {};

  if (!form.value.fullName.trim()) {
    errs.fullName = 'Full name is required';
  }

  if (!form.value.password) {
    errs.password = 'Password is required';
  } else if (form.value.password.length < 6) {
    errs.password = 'Password must be at least 6 characters';
  }

  if (!(form.value.phone.trim() || form.value.email.trim())) {
    errs.contact = 'Either phone number or email is required';
  }

  if (form.value.email.trim() && !EMAIL_REGEX.test(form.value.email.trim())) {
    errs.email = 'Invalid email format';
  }

  if (!form.value.role) {
    errs.role = 'Role is required';
  }

  errors.value = errs;
  return Object.keys(errs).length === 0;
}

async function handleSave() {
  errorMessage.value = '';
  if (!validate()) {
    return;
  }

  isSaving.value = true;
  try {
    const payload: Record<string, unknown> = {
      fullName: form.value.fullName.trim(),
      password: form.value.password,
      roleId: form.value.role,
    };

    if (form.value.phone.trim()) {
      payload.phone = form.value.phone.trim();
    }
    if (form.value.email.trim()) {
      payload.email = form.value.email.trim();
    }
    if (form.value.birthday) {
      payload.birthday = form.value.birthday;
    }
    if (form.value.specialization.trim()) {
      payload.specialization = form.value.specialization.trim();
    }

    if (isMockMode()) {
      submitted.value = true;
      setTimeout(() => {
        router.push('/business/team/employees');
      }, 1000);
      return;
    }

    await apiClient.post('/user', payload);
    submitted.value = true;
    setTimeout(() => {
      router.push('/business/team/employees');
    }, 1000);
  } catch (err: unknown) {
    const errorVal = err as Record<string, unknown> | null;
    errorMessage.value =
      String(errorVal?.message || '') || 'Failed to create employee profile.';
  } finally {
    isSaving.value = false;
  }
}

function handleCancel() {
  router.push('/business/team/employees');
}
</script>

<template>
  <div class="page">
    <div class="page__header">
      <div>
        <h1 class="page__title">Add employee</h1>
        <p class="page__subtitle">Fill in the details to add a new employee</p>
      </div>
    </div>

    <!-- Error Banner -->
    <div
      v-if="errorMessage"
      class="error-banner"
    >
      {{ errorMessage }}
    </div>

    <div class="form-card">
      <div class="form-card__section">
        <!-- Full name -->
        <div class="form-group">
          <label class="form-label">
            Full name <span class="required">*</span>
          </label>
          <input
            v-model="form.fullName"
            type="text"
            class="form-input"
            placeholder="Enter full name"
            :class="{ 'form-input--error': errors.fullName }"
          >
          <span
            v-if="errors.fullName"
            class="form-error"
          >
            {{ errors.fullName }}
          </span>
        </div>

        <!-- Password and Birthday -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              Password <span class="required">*</span>
            </label>
            <div class="password-wrapper">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input password-input-field"
                placeholder="Enter password"
                :class="{ 'form-input--error': errors.password }"
              >
              <button
                type="button"
                class="password-toggle-btn"
                @click="showPassword = !showPassword"
              >
                <component
                  :is="showPassword ? EyeOff : Eye"
                  :size="16"
                />
              </button>
            </div>
            <span
              v-if="errors.password"
              class="form-error"
            >
              {{ errors.password }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Birthday</label>
            <input
              v-model="form.birthday"
              type="date"
              class="form-input"
            >
          </div>
        </div>

        <!-- Contact Method Information -->
        <div class="contact-info-banner">
          At least one contact method (Phone or Email) must be provided.
        </div>

        <!-- Phone and Email -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Phone</label>
            <input
              v-model="form.phone"
              type="tel"
              class="form-input"
              placeholder="+998 XX XXX XX XX"
              :class="{ 'form-input--error': errors.contact }"
            >
            <span
              v-if="errors.contact"
              class="form-error"
            >
              {{ errors.contact }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="form-input"
              placeholder="email@example.com"
              :class="{ 'form-input--error': errors.contact || errors.email }"
            >
            <span
              v-if="errors.email"
              class="form-error"
            >
              {{ errors.email }}
            </span>
          </div>
        </div>

        <!-- Role and Specialization -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              Role <span class="required">*</span>
            </label>
            <select
              v-model="form.role"
              class="form-input"
              :class="{ 'form-input--error': errors.role }"
            >
              <option
                value=""
                disabled
              >
                Select role
              </option>
              <option
                v-for="role in rolesList"
                :key="role.id"
                :value="role.id"
              >
                {{ role.name }}
              </option>
            </select>
            <span
              v-if="errors.role"
              class="form-error"
            >
              {{ errors.role }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Specialization</label>
            <input
              v-model="form.specialization"
              type="text"
              class="form-input"
              placeholder="e.g. Engine Repair"
            >
          </div>
        </div>
      </div>

      <div class="form-card__actions">
        <button
          type="button"
          class="btn btn--outline"
          :disabled="isSaving"
          @click="handleCancel"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn btn--primary"
          :disabled="isSaving"
          @click="handleSave"
        >
          {{ isSaving ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </div>

    <div
      v-if="submitted"
      class="success-toast"
    >
      Employee added successfully!
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
}

.page__header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
}

.page__title {
  margin: 0;
  font-family: var(--font-primary);
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
}

.page__subtitle {
  margin: 4px 0 0;
  font-family: var(--font-primary);
  font-size: 14px;
  color: var(--muted-foreground);
}

/* Form card */
.form-card {
  max-width: 720px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.form-card__section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
}

.form-card__actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
}

/* Form groups */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.required {
  color: var(--destructive);
}

.form-input {
  padding: 10px 12px;
  font-family: var(--font-primary);
  font-size: 14px;
  color: var(--foreground);
  outline: none;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: border-color 0.15s;
}

.form-input:focus {
  border-color: var(--primary);
}

.form-input--error {
  border-color: var(--destructive);
}

.form-error {
  font-family: var(--font-primary);
  font-size: 12px;
  color: var(--destructive);
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-field {
  width: 100%;
  padding-right: 40px;
}

.password-toggle-btn {
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: var(--muted-foreground);
  cursor: pointer;
  background: none;
  border: none;
}

.contact-info-banner {
  padding: 10px 14px;
  font-family: var(--font-primary);
  font-size: 13px;
  color: #3b82f6;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: var(--radius-md);
}

.error-banner {
  max-width: 720px;
  padding: 12px 16px;
  font-family: var(--font-primary);
  font-size: 13px;
  color: var(--destructive);
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
}

/* Buttons */
.btn {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 10px 20px;
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-md);
  transition: opacity 0.15s;
}

.btn:hover {
  opacity: 0.9;
}

.btn--primary {
  color: #ffffff;
  background: #5749f4;
}

.btn--outline {
  color: var(--foreground);
  background: transparent;
  border: 1px solid var(--border);
}

/* Success toast */
.success-toast {
  position: fixed;
  right: 24px;
  bottom: 24px;
  padding: 12px 24px;
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background: var(--success);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-modal);
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
