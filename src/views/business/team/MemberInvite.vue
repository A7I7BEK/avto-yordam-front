<script
  setup
  lang="ts"
>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { createInvitation } from '@/services/invitationsService';
import { getRoles } from '@/services/rolesService';
import { useBusinessAppStore } from '@/stores/businessApp';

const router = useRouter();
const store = useBusinessAppStore();

const roles = ref<{ id: string; name: string }[]>([]);

const form = ref({
  email: '',
  role: '',
  organization: store.orgName,
});

const errors = ref<Record<string, string>>({});
const submitted = ref(false);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate() {
  const errs: Record<string, string> = {};

  if (!form.value.email.trim()) {
    errs.email = 'Email is required';
  } else if (!emailRegex.test(form.value.email)) {
    errs.email = 'Invalid email format';
  }
  if (!form.value.role) {
    errs.role = 'Role is required';
  }
  if (!form.value.organization.trim()) {
    errs.organization = 'Organization is required';
  }

  errors.value = errs;
  return Object.keys(errs).length === 0;
}

async function handleSend() {
  if (!validate()) {
    return;
  }

  submitted.value = true;
  try {
    const role = roles.value.find((r) => r.name === form.value.role);
    await createInvitation({
      email: form.value.email.trim(),
      roleId: role?.id ?? '',
    });
    router.push('/business/team/members');
  } catch {
    submitted.value = false;
  }
}

function handleCancel() {
  router.push('/business/team/members');
}

onMounted(async () => {
  try {
    const data = await getRoles();
    roles.value = data.map((r) => ({ id: r.name, name: r.name }));
  } catch {
    // keep empty
  }
});
</script>

<template>
  <div class="page">
    <div class="page__header">
      <div>
        <h1 class="page__title">Invite team member</h1>
        <p class="page__subtitle">
          Send an invitation to join your organization
        </p>
      </div>
    </div>

    <div class="form-card">
      <div class="form-card__section">
        <div class="form-group">
          <label class="form-label"
            >Email <span class="required">*</span></label
          >
          <input
            v-model="form.email"
            type="email"
            class="form-input"
            placeholder="member@example.com"
            :class="{ 'form-input--error': errors.email }"
          >
          <span
            v-if="errors.email"
            class="form-error"
            >{{ errors.email }}</span
          >
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
              <option
                v-for="role in roles"
                :key="role.id"
                :value="role.name"
              >
                {{ role.name }}
              </option>
            </select>
            <span
              v-if="errors.role"
              class="form-error"
              >{{ errors.role }}</span
            >
          </div>

          <div class="form-group">
            <label class="form-label"
              >Organization <span class="required">*</span></label
            >
            <input
              v-model="form.organization"
              type="text"
              class="form-input"
              placeholder="Organization name"
              :class="{ 'form-input--error': errors.organization }"
            >
            <span
              v-if="errors.organization"
              class="form-error"
              >{{ errors.organization }}</span
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
          @click="handleSend"
        >
          Send invitation
        </button>
      </div>
    </div>

    <div
      v-if="submitted"
      class="success-toast"
    >
      Invitation sent successfully!
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
  max-width: 640px;
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
  color: var(--primary-foreground);
  background: var(--primary);
}

.btn--outline {
  color: var(--foreground);
  background: transparent;
  border: 1px solid var(--border);
}

@media (max-width: 640px) {
  .page {
    padding: 16px 12px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-card__actions {
    flex-direction: column-reverse;
    gap: 10px;
  }

  .form-card__actions .btn {
    justify-content: center;
    width: 100%;
  }
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

/* Success toast */
.success-toast {
  position: fixed;
  right: 24px;
  bottom: 24px;
  padding: 12px 24px;
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-foreground);
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
