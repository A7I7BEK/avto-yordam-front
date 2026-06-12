<script
  setup
  lang="ts"
>
import { Eye, Search, Trash2, UserPlus } from '@lucide/vue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getMembers } from '@/services/membersService';
import type { TeamMember } from '@/types/business';

const router = useRouter();

const searchQuery = ref('');
const roleFilter = ref('');
const statusFilter = ref('');

const members = ref<TeamMember[]>([]);
const loading = ref(true);

async function loadMembers() {
  try {
    loading.value = true;
    const data = await getMembers();
    members.value = data ?? [];
  } finally {
    loading.value = false;
  }
}

loadMembers();

const roles = computed(() => {
  const unique = new Set(members.value.map((m) => m.role));
  return Array.from(unique);
});

const filteredMembers = computed(() =>
  members.value.filter((m) => {
    const matchSearch =
      !searchQuery.value ||
      m.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchRole = !roleFilter.value || m.role === roleFilter.value;
    const matchStatus = !statusFilter.value || m.status === statusFilter.value;
    return matchSearch && matchRole && matchStatus;
  }),
);

function viewMember(id: string) {
  router.push(`/business/team/members/${id}`);
}

function removeMember(id: string) {
  // biome-ignore lint/suspicious/noConsole: allowed in handler
  console.log('Remove member', id);
}
</script>

<template>
  <div class="page">
    <div class="page__header">
      <div>
        <h1 class="page__title">Team Members</h1>
        <p class="page__subtitle">Manage your organization members</p>
      </div>
      <button
        type="button"
        class="btn btn--primary"
        @click="router.push('/business/team/members/invite')"
      >
        <UserPlus :size="18" />
        Invite member
      </button>
    </div>

    <div class="page__toolbar">
      <div class="search-input">
        <Search
          :size="18"
          class="search-input__icon"
        />
        <input
          v-model="searchQuery"
          type="text"
          class="search-input__field"
          placeholder="Search members..."
        >
      </div>
      <select
        v-model="roleFilter"
        class="select-input"
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
      <select
        v-model="statusFilter"
        class="select-input"
      >
        <option value="">All statuses</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Pending">Pending</option>
      </select>
    </div>

    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Role</th>
            <th>Organization</th>
            <th>Phone</th>
            <th>Status</th>
            <th class="table__th--actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="member in filteredMembers"
            :key="member.id"
          >
            <td>
              <div class="member-cell">
                <div
                  class="avatar"
                  :style="{ background: member.avatarColor }"
                >
                  {{ member.initials }}
                </div>
                <span class="member-cell__name">{{ member.name }}</span>
              </div>
            </td>
            <td>
              <span class="badge badge--role">{{ member.role }}</span>
            </td>
            <td class="table__cell-muted">{{ member.org }}</td>
            <td class="table__cell-muted">{{ member.phone }}</td>
            <td>
              <span
                class="badge badge--status"
                :class="{
                  'badge--success': member.status === 'Active',
                  'badge--muted': member.status === 'Inactive',
                  'badge--warning': member.status === 'Pending',
                }"
              >
                {{ member.status }}
              </span>
            </td>
            <td>
              <div class="action-btns">
                <button
                  type="button"
                  class="icon-btn"
                  title="View"
                  @click="viewMember(member.id)"
                >
                  <Eye :size="16" />
                </button>
                <button
                  type="button"
                  class="icon-btn icon-btn--danger"
                  title="Remove"
                  @click="removeMember(member.id)"
                >
                  <Trash2 :size="16" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!loading && filteredMembers.length === 0">
            <td
              colspan="6"
              class="table__empty"
            >
              No members found
            </td>
          </tr>
        </tbody>
      </table>
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

/* Toolbar */
.page__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.search-input {
  display: flex;
  flex: 1;
  gap: 8px;
  align-items: center;
  max-width: 320px;
  padding: 8px 12px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.search-input__icon {
  flex-shrink: 0;
  color: var(--muted-icon);
}

.search-input__field {
  flex: 1;
  font-family: var(--font-primary);
  font-size: 14px;
  color: var(--foreground);
  outline: none;
  background: transparent;
  border: none;
}

.search-input__field::placeholder {
  color: var(--muted-icon);
}

.select-input {
  padding: 8px 12px;
  font-family: var(--font-primary);
  font-size: 14px;
  color: var(--foreground);
  cursor: pointer;
  outline: none;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

/* Table */
.table-wrapper {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.table {
  width: 100%;
  font-family: var(--font-primary);
  border-collapse: collapse;
}

.table th {
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-foreground);
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--accent);
  border-bottom: 1px solid var(--border);
}

.table td {
  padding: 12px 16px;
  font-size: 14px;
  color: var(--foreground);
  border-bottom: 1px solid var(--border);
}

.table tr:last-child td {
  border-bottom: none;
}

.table__th--actions {
  text-align: right;
}

.table__cell-muted {
  color: var(--muted-foreground);
}

.table__empty {
  padding: 32px 16px;
  color: var(--muted-foreground);
  text-align: center;
}

/* Member cell */
.member-cell {
  display: flex;
  gap: 10px;
  align-items: center;
}

.avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  border-radius: 50%;
}

.member-cell__name {
  font-weight: 500;
}

/* Badges */
.badge {
  display: inline-block;
  padding: 3px 10px;
  font-family: var(--font-primary);
  font-size: 12px;
  font-weight: 500;
  border-radius: var(--radius-pill);
}

.badge--role {
  color: var(--foreground);
  background: var(--accent);
}

.badge--status {
  font-weight: 600;
}

.badge--success {
  color: var(--success);
  background: var(--success-bg);
}

.badge--muted {
  color: var(--muted-foreground);
  background: var(--accent);
}

.badge--warning {
  color: var(--warning);
  background: var(--warning-bg);
}

/* Action buttons */
.action-btns {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--muted-icon);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  transition:
    background 0.15s,
    color 0.15s;
}

.icon-btn:hover {
  color: var(--foreground);
  background: var(--accent);
}

.icon-btn--danger:hover {
  color: var(--destructive);
  background: #fee2e2;
}
</style>
