<script
  setup
  lang="ts"
>
import { ArrowLeft, BriefcaseBusiness, Check } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  getRole,
  getRolePermissions,
  saveRolePermissions,
} from '@/services/rolesService';
import type { PermissionCategory, Role } from '@/types/business';

const route = useRoute();
const router = useRouter();

const role = ref<Role | null>(null);
const categories = ref<PermissionCategory[]>([]);
const loading = ref(true);
const saving = ref(false);

onMounted(async () => {
  try {
    const id = route.params.id as string;
    const [roleData, permData] = await Promise.all([
      getRole(id),
      getRolePermissions(id),
    ]);
    role.value = roleData;
    categories.value = permData;
  } finally {
    loading.value = false;
  }
});

function togglePermission(catId: string, permId: string) {
  const cat = categories.value.find((c) => c.id === catId);
  if (!cat) {
    return;
  }
  const perm = cat.permissions.find((p) => p.id === permId);
  if (!perm) {
    return;
  }
  perm.allowed = !perm.allowed;
}

async function handleSave() {
  if (!role.value) {
    return;
  }
  saving.value = true;
  try {
    await saveRolePermissions(role.value.id, categories.value);
    router.push(`/business/roles-permissions/${role.value.id}`);
  } finally {
    saving.value = false;
  }
}

function allowedCount(cat: PermissionCategory): number {
  return cat.permissions.filter((p) => p.allowed).length;
}
</script>

<template>
  <div class="page">
    <div
      v-if="loading"
      class="loading-text"
    >
      Loading permissions…
    </div>

    <template v-else-if="role">
      <button
        type="button"
        class="back-link"
        @click="router.go(-1)"
      >
        <ArrowLeft :size="14" />
        Back
      </button>

      <!-- Header -->
      <div class="page-header">
        <div class="page-header__left">
          <div class="title-row">
            <h1 class="page-title">Assign permissions</h1>
            <span
              class="role-badge"
              :style="{ background: role.color, borderColor: role.color, color: 'var(--primary-foreground)' }"
            >
              <BriefcaseBusiness :size="11" />
              {{ role.name }}
            </span>
          </div>
          <p class="page-subtitle">
            Choose what teammates with this role can do. Changes apply to all
            members assigned to this role.
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

      <!-- Permission category cards -->
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="perm-card"
      >
        <div class="perm-card__header">
          <h2 class="perm-card__title">{{ cat.name }}</h2>
          <span class="perm-card__badge">
            <Check :size="12" />
            {{ allowedCount(cat) }}
            of {{ cat.permissions.length }} allowed
          </span>
        </div>

        <table class="perm-table">
          <tbody>
            <tr
              v-for="perm in cat.permissions"
              :key="perm.id"
              :class="{ 'perm-row--muted': !perm.allowed }"
            >
              <td class="perm-cell__label">{{ perm.label }}</td>
              <td class="perm-cell__toggle">
                <button
                  type="button"
                  class="toggle"
                  :class="{ 'toggle--on': perm.allowed }"
                  :aria-label="perm.label"
                  @click="togglePermission(cat.id, perm.id)"
                >
                  <span class="toggle__thumb" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <div
      v-else
      class="loading-text"
    >
      Role not found
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 32px;
}

.loading-text {
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: var(--muted-foreground);
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

/* Header */
.page-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
}

.page-header__left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
}

.role-badge {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 4px 10px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  border-radius: var(--radius-pill);
}

.page-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* Buttons */
.btn {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 12px 20px;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid var(--primary);
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

/* Permission cards */
.perm-card {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

.perm-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid var(--border);
}

.perm-card__title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
}

.perm-card__badge {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 4px 10px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-foreground);
  background: var(--accent);
  border-radius: var(--radius-pill);
}

/* Permission table */
.perm-table {
  width: 100%;
  padding: 14px 24px 24px 24px;
  border-collapse: collapse;
}

.perm-table td {
  padding: 6px 24px;
  vertical-align: middle;
}

.perm-table tbody tr:first-child td {
  padding-top: 24px;
}
.perm-table tbody tr:last-child td {
  padding-bottom: 24px;
}

.perm-cell__label {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
}

.perm-row--muted .perm-cell__label {
  color: var(--muted-foreground);
}

.perm-cell__toggle {
  text-align: right;
}

/* Toggle Switch */
.toggle {
  position: relative;
  flex-shrink: 0;
  width: 40px;
  height: 22px;
  padding: 0;
  cursor: pointer;
  background: var(--border);
  border: none;
  border-radius: var(--radius-pill);
  transition: background 0.2s;
}

.toggle--on {
  background: var(--primary);
}

.toggle__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  background: var(--card);
  border-radius: 50%;
  transition: transform 0.2s;
}

.toggle--on .toggle__thumb {
  transform: translateX(18px);
}
</style>
