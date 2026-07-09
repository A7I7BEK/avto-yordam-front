<script
  setup
  lang="ts"
>
import { Eye, Pencil, Plus, Trash2 } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { deleteRole, getRoles } from '@/services/rolesService';
import type { Role } from '@/types/business';

const router = useRouter();

const roles = ref<Role[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    loading.value = true;
    roles.value = await getRoles();
  } finally {
    loading.value = false;
  }
});

function viewRole(id: string) {
  router.push(`/business/roles-permissions/${id}`);
}

function editRole(id: string) {
  router.push(`/business/roles-permissions/${id}/edit`);
}

function handleDelete(role: Role) {
  if (role.isSystem) {
    return;
  }
  deleteRole(role.id);
  roles.value = roles.value.filter((r) => r.id !== role.id);
}
</script>

<template>
  <div class="page">
    <div class="page__breadcrumb">
      <span class="page__breadcrumb-text">Roles &amp; permissions</span>
    </div>

    <div class="page__header">
      <div>
        <h1 class="page__title">Roles</h1>
        <p class="page__subtitle">
          Create roles and decide what each one can do.
        </p>
      </div>
      <button
        type="button"
        class="btn btn--primary"
        @click="router.push('/business/roles-permissions/new')"
      >
        <Plus :size="16" />
        Create role
      </button>
    </div>

    <div class="table-card">
      <div
        v-if="loading"
        class="table-card__loading"
      >
        Loading roles…
      </div>

      <template v-else>
        <!-- Table Header -->
        <div class="table-row table-row--head">
          <span class="col col--role">Role</span>
          <span class="col col--members">Members</span>
          <span class="col col--permissions">Permissions</span>
          <span class="col col--edited">Last edited</span>
          <span class="col col--actions">Actions</span>
        </div>

        <!-- Table Rows -->
        <div
          v-for="role in roles"
          :key="role.id"
          class="table-row"
        >
          <div class="col col--role">
            <div class="role-info">
              <span
                class="role-dot"
                :style="{ background: role.color }"
              />
              <div class="role-text">
                <span class="role-name">{{ role.name }}</span>
                <span class="role-desc">{{ role.description }}</span>
              </div>
            </div>
          </div>

          <span class="col col--members">{{ role.memberCount }}</span>

          <span class="col col--permissions">
            {{ role.isSystem ? 'All permissions' : `${role.enabledPermissionCount} enabled` }}
          </span>

          <div class="col col--edited">
            <span class="edited-date">{{ role.lastEditedDate }}</span>
            <span class="edited-by">by {{ role.lastEditedBy }}</span>
          </div>

          <div class="col col--actions">
            <div class="action-btns">
              <button
                type="button"
                class="icon-btn"
                title="View"
                @click="viewRole(role.id)"
              >
                <Eye :size="16" />
              </button>
              <button
                v-if="!role.isSystem"
                type="button"
                class="icon-btn"
                title="Edit"
                @click="editRole(role.id)"
              >
                <Pencil :size="16" />
              </button>
              <button
                v-if="!role.isSystem"
                type="button"
                class="icon-btn icon-btn--danger"
                title="Delete"
                @click="handleDelete(role)"
              >
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="table-footer">
          <span class="table-footer__text"
            >Showing 1–{{ roles.length }}
            of {{ roles.length }} roles</span
          >
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
  padding: 24px 32px;
}

.page__breadcrumb {
  display: flex;
  gap: 6px;
  align-items: center;
}

.page__breadcrumb-text {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
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

/* Table card */
.table-card {
  overflow: hidden;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

.table-card__loading {
  padding: 40px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: var(--muted-foreground);
  text-align: center;
}

/* Table rows */
.table-row {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
}

.table-row:last-of-type {
  border-bottom: none;
}

.table-row--head {
  background: var(--accent);
}

.table-row--head .col {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-foreground);
}

.col--role {
  flex-shrink: 0;
  width: 360px;
}
.col--members {
  flex-shrink: 0;
  width: 110px;
}
.col--permissions {
  flex-shrink: 0;
  width: 180px;
}
.col--edited {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 2px;
  width: 240px;
}
.col--actions {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  padding-right: 8px;
}

/* Role info */
.role-info {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.role-dot {
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  margin-top: 4px;
  border-radius: 50%;
}

.role-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.role-name {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.role-desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* Column text */
.col--members,
.col--permissions {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
}

.col--permissions {
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.edited-date {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
}

.edited-by {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* Action buttons */
.action-btns {
  display: flex;
  gap: 6px;
  align-items: center;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--foreground);
  cursor: pointer;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  transition: background 0.15s;
}

.icon-btn:hover {
  background: var(--accent);
  opacity: 0.8;
}

.icon-btn--danger {
  color: var(--destructive);
}

/* Footer */
.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background: var(--accent);
  border-top: 1px solid var(--border);
}

.table-footer__text {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}
</style>
