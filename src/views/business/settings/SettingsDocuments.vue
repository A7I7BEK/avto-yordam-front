<script
  setup
  lang="ts"
>
import {
  Download,
  FileText,
  Loader2,
  Plus,
  Trash2,
  Upload,
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

// ── State ────────────────────────────────────────────────────────────────────
const files = ref<FileResponse[]>([]);
const loading = ref(false);
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

// ── Load ─────────────────────────────────────────────────────────────────────
async function loadFiles() {
  loading.value = true;
  errorMsg.value = null;
  try {
    const responses = await getOrganizationFilesByType('DOCUMENT');
    files.value = responses.map((r) => r.file);
  } catch (e) {
    errorMsg.value =
      e instanceof Error ? e.message : 'Failed to load documents';
  } finally {
    loading.value = false;
  }
}

onMounted(loadFiles);

// ── Selection helpers ─────────────────────────────────────────────────────────
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

// ── Upload ────────────────────────────────────────────────────────────────────
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

// ── Delete single ─────────────────────────────────────────────────────────────
function askDeleteOne(file: FileResponse) {
  deleteTarget.value = file;
  deleteMany.value = false;
}

function askDeleteSelected() {
  deleteMany.value = true;
  deleteTarget.value = null;
}

function cancelDelete() {
  deleteTarget.value = null;
  deleteMany.value = false;
}

async function confirmDelete() {
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

// ── Download ──────────────────────────────────────────────────────────────────
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

// ── Helpers ───────────────────────────────────────────────────────────────────
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
  <div class="docs-page">
    <!-- Page header -->
    <div class="page-header">
      <div class="header-text">
        <h1 class="page-title">Documents</h1>
        <p class="page-subtitle">
          Official documents attached to your organization — certificates,
          licenses, contracts and other legal files.
        </p>
      </div>
      <div class="header-actions">
        <button
          v-if="selected.size > 0"
          type="button"
          class="btn btn--danger"
          @click="askDeleteSelected"
        >
          <Trash2 :size="13" />
          Delete {{ selected.size }} selected
        </button>
        <button
          type="button"
          class="btn btn--primary"
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
      v-if="loading"
      class="loading-state"
    >
      <Loader2
        :size="28"
        class="spin"
      />
      <span>Loading documents…</span>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="files.length === 0"
      class="empty-state"
    >
      <div class="empty-icon-box">
        <FileText :size="32" />
      </div>
      <h2 class="empty-title">No documents yet</h2>
      <p class="empty-desc">
        Upload certificates, licenses, contracts or any legal files for your
        organization.
      </p>
      <button
        type="button"
        class="btn btn--primary"
        @click="triggerUpload"
      >
        <Plus :size="13" />
        Upload first document
      </button>
    </div>

    <!-- Table -->
    <div
      v-else
      class="table-card"
    >
      <table class="docs-table">
        <thead>
          <tr>
            <th class="col-check">
              <input
                type="checkbox"
                class="checkbox"
                :checked="allSelected"
                @change="toggleSelectAll"
              >
            </th>
            <th class="col-name">Name</th>
            <th class="col-type">Type</th>
            <th class="col-size">Size</th>
            <th class="col-date">Uploaded</th>
            <th class="col-actions" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="file in files"
            :key="file.id"
            class="doc-row"
            :class="{ selected: selected.has(file.id) }"
          >
            <td class="col-check">
              <input
                type="checkbox"
                class="checkbox"
                :checked="selected.has(file.id)"
                @change="toggleSelect(file.id)"
              >
            </td>
            <td class="col-name">
              <div class="file-name-cell">
                <div
                  class="file-type-badge"
                  :class="`type-${fileIcon(file.contentType)}`"
                >
                  <FileText :size="14" />
                </div>
                <span class="file-name">{{ file.originalName }}</span>
              </div>
            </td>
            <td class="col-type">
              <span class="content-type">{{ file.contentType }}</span>
            </td>
            <td class="col-size">{{ formatSize(file.size) }}</td>
            <td class="col-date">{{ formatDate(file.createdDate) }}</td>
            <td class="col-actions">
              <div class="row-actions">
                <button
                  type="button"
                  class="action-btn"
                  title="Download"
                  @click="download(file)"
                >
                  <Download :size="14" />
                </button>
                <button
                  type="button"
                  class="action-btn action-btn--danger"
                  title="Delete"
                  @click="askDeleteOne(file)"
                >
                  <Trash2 :size="14" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="deleteTarget || deleteMany"
      class="modal-overlay"
      @click.self="cancelDelete"
    >
      <div class="modal-card">
        <div class="modal-icon-box">
          <Trash2 :size="22" />
        </div>
        <div class="modal-body">
          <h3 class="modal-title">Delete document?</h3>
          <p class="modal-desc">
            <strong>{{ deleteModalName }}</strong>
            will be permanently deleted. This action cannot be undone.
          </p>
        </div>
        <div class="modal-actions">
          <button
            type="button"
            class="btn btn--outline"
            :disabled="deleting"
            @click="cancelDelete"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn--danger"
            :disabled="deleting"
            @click="confirmDelete"
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
/* ===== Layout ===== */
.docs-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ===== Page header ===== */
.page-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #2a2933;
}

.page-subtitle {
  max-width: 560px;
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
}

.header-actions {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
}

/* ===== Buttons ===== */
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
  transition:
    background 0.15s,
    opacity 0.15s;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn--primary {
  color: #fff;
  background: #5749f4;
}

.btn--primary:not(:disabled):hover {
  background: #4639d4;
}

.btn--outline {
  color: #616167;
  background: transparent;
  border: 1px solid #c5c5cb;
}

.btn--outline:not(:disabled):hover {
  color: #5749f4;
  border-color: #5749f4;
}

.btn--danger {
  color: #fff;
  background: #cc3314;
}

.btn--danger:not(:disabled):hover {
  background: #a6280f;
}

/* ===== Error banner ===== */
.error-banner {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #7c1400;
  background: #fde8e3;
  border: 1px solid #f5bfb4;
  border-radius: 12px;
}

.error-dismiss {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  color: #7c1400;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 4px;
}

.error-dismiss:hover {
  background: #f5bfb4;
}

/* ===== Loading ===== */
.loading-state {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #616167;
}

/* ===== Empty state ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
  background: #fff;
  border: 1px solid #c5c5cb;
  border-radius: 24px;
}

.empty-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  color: #616167;
  background: #f5f5f5;
  border-radius: 16px;
}

.empty-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2a2933;
}

.empty-desc {
  max-width: 360px;
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
}

/* ===== Table card ===== */
.table-card {
  overflow: hidden;
  background: #fff;
  border: 1px solid #c5c5cb;
  border-radius: 24px;
}

.docs-table {
  width: 100%;
  border-collapse: collapse;
}

.docs-table thead th {
  padding: 12px 16px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #616167;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  background: #f9f9fb;
  border-bottom: 1px solid #e8e8ed;
}

.docs-table tbody .doc-row {
  border-bottom: 1px solid #f0f0f4;
  transition: background 0.1s;
}

.docs-table tbody .doc-row:last-child {
  border-bottom: none;
}

.docs-table tbody .doc-row:hover {
  background: #f9f9fb;
}

.docs-table tbody .doc-row.selected {
  background: #f0effe;
}

.docs-table td {
  padding: 14px 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  vertical-align: middle;
  color: #2a2933;
}

/* ===== Column widths ===== */
.col-check {
  width: 40px;
}

.col-name {
  min-width: 220px;
}

.col-type {
  max-width: 180px;
}

.col-size {
  width: 90px;
}

.col-date {
  width: 130px;
}

.col-actions {
  width: 90px;
}

/* ===== Checkbox ===== */
.checkbox {
  width: 16px;
  height: 16px;
  accent-color: #5749f4;
  cursor: pointer;
}

/* ===== File name cell ===== */
.file-name-cell {
  display: flex;
  gap: 10px;
  align-items: center;
}

.file-type-badge {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

.type-pdf {
  color: #cc3314;
  background: #fde8e3;
}

.type-img {
  color: #0a7d38;
  background: #d4f4e2;
}

.type-xls {
  color: #0a6e1e;
  background: #d4eedb;
}

.type-doc {
  color: #1a4cbf;
  background: #d6e4ff;
}

.type-file {
  color: #5749f4;
  background: #eceafe;
}

.file-name {
  font-weight: 500;
  word-break: break-all;
}

.content-type {
  display: inline-block;
  max-width: 160px;
  padding: 3px 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
  font-weight: 500;
  color: #616167;
  white-space: nowrap;
  background: #f0f0f4;
  border-radius: 999px;
}

/* ===== Row actions ===== */
.row-actions {
  display: flex;
  gap: 4px;
  align-items: center;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  color: #616167;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 8px;
  transition:
    background 0.15s,
    color 0.15s;
}

.action-btn:hover {
  color: #2a2933;
  background: #f0f0f4;
}

.action-btn--danger:hover {
  color: #cc3314;
  background: #fde8e3;
}

/* ===== Modal ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 30%);
  backdrop-filter: blur(2px);
}

.modal-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 400px;
  padding: 28px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgb(0 0 0 / 15%);
}

.modal-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: #cc3314;
  background: #fde8e3;
  border-radius: 14px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.modal-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #2a2933;
}

.modal-desc {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
}

.modal-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* ===== Spin animation ===== */
.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
