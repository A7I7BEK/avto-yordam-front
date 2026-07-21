<script
  setup
  lang="ts"
>
import {
  Briefcase,
  Building2,
  Check,
  Download,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
  UserRound,
  X,
} from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import {
  deleteOrganizationFile,
  deleteOrganizationFiles,
  type FileResponse,
  getDownloadUrl,
  getOrganizationFilesByType,
  uploadOrganizationFile,
} from '@/services/documentsService';
import { getSettingsLegal } from '@/services/settingsService';

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
}

const isEditing = ref(false);
const data = ref<LegalInfoData | null>(null);
const form = ref({
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
});

const orgTypeOptions = [
  {
    value: 'mchj',
    title: 'Limited Liability Company',
    subtitle:
      'MChJ \u2014 the most common form for small and mid-size service businesses. Liability limited to capital contribution.',
    badge: 'MCHJ',
    icon: Building2,
    iconBg: '#c9d6f0',
    iconColor: '#001133',
    badgeBg: '#c9d6f0',
    badgeColor: '#001133',
  },
  {
    value: 'ytt',
    title: 'Individual Entrepreneur',
    subtitle:
      'YTT (Yakka Tartibdagi Tadbirkor) \u2014 sole-trader format with simplified tax and direct personal liability.',
    badge: 'YTT',
    icon: Briefcase,
    iconBg: '#ffd9b2',
    iconColor: '#4d2700',
    badgeBg: '#ffd9b2',
    badgeColor: '#4d2700',
  },
  {
    value: 'self-employed',
    title: 'Solo Master',
    subtitle:
      'For one-person setups working without a formal company. Lowest paperwork, fastest start.',
    badge: 'Self-employed',
    icon: UserRound,
    iconBg: '#a1e5a1',
    iconColor: '#003300',
    badgeBg: '#a1e5a1',
    badgeColor: '#003300',
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
    };
  }
  await loadFiles();
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
    };
  }
}

function save() {
  data.value = { ...form.value };
  isEditing.value = false;
}

// ── Documents CRUD ─────────────────────────────────────────────────────────────

const files = ref<FileResponse[]>([]);
const loadingDocs = ref(false);
const uploading = ref(false);
const errorMsg = ref<string | null>(null);

// Selection
const selected = ref<Set<string>>(new Set());
const allSelected = computed(
  () => files.value.length > 0 && selected.value.size === files.value.length,
);

// Delete modal
const deleteTarget = ref<FileResponse | null>(null);
const deleteMany = ref(false);
const deleting = ref(false);

// Upload input ref
const fileInputRef = ref<HTMLInputElement | null>(null);

async function loadFiles() {
  loadingDocs.value = true;
  errorMsg.value = null;
  try {
    const responses = await getOrganizationFilesByType('DOCUMENT');
    files.value = responses.map((r) => r.file);
  } catch (e) {
    errorMsg.value =
      e instanceof Error ? e.message : 'Failed to load documents';
  } finally {
    loadingDocs.value = false;
  }
}

function toggleSelectAll() {
  if (allSelected.value) {
    selected.value = new Set();
  } else {
    selected.value = new Set(files.value.map((f) => f.id));
  }
}

function toggleSelect(id: string) {
  const next = new Set(selected.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  selected.value = next;
}

function triggerUpload() {
  fileInputRef.value?.click();
}

async function onFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const picked = Array.from(input.files ?? []);
  if (picked.length === 0) {
    return;
  }

  uploading.value = true;
  errorMsg.value = null;
  try {
    for (const file of picked) {
      const saved = await uploadOrganizationFile(file, 'DOCUMENT');
      files.value.unshift(saved.file);
    }
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : 'Upload failed';
  } finally {
    uploading.value = false;
    input.value = '';
  }
}

function askDeleteOne(file: FileResponse) {
  deleteTarget.value = file;
  deleteMany.value = false;
}

function askDeleteSelected() {
  deleteMany.value = true;
  deleteTarget.value = null;
}

function cancelDeleteDocs() {
  deleteTarget.value = null;
  deleteMany.value = false;
}

async function confirmDeleteDocs() {
  deleting.value = true;
  errorMsg.value = null;
  try {
    if (deleteMany.value) {
      const ids = Array.from(selected.value);
      await deleteOrganizationFiles(ids);
      files.value = files.value.filter((f) => !selected.value.has(f.id));
      selected.value = new Set();
    } else if (deleteTarget.value) {
      await deleteOrganizationFile(deleteTarget.value.id);
      files.value = files.value.filter((f) => f.id !== deleteTarget.value?.id);
      selected.value.delete(deleteTarget.value.id);
    }
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : 'Delete failed';
  } finally {
    deleting.value = false;
    deleteTarget.value = null;
    deleteMany.value = false;
  }
}

function download(file: FileResponse) {
  const url = getDownloadUrl(file.id);
  const token = localStorage.getItem('token');
  if (token) {
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const anchor = document.createElement('a');
        anchor.href = URL.createObjectURL(blob);
        anchor.download = file.originalName;
        anchor.click();
        URL.revokeObjectURL(anchor.href);
      });
  } else {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = file.originalName;
    anchor.click();
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function fileIcon(contentType: string): string {
  if (contentType.includes('pdf')) {
    return 'pdf';
  }
  if (contentType.includes('image')) {
    return 'img';
  }
  if (
    contentType.includes('spreadsheet') ||
    contentType.includes('excel') ||
    contentType.includes('csv')
  ) {
    return 'xls';
  }
  if (contentType.includes('word') || contentType.includes('document')) {
    return 'doc';
  }
  return 'file';
}

const deleteModalName = computed(() => {
  if (deleteMany.value) {
    return `${selected.value.size} selected files`;
  }
  return deleteTarget.value?.originalName ?? '';
});
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
            <div
              class="org-type-icon-box"
              :style="{ background: option.iconBg, color: option.iconColor }"
            >
              <component
                :is="option.icon"
                :size="20"
              ></component>
            </div>
            <span
              class="org-type-badge-pill"
              :style="{ background: option.badgeBg, color: option.badgeColor }"
              >{{ option.badge }}</span
            >
          </div>
          <h3 class="org-type-title">{{ option.title }}</h3>
          <p class="org-type-desc">{{ option.subtitle }}</p>
          <div class="org-type-status">
            <button
              v-if="form.orgType === option.value"
              type="button"
              class="org-type-btn org-type-btn-current"
            >
              <Check :size="14"></Check>
              Current type
            </button>
            <button
              v-else
              type="button"
              class="org-type-btn org-type-btn-select"
            >
              Select
            </button>
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
        <div class="header-actions">
          <button
            v-if="selected.size > 0"
            type="button"
            class="btn btn-danger btn-sm"
            @click="askDeleteSelected"
          >
            <Trash2 :size="13" />
            Delete {{ selected.size }} selected
          </button>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            :disabled="uploading"
            @click="triggerUpload"
          >
            <Loader2
              v-if="uploading"
              :size="13"
              class="spin"
            />
            <Upload
              v-else
              :size="13"
            />
            Upload document
          </button>
          <input
            ref="fileInputRef"
            type="file"
            multiple
            accept="*/*"
            style="display: none"
            @change="onFilesSelected"
          >
        </div>
      </div>

      <!-- Error banner -->
      <div
        v-if="errorMsg"
        class="error-banner"
      >
        <span>{{ errorMsg }}</span>
        <button
          type="button"
          class="error-dismiss"
          @click="errorMsg = null"
        >
          <X :size="14" />
        </button>
      </div>

      <!-- Loading -->
      <div
        v-if="loadingDocs"
        class="loading-state"
      >
        <Loader2
          :size="28"
          class="spin"
        />
        <span>Loading documents&hellip;</span>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="files.length === 0"
        class="empty-state"
      >
        <div class="empty-icon-box">
          <FileText :size="32" />
        </div>
        <h3 class="empty-title">No documents yet</h3>
        <p class="empty-desc">
          Upload certificates, licenses, contracts or any legal files for your
          organization.
        </p>
        <button
          type="button"
          class="btn btn-primary btn-sm"
          @click="triggerUpload"
        >
          <Plus :size="13" />
          Upload first document
        </button>
      </div>

      <!-- Document rows -->
      <template v-else>
        <!-- Select-all header -->
        <div class="docs-list-header">
          <input
            type="checkbox"
            class="checkbox"
            :checked="allSelected"
            @change="toggleSelectAll"
          >
          <span class="docs-count"
            >{{ files.length }}
            document{{ files.length === 1 ? '' : 's' }}</span
          >
        </div>
        <div
          v-for="file in files"
          :key="file.id"
          class="doc-row"
          :class="{ 'doc-row-selected': selected.has(file.id) }"
        >
          <input
            type="checkbox"
            class="checkbox"
            :checked="selected.has(file.id)"
            @change="toggleSelect(file.id)"
          >
          <div
            class="file-type-badge"
            :class="`type-${fileIcon(file.contentType)}`"
          >
            <FileText :size="16" />
          </div>
          <div class="doc-info">
            <span class="doc-name">{{ file.originalName }}</span>
            <span class="doc-meta"
              >{{ file.contentType }}
              &middot; {{ formatSize(file.size) }}</span
            >
          </div>
          <span class="doc-date">{{ formatDate(file.createdDate) }}</span>
          <div class="doc-actions">
            <button
              type="button"
              class="btn-icon-only"
              title="Download"
              @click="download(file)"
            >
              <Download :size="14" />
            </button>
            <button
              type="button"
              class="btn-icon-only btn-icon-danger"
              title="Delete"
              @click="askDeleteOne(file)"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="deleteTarget || deleteMany"
      class="modal-overlay"
      @click.self="cancelDeleteDocs"
    >
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-icon-box">
            <Trash2 :size="22"></Trash2>
          </div>
          <div class="modal-title-group">
            <h3 class="modal-title">Delete document?</h3>
            <p class="modal-desc">
              <strong>{{ deleteModalName }}</strong>
              will be permanently deleted. This action cannot be undone.
            </p>
          </div>
        </div>
        <div class="modal-actions">
          <button
            type="button"
            class="btn btn-outline"
            :disabled="deleting"
            @click="cancelDeleteDocs"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-danger"
            :disabled="deleting"
            @click="confirmDeleteDocs"
          >
            <Loader2
              v-if="deleting"
              :size="13"
              class="spin"
            />
            <Trash2
              v-else
              :size="13"
            />
            Delete
          </button>
        </div>
      </div>
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
.btn-danger {
  color: #fff;
  background: #cc3314;
  border: none;
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
  flex-direction: row;
  gap: 14px;
}
.org-type-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  cursor: default;
  background: #fff;
  border: 1px solid #c5c5cb;
  border-radius: 24px;
}
.org-type-card-selected {
  border-color: #5749f4;
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
.status-badge-active {
  color: #2a2933;
  background: #f5f5f5;
}
.org-type-btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 9px 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 999px;
}
.org-type-btn-current {
  color: #fff;
  background: #5749f4;
  border: none;
}
.org-type-btn-select {
  color: #2a2933;
  background: transparent;
  border: 1px solid #c5c5cb;
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
.btn-delete-pill {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #cc3314;
  cursor: pointer;
  background: transparent;
  border: 1px solid #cc3314;
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

/* Delete Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.6);
}
.modal-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 440px;
  padding: 24px;
  background: #fff;
  border: 1px solid #c5c5cb;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.24);
}
.modal-header {
  display: flex;
  gap: 14px;
}
.modal-icon-box {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: #cc3314;
  background: #f5f5f5;
  border-radius: 24px;
}
.modal-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
}
.modal-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2a2933;
}
.modal-desc {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  line-height: 1.4;
  color: #616167;
}
.modal-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* ===== Documents CRUD styles ===== */
.header-actions {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
}
.btn-sm {
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 600;
}
.btn-danger {
  color: #fff;
  background: #cc3314;
  border: none;
}
.spin {
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.error-banner {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #cc3314;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}
.error-dismiss {
  display: flex;
  align-items: center;
  padding: 0;
  color: #cc3314;
  cursor: pointer;
  background: transparent;
  border: none;
}
.loading-state {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
}
.empty-state {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  padding: 48px 24px;
  text-align: center;
}
.empty-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  color: #616167;
  background: #f5f5f5;
  border-radius: 32px;
}
.empty-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #2a2933;
}
.empty-desc {
  max-width: 360px;
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  line-height: 1.5;
  color: #616167;
}
.docs-list-header {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 8px 14px;
}
.docs-count {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #616167;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.checkbox {
  width: 16px;
  height: 16px;
  accent-color: #5749f4;
  cursor: pointer;
}
.doc-row-selected {
  background: #f5f3ff;
  border-color: #5749f4;
}
.doc-actions {
  display: flex;
  flex-shrink: 0;
  gap: 4px;
}
.btn-icon-only {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: #616167;
  cursor: pointer;
  background: transparent;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
  transition: background 0.15s;
}
.btn-icon-only:hover {
  background: #f5f5f5;
}
.btn-icon-danger {
  color: #cc3314;
  border-color: #cc3314;
}
.btn-icon-danger:hover {
  background: #fef2f2;
}
.file-type-badge {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: #616167;
  background: #f5f5f5;
  border-radius: 10px;
}
.doc-date {
  flex-shrink: 0;
  font-family: Inter, sans-serif;
  font-size: 11px;
  color: #616167;
  white-space: nowrap;
}
</style>
