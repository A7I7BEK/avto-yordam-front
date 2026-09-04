<script
  setup
  lang="ts"
>
import { LoaderCircle } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import {
  activateOrganization,
  deactivateOrganization,
  getOrganizationActiveState,
  transferOrganizationOwnership,
} from '@/services/settingsService';

type ModalType = 'transfer' | 'activate' | 'deactivate' | 'delete' | null;

const activeModal = ref<ModalType>(null);
const newOwnerPhone = ref('');
const actionLoading = ref(false);
const orgActive = ref(true);
const statusLoading = ref(true);

onMounted(async () => {
  orgActive.value = await getOrganizationActiveState();
  statusLoading.value = false;
});

function openModal(type: ModalType) {
  newOwnerPhone.value = '';
  activeModal.value = type;
}

function closeModal() {
  activeModal.value = null;
  newOwnerPhone.value = '';
}

async function confirmTransfer() {
  if (!newOwnerPhone.value.trim() || actionLoading.value) {
    return;
  }

  actionLoading.value = true;
  try {
    await transferOrganizationOwnership({
      newOwnerPhoneNumber: newOwnerPhone.value.trim(),
    });
    closeModal();
  } catch {
    // Error toast could be added here
  } finally {
    actionLoading.value = false;
  }
}

async function confirmActivate() {
  if (actionLoading.value) {
    return;
  }

  actionLoading.value = true;
  try {
    await activateOrganization();
    orgActive.value = true;
    closeModal();
  } catch {
    // Error toast could be added here
  } finally {
    actionLoading.value = false;
  }
}

async function confirmDeactivate() {
  if (actionLoading.value) {
    return;
  }

  actionLoading.value = true;
  try {
    await deactivateOrganization();
    orgActive.value = false;
    closeModal();
  } catch {
    // Error toast could be added here
  } finally {
    actionLoading.value = false;
  }
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
        <div class="danger-row-actions">
          <button
            type="button"
            class="btn btn--outline-destructive"
            @click="openModal('transfer')"
          >
            Transfer ownership
          </button>
        </div>
      </div>

      <!-- Row 2: Organization activation state -->
      <div class="danger-row danger-row--bordered">
        <div class="danger-row-text">
          <span class="danger-row-title">
            {{ orgActive
                ? 'Deactivate organization'
                : 'Activate organization' }}
          </span>
          <span class="danger-row-desc">
            {{ orgActive
                ? 'Temporarily hide the organization from customers. Bookings are paused; you can reactivate anytime.'
                : 'Make your organization visible to customers again and resume taking bookings.' }}
          </span>
        </div>
        <div class="danger-row-actions">
          <span
            class="status-pill"
            :class="orgActive ? 'status-pill--active' : 'status-pill--inactive'"
          >
            {{ orgActive ? 'Active' : 'Inactive' }}
          </span>
          <button
            type="button"
            :class="orgActive ? 'btn btn--outline-destructive' : 'btn btn--primary'"
            :disabled="statusLoading || actionLoading"
            @click="openModal(orgActive ? 'deactivate' : 'activate')"
          >
            <LoaderCircle
              v-if="actionLoading"
              :size="13"
              class="btn-spinner"
            />
            {{ orgActive ? 'Deactivate' : 'Activate' }}
          </button>
        </div>
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
        <div class="danger-row-actions">
          <button
            type="button"
            class="btn btn--filled-destructive"
            @click="openModal('delete')"
          >
            Delete organization
          </button>
        </div>
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
            Enter the phone number of the new owner. You will become an admin
            after the transfer.
          </p>

          <div class="transfer-field">
            <label
              class="transfer-label"
              for="new-owner-phone"
              >New owner phone number</label
            >
            <input
              id="new-owner-phone"
              v-model="newOwnerPhone"
              type="tel"
              class="transfer-input"
              placeholder="+998 90 123 45 67"
              :disabled="actionLoading"
            >
          </div>

          <div class="modal-actions">
            <button
              type="button"
              class="btn btn--outline"
              :disabled="actionLoading"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn--filled-destructive"
              :disabled="!newOwnerPhone.trim() || actionLoading"
              @click="confirmTransfer"
            >
              <LoaderCircle
                v-if="actionLoading"
                :size="13"
                class="btn-spinner"
              />
              {{ actionLoading ? 'Transferring…' : 'Transfer ownership' }}
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
              :disabled="actionLoading"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn--outline-destructive"
              :disabled="actionLoading"
              @click="confirmDeactivate"
            >
              <LoaderCircle
                v-if="actionLoading"
                :size="13"
                class="btn-spinner"
              />
              {{ actionLoading ? 'Deactivating…' : 'Deactivate' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Activate confirmation modal -->
    <Teleport to="body">
      <div
        v-if="activeModal === 'activate'"
        class="modal-overlay"
        @click.self="closeModal"
      >
        <div class="modal-card">
          <h3 class="modal-title">Activate organization</h3>
          <p class="modal-desc">
            Are you sure you want to activate this organization? It will become
            visible to customers again and bookings will resume.
          </p>

          <div class="modal-actions">
            <button
              type="button"
              class="btn btn--outline"
              :disabled="actionLoading"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn--primary"
              :disabled="actionLoading"
              @click="confirmActivate"
            >
              <LoaderCircle
                v-if="actionLoading"
                :size="13"
                class="btn-spinner"
              />
              {{ actionLoading ? 'Activating…' : 'Activate' }}
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

.danger-row-actions {
  display: flex;
  flex-shrink: 0;
  gap: 12px;
  align-items: center;
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
  background: var(--destructive-soft);
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

.btn--primary {
  color: var(--primary-foreground);
  background: var(--primary);
}

.btn--primary:hover:not(:disabled) {
  filter: brightness(1.05);
}

.btn--primary:disabled {
  cursor: default;
  opacity: 0.45;
}

@media (max-width: 768px) {
  .danger-card {
    padding: 18px 16px;
    border-radius: 20px;
  }

  .danger-row {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
    padding: 16px 0;
  }

  .danger-row:first-child {
    padding-top: 0;
  }

  .danger-row:last-child {
    padding-bottom: 0;
  }

  .danger-row-actions {
    width: 100%;
  }

  .danger-row-actions .btn {
    justify-content: center;
    width: 100%;
  }
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: var(--radius-pill);
}

.status-pill--active {
  color: var(--success);
  background: var(--success-bg);
}

.status-pill--inactive {
  color: var(--destructive);
  background: var(--destructive-soft);
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

/* ===== Transfer ownership input ===== */
.transfer-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.transfer-label {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-foreground);
}

.transfer-input {
  width: 100%;
  padding: 10px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--foreground);
  outline: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition: border-color 0.15s;
}

.transfer-input:focus {
  border-color: var(--primary);
}

.transfer-input:disabled {
  cursor: default;
  background: var(--accent);
  opacity: 1;
}

/* ===== Button spinner ===== */
.btn-spinner {
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
