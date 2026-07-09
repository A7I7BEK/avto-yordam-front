<script
  setup
  lang="ts"
>
import { ArrowLeft, Check, KeyRound, Minus, Pencil } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getRole, getRolePermissions } from '@/services/rolesService';
import type { PermissionCategory, Role } from '@/types/business';

const route = useRoute();
const router = useRouter();

const role = ref<Role | null>(null);
const permissions = ref<PermissionCategory[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const id = route.params.id as string;
    const [roleData, permData] = await Promise.all([
      getRole(id),
      getRolePermissions(id),
    ]);
    role.value = roleData;
    permissions.value = permData;
  } finally {
    loading.value = false;
  }
});

function goBack() {
  router.push('/business/roles-permissions');
}

function editRole() {
  if (!role.value) {
    return;
  }
  router.push(`/business/roles-permissions/${role.value.id}/edit`);
}

function assignPermissions() {
  if (!role.value) {
    return;
  }
  router.push(`/business/roles-permissions/${role.value.id}/permissions`);
}

function allowedCount(cat: PermissionCategory): number {
  return cat.permissions.filter((p) => p.allowed).length;
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

    <div v-if="loading">
      <p class="loading-text">Loading role…</p>
    </div>

    <template v-else-if="role">
      <!-- Header -->
      <div class="detail-header">
        <div class="detail-header__left">
          <div class="role-title-row">
            <span
              class="role-color-dot"
              :style="{ background: role.color }"
            ></span>
            <h1 class="detail-title">{{ role.name }}</h1>
          </div>
        </div>
        <div class="detail-header__actions">
          <button
            type="button"
            class="btn btn--outline"
            @click="editRole"
          >
            <Pencil :size="14" />
            Edit role
          </button>
          <button
            type="button"
            class="btn btn--primary"
            @click="assignPermissions"
          >
            <KeyRound :size="14" />
            Assign permissions
          </button>
        </div>
      </div>

      <!-- Info card -->
      <div class="info-table-wrapper">
        <table class="info-table">
          <thead>
            <tr>
              <th class="info-th">DESCRIPTION</th>
              <th class="info-th">MEMBERS</th>
              <th class="info-th">CREATED</th>
              <th class="info-th">LAST EDITED</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="info-td">{{ role.description }}</td>
              <td class="info-td info-td--lg">{{ role.memberCount }}</td>
              <td class="info-td">
                {{ role.createdDate }}<br>
                <span class="info-sub">by {{ role.createdBy }}</span>
              </td>
              <td class="info-td">
                {{ role.lastEditedDate }}<br>
                <span class="info-sub">by {{ role.lastEditedBy }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Permissions header -->
      <div class="perms-header">
        <div>
          <h2 class="perms-title">Permissions</h2>
          <p class="perms-subtitle">
            Read-only summary of what this role can do.
          </p>
        </div>
        <div class="perms-legends">
          <span class="legend legend--allowed">
            <Check :size="12" />
            Allowed
          </span>
          <span class="legend legend--not-allowed">
            <Minus :size="12" />
            Not allowed
          </span>
        </div>
      </div>

      <!-- Permission cards -->
      <div
        v-for="cat in permissions"
        :key="cat.id"
        class="perm-card"
      >
        <div class="perm-card__header">
          <h3 class="perm-card__title">{{ cat.name }}</h3>
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
              <td class="perm-cell__tag">
                <span
                  class="perm-row__tag"
                  :class="perm.allowed ? 'perm-row__tag--allowed' : 'perm-row__tag--denied'"
                >
                  <Check
                    v-if="perm.allowed"
                    :size="12"
                  />
                  <Minus
                    v-else
                    :size="12"
                  />
                  {{ perm.allowed ? 'Allowed' : 'Not allowed' }}
                </span>
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
  gap: 18px;
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
.detail-header {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
}

.detail-header__left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.role-title-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.role-color-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.detail-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
}

.detail-header__actions {
  display: flex;
  gap: 8px;
}

/* Buttons */
.btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 8px 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
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

.btn--primary {
  color: var(--primary-foreground);
  background: var(--primary);
}

.btn--outline {
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
}

/* Info table */
.info-table-wrapper {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

.info-table {
  width: 100%;
  border-spacing: 0;
  border-collapse: separate;
  background: var(--background);
}

.info-table thead {
  background: var(--accent);
}

.info-th {
  padding: 14px 24px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-foreground);
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.info-td {
  padding: 14px 24px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  vertical-align: middle;
  color: var(--foreground);
}

.info-td--lg {
  font-size: 16px;
  font-weight: 700;
}

.info-sub {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* Permissions header */
.perms-header {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.perms-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
}

.perms-subtitle {
  margin: 4px 0 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: var(--muted-foreground);
}

.perms-legends {
  display: flex;
  gap: 12px;
}

.legend {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  padding: 2px 8px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  border-radius: var(--radius-pill);
}

.legend--allowed {
  color: #003300;
  background: #a1e5a1;
}

.legend--not-allowed {
  color: var(--muted-foreground);
  background: var(--accent);
  border: 1px solid var(--border);
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
  padding: 24px 24px 14px 24px;
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

.perm-table {
  width: 100%;
  padding: 14px 24px 24px 24px;
  border-collapse: collapse;
}

.perm-table td {
  padding: 6px 24px;
  vertical-align: middle;
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

.perm-cell__tag {
  text-align: right;
}

.perm-row__tag {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  padding: 2px 8px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  border-radius: var(--radius-pill);
}

.perm-row__tag--allowed {
  color: #003300;
  background: #a1e5a1;
}

.perm-row__tag--denied {
  color: var(--muted-foreground);
  background: var(--accent);
  border: 1px solid var(--border);
}
</style>
