<script
  setup
  lang="ts"
>
import { Eye, EyeOff, Trash2, Upload } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { getSettingsLegal } from '@/services/settingsService';

const previewMode = ref(false);
const form = ref({
  orgName: '',
  legalForm: '',
  inn: '',
  regDate: '',
  taxRegime: '',
  legalAddress: '',
  actualAddress: '',
  sameAsLegal: false,
  bankName: '',
  accountNumber: '',
  mfo: '',
  documents: [] as { name: string; size: string }[],
});

const legalForms = ['MCHJ', 'OOO', 'XK', 'AK', 'Other'];

onMounted(async () => {
  const data = await getSettingsLegal();
  if (data) {
    form.value = {
      orgName: data.orgName,
      legalForm: data.legalForm,
      inn: data.inn,
      regDate: data.regDate,
      taxRegime: data.taxRegime,
      legalAddress: data.legalAddress,
      actualAddress: data.actualAddress,
      sameAsLegal: data.sameAsLegal,
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      mfo: data.mfo,
      documents: [...data.documents],
    };
  }
});

function save() {
  // Save logic
}

function removeDocument(index: number) {
  form.value.documents.splice(index, 1);
}
</script>

<template>
  <div class="settings-page">
    <!-- Header -->
    <div class="header-row">
      <div class="header-row__left">
        <h1 class="page-title">Legal information</h1>
        <p class="page-subtitle">
          Manage your organization's legal and registration details
        </p>
      </div>
      <button
        type="button"
        class="btn btn--outline"
        @click="previewMode = !previewMode"
      >
        <component
          :is="previewMode ? EyeOff : Eye"
          :size="16"
        />
        {{ previewMode ? 'Edit' : 'Preview' }}
      </button>
    </div>

    <!-- Business Details -->
    <div class="form-card">
      <h2 class="form-card__title">Business Details</h2>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Organization name</label>
          <input
            v-model="form.orgName"
            type="text"
            class="form-input"
            :readonly="previewMode"
          >
        </div>
        <div class="form-group">
          <label class="form-label">Legal form</label>
          <select
            v-model="form.legalForm"
            class="form-input"
            :disabled="previewMode"
          >
            <option
              v-for="lf in legalForms"
              :key="lf"
              :value="lf"
            >
              {{ lf }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">INN</label>
          <input
            v-model="form.inn"
            type="text"
            class="form-input"
            :readonly="previewMode"
          >
        </div>
        <div class="form-group">
          <label class="form-label">Registration date</label>
          <input
            v-model="form.regDate"
            type="date"
            class="form-input"
            :readonly="previewMode"
          >
        </div>
        <div class="form-group">
          <label class="form-label">Tax regime</label>
          <input
            v-model="form.taxRegime"
            type="text"
            class="form-input"
            :readonly="previewMode"
          >
        </div>
      </div>
    </div>

    <!-- Address -->
    <div class="form-card">
      <h2 class="form-card__title">Address</h2>
      <div class="form-grid">
        <div class="form-group form-group--full">
          <label class="form-label">Legal address</label>
          <input
            v-model="form.legalAddress"
            type="text"
            class="form-input"
            :readonly="previewMode"
          >
        </div>
        <div class="form-group form-group--full">
          <label class="form-checkbox">
            <input
              v-model="form.sameAsLegal"
              type="checkbox"
              class="checkbox"
              :disabled="previewMode"
            >
            <span>Actual address matches legal address</span>
          </label>
        </div>
        <div
          v-if="!form.sameAsLegal"
          class="form-group form-group--full"
        >
          <label class="form-label">Actual address</label>
          <input
            v-model="form.actualAddress"
            type="text"
            class="form-input"
            :readonly="previewMode"
          >
        </div>
      </div>
    </div>

    <!-- Bank Details -->
    <div class="form-card">
      <h2 class="form-card__title">Bank Details</h2>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Bank name</label>
          <input
            v-model="form.bankName"
            type="text"
            class="form-input"
            :readonly="previewMode"
          >
        </div>
        <div class="form-group">
          <label class="form-label">Account number</label>
          <input
            v-model="form.accountNumber"
            type="text"
            class="form-input"
            :readonly="previewMode"
          >
        </div>
        <div class="form-group">
          <label class="form-label">MFO</label>
          <input
            v-model="form.mfo"
            type="text"
            class="form-input"
            :readonly="previewMode"
          >
        </div>
      </div>
    </div>

    <!-- Documents -->
    <div class="form-card">
      <h2 class="form-card__title">Documents</h2>
      <div class="documents-list">
        <div
          v-for="(doc, index) in form.documents"
          :key="index"
          class="doc-item"
        >
          <div class="doc-item__info">
            <span class="doc-item__name">{{ doc.name }}</span>
            <span class="doc-item__size">{{ doc.size }}</span>
          </div>
          <button
            v-if="!previewMode"
            type="button"
            class="btn-icon"
            title="Remove document"
            @click="removeDocument(index)"
          >
            <Trash2 :size="16" />
          </button>
        </div>
        <div
          v-if="!previewMode"
          class="doc-upload"
        >
          <Upload :size="20" />
          <span>Upload document</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div
      v-if="!previewMode"
      class="form-actions"
    >
      <button
        type="button"
        class="btn btn--outline"
      >
        Cancel
      </button>
      <button
        type="button"
        class="btn btn--primary"
        @click="save"
      >
        Save changes
      </button>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  max-width: 800px;
  padding: 24px 32px;
}

.header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.header-row__left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #2a2933;
}

.page-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #616167;
}

.btn {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 10px 20px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 999px;
  transition: background 0.15s;
}

.btn--primary {
  color: #ffffff;
  background: #5749f4;
}

.btn--primary:hover {
  background: #4639d4;
}

.btn--outline {
  color: #616167;
  background: #ffffff;
  border: 1px solid #d9d9db;
}

.btn--outline:hover {
  background: #f5f5f5;
}

.form-card {
  padding: 20px 24px;
  margin-bottom: 16px;
  border: 1px solid #d9d9db;
  border-radius: 10px;
}

.form-card__title {
  margin: 0 0 16px;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #2a2933;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group--full {
  grid-column: 1 / -1;
}

.form-label {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #2a2933;
}

.form-input {
  padding: 10px 14px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #2a2933;
  outline: none;
  background: #ffffff;
  border: 1px solid #d9d9db;
  border-radius: 8px;
  transition: border-color 0.15s;
}

.form-input:focus {
  border-color: #5749f4;
}

.form-input[readonly],
.form-input:disabled {
  color: #616167;
  cursor: default;
  background: #f9f9f9;
}

.form-checkbox {
  display: flex;
  gap: 8px;
  align-items: center;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
  cursor: pointer;
}

.checkbox {
  width: 16px;
  height: 16px;
  accent-color: #5749f4;
  cursor: pointer;
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.doc-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #f9f9f9;
  border-radius: 8px;
}

.doc-item__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.doc-item__name {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #2a2933;
}

.doc-item__size {
  font-family: Inter, sans-serif;
  font-size: 11px;
  color: #939399;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: #939399;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 6px;
  transition: all 0.15s;
}

.btn-icon:hover {
  color: #cc3314;
  background: #fee9e5;
}

.doc-upload {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #5749f4;
  cursor: pointer;
  border: 2px dashed #d9d9db;
  border-radius: 8px;
  transition: border-color 0.15s;
}

.doc-upload:hover {
  border-color: #5749f4;
}

.form-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
}
</style>
