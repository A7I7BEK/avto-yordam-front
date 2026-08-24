<script
  setup
  lang="ts"
>
import { ArrowLeft, Check, ChevronDown, Loader2 } from '@lucide/vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { colorSwatches, permissionTemplates } from '@/data/roles';
import {
  createRole,
  getPermissions,
  getRole,
  getRolePermissionIds,
  updateRole,
} from '@/services/rolesService';
import type {
  PermissionCategory,
  PermissionResponse,
  Role,
} from '@/types/business';

const route = useRoute();
const router = useRouter();

const isEdit = ref(false);
const roleId = ref<string | null>(null);

const form = ref({
  name: '',
  description: '',
  color: 'var(--primary)',
  template: 'blank',
});

const errors = ref<Record<string, string>>({});
const saving = ref(false);
const loadingPerms = ref(true);

const allPermissions = ref<PermissionResponse[]>([]);
const permissionCategories = ref<PermissionCategory[]>([]);
const collapsedCats = ref<Set<string>>(new Set());

const PERMISSION_SUFFIX_REGEX = /_(CREATE|READ|UPDATE|DELETE)$/;

const templateOptions = [
  { value: 'blank', label: 'Start blank' },
  { value: 'manager', label: 'Manager template' },
  { value: 'dispatcher', label: 'Dispatcher template' },
];

interface GroupedCategory {
  id: string;
  name: string;
  permissions: {
    id: string;
    label: string;
    code: string;
    allowed: boolean;
  }[];
}

const groupedCategories = computed<GroupedCategory[]>(() => {
  const groups = new Map<string, GroupedCategory>();

  for (const perm of allPermissions.value) {
    const prefix = perm.code.replace(PERMISSION_SUFFIX_REGEX, '');
    const catKey = prefix || 'OTHER';
    let group = groups.get(catKey);
    if (!group) {
      const label = catKey
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
      group = { id: catKey, name: label, permissions: [] };
      groups.set(catKey, group);
    }
    group.permissions.push({
      id: perm.id,
      label: perm.name || perm.code,
      code: perm.code,
      allowed: permissionCategories.value
        .flatMap((c) => c.permissions)
        .some((p) => p.id === perm.id && p.allowed),
    });
  }

  return Array.from(groups.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
});

const templatePermissionIds = computed(() => {
  const tmpl = (permissionTemplates as Record<string, PermissionCategory[]>)[
    form.value.template
  ];
  if (!tmpl) {
    return [];
  }
  const ids: string[] = [];
  for (const cat of tmpl) {
    for (const perm of cat.permissions) {
      if (perm.allowed) {
        ids.push(perm.id);
      }
    }
  }
  return ids;
});

onMounted(async () => {
  const id = route.params.id as string | undefined;
  if (id && route.name === 'biz-role-form-edit') {
    isEdit.value = true;
    roleId.value = id;
  }

  try {
    const [perms, roleData] = await Promise.all([
      getPermissions(),
      isEdit.value && roleId.value
        ? Promise.all([
            getRole(roleId.value),
            getRolePermissionIds(roleId.value),
          ])
        : Promise.resolve([null, null]),
    ]);

    allPermissions.value = perms;

    if (isEdit.value && roleData[0]) {
      const role = roleData[0] as Role;
      const rolePermIds = roleData[1] as string[];
      const allowedSet = new Set(rolePermIds);
      form.value = {
        name: role.name,
        description: role.description,
        color: role.color,
        template: 'blank',
      };
      // Build permission categories with real backend IDs marked as allowed
      permissionCategories.value = [
        {
          id: 'template',
          name: 'Permissions',
          permissions: allPermissions.value.map((p) => ({
            id: p.id,
            label: p.name,
            allowed: allowedSet.has(p.id),
          })),
        },
      ];
    } else {
      // New role — apply template selection
      applyTemplate(form.value.template);
    }
  } finally {
    loadingPerms.value = false;
  }
});

// Apply template when selection changes (new role only)
watch(
  () => form.value.template,
  (tmpl) => {
    if (!isEdit.value) {
      applyTemplate(tmpl);
    }
  },
);

function applyTemplate(template: string) {
  const tmpl = (permissionTemplates as Record<string, PermissionCategory[]>)[
    template
  ];
  if (!tmpl) {
    permissionCategories.value = [];
    return;
  }

  const allowedIds = new Set<string>();
  for (const cat of tmpl) {
    for (const perm of cat.permissions) {
      if (perm.allowed) {
        allowedIds.add(perm.id);
      }
    }
  }

  // Map template allowed IDs to real permission IDs
  const realIds = new Set<string>();
  for (const perm of allPermissions.value) {
    const codeKey = perm.code.toLowerCase().replace(/_/g, '-');
    for (const tid of allowedIds) {
      if (codeKey.includes(tid.replace('perm-', '')) || tid === perm.id) {
        realIds.add(perm.id);
      }
    }
  }

  permissionCategories.value = [
    {
      id: 'template',
      name: 'Permissions',
      permissions: allPermissions.value.map((p) => ({
        id: p.id,
        label: p.name,
        allowed: realIds.has(p.id),
      })),
    },
  ];
}

function toggleCollapse(catId: string) {
  const next = new Set(collapsedCats.value);
  if (next.has(catId)) {
    next.delete(catId);
  } else {
    next.add(catId);
  }
  collapsedCats.value = next;
}

function togglePermission(permId: string) {
  const updated = permissionCategories.value
    .flatMap((c) => c.permissions)
    .map((p) => (p.id === permId ? { ...p, allowed: !p.allowed } : p));

  permissionCategories.value = [
    { id: 'template', name: 'Permissions', permissions: updated },
  ];
}

function selectAllInCategory(catId: string) {
  const updated = permissionCategories.value
    .flatMap((c) => c.permissions)
    .map((p) => {
      const group = groupedCategories.value.find((g) => g.id === catId);
      if (group?.permissions.some((gp) => gp.id === p.id)) {
        return { ...p, allowed: true };
      }
      return p;
    });

  permissionCategories.value = [
    { id: 'template', name: 'Permissions', permissions: updated },
  ];
}

function deselectAllInCategory(catId: string) {
  const updated = permissionCategories.value
    .flatMap((c) => c.permissions)
    .map((p) => {
      const group = groupedCategories.value.find((g) => g.id === catId);
      if (group?.permissions.some((gp) => gp.id === p.id)) {
        return { ...p, allowed: false };
      }
      return p;
    });

  permissionCategories.value = [
    { id: 'template', name: 'Permissions', permissions: updated },
  ];
}

function getSelectedPermissionIds(): string[] {
  return permissionCategories.value
    .flatMap((c) => c.permissions)
    .filter((p) => p.allowed)
    .map((p) => p.id);
}

function allowedCountInCategory(catId: string): number {
  const group = groupedCategories.value.find((g) => g.id === catId);
  if (!group) {
    return 0;
  }
  const groupIds = new Set(group.permissions.map((p) => p.id));
  return permissionCategories.value
    .flatMap((c) => c.permissions)
    .filter((p) => groupIds.has(p.id) && p.allowed).length;
}

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

  const permissionIds = getSelectedPermissionIds();

  try {
    if (isEdit.value && roleId.value) {
      await updateRole(
        roleId.value,
        {
          name: form.value.name,
          description: form.value.description,
          color: form.value.color,
        },
        permissionIds,
      );
      router.push(`/business/roles-permissions/${roleId.value}`);
    } else {
      const newRole = await createRole(
        {
          name: form.value.name,
          description: form.value.description,
          color: form.value.color,
        },
        permissionIds,
      );
      router.push(`/business/roles-permissions/${newRole.id}`);
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
          {{ isEdit ? 'Update the role details.' : 'Select a template to pre-fill permissions for this role.' }}
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

    <!-- Permissions section -->
    <div class="form-card">
      <div class="form-group">
        <span class="form-label">Permissions</span>
        <p class="form-hint">
          Choose what this role can do. Permissions are loaded from the system.
        </p>
      </div>

      <div
        v-if="loadingPerms"
        class="loading-state"
      >
        <Loader2
          :size="20"
          class="spin"
        />
        <span>Loading permissions…</span>
      </div>

      <template v-else-if="groupedCategories.length === 0">
        <p class="empty-perms">No permissions available.</p>
      </template>

      <template v-else>
        <div
          v-for="cat in groupedCategories"
          :key="cat.id"
          class="perm-category"
        >
          <div
            class="perm-category__header"
            @click="toggleCollapse(cat.id)"
          >
            <div class="perm-category__title-row">
              <ChevronDown
                :size="14"
                class="perm-category__chevron"
                :class="{ rotated: !collapsedCats.has(cat.id) }"
              />
              <span class="perm-category__name">{{ cat.name }}</span>
              <span class="perm-category__count">
                {{ allowedCountInCategory(cat.id) }}/{{ cat.permissions.length }}
              </span>
            </div>
            <div class="perm-category__actions">
              <button
                type="button"
                class="btn-link"
                @click.stop="selectAllInCategory(cat.id)"
              >
                All
              </button>
              <span class="perm-category__sep">|</span>
              <button
                type="button"
                class="btn-link"
                @click.stop="deselectAllInCategory(cat.id)"
              >
                None
              </button>
            </div>
          </div>
          <div
            v-if="!collapsedCats.has(cat.id)"
            class="perm-category__body"
          >
            <label
              v-for="perm in cat.permissions"
              :key="perm.id"
              class="perm-checkbox"
            >
              <input
                type="checkbox"
                class="perm-checkbox__input"
                :checked="perm.allowed"
                @change="togglePermission(perm.id)"
              >
              <span class="perm-checkbox__label">{{ perm.label }}</span>
              <code class="perm-checkbox__code">{{ perm.code }}</code>
            </label>
          </div>
        </div>
      </template>
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

/* ── Permissions section ── */
.loading-state {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 32px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--muted-foreground);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-perms {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--muted-foreground);
  text-align: center;
}

.perm-category {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.perm-category__header {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
  background: var(--accent);
  transition: background 0.15s;
}

.perm-category__header:hover {
  background: var(--border);
}

.perm-category__title-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.perm-category__chevron {
  color: var(--muted-foreground);
  transition: transform 0.2s;
}

.perm-category__chevron.rotated {
  transform: rotate(0deg);
}

.perm-category__chevron:not(.rotated) {
  transform: rotate(-90deg);
}

.perm-category__name {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.perm-category__count {
  padding: 2px 8px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: var(--muted-foreground);
  background: var(--border);
  border-radius: var(--radius-pill);
}

.perm-category__actions {
  display: flex;
  gap: 4px;
  align-items: center;
}

.btn-link {
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: var(--primary);
  cursor: pointer;
  background: none;
  border: none;
}

.btn-link:hover {
  text-decoration: underline;
}

.perm-category__sep {
  font-size: 11px;
  color: var(--border);
}

.perm-category__body {
  display: flex;
  flex-direction: column;
  padding: 4px 0;
}

.perm-checkbox {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.1s;
}

.perm-checkbox:hover {
  background: var(--accent);
}

.perm-checkbox__input {
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
  cursor: pointer;
}

.perm-checkbox__label {
  flex: 1;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--foreground);
}

.perm-checkbox__code {
  padding: 2px 6px;
  font-family: "SF Mono", "Cascadia Code", monospace;
  font-size: 11px;
  color: var(--muted-foreground);
  background: var(--accent);
  border-radius: 4px;
}
</style>
