<script
  setup
  lang="ts"
>
import { History, Pencil, ShieldAlert } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import {
  getOrganization,
  getSettingsBankInfo,
  updateOrganization,
} from '@/services/settingsService';

interface BankInfo {
  accountHolder: string;
  bank: string;
  mfo: string;
  inn: string;
  accountNumber: string;
}

const isEditing = ref(false);
const saving = ref(false);

const bankInfo = ref<BankInfo>({
  accountHolder: '',
  bank: '',
  mfo: '',
  inn: '',
  accountNumber: '',
});

const savedValues = ref<BankInfo>({
  accountHolder: '',
  bank: '',
  mfo: '',
  inn: '',
  accountNumber: '',
});

onMounted(async () => {
  const data = await getSettingsBankInfo();
  if (data) {
    const values: BankInfo = {
      accountHolder: data.accountHolder ?? '',
      bank: data.bank ?? '',
      mfo: data.mfo ?? '',
      inn: data.inn ?? '',
      accountNumber: data.accountNumber ?? '',
    };
    bankInfo.value = { ...values };
    savedValues.value = { ...values };
  }
});

function startEditing() {
  savedValues.value = { ...bankInfo.value };
  isEditing.value = true;
}

function cancel() {
  bankInfo.value = { ...savedValues.value };
  isEditing.value = false;
}

async function saveChanges() {
  if (saving.value) {
    return;
  }
  saving.value = true;
  try {
    const org = await getOrganization();
    await updateOrganization({
      type: org?.type ?? 'MCHJ',
      name: bankInfo.value.accountHolder,
      description: org?.description ?? null,
      phone: org?.phone ?? '',
      email: org?.email ?? null,
      latitude: org?.latitude ?? null,
      longitude: org?.longitude ?? null,
      address: org?.address ?? '',
      ownerId: org?.ownerId ?? '',
      inn: bankInfo.value.inn,
      bankAccount: bankInfo.value.accountNumber,
      mfo: bankInfo.value.mfo,
      bankName: bankInfo.value.bank,
    });
    savedValues.value = { ...bankInfo.value };
    isEditing.value = false;
  } catch {
    // Global error toast surfaces the failure
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="bank-info-page">
    <!-- Page header -->
    <div class="page-header">
      <h1 class="page-title">Bank info</h1>
      <p class="page-subtitle">
        The settlement account where online payments will be transferred (T+2).
        Visible only to roles with finance.edit_bank_info.
      </p>
    </div>

    <!-- Warning banner -->
    <div class="warning-banner">
      <ShieldAlert
        :size="16"
        class="warning-icon"
      />
      <div class="warning-text">
        <span class="warning-title">Sensitive data</span>
        <span class="warning-desc">
          Bank details belong to the organization, not to individual employees.
          Changes are logged for audit.
        </span>
      </div>
    </div>

    <!-- Settlement account card -->
    <div class="form-card">
      <h2 class="card-title">Settlement account</h2>

      <!-- Row 1: Legal entity name + INN -->
      <div class="form-row form-row--two-col">
        <div class="form-field">
          <label
            class="field-label"
            for="account-holder"
            >Legal entity name</label
          >
          <input
            id="account-holder"
            v-model="bankInfo.accountHolder"
            type="text"
            class="field-input"
            :disabled="!isEditing"
          >
        </div>
        <div class="form-field">
          <label
            class="field-label"
            for="inn"
            >INN (tax ID)</label
          >
          <input
            id="inn"
            v-model="bankInfo.inn"
            type="text"
            class="field-input"
            :disabled="!isEditing"
          >
        </div>
      </div>

      <!-- Row 2: Account number + MFO -->
      <div class="form-row form-row--two-col">
        <div class="form-field">
          <label
            class="field-label"
            for="account-number"
            >Account number</label
          >
          <input
            id="account-number"
            v-model="bankInfo.accountNumber"
            type="text"
            class="field-input"
            :disabled="!isEditing"
          >
        </div>
        <div class="form-field">
          <label
            class="field-label"
            for="mfo"
            >MFO (bank code)</label
          >
          <input
            id="mfo"
            v-model="bankInfo.mfo"
            type="text"
            class="field-input"
            :disabled="!isEditing"
          >
        </div>
      </div>

      <!-- Row 3: Bank name (full width) -->
      <div class="form-row">
        <div class="form-field">
          <label
            class="field-label"
            for="bank-name"
            >Bank name</label
          >
          <input
            id="bank-name"
            v-model="bankInfo.bank"
            type="text"
            class="field-input"
            :disabled="!isEditing"
          >
        </div>
      </div>

      <!-- Footer -->
      <div class="form-footer">
        <div class="footer-meta">
          <History
            :size="12"
            class="meta-icon"
          />
          <span class="meta-text">
            Last updated by Aziz Ismoilov • Mar 18, 2026
          </span>
        </div>
        <div
          v-if="isEditing"
          class="footer-actions"
        >
          <button
            type="button"
            class="btn btn--outline"
            @click="cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn--primary"
            :disabled="saving"
            @click="saveChanges"
          >
            {{ saving ? 'Saving…' : 'Save changes' }}
          </button>
        </div>
        <button
          v-else
          type="button"
          class="btn btn--edit"
          @click="startEditing"
        >
          <Pencil :size="13" />
          Edit
        </button>
      </div>
    </div>
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

/* ===== Warning banner ===== */
.warning-banner {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 14px;
  margin-bottom: 16px;
  background: var(--color-warning);
  border: 1px solid var(--color-warning-foreground);
  border-radius: var(--radius-xl);
}

.warning-icon {
  flex-shrink: 0;
  margin-top: 1px;
  color: var(--color-warning-foreground);
}

.warning-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.warning-title {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-warning-foreground);
}

.warning-desc {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: var(--color-warning-foreground);
}

/* ===== Form card ===== */
.form-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

.card-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

/* ===== Form rows ===== */
.form-row {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row--two-col {
  flex-direction: row;
}

/* ===== Form field ===== */
.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row--two-col .form-field {
  flex: 1;
  min-width: 0;
}

.field-label {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: var(--muted-foreground);
  text-transform: none;
}

/* ===== Field input ===== */
.field-input {
  width: 100%;
  padding: 10px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--foreground);
  outline: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition:
    border-color 0.15s,
    background 0.15s;
}

.field-input:disabled {
  -webkit-text-fill-color: var(--foreground);
  cursor: default;
  background: var(--accent);
  opacity: 1;
}

.field-input:not(:disabled):focus {
  background: var(--background);
  border-color: var(--primary);
}

/* ===== Footer ===== */
.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.footer-meta {
  display: flex;
  gap: 6px;
  align-items: center;
}

.meta-icon {
  flex-shrink: 0;
  color: var(--muted-foreground);
}

.meta-text {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.footer-actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 640px) {
  .form-row--two-col {
    flex-direction: column;
    gap: 14px;
  }

  .form-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .footer-actions {
    width: 100%;
  }

  .footer-actions .btn {
    flex: 1;
    justify-content: center;
  }
}

/* ===== Buttons ===== */
.btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-pill);
  transition:
    background 0.15s,
    border-color 0.15s;
}

.btn--primary {
  font-weight: 600;
  color: var(--primary-foreground);
  background: var(--primary);
}

.btn--primary:hover {
  background: #4639d4;
}

.btn--outline {
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
}

.btn--outline:hover {
  border-color: var(--primary);
}

.btn--edit {
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
}

.btn--edit:hover {
  border-color: var(--primary);
}
</style>
