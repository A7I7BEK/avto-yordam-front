<script
  setup
  lang="ts"
>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = ref({
  name: '',
  phone: '',
  email: '',
  role: '',
  specialization: '',
});

const errors = ref<Record<string, string>>({});
const submitted = ref(false);

function validate() {
  const errs: Record<string, string> = {};

  if (!form.value.name.trim()) {
    errs.name = 'Full name is required';
  }
  if (!form.value.phone.trim()) {
    errs.phone = 'Phone is required';
  }
  if (!form.value.email.trim()) {
    errs.email = 'Email is required';
  }
  if (!form.value.role) {
    errs.role = 'Role is required';
  }

  errors.value = errs;
  return Object.keys(errs).length === 0;
}

function handleSave() {
  if (!validate()) {
    return;
  }

  submitted.value = true;
  // biome-ignore lint/suspicious/noConsole: allowed in handler
  console.log('Save employee', form.value);

  setTimeout(() => {
    router.push('/business/team/employees');
  }, 300);
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

    <div class="form-card">
      <div class="form-card__section">
        <div class="form-group">
          <label class="form-label"
            >Full name <span class="required">*</span></label
          >
          <input
            v-model="form.name"
            type="text"
            class="form-input"
            placeholder="Enter full name"
            :class="{ 'form-input--error': errors.name }"
          >
          <span
            v-if="errors.name"
            class="form-error"
            >{{ errors.name }}</span
          >
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label"
              >Phone <span class="required">*</span></label
            >
            <input
              v-model="form.phone"
              type="tel"
              class="form-input"
              placeholder="+998 XX XXX XX XX"
              :class="{ 'form-input--error': errors.phone }"
            >
            <span
              v-if="errors.phone"
              class="form-error"
              >{{ errors.phone }}</span
            >
          </div>

          <div class="form-group">
            <label class="form-label"
              >Email <span class="required">*</span></label
            >
            <input
              v-model="form.email"
              type="email"
              class="form-input"
              placeholder="email@example.com"
              :class="{ 'form-input--error': errors.email }"
            >
            <span
              v-if="errors.email"
              class="form-error"
              >{{ errors.email }}</span
            >
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label"
              >Role <span class="required">*</span></label
            >
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
              <option value="Master">Master</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Admin">Admin</option>
            </select>
            <span
              v-if="errors.role"
              class="form-error"
              >{{ errors.role }}</span
            >
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
          @click="handleCancel"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn btn--primary"
          @click="handleSave"
        >
          Save
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
