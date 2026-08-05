<script
  setup
  lang="ts"
>
import {
  ChevronRight,
  Loader2,
  Mail,
  Search,
  Trash2,
  UserPlus,
} from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  deleteInvitation,
  getOrganizationInvitations,
} from '@/services/invitationsService';
import type {
  InvitationStatus,
  OrganizationInvitation,
} from '@/types/business';

const router = useRouter();

const invitations = ref<OrganizationInvitation[]>([]);
const loading = ref(true);
const deletingId = ref<string | null>(null);
const cancelTarget = ref<OrganizationInvitation | null>(null);

const searchQuery = ref('');
const statusFilter = ref('All');

function invitationStatus(inv: OrganizationInvitation): InvitationStatus {
  return inv.canDelete ? 'PENDING' : 'RESOLVED';
}

const statusLabels: Record<InvitationStatus, string> = {
  PENDING: 'Pending',
  RESOLVED: 'Resolved',
};

const filteredInvitations = computed(() =>
  invitations.value.filter((inv) => {
    const haystack = [
      inv.userName ?? '',
      inv.email ?? '',
      inv.phoneNumber ?? '',
      inv.roleName,
    ]
      .join(' ')
      .toLowerCase();
    const matchSearch =
      !searchQuery.value ||
      haystack.includes(searchQuery.value.toLowerCase());
    const matchStatus =
      statusFilter.value === 'All' ||
      invitationStatus(inv) === statusFilter.value;
    return matchSearch && matchStatus;
  }),
);

const pendingCount = computed(
  () => invitations.value.filter((i) => i.canDelete).length,
);

async function loadInvitations() {
  loading.value = true;
  try {
    invitations.value = await getOrganizationInvitations();
  } finally {
    loading.value = false;
  }
}

function askCancel(inv: OrganizationInvitation) {
  cancelTarget.value = inv;
}

function closeCancel() {
  cancelTarget.value = null;
}

async function confirmCancel() {
  const target = cancelTarget.value;
  if (!target) {
    return;
  }
  deletingId.value = target.id;
  try {
    await deleteInvitation(target.id);
    invitations.value = invitations.value.filter((i) => i.id !== target.id);
  } finally {
    deletingId.value = null;
    cancelTarget.value = null;
  }
}

function goInvite() {
  router.push('/business/team/members/invite');
}

onMounted(loadInvitations);
</script>

<template>
  <div class="invitations-page">
    <!-- Header Row -->
    <div class="header-row">
      <div class="header-row__left">
        <h1 class="header-row__title">Invitations</h1>
        <p class="header-row__subtitle">
          {{ invitations.length }} sent · {{ pendingCount }} pending
        </p>
      </div>
      <div class="header-row__right">
        <button
          type="button"
          class="btn btn--primary"
          @click="goInvite"
        >
          <UserPlus :size="14" />
          Invite member
        </button>
      </div>
    </div>

    <!-- Filters Row -->
    <div class="filters-row">
      <div class="filter-search">
        <Search
          :size="13"
          class="filter-search__icon"
        />
        <input
          v-model="searchQuery"
          type="text"
          class="filter-search__input"
          placeholder="Search email or role…"
        >
      </div>
      <div class="filter-pill">
        <span class="filter-pill__label">Status:</span>
        <span class="filter-pill__value">{{ statusFilter }}</span>
        <select
          v-model="statusFilter"
          class="filter-pill__select"
        >
          <option value="All">All</option>
          <option value="PENDING">Pending</option>
          <option value="RESOLVED">Resolved</option>
        </select>
        <ChevronRight
          :size="12"
          class="filter-pill__chevron"
        />
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="loading-state"
    >
      <Loader2
        :size="24"
        class="spin"
      />
      <span>Loading invitations…</span>
    </div>

    <!-- Table -->
    <div
      v-else
      class="data-table-wrapper"
    >
      <table class="data-table">
        <thead>
          <tr class="column-headers">
            <th>Invitee</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredInvitations.length === 0">
            <td
              colspan="4"
              class="empty-state"
            >
              No invitations found
            </td>
          </tr>
          <tr
            v-for="inv in filteredInvitations"
            :key="inv.id"
            class="data-row"
          >
            <td>
              <div class="invitee-info">
                <div class="invitee-info__avatar">
                  <Mail :size="14" />
                </div>
                <div class="invitee-info__text">
                  <span class="invitee-info__name"
                    >{{ inv.userName || inv.email || inv.phoneNumber || 'Invitee' }}</span
                  >
                  <span
                    v-if="inv.email || inv.phoneNumber"
                    class="invitee-info__email"
                    >{{ inv.email || inv.phoneNumber }}</span
                  >
                </div>
              </div>
            </td>
            <td>
              <span class="badge badge--role">{{ inv.roleName }}</span>
            </td>
            <td>
              <span
                class="badge"
                :class="`badge--${invitationStatus(inv).toLowerCase()}`"
              >
                {{ statusLabels[invitationStatus(inv)] }}
              </span>
            </td>
            <td>
              <button
                v-if="inv.canDelete"
                type="button"
                class="btn-icon"
                title="Cancel invitation"
                :disabled="deletingId === inv.id"
                @click="askCancel(inv)"
              >
                <Trash2 :size="14" />
              </button>
              <span
                v-else
                class="muted"
                >—</span
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cancel confirmation -->
    <Teleport to="body">
      <div
        v-if="cancelTarget"
        class="modal-overlay"
        @click.self="closeCancel"
      >
        <div class="modal-card">
          <div class="modal-icon-box">
            <Trash2 :size="20" />
          </div>
          <div class="modal-title-group">
            <h3 class="modal-title">Cancel invitation?</h3>
            <p class="modal-desc">
              The invitation to
              <strong>{{ cancelTarget.email || cancelTarget.phoneNumber || cancelTarget.userName }}</strong>
              will be cancelled and can no longer be accepted.
            </p>
          </div>
          <div class="modal-actions">
            <button
              type="button"
              class="btn btn--outline"
              @click="closeCancel"
            >
              Keep
            </button>
            <button
              type="button"
              class="btn btn--danger"
              @click="confirmCancel"
            >
              <Loader2
                v-if="deletingId === cancelTarget.id"
                :size="13"
                class="spin"
              />
              <Trash2
                v-else
                :size="13"
              />
              Cancel invitation
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* ============================================
   Page Layout
   ============================================ */
.invitations-page {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
}

/* ============================================
   Header Row
   ============================================ */
.header-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
}

.header-row__left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-row__title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--foreground);
}

.header-row__subtitle {
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.header-row__right {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* ============================================
   Buttons
   ============================================ */
.btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-pill);
  transition: opacity 0.15s;
}

.btn:hover {
  opacity: 0.88;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn--primary {
  font-weight: 600;
  color: var(--primary-foreground);
  background: var(--primary);
}

.btn--outline {
  font-weight: 500;
  color: var(--foreground);
  background: transparent;
  border: 1px solid var(--border);
}

.btn--danger {
  font-weight: 600;
  color: #ffffff;
  background: #cc3314;
}

/* ============================================
   Filters Row
   ============================================ */
.filters-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.filter-search {
  position: relative;
  flex: 1;
}

.filter-search__icon {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 14px;
  margin: auto;
  color: var(--muted-foreground);
}

.filter-search__input {
  width: 100%;
  height: 34px;
  padding-left: 34px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  color: var(--foreground);
  outline: none;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
}

.filter-search__input::placeholder {
  color: var(--muted-foreground);
}

.filter-pill {
  position: relative;
  display: flex;
  gap: 6px;
  align-items: center;
  height: 34px;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  color: var(--muted-foreground);
  white-space: nowrap;
  cursor: pointer;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
}

.filter-pill__label {
  color: var(--muted-foreground);
}

.filter-pill__value {
  font-weight: 500;
  color: var(--foreground);
}

.filter-pill__select {
  position: absolute;
  inset: 0;
  width: 100%;
  padding: 0;
  font-size: 12px;
  font-weight: 500;
  color: transparent;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  outline: none;
  background: transparent;
  border: none;
  border-radius: var(--radius-pill);
  opacity: 0;
}

.filter-pill__select option {
  color: var(--foreground);
}

.filter-pill__chevron {
  flex-shrink: 0;
  color: var(--muted-foreground);
  transform: rotate(90deg);
}

/* ============================================
   Data Table
   ============================================ */
.data-table {
  width: 100%;
  border-spacing: 0;
  border-collapse: separate;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px 16px 0 0;
}

.column-headers th {
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-foreground);
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--muted);
  border-bottom: 1px solid var(--border);
}

.column-headers th:first-child {
  border-radius: 16px 0 0 0;
}

.column-headers th:last-child {
  border-radius: 0 16px 0 0;
}

.data-row td {
  padding: 10px 16px;
  vertical-align: middle;
  border-bottom: 1px solid var(--border);
}

.data-row:last-child td {
  border-bottom: 0;
}

.empty-state {
  padding: 40px 16px;
  font-size: 13px;
  color: var(--muted-foreground);
  text-align: center;
}

/* ============================================
   Invitee Info
   ============================================ */
.invitee-info {
  display: flex;
  gap: 10px;
  align-items: center;
}

.invitee-info__avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--muted-foreground);
  background: var(--muted);
  border-radius: 50%;
}

.invitee-info__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.invitee-info__name {
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.invitee-info__email {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* ============================================
   Badges
   ============================================ */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 999px;
}

.badge--role {
  color: var(--foreground);
  background: var(--muted);
}

.badge--pending {
  color: #b26a00;
  background: #fff4e0;
}

.badge--resolved {
  color: var(--muted-foreground);
  background: var(--muted);
}

/* ============================================
   Misc
   ============================================ */
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  color: #cc3314;
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.btn-icon:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.muted {
  color: var(--muted-foreground);
}

.loading-state {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  font-size: 14px;
  color: var(--muted-foreground);
}

.spin {
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ============================================
   Modal
   ============================================ */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.4);
}

.modal-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 380px;
  padding: 20px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

.modal-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #cc3314;
  background: #fde8e8;
  border-radius: 50%;
}

.modal-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--foreground);
}

.modal-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--muted-foreground);
}

.modal-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 4px;
}
</style>
