<script
  setup
  lang="ts"
>
import { ref } from 'vue';
import { members } from '@/data/members';

type ModalType = 'transfer' | 'deactivate' | 'delete' | null;

const activeModal = ref<ModalType>(null);
const selectedMemberId = ref<string | null>(null);

const eligibleMembers = members.filter(
  (m) => m.status === 'Active' && m.role !== 'Owner',
);

function openModal(type: ModalType) {
  selectedMemberId.value = null;
  activeModal.value = type;
}

function closeModal() {
  activeModal.value = null;
  selectedMemberId.value = null;
}

function confirmTransfer() {
  if (selectedMemberId.value) {
    closeModal();
  }
}

function confirmDeactivate() {
  closeModal();
}

function confirmDelete() {
  closeModal();
}
</script>

<template>
  <div class="danger-page">
    <!-- Page header -->
    <div class="page-header">
      <h1 class="page-title">Danger zone</h1>
      <p class="page-subtitle">
        Irreversible and destructive actions for this organization. Proceed with
        caution.
      </p>
    </div>

    <!-- Danger card -->
    <div class="danger-card">
      <!-- Row 1: Transfer ownership -->
      <div class="danger-row">
        <div class="danger-row-text">
          <span class="danger-row-title">Transfer ownership</span>
          <span class="danger-row-desc">
            Move owner rights to another verified team member. You will become
            an admin.
          </span>
        </div>
        <button
          type="button"
          class="btn btn--outline-destructive"
          @click="openModal('transfer')"
        >
          Transfer ownership
        </button>
      </div>

      <!-- Row 2: Deactivate organization -->
      <div class="danger-row danger-row--bordered">
        <div class="danger-row-text">
          <span class="danger-row-title">Deactivate organization</span>
          <span class="danger-row-desc">
            Temporarily hide the organization from customers. Bookings are
            paused; you can reactivate anytime.
          </span>
        </div>
        <button
          type="button"
          class="btn btn--outline-destructive"
          @click="openModal('deactivate')"
        >
          Deactivate
        </button>
      </div>

      <!-- Row 3: Delete organization -->
      <div class="danger-row danger-row--bordered">
        <div class="danger-row-text">
          <span class="danger-row-title">Delete organization</span>
          <span class="danger-row-desc">
            Permanently delete this organization, its team, services and
            history. This cannot be undone.
          </span>
        </div>
        <button
          type="button"
          class="btn btn--filled-destructive"
          @click="openModal('delete')"
        >
          Delete organization
        </button>
      </div>
    </div>

    <!-- ===== MODALS ===== -->

    <!-- Transfer ownership modal -->
    <Teleport to="body">
      <div
        v-if="activeModal === 'transfer'"
        class="modal-overlay"
        @click.self="closeModal"
      >
        <div class="modal-card">
          <h3 class="modal-title">Transfer ownership</h3>
          <p class="modal-desc">
            Select a team member to transfer ownership to. You will become an
            admin.
          </p>

          <div class="member-list">
            <label
              v-for="member in eligibleMembers"
              :key="member.id"
              class="member-item"
              :class="{ 'member-item--selected': selectedMemberId === member.id }"
            >
              <div class="member-item-left">
                <div
                  class="member-avatar"
                  :style="{ background: member.avatarColor }"
                >
                  {{ member.initials }}
                </div>
                <div class="member-info">
                  <span class="member-name">{{ member.name }}</span>
                  <span class="member-role">{{ member.role }}</span>
                </div>
              </div>
              <input
                v-model="selectedMemberId"
                type="radio"
                :value="member.id"
                name="transfer-member"
                class="member-radio"
              >
            </label>
          </div>

          <div class="modal-actions">
            <button
              type="button"
              class="btn btn--outline"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn--filled-destructive"
              :disabled="!selectedMemberId"
              @click="confirmTransfer"
            >
              Transfer ownership
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Deactivate confirmation modal -->
    <Teleport to="body">
      <div
        v-if="activeModal === 'deactivate'"
        class="modal-overlay"
        @click.self="closeModal"
      >
        <div class="modal-card">
          <h3 class="modal-title">Deactivate organization</h3>
          <p class="modal-desc">
            Are you sure you want to deactivate this organization? Bookings will
            be paused and the organization will be hidden from customers. You
            can reactivate at any time.
          </p>

          <div class="modal-actions">
            <button
              type="button"
              class="btn btn--outline"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn--outline-destructive"
              @click="confirmDeactivate"
            >
              Deactivate
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete confirmation modal -->
    <Teleport to="body">
      <div
        v-if="activeModal === 'delete'"
        class="modal-overlay"
        @click.self="closeModal"
      >
        <div class="modal-card">
          <h3 class="modal-title">Delete organization</h3>
          <p class="modal-desc">
            Are you absolutely sure? This action cannot be undone. This will
            permanently delete this organization, its team, services and all
            associated history.
          </p>

          <div class="modal-actions">
            <button
              type="button"
              class="btn btn--outline"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn--filled-destructive"
              @click="confirmDelete"
            >
              Delete organization
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* ===== Page header ===== */
.page-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--foreground);
}

.page-subtitle {
  max-width: 720px;
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Danger card ===== */
.danger-card {
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: var(--background);
  border: 1px solid var(--destructive);
  border-radius: var(--radius-xl);
}

/* ===== Danger row ===== */
.danger-row {
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 16px 0;
}

.danger-row--bordered {
  padding: 16px 0;
  border-top: 1px solid var(--border);
}

.danger-row:last-child {
  padding-bottom: 0;
}

.danger-row-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.danger-row-title {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.danger-row-desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Buttons ===== */
.btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 9px 16px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-pill);
  transition:
    background 0.15s,
    border-color 0.15s;
}

.btn--outline-destructive {
  color: var(--destructive);
  background: transparent;
  border: 1px solid var(--destructive);
}

.btn--outline-destructive:hover {
  background: #fef2f2;
}

.btn--filled-destructive {
  color: var(--primary-foreground);
  background: var(--destructive);
}

.btn--filled-destructive:hover:not(:disabled) {
  background: #a8280f;
}

.btn--filled-destructive:disabled {
  cursor: default;
  opacity: 0.45;
}

.btn--outline {
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
}

.btn--outline:hover {
  border-color: var(--primary);
}

/* ===== Modal overlay ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.6);
}

/* ===== Modal card ===== */
.modal-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 480px;
  max-width: 90vw;
  max-height: 80vh;
  padding: 24px;
  overflow-y: auto;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-modal);
}

.modal-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
}

.modal-desc {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--muted-foreground);
}

.modal-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 4px;
}

/* ===== Member list (transfer modal) ===== */
.member-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.member-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  cursor: pointer;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition:
    border-color 0.15s,
    background 0.15s;
}

.member-item:hover {
  border-color: var(--primary);
}

.member-item--selected {
  background: #f5f3ff;
  border-color: var(--primary);
}

.member-item-left {
  display: flex;
  gap: 10px;
  align-items: center;
}

.member-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  border-radius: var(--radius-pill);
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.member-name {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.member-role {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.member-radio {
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
  cursor: pointer;
}
</style>
