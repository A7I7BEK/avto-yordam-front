<script
  setup
  lang="ts"
>
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  EllipsisVertical,
  Filter,
  Link,
  Search,
  Send,
  Star,
  Trash2,
  UserPlus,
  UserRound,
} from '@lucide/vue';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import CopyInviteLinkModal from '@/components/business/CopyInviteLinkModal.vue';
import InviteMemberModal from '@/components/business/InviteMemberModal.vue';
import RemoveMemberModal from '@/components/business/RemoveMemberModal.vue';
import ResendInvitationModal from '@/components/business/ResendInvitationModal.vue';
import {
  buildInviteLink,
  createInvitation,
  deleteInvitation,
  getOrganizationInvitations,
} from '@/services/invitationsService';
import { getMembers } from '@/services/membersService';
import { getRoles } from '@/services/rolesService';
import type {
  OrganizationInvitation,
  OrganizationInvitationRequest,
  TeamMember,
} from '@/types/business';

const router = useRouter();

// ── Data ──────────────────────────────────────────────────
const members = ref<TeamMember[]>([]);
const loading = ref(true);

// ── Filters ────────────────────────────────────────────────
const searchQuery = ref('');
const statusFilter = ref('All');
const roleFilter = ref('Any');
const specialtyFilter = ref('Any');

const specialtyOptions = [
  'Diagnostics',
  'Engine repair',
  'Transmission',
  'Suspension',
  'Customer service',
  'Scheduling',
  'Electrical',
  'AC repair',
  'Administration',
  'Body work',
  'Painting',
];

const filteredMembers = computed(() =>
  members.value.filter((m) => {
    const matchSearch =
      !searchQuery.value ||
      m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus =
      statusFilter.value === 'All' || m.status === statusFilter.value;
    const matchRole = roleFilter.value === 'Any' || m.role === roleFilter.value;
    const matchSpecialty =
      specialtyFilter.value === 'Any' ||
      m.specialties.includes(specialtyFilter.value);
    return matchSearch && matchStatus && matchRole && matchSpecialty;
  }),
);

const activeCount = computed(
  () => members.value.filter((m) => m.status === 'Accepted').length,
);
const pendingCount = computed(
  () => members.value.filter((m) => m.status === 'Invited').length,
);

// ── Pagination ─────────────────────────────────────────────
const currentPage = ref(1);
const pageSize = 8;

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredMembers.value.length / pageSize)),
);

const pagedMembers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredMembers.value.slice(start, start + pageSize);
});

const showingStart = computed(() => {
  if (filteredMembers.value.length === 0) {
    return 0;
  }
  return (currentPage.value - 1) * pageSize + 1;
});

const showingEnd = computed(() =>
  Math.min(currentPage.value * pageSize, filteredMembers.value.length),
);

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) {
    return;
  }
  currentPage.value = page;
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

function goToPrev() {
  goToPage(currentPage.value - 1);
}

function goToNext() {
  goToPage(currentPage.value + 1);
}

// ── Action dropdown ────────────────────────────────────────
const openDropdownId = ref<string | null>(null);
const dropdownStyle = ref({ top: '0px', left: '0px' });

const openMember = computed<TeamMember | null>(
  () => members.value.find((m) => m.id === openDropdownId.value) ?? null,
);

function toggleDropdown(id: string, event: MouseEvent) {
  if (openDropdownId.value === id) {
    openDropdownId.value = null;
    return;
  }
  openDropdownId.value = id;
  nextTick(() => {
    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    dropdownStyle.value = {
      top: `${rect.bottom + 4}px`,
      left: `${rect.right - 200}px`,
    };
  });
}

function closeDropdown() {
  openDropdownId.value = null;
}

function viewMember(id: string) {
  closeDropdown();
  const target = members.value.find((m) => m.id === id);
  if (!target?.userId) {
    return;
  }
  router.push(`/business/team/members/${target.userId}`);
}

// ── Remove modal ──────────────────────────────────────────
const showRemoveModal = ref(false);
const removeTarget = ref<TeamMember | null>(null);

function openRemoveModal(id: string) {
  closeDropdown();
  removeTarget.value = members.value.find((m) => m.id === id) ?? null;
  showRemoveModal.value = true;
}

function confirmRemove() {
  const target = removeTarget.value;
  if (target) {
    if (target.invitationId) {
      deleteInvitation(target.invitationId).catch(() => {
        // The row is removed optimistically regardless of backend outcome.
      });
    }
    members.value = members.value.filter((m) => m.id !== target.id);
  }
  showRemoveModal.value = false;
  removeTarget.value = null;
}

function cancelRemove() {
  showRemoveModal.value = false;
  removeTarget.value = null;
}

// ── Resend invitation modal ───────────────────────────────
const showResendModal = ref(false);
const resendTarget = ref<TeamMember | null>(null);

function openResendModal(id: string) {
  closeDropdown();
  resendTarget.value = members.value.find((m) => m.id === id) ?? null;
  showResendModal.value = true;
}

function confirmResend() {
  showResendModal.value = false;
  resendTarget.value = null;
}

function cancelResend() {
  showResendModal.value = false;
  resendTarget.value = null;
}

// ── Copy invite link modal ────────────────────────────────
const showCopyLinkModal = ref(false);
const copyLinkTarget = ref<TeamMember | null>(null);
const copyInviteLink = ref('');

function openCopyLinkModal(id: string) {
  closeDropdown();
  const member = members.value.find((m) => m.id === id) ?? null;
  copyLinkTarget.value = member;
  copyInviteLink.value = member?.invitationId
    ? buildInviteLink(member.invitationId)
    : '';
  showCopyLinkModal.value = true;
}

function closeCopyLinkModal() {
  showCopyLinkModal.value = false;
  copyLinkTarget.value = null;
  copyInviteLink.value = '';
}

function onDocumentClick() {
  closeDropdown();
}

/** Turn a pending backend invitation into an "Invited" member row. */
function invitationToMember(inv: OrganizationInvitation): TeamMember {
  const contact = inv.email ?? inv.phoneNumber ?? '';
  const sourceName = inv.userName ?? contact.split('@')[0] ?? '';
  const displayName =
    sourceName
      .replace(/[^a-zA-Z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Invited Member';
  return {
    id: `inv-${inv.id}`,
    invitationId: inv.id,
    userId: inv.userId,
    name: displayName,
    email: contact,
    initials:
      displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'IN',
    avatarColor: 'var(--border)',
    role: inv.roleName || 'Member',
    specialties: [],
    rating: 0,
    orders: 0,
    status: 'Invited',
    joined: 'Invited',
  };
}

async function loadMembers() {
  try {
    loading.value = true;
    const [accepted, invites] = await Promise.all([
      getMembers(),
      getOrganizationInvitations(),
    ]);
    const pendingInvites = (invites ?? [])
      .filter((i) => i.canDelete)
      .map(invitationToMember);
    members.value = [...(accepted ?? []), ...pendingInvites];
  } catch {
    members.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadMembers();
  document.addEventListener('click', onDocumentClick);
});
onUnmounted(() => document.removeEventListener('click', onDocumentClick));

// ── Invite modal ──────────────────────────────────────────
const showInviteModal = ref(false);

function formatPhoneWithPrefix(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('998') ? `+${digits}` : `+998${digits}`;
}

async function onInviteSend(data: {
  contactMethod: 'phone' | 'email';
  phone: string;
  email: string;
  role: string;
  message: string;
}) {
  showInviteModal.value = false;
  const emailAddr = data.contactMethod === 'email' ? data.email : '';
  const displayName =
    data.contactMethod === 'email'
      ? (data.email.split('@')[0] ?? '')
          .replace(/[^a-zA-Z]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()) || 'New Member'
      : 'New Member';
  const displayInitials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  members.value.push({
    id: `m${members.value.length + 1}`,
    name: displayName,
    email: emailAddr,
    initials: displayInitials || 'NM',
    avatarColor: 'var(--border)',
    role: data.role,
    specialties: [],
    rating: 0,
    orders: 0,
    status: 'Invited',
    joined: 'Just now',
  });

  // Send the invitation to the backend (keeps the optimistic row above too)
  try {
    const roleOptions = await getRoles();
    const roleId = roleOptions.find((r) => r.name === data.role)?.id ?? '';
    const request: OrganizationInvitationRequest = {
      roleId,
      inviteMessage: data.message,
      ...(data.contactMethod === 'email'
        ? { email: data.email }
        : { phoneNumber: formatPhoneWithPrefix(data.phone) }),
    };
    await createInvitation(request);
    // Reload so the new invitation shows as an "Invited" row with its real id.
    await loadMembers();
  } catch {
    // The optimistic member row stays; the error can be surfaced later
  }
}
</script>

<template>
  <div class="members-page">
    <!-- Header Row -->
    <div class="header-row">
      <div class="header-row__left">
        <h1 class="header-row__title">Members</h1>
        <p class="header-row__subtitle">
          {{ members.length }}
          entries · {{ activeCount }} active members ·
          {{ pendingCount }}
          pending invitations
        </p>
      </div>
      <div class="header-row__right">
        <button
          type="button"
          class="btn btn--outline"
        >
          <Download :size="14" />
          Export
        </button>
        <button
          type="button"
          class="btn btn--primary"
          @click="showInviteModal = true"
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
          placeholder="Search name, email, role…"
        >
      </div>

      <!-- Status filter -->
      <div class="filter-pill">
        <span class="filter-pill__label">Status:</span>
        <span class="filter-pill__value">{{ statusFilter }}</span>
        <select
          v-model="statusFilter"
          class="filter-pill__select"
        >
          <option value="All">All</option>
          <option value="Accepted">Accepted</option>
          <option value="Invited">Invited</option>
          <option value="Declined">Declined</option>
          <option value="Expired">Expired</option>
        </select>
        <ChevronRight
          :size="12"
          class="filter-pill__chevron"
        />
      </div>

      <!-- Role filter -->
      <div class="filter-pill">
        <span class="filter-pill__label">Role:</span>
        <span class="filter-pill__value">{{ roleFilter }}</span>
        <select
          v-model="roleFilter"
          class="filter-pill__select"
        >
          <option value="Any">Any</option>
          <option value="Manager">Manager</option>
          <option value="Master">Master</option>
          <option value="Receptionist">Receptionist</option>
          <option value="Admin">Admin</option>
        </select>
        <ChevronRight
          :size="12"
          class="filter-pill__chevron"
        />
      </div>

      <!-- Specialty filter -->
      <div class="filter-pill">
        <span class="filter-pill__label">Specialty:</span>
        <span class="filter-pill__value">{{ specialtyFilter }}</span>
        <select
          v-model="specialtyFilter"
          class="filter-pill__select"
        >
          <option value="Any">Any</option>
          <option
            v-for="s in specialtyOptions"
            :key="s"
            :value="s"
          >
            {{ s }}
          </option>
        </select>
        <ChevronRight
          :size="12"
          class="filter-pill__chevron"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="data-table-card">
      <div class="data-table-scroll">
        <table class="data-table">
          <thead>
            <tr class="column-headers">
              <th>Member</th>
              <th>Role</th>
              <th>Specialties</th>
              <th>Rating</th>
              <th>Orders</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pagedMembers.length === 0">
              <td
                colspan="8"
                class="empty-state"
              >
                No members found
              </td>
            </tr>
            <tr
              v-for="member in pagedMembers"
              :key="member.id"
              class="data-row"
            >
              <!-- Member cell -->
              <td>
                <div class="member-info">
                  <div class="member-info__avatar">{{ member.initials }}</div>
                  <div class="member-info__text">
                    <span class="member-info__name">{{ member.name }}</span>
                    <span class="member-info__email">{{ member.email }}</span>
                  </div>
                </div>
              </td>

              <!-- Role cell -->
              <td>
                <span class="badge badge--role">{{ member.role }}</span>
              </td>

              <!-- Specialties cell -->
              <td>
                <div class="specialty-list">
                  <span
                    v-for="spec in member.specialties"
                    :key="spec"
                    class="badge badge--specialty"
                    >{{ spec }}</span
                  >
                </div>
              </td>

              <!-- Rating cell -->
              <td>
                <div class="rating">
                  <Star
                    :size="12"
                    class="rating__star"
                  />
                  <span class="rating__value"
                    >{{ member.rating.toFixed(1) }}</span
                  >
                </div>
              </td>

              <!-- Orders cell -->
              <td>
                <span class="orders-value">{{ member.orders }}</span>
              </td>

              <!-- Status cell -->
              <td>
                <span
                  class="badge badge--status"
                  :class="{
                'badge--accepted': member.status === 'Accepted',
                'badge--invited': member.status === 'Invited',
                'badge--declined': member.status === 'Declined',
                'badge--expired': member.status === 'Expired',
              }"
                >
                  <Check
                    v-if="member.status === 'Accepted'"
                    :size="10"
                  />
                  {{ member.status }}
                </span>
              </td>

              <!-- Joined cell -->
              <td>
                <span class="joined-date">{{ member.joined }}</span>
              </td>

              <!-- Actions cell -->
              <td>
                <button
                  type="button"
                  class="kebab-btn"
                  @click.stop="toggleDropdown(member.id, $event)"
                >
                  <EllipsisVertical :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table Footer -->
      <div class="table-footer">
        <span class="table-footer__text">
          Showing {{ showingStart }}–{{ showingEnd }}
          of {{ filteredMembers.length }} members
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

    <!-- Action Dropdown (teleported to avoid overflow clipping) -->
    <Teleport to="body">
      <div
        v-if="openDropdownId"
        class="action-dropdown-overlay"
        @click="closeDropdown"
      >
        <div
          class="action-dropdown"
          :style="dropdownStyle"
          @click.stop
        >
          <button
            type="button"
            class="action-dropdown__item"
            :disabled="!openMember?.userId"
            @click="viewMember(openDropdownId)"
          >
            <UserRound :size="15" />
            View profile
          </button>
          <button
            type="button"
            class="action-dropdown__item"
            @click="openResendModal(openDropdownId)"
          >
            <Send :size="15" />
            Resend invitation
          </button>
          <button
            type="button"
            class="action-dropdown__item"
            :disabled="!openMember?.invitationId"
            @click="openCopyLinkModal(openDropdownId)"
          >
            <Link :size="15" />
            Copy invite link
          </button>
          <div class="action-dropdown__divider" />
          <button
            type="button"
            class="action-dropdown__item action-dropdown__item--danger"
            @click="openRemoveModal(openDropdownId)"
          >
            <Trash2 :size="15" />
            Remove member
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Invite Member Modal -->
    <InviteMemberModal
      :is-open="showInviteModal"
      org-name="AutoFix MCHJ"
      @close="showInviteModal = false"
      @send="onInviteSend"
    />

    <RemoveMemberModal
      :is-open="showRemoveModal"
      :member-name="removeTarget?.name"
      org-name="AutoFix MCHJ"
      @cancel="cancelRemove"
      @confirm="confirmRemove"
    />

    <ResendInvitationModal
      :is-open="showResendModal"
      :member-name="resendTarget?.name"
      :member-email="resendTarget?.email"
      @cancel="cancelResend"
      @confirm="confirmResend"
    />

    <CopyInviteLinkModal
      :is-open="showCopyLinkModal"
      :member-name="copyLinkTarget?.name"
      :invite-link="copyInviteLink"
      @cancel="closeCopyLinkModal"
    />
  </div>
</template>

<style scoped>
/* ============================================
   Page Layout
   ============================================ */
.members-page {
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

.filter-pill__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  padding: 0 6px;
  font-size: 10px;
  font-weight: 600;
  line-height: 14px;
  color: var(--muted-foreground);
  background: var(--muted);
  border-radius: var(--radius-pill);
}

.filter-pill__chevron {
  flex-shrink: 0;
  color: var(--muted-foreground);
  transform: rotate(90deg);
}

/* ============================================
   Data Table
   ============================================ */
.data-table-card {
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
}

.data-table-scroll {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.data-table {
  width: 100%;
  min-width: 680px;
  border-spacing: 0;
  border-collapse: separate;
  background: var(--card);
}

@media (max-width: 768px) {
  .members-page {
    padding: 16px 12px;
  }

  .header-row {
    flex-direction: column;
    gap: 12px;
  }

  .header-row__right {
    width: 100%;
  }

  .header-row__right .btn {
    flex: 1;
    justify-content: center;
  }

  .filters-row {
    flex-wrap: wrap;
  }

  .filter-search {
    width: 100%;
    min-width: 100%;
  }

  .filter-pill {
    flex: 1;
    min-width: 130px;
  }

  .table-footer {
    flex-direction: column;
    gap: 10px;
    align-items: center;
    padding: 12px 14px;
  }
}

/* Header */
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

/* Rows */
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
   Member Info
   ============================================ */
.member-info {
  display: flex;
  gap: 10px;
  align-items: center;
}

.member-info__avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  font-size: 11px;
  font-weight: 700;
  color: var(--secondary-foreground);
  background: var(--secondary);
  border-radius: var(--radius-pill);
}

.member-info__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.member-info__name {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--foreground);
  white-space: nowrap;
}

.member-info__email {
  font-size: 11px;
  font-weight: 400;
  line-height: 1.2;
  color: var(--muted-foreground);
}

/* ============================================
   Badges
   ============================================ */
.badge {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  border-radius: var(--radius-pill);
}

.badge--role {
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 700;
  color: var(--foreground);
  background: var(--accent);
  border: 1px solid var(--border);
}

.badge--specialty {
  padding: 2px 7px;
  font-size: 10px;
  font-weight: 500;
  color: var(--foreground);
  background: var(--accent);
  border: 1px solid var(--border);
}

.badge--status {
  display: inline-flex;
  gap: 5px;
  align-items: center;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 600;
}

.badge--accepted {
  color: var(--color-success-foreground);
  background: var(--color-success);
}

.badge--invited {
  color: var(--color-warning-foreground);
  background: var(--color-warning);
}

.badge--declined {
  color: var(--color-error-foreground);
  background: var(--color-error);
}

.badge--expired {
  color: var(--muted-foreground);
  background: var(--muted);
}

/* ============================================
   Specialty List
   ============================================ */
.specialty-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

/* ============================================
   Rating
   ============================================ */
.rating {
  display: flex;
  gap: 4px;
  align-items: center;
}

.rating__star {
  flex-shrink: 0;
  color: #fbbf24;
  fill: #fbbf24;
}

.rating__value {
  font-size: 12px;
  font-weight: 600;
  color: var(--foreground);
}

/* ============================================
   Orders Value
   ============================================ */
.orders-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--foreground);
}

/* ============================================
   Joined Date
   ============================================ */
.joined-date {
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ============================================
   Actions
   ============================================ */

.kebab-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: var(--foreground);
  cursor: pointer;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  transition: background 0.15s;
}

.kebab-btn:hover {
  background: var(--muted);
}

/* ============================================
   Action Dropdown (teleported)
   ============================================ */
.action-dropdown-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
}

.action-dropdown {
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 200px;
  padding: 6px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow:
    0 12px 32px rgba(15, 23, 42, 0.16),
    0 2px 6px rgba(15, 23, 42, 0.08);
}

.action-dropdown__item {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  padding: 9px 10px;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 8px;
  transition: background 0.1s;
}

.action-dropdown__item:hover {
  background: var(--accent);
}

.action-dropdown__item:disabled {
  color: var(--muted-foreground);
  cursor: not-allowed;
  opacity: 0.6;
}

.action-dropdown__item:disabled:hover {
  background: transparent;
}

.action-dropdown__item--danger {
  color: var(--destructive);
}

.action-dropdown__item--danger:hover {
  background: var(--accent);
}

.action-dropdown__divider {
  width: 100%;
  height: 1px;
  background: var(--border);
}

/* ============================================
   Table Footer / Pagination
   ============================================ */
.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background: var(--accent);
  border-top: 1px solid var(--border);
}

.table-footer__text {
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

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
</style>
