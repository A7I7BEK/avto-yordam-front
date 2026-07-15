<script
  setup
  lang="ts"
>
import { ArrowLeft, Check } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { colorSwatches } from '@/data/roles';
import { createRole, getRole, updateRole } from '@/services/rolesService';
import type { Role } from '@/types/business';

const route = useRoute();
const router = useRouter();

const isEdit = ref(false);
const roleId = ref<string | null>(null);

const form = ref({
  name: '',
  description: '',
  color: '#5749F4',
  template: 'blank',
});

const errors = ref<Record<string, string>>({});
const saving = ref(false);

const templateOptions = [
  { value: 'blank', label: 'Start blank' },
  { value: 'manager', label: 'Manager template' },
  { value: 'dispatcher', label: 'Dispatcher template' },
];

onMounted(async () => {
  const id = route.params.id as string | undefined;
  if (id && route.name === 'biz-role-form-edit') {
    isEdit.value = true;
    roleId.value = id;
    const role = await getRole(id);
    if (role) {
      form.value = {
        name: role.name,
        description: role.description,
        color: role.color,
        template: 'blank',
      };
    }
  }
});

function validate() {
  const errs: Record<string, string> = {};
  if (!form.value.name.trim()) {
    errs.name = 'Role name is required';
  }
  if (!form.value.description.trim()) {
    errs.description = 'Description is required';
  }
  errors.value = errs;
  return Object.keys(errs).length === 0;
}

async function handleSave() {
  if (!validate()) {
    return;
  }
  saving.value = true;

  try {
    if (isEdit.value && roleId.value) {
      await updateRole(roleId.value, {
        name: form.value.name,
        description: form.value.description,
        color: form.value.color,
      });
      router.push(`/business/roles-permissions/${roleId.value}`);
    } else {
      const newRole = createRole({
        name: form.value.name,
        description: form.value.description,
        color: form.value.color,
      });
      router.push(`/business/roles-permissions/${newRole.id}/permissions`);
    }
  } finally {
    saving.value = false;
  }
}

function goBack() {
  router.push('/business/roles-permissions');
}

function selectColor(color: string) {
  form.value.color = color;
}
</script>

<template>
  <div class="page">
    <button
      type="button"
      class="back-link"
      @click="goBack"
    >
      <ArrowLeft :size="14" />
      Back to roles
    </button>

    <div class="page__header">
      <div>
        <h1 class="page__title">{{ isEdit ? 'Edit role' : 'Create role' }}</h1>
        <p class="page__subtitle">
          {{ isEdit ? 'Update the role details.' : 'Define a new role and continue to assign permissions.' }}
        </p>
      </div>
      <button
        type="button"
        class="btn btn--primary"
        :disabled="saving"
        @click="handleSave"
      >
        <Check :size="16" />
        {{ saving ? 'Saving…' : 'Save' }}
      </button>
    </div>

    <div class="form-card">
      <!-- Role name -->
      <div class="form-group">
        <label
          for="roleName"
          class="form-label"
          >Role name</label
        >
        <input
          id="roleName"
          v-model="form.name"
          type="text"
          class="form-input"
          placeholder="e.g. Service Advisor"
          :class="{ 'form-input--error': errors.name }"
        >
        <span
          v-if="errors.name"
          class="form-error"
          >{{ errors.name }}</span
        >
      </div>

      <!-- Description -->
      <div class="form-group">
        <label
          for="roleDesc"
          class="form-label"
          >Description</label
        >
        <textarea
          id="roleDesc"
          v-model="form.description"
          class="form-textarea"
          placeholder="Briefly describe what this role can do."
          rows="3"
          :class="{ 'form-input--error': errors.description }"
        ></textarea>
        <span
          v-if="errors.description"
          class="form-error"
          >{{ errors.description }}</span
        >
      </div>

      <!-- Color tag -->
      <div class="form-group">
        <span class="form-label">Color tag</span>
        <div class="swatch-row">
          <button
            v-for="swatch in colorSwatches"
            :key="swatch"
            type="button"
            class="swatch"
            :class="{ 'swatch--selected': form.color === swatch }"
            :style="{ background: swatch }"
            :aria-label="`Color ${swatch}`"
            @click="selectColor(swatch)"
          ></button>
        </div>
      </div>

      <!-- Template -->
      <div class="form-group">
        <label
          for="roleTemplate"
          class="form-label"
          >Based on template</label
        >
        <select
          id="roleTemplate"
          v-model="form.template"
          class="form-select"
          :disabled="isEdit"
        >
          <option
            v-for="opt in templateOptions"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
        <p
          v-if="isEdit"
          class="form-hint"
        >
          Template selection is only available when creating a new role.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 784px;
  padding: 24px 32px;
  margin: auto;
}

.back-link {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  width: fit-content;
  padding: 0;
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

.page__header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
}

.page__title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
}

.page__subtitle {
  margin: 4px 0 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--muted-foreground);
}

/* Save button */
.btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-pill);
  transition: opacity 0.15s;
}

.btn:hover {
  opacity: 0.9;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn--primary {
  color: var(--primary-foreground);
  background: var(--primary);
}

/* Form card */
.form-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

/* Form groups */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.form-input {
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

.form-input::placeholder {
  color: var(--muted-foreground);
}

.form-input:focus {
  border-color: var(--primary);
}

.form-input--error {
  border-color: var(--destructive);
}

.form-textarea {
  min-height: 80px;
  padding: 16px 24px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--foreground);
  resize: vertical;
  outline: none;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  transition: border-color 0.15s;
}

.form-textarea::placeholder {
  color: var(--muted-foreground);
}

.form-textarea:focus {
  border-color: var(--primary);
}

.form-select {
  padding: 18px 24px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--foreground);
  appearance: none;
  cursor: pointer;
  outline: none;
  background: var(--accent);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23616167' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
}

.form-select:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.form-error {
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: var(--destructive);
}

.form-hint {
  margin: 4px 0 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: var(--muted-foreground);
}

/* Color swatches */
.swatch-row {
  display: flex;
  gap: 14px;
}

.swatch {
  width: 34px;
  height: 34px;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: var(--radius-pill);
  transition:
    border-color 0.15s,
    transform 0.15s;
}

.swatch:hover {
  transform: scale(1.1);
}

.swatch--selected {
  border-color: currentColor;
  box-shadow: 0 0 0 1px var(--background) inset;
}
</style>
