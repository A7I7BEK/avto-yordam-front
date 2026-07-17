<script
  setup
  lang="ts"
>
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  Eye,
  KeyRound,
  Pencil,
  Search,
  Trash2,
  UserPlus,
  Users,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import DeleteEmployeeModal from '@/components/business/DeleteEmployeeModal.vue';
import ResetPasswordModal from '@/components/business/ResetPasswordModal.vue';
import { getEmployees } from '@/services/employeesService';
import type { Employee } from '@/types/business';

interface EmployeeRow {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  roleColor: string;
  status: 'Active' | 'Inactive';
  statusLabel: string;
  avatarColor: string;
  lastActive: string;
  lastActiveDate: string;
}

const router = useRouter();
const searchQuery = ref('');
const roleFilter = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const pageSize = 3;
const deleteTarget = ref<EmployeeRow | null>(null);
const resetTarget = ref<EmployeeRow | null>(null);

const employees = ref<EmployeeRow[]>([]);
const loading = ref(true);

const roleColors: Record<string, string> = {
  Owner: '#5749F4',
  Admin: '#CC3314',
  Manager: '#F77E40',
  Accountant: '#2BC8B6',
  Mechanic: '#1FAA59',
  Receptionist: '#00A0E9',
};

const roleDotColors: Record<string, string> = {
  Owner: '#5749F4',
  Admin: '#CC3314',
  Manager: '#F77E40',
  Accountant: '#2BC8B6',
  Mechanic: '#1FAA59',
  Receptionist: '#00A0E9',
};

async function loadEmployees() {
  try {
    loading.value = true;
    const data = await getEmployees();
    employees.value = (data ?? []).map((e: Employee, i: number) => ({
      id: e.id,
      name: e.name,
      initials: e.initials,
      email: `${e.name.toLowerCase().replace(/\s+/g, '.')}@autofix.uz`,
      role: e.role,
      roleColor: roleColors[e.role] ?? '#5749F4',
      status: e.status,
      statusLabel: e.status,
      avatarColor: e.avatarColor,
      lastActive: [
        '5 minutes ago',
        '2 hours ago',
        'Yesterday',
        '3 days ago',
        'Not signed in yet',
        '5 minutes ago',
        '2 hours ago',
      ][i % 7],
      lastActiveDate: [
        'Online now',
        'Today, 09:14',
        'May 20, 2026',
        'May 18, 2026',
        'Invite sent May 19',
        'Online now',
        'Today, 10:30',
      ][i % 7],
    }));
  } finally {
    loading.value = false;
  }
}

loadEmployees();

const roles = computed(() => {
  const unique = new Set(employees.value.map((e) => e.role));
  return Array.from(unique);
});

const filteredEmployees = computed(() =>
  employees.value.filter((e) => {
    const matchSearch =
      !searchQuery.value ||
      e.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchRole = !roleFilter.value || e.role === roleFilter.value;
    const matchStatus = !statusFilter.value || e.status === statusFilter.value;
    return matchSearch && matchRole && matchStatus;
  }),
);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredEmployees.value.length / pageSize)),
);

const pagedEmployees = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredEmployees.value.slice(start, start + pageSize);
});

const showingStart = computed(() => {
  if (filteredEmployees.value.length === 0) {
    return 0;
  }
  return (currentPage.value - 1) * pageSize + 1;
});

const showingEnd = computed(() =>
  Math.min(currentPage.value * pageSize, filteredEmployees.value.length),
);

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

function viewEmployee(id: string) {
  router.push(`/business/team/employees/${id}`);
}

function editEmployee(id: string) {
  router.push(`/business/team/employees/${id}/edit`);
}

function resetPassword(id: string) {
  const emp = employees.value.find((e) => e.id === id) ?? null;
  resetTarget.value = emp;
}

function deleteEmployee(id: string) {
  const emp = employees.value.find((e) => e.id === id) ?? null;
  deleteTarget.value = emp;
}

function confirmDelete(id: string) {
  employees.value = employees.value.filter((e) => e.id !== id);
  deleteTarget.value = null;
}

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
</script>

<template>
  <div class="employees-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-text">
        <h1 class="page-title">Employees</h1>
        <p class="page-subtitle">
          Manage team members, their roles and account access.
        </p>
      </div>
      <button
        type="button"
        class="btn btn--primary"
        @click="router.push('/business/team/employees/new')"
      >
        <UserPlus :size="15" />
        Add employee
      </button>
    </div>

    <!-- Table card -->
    <div class="table-card">
      <!-- Toolbar -->
      <div class="toolbar">
        <div class="search-box">
          <Search
            :size="15"
            class="search-icon"
          />
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Search employees by name or email..."
          >
        </div>
        <div class="filter-group">
          <div class="filter-pill">
            <Users :size="14" />
            <select
              v-model="roleFilter"
              class="filter-select"
            >
              <option value="">All roles</option>
              <option
                v-for="role in roles"
                :key="role"
                :value="role"
              >
                {{ role }}
              </option>
            </select>
            <ChevronDown :size="14" />
          </div>
          <div class="filter-pill">
            <CircleCheckBig :size="14" />
            <select
              v-model="statusFilter"
              class="filter-select"
            >
              <option value="">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown :size="14" />
          </div>
        </div>
      </div>

      <!-- Table -->
      <table class="data-table">
        <thead>
          <tr class="column-headers">
            <th>Employee</th>
            <th>Role</th>
            <th>Status</th>
            <th>Last active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="!loading && pagedEmployees.length === 0"
            class="empty-row"
          >
            <td
              colspan="5"
              class="empty-state"
            >
              No employees found
            </td>
          </tr>
          <tr
            v-for="emp in pagedEmployees"
            :key="emp.id"
            class="data-row"
          >
            <!-- Employee cell -->
            <td>
              <div class="employee-cell">
                <div
                  class="avatar"
                  :style="{ background: emp.avatarColor }"
                >
                  {{ emp.initials }}
                </div>
                <div class="employee-info">
                  <span class="employee-name">{{ emp.name }}</span>
                  <span class="employee-email">{{ emp.email }}</span>
                </div>
              </div>
            </td>

            <!-- Role cell -->
            <td>
              <div class="role-cell">
                <span
                  class="role-dot"
                  :style="{ background: emp.roleColor }"
                />
                <span class="role-name">{{ emp.role }}</span>
              </div>
            </td>

            <!-- Status cell -->
            <td>
              <span
                class="status-badge"
                :class="{
                  'status-badge--active': emp.status === 'Active',
                  'status-badge--inactive': emp.status === 'Inactive',
                }"
              >
                {{ emp.statusLabel }}
              </span>
            </td>

            <!-- Last active cell -->
            <td>
              <div class="last-active-cell">
                <span class="last-active-time">{{ emp.lastActive }}</span>
                <span class="last-active-date">{{ emp.lastActiveDate }}</span>
              </div>
            </td>

            <!-- Actions cell -->
            <td>
              <div class="actions-cell">
                <button
                  type="button"
                  class="action-btn"
                  title="View"
                  @click="viewEmployee(emp.id)"
                >
                  <Eye :size="16" />
                </button>
                <button
                  type="button"
                  class="action-btn"
                  title="Edit"
                  @click="editEmployee(emp.id)"
                >
                  <Pencil :size="16" />
                </button>
                <button
                  type="button"
                  class="action-btn"
                  title="Reset password"
                  @click="resetPassword(emp.id)"
                >
                  <KeyRound :size="16" />
                </button>
                <button
                  type="button"
                  class="action-btn action-btn--danger"
                  title="Delete"
                  @click="deleteEmployee(emp.id)"
                >
                  <Trash2 :size="16" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="table-footer">
        <span class="table-footer__text">
          Showing {{ showingStart }}–{{ showingEnd }}
          of {{ filteredEmployees.length }} employees
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
    </div>

    <DeleteEmployeeModal
      :is-open="!!deleteTarget"
      :employee="deleteTarget"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />

    <ResetPasswordModal
      :is-open="!!resetTarget"
      :employee="resetTarget"
      @cancel="resetTarget = null"
      @confirm="resetTarget = null"
    />
  </div>
</template>

<style scoped>
/* ===== Page layout ===== */
.employees-page {
  padding: 32px;
}

/* ===== Header ===== */
.page-header {
  display: flex;
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

/* ===== Add employee button ===== */
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

/* ===== Table card ===== */
.table-card {
  overflow: hidden;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

/* ===== Toolbar ===== */
.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
}

.search-box {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 320px;
  padding: 9px 14px;
  background: var(--accent);
  border-radius: var(--radius-pill);
}

.search-icon {
  flex-shrink: 0;
  color: var(--muted-foreground);
}

.search-input {
  flex: 1;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--foreground);
  outline: none;
  background: transparent;
  border: none;
}

.search-input::placeholder {
  color: var(--muted-foreground);
}

.filter-group {
  display: flex;
  flex: 1;
  gap: 8px;
  justify-content: flex-end;
}

.filter-pill {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 9px 14px;
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
}

.filter-select {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
  appearance: none;
  cursor: pointer;
  outline: none;
  background: transparent;
  border: none;
}

/* ===== Data table ===== */
.data-table {
  width: 100%;
  border-collapse: collapse;
}

/* ===== Column headers ===== */
.column-headers th {
  padding: 13px 18px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-foreground);
  text-align: left;
  letter-spacing: 0.3px;
  background: var(--accent);
  border-bottom: 1px solid var(--border);
}

/* ===== Data rows ===== */
.data-row td {
  padding: 13px 18px;
  vertical-align: middle;
  border-bottom: 1px solid var(--border);
}

.data-row:last-of-type td {
  border-bottom: none;
}

/* ===== Employee cell ===== */
.employee-cell {
  display: flex;
  gap: 12px;
  align-items: center;
}
.avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  border-radius: var(--radius-pill);
}

.employee-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.employee-name {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.employee-email {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Role cell ===== */
.role-cell {
  display: flex;
  gap: 8px;
  align-items: center;
}

.role-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: var(--radius-pill);
}

.role-name {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
}

/* ===== Status cell ===== */
.status-badge {
  display: inline-block;
  padding: 4px 10px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  border-radius: var(--radius-pill);
}

.status-badge--active {
  color: #003300;
  background: #a1e5a1;
}

.status-badge--inactive {
  color: #590f00;
  background: #ffbfb2;
}

/* ===== Last active cell ===== */
.last-active-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.last-active-time {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
}

.last-active-date {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Actions cell ===== */
.actions-cell {
  display: flex;
  gap: 4px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  color: var(--muted-foreground);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  transition:
    background 0.15s,
    border 0.15s,
    color 0.15s;
}

.action-btn--danger {
  color: var(--destructive);
}

.action-btn:hover {
  color: var(--foreground);
  background: var(--accent);
  border-color: var(--foreground);
}

.action-btn--danger:hover {
  color: var(--destructive);
  background: color-mix(in srgb, var(--destructive) 10%, white);
  border-color: var(--destructive);
}

/* ===== Table footer ===== */
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

/* ===== Pagination ===== */
.pagination {
  display: flex;
  gap: 4px;
  align-items: center;
}

.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
  cursor: pointer;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  transition:
    border-color 0.15s,
    background 0.15s,
    color 0.15s;
}

.page-btn:hover:not(:disabled):not(.page-btn--active):not(.page-btn--ellipsis) {
  background: color-mix(in srgb, var(--primary) 10%, white);
  border-color: var(--primary);
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

/* ===== Empty state ===== */
.empty-state {
  padding: 40px 18px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--muted-foreground);
  text-align: center;
}
</style>
