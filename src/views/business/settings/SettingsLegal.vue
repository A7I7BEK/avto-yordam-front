<script
  setup
  lang="ts"
>
import {
  Building2,
  Check,
  Download,
  FileText,
  Pencil,
  Trash2,
  Upload,
} from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { getSettingsLegal } from '@/services/settingsService';

interface LegalDocument {
  id: string;
  name: string;
  fileName: string;
  size: string;
  uploadedAt: string;
  verified: boolean;
}

interface LegalInfoData {
  orgType: string;
  legalEntityName: string;
  stateRegNumber: string;
  taxId: string;
  vatStatus: string;
  foundingDate: string;
  country: string;
  region: string;
  city: string;
  postalCode: string;
  street: string;
  documents: LegalDocument[];
}

const isEditing = ref(false);
const data = ref<LegalInfoData | null>(null);
const form = ref<LegalInfoData>({
  orgType: 'mchj',
  legalEntityName: '',
  stateRegNumber: '',
  taxId: '',
  vatStatus: '',
  foundingDate: '',
  country: '',
  region: '',
  city: '',
  postalCode: '',
  street: '',
  documents: [],
});

const orgTypeOptions = [
  {
    value: 'mchj',
    title: 'Limited Liability Company',
    subtitle:
      'MChJ \u2014 the most common form for small and mid-size service businesses. Liability limited to capital contribution.',
    badge: 'MCHJ',
  },
  {
    value: 'ytt',
    title: 'Individual Entrepreneur',
    subtitle:
      'YTT (Yakka Tartibdagi Tadbirkor) \u2014 sole-trader format with simplified tax and direct personal liability.',
    badge: 'YTT',
  },
  {
    value: 'self-employed',
    title: 'Solo Master',
    subtitle:
      'For one-person setups working without a formal company. Lowest paperwork, fastest start.',
    badge: 'Self-employed',
  },
];

onMounted(async () => {
  const result = await getSettingsLegal();
  data.value = result;
  if (result) {
    form.value = {
      orgType: result.orgType,
      legalEntityName: result.legalEntityName,
      stateRegNumber: result.stateRegNumber,
      taxId: result.taxId,
      vatStatus: result.vatStatus,
      foundingDate: result.foundingDate,
      country: result.country,
      region: result.region,
      city: result.city,
      postalCode: result.postalCode,
      street: result.street,
      documents: [...result.documents],
    };
  }
});

function startEditing() {
  isEditing.value = true;
}

function cancelEditing() {
  isEditing.value = false;
  if (data.value) {
    form.value = {
      orgType: data.value.orgType,
      legalEntityName: data.value.legalEntityName,
      stateRegNumber: data.value.stateRegNumber,
      taxId: data.value.taxId,
      vatStatus: data.value.vatStatus,
      foundingDate: data.value.foundingDate,
      country: data.value.country,
      region: data.value.region,
      city: data.value.city,
      postalCode: data.value.postalCode,
      street: data.value.street,
      documents: [...data.value.documents],
    };
  }
}

function save() {
  data.value = { ...form.value };
  isEditing.value = false;
}

function removeDocument(index: number) {
  form.value.documents.splice(index, 1);
}
</script>

<template>
  <div class="legal-info-page">
    <div class="header-row">
      <div class="header-text">
        <h1 class="page-title">Legal info</h1>
        <p class="page-subtitle">
          The registered legal entity used on contracts, invoices, and official
          documents.
        </p>
      </div>
      <div
        class="header-actions"
        v-if="!isEditing"
      >
        <button
          type="button"
          class="btn btn-primary"
          @click="startEditing"
        >
          <Pencil :size="13"></Pencil>
          Edit
        </button>
      </div>
      <div
        class="header-actions"
        v-else
      >
        <button
          type="button"
          class="btn btn-outline"
          @click="cancelEditing"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary"
          @click="save"
        >
          <Check :size="14"></Check>
          Save changes
        </button>
      </div>
    </div>

    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">Organization type</h2>
        <p class="section-desc">
          Changing this affects tax handling, invoices and the documents you
          must provide. Pick the legal structure that matches your registration.
        </p>
      </div>
      <div
        v-if="!isEditing"
        class="org-type-wrapper"
      >
        <div class="org-type-card org-type-card-selected">
          <div class="org-type-card-header">
            <div class="org-type-icon-box">
              <Building2 :size="20"></Building2>
            </div>
            <span class="org-type-badge-pill"
              >{{ orgTypeOptions.find((o) => o.value === form.orgType)?.badge }}</span
            >
          </div>
          <h3 class="org-type-title">
            {{ orgTypeOptions.find((o) => o.value === form.orgType)?.title }}
          </h3>
          <p class="org-type-desc">
            {{ orgTypeOptions.find((o) => o.value === form.orgType)?.subtitle }}
          </p>
          <div class="org-type-status">
            <div class="status-badge status-badge-active">
              <Check :size="14"></Check>
              Active
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="org-type-wrapper"
      >
        <div
          v-for="option in orgTypeOptions"
          :key="option.value"
          class="org-type-card"
          :class="form.orgType === option.value ? 'org-type-card-selected' : ''"
          role="button"
          tabindex="0"
          @click="form.orgType = option.value"
          @keydown.enter="form.orgType = option.value"
        >
          <div class="org-type-card-header">
            <span class="org-type-badge">{{ option.badge }}</span>
            <div
              v-if="form.orgType === option.value"
              class="org-type-check"
            >
              <Check :size="16"></Check>
            </div>
          </div>
          <h3 class="org-type-title">{{ option.title }}</h3>
          <p class="org-type-desc">{{ option.subtitle }}</p>
          <div class="org-type-status">
            <div
              v-if="form.orgType === option.value"
              class="status-badge status-badge-selected"
            >
              <Check :size="14"></Check>
              Selected
            </div>
            <div
              v-else
              class="status-badge status-badge-select"
            >
              Select
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <h2 class="section-title">Legal entity</h2>
      <div class="field-group">
        <label class="field-label">Registered legal entity name</label>
        <div
          v-if="!isEditing"
          class="field-value field-value-full"
        >
          {{ form.legalEntityName }}
        </div>
        <input
          v-else
          v-model="form.legalEntityName"
          type="text"
          class="field-input field-input-full"
        >
      </div>
      <div class="field-row">
        <div class="field-group">
          <label class="field-label">State registration number</label>
          <div
            v-if="!isEditing"
            class="field-value"
          >
            {{ form.stateRegNumber }}
          </div>
          <input
            v-else
            v-model="form.stateRegNumber"
            type="text"
            class="field-input"
          >
        </div>
        <div class="field-group">
          <label class="field-label">Tax ID (INN)</label>
          <div
            v-if="!isEditing"
            class="field-value"
          >
            {{ form.taxId }}
          </div>
          <input
            v-else
            v-model="form.taxId"
            type="text"
            class="field-input"
          >
        </div>
      </div>
      <div class="field-row">
        <div class="field-group">
          <label class="field-label">VAT status</label>
          <div
            v-if="!isEditing"
            class="field-value"
          >
            {{ form.vatStatus }}
          </div>
          <input
            v-else
            v-model="form.vatStatus"
            type="text"
            class="field-input"
          >
        </div>
        <div class="field-group">
          <label class="field-label">Founding date</label>
          <div
            v-if="!isEditing"
            class="field-value"
          >
            {{ form.foundingDate }}
          </div>
          <input
            v-else
            v-model="form.foundingDate"
            type="text"
            class="field-input"
            placeholder="e.g. 12 March 2019"
          >
        </div>
      </div>
    </div>

    <div class="section-card">
      <h2 class="section-title">Registered legal address</h2>
      <div class="field-row">
        <div class="field-group">
          <label class="field-label">Country</label>
          <div
            v-if="!isEditing"
            class="field-value"
          >
            {{ form.country }}
          </div>
          <input
            v-else
            v-model="form.country"
            type="text"
            class="field-input"
          >
        </div>
        <div class="field-group">
          <label class="field-label">Region</label>
          <div
            v-if="!isEditing"
            class="field-value"
          >
            {{ form.region }}
          </div>
          <input
            v-else
            v-model="form.region"
            type="text"
            class="field-input"
          >
        </div>
      </div>
      <div class="field-row">
        <div class="field-group">
          <label class="field-label">City</label>
          <div
            v-if="!isEditing"
            class="field-value"
          >
            {{ form.city }}
          </div>
          <input
            v-else
            v-model="form.city"
            type="text"
            class="field-input"
          >
        </div>
        <div class="field-group">
          <label class="field-label">Postal code</label>
          <div
            v-if="!isEditing"
            class="field-value"
          >
            {{ form.postalCode }}
          </div>
          <input
            v-else
            v-model="form.postalCode"
            type="text"
            class="field-input"
          >
        </div>
      </div>
      <div class="field-group">
        <label class="field-label">Street</label>
        <div
          v-if="!isEditing"
          class="field-value field-value-full"
        >
          {{ form.street }}
        </div>
        <input
          v-else
          v-model="form.street"
          type="text"
          class="field-input field-input-full"
        >
      </div>
    </div>

    <div class="section-card">
      <div class="section-header section-header-row">
        <h2 class="section-title">Legal documents</h2>
        <button
          v-if="isEditing"
          type="button"
          class="btn btn-primary btn-sm"
        >
          <Upload :size="14"></Upload>
          Upload document
        </button>
      </div>
      <div
        v-for="(doc, index) in form.documents"
        :key="doc.id"
        class="doc-row"
      >
        <FileText
          :size="18"
          class="doc-icon"
        ></FileText>
        <div class="doc-info">
          <span class="doc-name">{{ doc.name }}</span>
          <span class="doc-meta"
            >{{ doc.fileName }}
            &middot; {{ doc.size }} &middot; Uploaded {{ doc.uploadedAt }}</span
          >
        </div>
        <div
          class="doc-badge"
          :class="doc.verified ? 'badge-verified' : 'badge-pending'"
        >
          {{ doc.verified ? 'Verified' : 'Pending' }}
        </div>
        <button
          v-if="!isEditing"
          type="button"
          class="btn-download-pill"
        >
          <Download :size="12"></Download>
          Download
        </button>
        <button
          v-else
          type="button"
          class="btn-icon btn-icon-danger"
          title="Remove document"
          @click="removeDocument(index)"
        >
          <Trash2 :size="16"></Trash2>
        </button>
      </div>
    </div>

    <div
      v-if="isEditing"
      class="edit-actions"
    >
      <button
        type="button"
        class="btn btn-outline"
        @click="cancelEditing"
      >
        Cancel
      </button>
      <button
        type="button"
        class="btn btn-primary"
        @click="save"
      >
        <Check :size="14"></Check>
        Save changes
      </button>
    </div>
  </div>
</template>

<style scoped>
.legal-info-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.header-actions {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
}
.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #2a2933;
}
.page-subtitle {
  max-width: 720px;
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
}
.btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  border-radius: 999px;
}
.btn-primary {
  color: #fff;
  background: #5749f4;
}
.btn-outline {
  color: #616167;
  background: transparent;
  border: 1px solid #c5c5cb;
}
.btn-sm {
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 600;
}
.section-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
  background: #fff;
  border: 1px solid #c5c5cb;
  border-radius: 24px;
}
.section-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.section-header-row {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.section-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #2a2933;
}
.section-desc {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #616167;
}
.org-type-wrapper {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.org-type-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  cursor: default;
  background: #fff;
  border: 1px solid #c5c5cb;
  border-radius: 24px;
}
.org-type-card-selected {
  border: 2px solid #5749f4;
}
.org-type-card[role="button"] {
  cursor: pointer;
}
.org-type-card[role="button"]:hover {
  border-color: #5749f4;
}
.org-type-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.org-type-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #001133;
  background: #c9d6f0;
  border-radius: 24px;
}
.org-type-badge-pill {
  padding: 5px 10px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #001133;
  letter-spacing: 0.3px;
  background: #c9d6f0;
  border-radius: 999px;
}
.org-type-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #5749f4;
}
.org-type-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #2a2933;
}
.org-type-desc {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  line-height: 1.5;
  color: #616167;
}
.org-type-status {
  display: flex;
}
.status-badge {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  border-radius: 999px;
}
.status-badge-selected {
  color: #fff;
  background: #5749f4;
}
.status-badge-active {
  color: #2a2933;
  background: #f5f5f5;
}
.status-badge-select {
  color: #616167;
  background: #f5f5f5;
}
.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field-label {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #616167;
}
.field-value {
  padding: 2px 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #2a2933;
}
.field-value-full {
  width: 100%;
}
.field-input {
  box-sizing: border-box;
  padding: 10px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #2a2933;
  outline: none;
  background: #fff;
  border: 1px solid #c5c5cb;
  border-radius: 6px;
}
.field-input:focus {
  border-color: #5749f4;
}
.field-input-full {
  width: 100%;
}
.field-row {
  display: flex;
  gap: 14px;
}
.field-row .field-group {
  flex: 1;
}
.doc-row {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid #c5c5cb;
  border-radius: 6px;
}
.doc-icon {
  flex-shrink: 0;
  color: #616167;
}
.doc-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.doc-name {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #2a2933;
}
.doc-meta {
  font-family: Inter, sans-serif;
  font-size: 11px;
  color: #616167;
}
.doc-badge {
  flex-shrink: 0;
  padding: 3px 10px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  border-radius: 999px;
}
.badge-verified {
  color: #003300;
  background: #a1e5a1;
}
.badge-pending {
  color: #4d2700;
  background: #ffd9b2;
}
.btn-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 6px 12px;
  color: #616167;
  cursor: pointer;
  background: transparent;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}
.btn-download-pill {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 6px 12px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #2a2933;
  cursor: pointer;
  background: transparent;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}
.btn-icon-danger {
  color: #cc3314;
  border-color: #c5c5cb;
}
.edit-actions {
  display: flex;
  gap: 8px;
}
</style>
