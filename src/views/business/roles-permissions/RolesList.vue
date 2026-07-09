<script
  setup
  lang="ts"
>
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Trash2,
} from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { deleteRole, getRoles } from '@/services/rolesService';
import type { Role } from '@/types/business';

const router = useRouter();

const roles = ref<Role[]>([]);
const loading = ref(true);
const currentPage = ref(1);
const pageSize = 5;

onMounted(async () => {
  try {
    loading.value = true;
    roles.value = await getRoles();
  } finally {
    loading.value = false;
  }
});

const totalPages = computed(() => Math.ceil(roles.value.length / pageSize));

const paginatedRoles = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return roles.value.slice(start, end);
});

const showingStart = computed(() => {
  if (roles.value.length === 0) {
    return 0;
  }
  return (currentPage.value - 1) * pageSize + 1;
});

const showingEnd = computed(() =>
  Math.min(currentPage.value * pageSize, roles.value.length),
);

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) {
    return;
  }
  currentPage.value = page;
}

function goToPrev() {
  goToPage(currentPage.value - 1);
}

function goToNext() {
  goToPage(currentPage.value + 1);
}

const visiblePages = computed(() => {
  const pages: number[] = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) {
    pages.push(-1);
  }
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (end < total - 1) {
    pages.push(-1);
  }
  pages.push(total);

  return pages;
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
  if (paginatedRoles.value.length === 0 && currentPage.value > 1) {
    currentPage.value--;
  }
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
        <table class="roles-table">
          <thead>
            <tr>
              <th class="col--role">Role</th>
              <th class="col--members">Members</th>
              <th class="col--permissions">Permissions</th>
              <th class="col--edited">Last edited</th>
              <th class="col--actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="role in paginatedRoles"
              :key="role.id"
            >
              <td class="col--role">
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
              </td>
              <td class="col--members">{{ role.memberCount }}</td>
              <td class="col--permissions">
                {{ role.isSystem ? 'All permissions' : `${role.enabledPermissionCount} enabled` }}
              </td>
              <td class="col--edited">
                <span class="edited-date">{{ role.lastEditedDate }}</span>
                <span class="edited-by">by {{ role.lastEditedBy }}</span>
              </td>
              <td class="col--actions">
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
              </td>
            </tr>
            <tr v-if="paginatedRoles.length === 0">
              <td
                colspan="5"
                class="table-empty"
              >
                No roles found
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="table-footer">
          <span class="table-footer__text">
            Showing {{ showingStart }}–{{ showingEnd }}
            of {{ roles.length }} roles
          </span>
          <div class="pagination">
            <button
              type="button"
              class="page-btn"
              :disabled="currentPage === 1"
              aria-label="Previous page"
              @click="goToPrev"
            >
              <ChevronLeft :size="14" />
            </button>
            <template
              v-for="page in visiblePages"
              :key="page"
            >
              <span
                v-if="page === -1"
                class="page-btn page-btn--ellipsis"
                >…</span
              >
              <button
                v-else
                type="button"
                class="page-btn"
                :class="{ 'page-btn--active': page === currentPage }"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
            </template>
            <button
              type="button"
              class="page-btn"
              :disabled="currentPage === totalPages"
              aria-label="Next page"
              @click="goToNext"
            >
              <ChevronRight :size="14" />
            </button>
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

/* Real table */
.roles-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

.roles-table thead tr {
  background: var(--accent);
}

.roles-table th {
  padding: 14px 18px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-foreground);
  text-align: left;
}

.roles-table td {
  padding: 14px 18px;
  vertical-align: middle;
  border-bottom: 1px solid var(--border);
}

.roles-table tbody tr:last-child td {
  border-bottom: none;
}

.col--role {
  width: 36%;
}

.col--members {
  width: 11%;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
}

.col--permissions {
  width: 17%;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.col--edited {
  width: 24%;
}

.col--actions {
  width: 12%;
}

.table-empty {
  padding: 32px 18px !important;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--muted-foreground);
  text-align: center;
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

.edited-date {
  display: block;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
}

.edited-by {
  display: block;
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
  transition: opacity 0.15s;
}

.icon-btn:hover {
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

/* Pagination */
.pagination {
  display: flex;
  gap: 4px;
  align-items: center;
}

.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-foreground);
  cursor: pointer;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition: background 0.15s;
}

.page-btn:hover:not(:disabled):not(.page-btn--active) {
  background: var(--accent);
}

.page-btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.page-btn--active {
  font-weight: 600;
  color: var(--primary-foreground);
  background: var(--primary);
  border-color: var(--primary);
}

.page-btn--ellipsis {
  cursor: default;
  background: none;
  border: none;
}
</style>
