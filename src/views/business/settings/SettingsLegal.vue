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
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import {
  deleteOrganizationFile,
  getDownloadUrl,
  getOrganizationFilesByType,
  type OrganizationFileResponse,
  type OrganizationFileUploadItem,
  uploadOrganizationFiles,
} from '@/services/documentsService';
import {
  getOrganization,
  getOrganizationDetails,
  getSettingsLegal,
  saveNewOrganizationDetails,
  updateOrganization,
} from '@/services/settingsService';
import type {
  CompanyDetailsRequest,
  OrganizationCompanyDetailsResponse,
  OrganizationDetailsChangeRequest,
  OrganizationDetailsResponse,
  OrganizationSelfEmployedDetailsResponse,
  OrganizationYattDetailsResponse,
  SelfEmployedDetailsRequest,
  YattDetailsRequest,
} from '@/types/settings';
import type { ServiceCenterType } from '@/types/user';

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
const saving = ref(false);
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

// Details entered for a *new* org type (only used when the type is changed).
// Sent to POST /organization/save-new-details.
const detailsForm = reactive({
  companyDetails: {
    directorFullName: '',
    directorPinfl: '',
    registrationNumber: '',
    registeredDate: '',
    oked: '',
    charterCapital: null as number | string | null,
  },
  yattDetails: {
    fullName: '',
    passportSeries: '',
    pinfl: '',
    registrationNumber: '',
    registeredDate: '',
  },
  selfEmployedDetails: {
    fullName: '',
    pinfl: '',
    passportSeries: '',
    activityType: '',
  },
});

const detailsErrors = reactive<Record<string, string>>({});

const PINFL_REGEX = /^\d{14}$/;
const PASSPORT_REGEX = /^[A-Z]{2}\d{7}$/;
const OKED_REGEX = /^\d{4,5}$/;

// ── Location map (Leaflet) ────────────────────────────────────────────────────

const mapLocation = ref<{ lat: number; lng: number } | null>(null);
let mapInstance: any = null;

const loadLeaflet = () =>
  new Promise<void>((resolve) => {
    if ((window as any).L) {
      resolve();
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => resolve();
    document.head.appendChild(script);
  });

async function initMap() {
  const loc = mapLocation.value;
  if (!loc) {
    return;
  }
  await loadLeaflet();
  const L = (window as any).L;
  if (!L) {
    return;
  }
  if (mapInstance) {
    try {
      mapInstance.remove();
    } catch {
      // Ignore cleanup failures
    }
    mapInstance = null;
  }
  mapInstance = L.map('legal-info-map').setView([loc.lat, loc.lng], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(mapInstance);
  L.marker([loc.lat, loc.lng]).addTo(mapInstance);
}

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

// ── Registered details (GET /organization/{id}/details) ────────────────────────

const details = ref<OrganizationDetailsResponse | null>(null);
const loadingDetails = ref(false);

interface DetailField {
  label: string;
  value: string;
}

function formatOptionalDate(value: string | null | undefined): string {
  if (!value) {
    return '';
  }
  return formatDate(value);
}

function companyFields(
  c: OrganizationCompanyDetailsResponse | null,
): DetailField[] {
  if (!c) {
    return [];
  }
  return [
    { label: 'Director full name', value: c.directorFullName ?? '' },
    { label: 'Director PINFL', value: c.directorPinfl ?? '' },
    { label: 'State registration number', value: c.registrationNumber ?? '' },
    { label: 'Registered date', value: formatOptionalDate(c.registeredDate) },
    { label: 'OKED', value: c.oked ?? '' },
    {
      label: 'Charter capital',
      value: c.charterCapital == null ? '' : String(c.charterCapital),
    },
  ];
}

function yattFields(y: OrganizationYattDetailsResponse | null): DetailField[] {
  if (!y) {
    return [];
  }
  return [
    { label: 'Full name', value: y.fullName ?? '' },
    { label: 'Passport series', value: y.passportSeries ?? '' },
    { label: 'PINFL', value: y.pinfl ?? '' },
    { label: 'Registration number', value: y.registrationNumber ?? '' },
    { label: 'Registered date', value: formatOptionalDate(y.registeredDate) },
  ];
}

function selfEmployedFields(
  s: OrganizationSelfEmployedDetailsResponse | null,
): DetailField[] {
  if (!s) {
    return [];
  }
  return [
    { label: 'Full name', value: s.fullName ?? '' },
    { label: 'PINFL', value: s.pinfl ?? '' },
    { label: 'Passport series', value: s.passportSeries ?? '' },
    { label: 'Activity type', value: s.activityType ?? '' },
  ];
}

const detailFields = computed<DetailField[]>(() => {
  const d = details.value;
  if (!d) {
    return [];
  }
  const orgType = (data.value?.orgType ?? '').toUpperCase();
  if (orgType.includes('YATT') || orgType.includes('YTT')) {
    return yattFields(d.yattDetails);
  }
  if (orgType.includes('SELF')) {
    return selfEmployedFields(d.selfEmployedDetails);
  }
  if (d.yattDetails) {
    return yattFields(d.yattDetails);
  }
  if (d.selfEmployedDetails) {
    return selfEmployedFields(d.selfEmployedDetails);
  }
  return companyFields(d.companyDetails);
});

async function loadDetails() {
  loadingDetails.value = true;
  try {
    details.value = await getOrganizationDetails();
  } finally {
    loadingDetails.value = false;
  }
}

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
  await loadDetails();

  const org = await getOrganization();
  if (org?.latitude != null && org?.longitude != null) {
    mapLocation.value = {
      lat: Number(org.latitude),
      lng: Number(org.longitude),
    };
  }
  await nextTick();
  await initMap();
});

function startEditing() {
  isEditing.value = true;
}

function cancelEditing() {
  isEditing.value = false;
  clearDetailsErrors();
  resetDetailsForm();
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

function orgTypeToBackend(type: string): ServiceCenterType {
  if (type === 'ytt') {
    return 'YATT';
  }
  if (type === 'self-employed') {
    return 'SELF_EMPLOYED';
  }
  return 'MCHJ';
}

// ── Org type change (POST /organization/save-new-details) ─────────────────────

/** True when the user picked a different org type than the current one. */
const typeChanged = computed(() => form.value.orgType !== data.value?.orgType);

function resetDetailsForm() {
  detailsForm.companyDetails = {
    directorFullName: '',
    directorPinfl: '',
    registrationNumber: '',
    registeredDate: '',
    oked: '',
    charterCapital: null,
  };
  detailsForm.yattDetails = {
    fullName: '',
    passportSeries: '',
    pinfl: '',
    registrationNumber: '',
    registeredDate: '',
  };
  detailsForm.selfEmployedDetails = {
    fullName: '',
    pinfl: '',
    passportSeries: '',
    activityType: '',
  };
}

/** Id of the currently registered details record for the given type. */
function currentDetailsId(type: ServiceCenterType): string {
  const d = details.value;
  if (!d) {
    return '';
  }
  if (type === 'YATT') {
    return d.yattDetails?.id ?? '';
  }
  if (type === 'SELF_EMPLOYED') {
    return d.selfEmployedDetails?.id ?? '';
  }
  return d.companyDetails?.id ?? '';
}

function buildCompanyRequest(): CompanyDetailsRequest {
  const c = detailsForm.companyDetails;
  return {
    directorFullName: c.directorFullName.trim(),
    directorPinfl: c.directorPinfl.trim(),
    registrationNumber: c.registrationNumber.trim(),
    registeredDate: c.registeredDate || null,
    oked: c.oked.trim() || null,
    charterCapital:
      c.charterCapital == null || c.charterCapital === ''
        ? null
        : Number(c.charterCapital),
  };
}

function buildYattRequest(): YattDetailsRequest {
  const y = detailsForm.yattDetails;
  return {
    fullName: y.fullName.trim(),
    passportSeries: y.passportSeries.trim(),
    pinfl: y.pinfl.trim(),
    registrationNumber: y.registrationNumber.trim(),
    registeredDate: y.registeredDate || null,
  };
}

function buildSelfEmployedRequest(): SelfEmployedDetailsRequest {
  const s = detailsForm.selfEmployedDetails;
  return {
    fullName: s.fullName.trim(),
    pinfl: s.pinfl.trim(),
    passportSeries: s.passportSeries.trim(),
    activityType: s.activityType.trim(),
  };
}

function buildDetailsChangeRequest(): OrganizationDetailsChangeRequest {
  const newType = orgTypeToBackend(form.value.orgType);
  const oldType = orgTypeToBackend(data.value?.orgType ?? 'mchj');
  return {
    yattDetails: newType === 'YATT' ? buildYattRequest() : null,
    companyDetails: newType === 'MCHJ' ? buildCompanyRequest() : null,
    selfEmployedDetails:
      newType === 'SELF_EMPLOYED' ? buildSelfEmployedRequest() : null,
    oldDetailsId: currentDetailsId(oldType),
    oldDetailsType: oldType,
    type: newType,
  };
}

function clearDetailsErrors(): void {
  for (const key of Object.keys(detailsErrors)) {
    delete detailsErrors[key];
  }
}

function validateCompanyDetails(): void {
  const c = detailsForm.companyDetails;
  if (!c.directorFullName.trim()) {
    detailsErrors.directorFullName = 'Director full name is required.';
  }
  if (!c.directorPinfl.trim()) {
    detailsErrors.directorPinfl = 'Director PINFL is required.';
  } else if (!PINFL_REGEX.test(c.directorPinfl.trim())) {
    detailsErrors.directorPinfl = 'PINFL must be exactly 14 digits.';
  }
  if (!c.registrationNumber.trim()) {
    detailsErrors.registrationNumber = 'Registration number is required.';
  }
  if (c.oked.trim() && !OKED_REGEX.test(c.oked.trim())) {
    detailsErrors.oked = 'OKED must be 4 or 5 digits.';
  }
  if (
    c.charterCapital !== null &&
    c.charterCapital !== '' &&
    Number(c.charterCapital) <= 0
  ) {
    detailsErrors.charterCapital = 'Charter capital must be positive.';
  }
}

function validateYattDetails(): void {
  const y = detailsForm.yattDetails;
  if (!y.fullName.trim()) {
    detailsErrors.yattFullName = 'Full name is required.';
  }
  if (!y.passportSeries.trim()) {
    detailsErrors.yattPassport = 'Passport series is required.';
  } else if (!PASSPORT_REGEX.test(y.passportSeries.trim())) {
    detailsErrors.yattPassport = 'Passport must be in format AB1234567.';
  }
  if (!y.pinfl.trim()) {
    detailsErrors.yattPinfl = 'PINFL is required.';
  } else if (!PINFL_REGEX.test(y.pinfl.trim())) {
    detailsErrors.yattPinfl = 'PINFL must be exactly 14 digits.';
  }
  if (!y.registrationNumber.trim()) {
    detailsErrors.yattRegistrationNumber = 'Registration number is required.';
  }
}

function validateSelfEmployedDetails(): void {
  const s = detailsForm.selfEmployedDetails;
  if (!s.fullName.trim()) {
    detailsErrors.seFullName = 'Full name is required.';
  }
  if (!s.pinfl.trim()) {
    detailsErrors.sePinfl = 'PINFL is required.';
  } else if (!PINFL_REGEX.test(s.pinfl.trim())) {
    detailsErrors.sePinfl = 'PINFL must be exactly 14 digits.';
  }
  if (!s.passportSeries.trim()) {
    detailsErrors.sePassportSeries = 'Passport series is required.';
  } else if (!PASSPORT_REGEX.test(s.passportSeries.trim())) {
    detailsErrors.sePassportSeries = 'Passport must be in format AB1234567.';
  }
  if (!s.activityType.trim()) {
    detailsErrors.seActivityType = 'Activity type is required.';
  }
}

function validateDetails(): boolean {
  clearDetailsErrors();
  if (form.value.orgType === 'mchj') {
    validateCompanyDetails();
  } else if (form.value.orgType === 'ytt') {
    validateYattDetails();
  } else {
    validateSelfEmployedDetails();
  }
  return Object.keys(detailsErrors).length === 0;
}

async function save() {
  if (typeChanged.value && !validateDetails()) {
    return;
  }
  saving.value = true;
  try {
    const org = await getOrganization();
    if (typeChanged.value) {
      await saveNewOrganizationDetails(buildDetailsChangeRequest());
    }
    await updateOrganization({
      type: orgTypeToBackend(form.value.orgType),
      name: form.value.legalEntityName,
      description: org?.description ?? null,
      phone: org?.phone ?? '',
      email: org?.email ?? null,
      latitude: org?.latitude ?? null,
      longitude: org?.longitude ?? null,
      address: form.value.street,
      ownerId: org?.ownerId ?? '',
      inn: form.value.taxId,
      bankAccount: org?.bankAccount ?? null,
      mfo: org?.mfo ?? null,
      bankName: org?.bankName ?? null,
    });
  } catch {
    // Global error toast surfaces the failure
  } finally {
    saving.value = false;
  }
  data.value = { ...form.value };
  isEditing.value = false;
  clearDetailsErrors();
  resetDetailsForm();
  await loadDetails();
}

// ── Documents CRUD ─────────────────────────────────────────────────────────────

const files = ref<OrganizationFileResponse[]>([]);
const loadingDocs = ref(false);
const uploading = ref(false);
const errorMsg = ref<string | null>(null);

// Delete modal
const deleteTarget = ref<OrganizationFileResponse | null>(null);
const deleting = ref(false);

// Upload input ref
const fileInputRef = ref<HTMLInputElement | null>(null);

async function loadFiles() {
  loadingDocs.value = true;
  errorMsg.value = null;
  try {
    const responses = await getOrganizationFilesByType('DOCUMENT');
    files.value = responses;
  } catch (e) {
    errorMsg.value =
      e instanceof Error ? e.message : 'Failed to load documents';
  } finally {
    loadingDocs.value = false;
  }
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
    const items: OrganizationFileUploadItem[] = picked.map((file) => ({
      file,
      type: 'DOCUMENT',
    }));
    const saved = await uploadOrganizationFiles(items);
    files.value.unshift(...saved);
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : 'Upload failed';
  } finally {
    uploading.value = false;
    input.value = '';
  }
}

function askDeleteOne(file: OrganizationFileResponse) {
  deleteTarget.value = file;
}

function cancelDeleteDocs() {
  deleteTarget.value = null;
}

async function confirmDeleteDocs() {
  if (!deleteTarget.value) {
    return;
  }
  deleting.value = true;
  errorMsg.value = null;
  try {
    const target = deleteTarget.value;
    await deleteOrganizationFile(target.id);
    files.value = files.value.filter((f) => f.id !== target.id);
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : 'Delete failed';
  } finally {
    deleting.value = false;
    deleteTarget.value = null;
  }
}

function download(file: OrganizationFileResponse) {
  const url = getDownloadUrl(file.file.id);
  const token = localStorage.getItem('token');
  if (token) {
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const anchor = document.createElement('a');
        anchor.href = URL.createObjectURL(blob);
        anchor.download = file.file.originalName;
        anchor.click();
        URL.revokeObjectURL(anchor.href);
      });
  } else {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = file.file.originalName;
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

const deleteModalName = computed(
  () => deleteTarget.value?.file.originalName ?? '',
);
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
          :disabled="saving"
          @click="save"
        >
          <Loader2
            v-if="saving"
            :size="14"
            class="spin"
          />
          <Check
            v-else
            :size="14"
          ></Check>
          {{ saving ? 'Saving...' : 'Save changes' }}
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

    <div
      v-if="isEditing && typeChanged"
      class="section-card"
    >
      <div class="section-header">
        <h2 class="section-title">New type details</h2>
        <p class="section-desc">
          Fill in the registration details for the newly selected organization
          type. They are submitted together with the type change.
        </p>
      </div>

      <template v-if="form.orgType === 'mchj'">
        <div class="field-group">
          <label class="field-label">Director full name</label>
          <input
            v-model="detailsForm.companyDetails.directorFullName"
            type="text"
            class="field-input field-input-full"
            placeholder="e.g. Rustam Karimov"
          >
          <span
            v-if="detailsErrors.directorFullName"
            class="field-error"
            >{{ detailsErrors.directorFullName }}</span
          >
        </div>
        <div class="field-row">
          <div class="field-group">
            <label class="field-label">Director PINFL (14 digits)</label>
            <input
              v-model="detailsForm.companyDetails.directorPinfl"
              type="text"
              class="field-input"
              placeholder="e.g. 31402914820192"
            >
            <span
              v-if="detailsErrors.directorPinfl"
              class="field-error"
              >{{ detailsErrors.directorPinfl }}</span
            >
          </div>
          <div class="field-group">
            <label class="field-label">Registration number</label>
            <input
              v-model="detailsForm.companyDetails.registrationNumber"
              type="text"
              class="field-input"
              placeholder="e.g. REG-847291"
            >
            <span
              v-if="detailsErrors.registrationNumber"
              class="field-error"
              >{{ detailsErrors.registrationNumber }}</span
            >
          </div>
        </div>
        <div class="field-row">
          <div class="field-group">
            <label class="field-label">Registration date</label>
            <input
              v-model="detailsForm.companyDetails.registeredDate"
              type="date"
              class="field-input"
            >
          </div>
          <div class="field-group">
            <label class="field-label">OKED (4-5 digits, optional)</label>
            <input
              v-model="detailsForm.companyDetails.oked"
              type="text"
              class="field-input"
              placeholder="e.g. 45200"
            >
            <span
              v-if="detailsErrors.oked"
              class="field-error"
              >{{ detailsErrors.oked }}</span
            >
          </div>
        </div>
        <div class="field-group">
          <label class="field-label">Charter capital (UZS, optional)</label>
          <input
            v-model.number="detailsForm.companyDetails.charterCapital"
            type="number"
            class="field-input"
            placeholder="e.g. 10000000"
          >
          <span
            v-if="detailsErrors.charterCapital"
            class="field-error"
            >{{ detailsErrors.charterCapital }}</span
          >
        </div>
      </template>

      <template v-else-if="form.orgType === 'ytt'">
        <div class="field-group">
          <label class="field-label">Full name</label>
          <input
            v-model="detailsForm.yattDetails.fullName"
            type="text"
            class="field-input field-input-full"
            placeholder="e.g. Sherzod Alimov"
          >
          <span
            v-if="detailsErrors.yattFullName"
            class="field-error"
            >{{ detailsErrors.yattFullName }}</span
          >
        </div>
        <div class="field-row">
          <div class="field-group">
            <label class="field-label">Passport series &amp; number</label>
            <input
              v-model="detailsForm.yattDetails.passportSeries"
              type="text"
              class="field-input"
              placeholder="e.g. AA1234567"
            >
            <span
              v-if="detailsErrors.yattPassport"
              class="field-error"
              >{{ detailsErrors.yattPassport }}</span
            >
          </div>
          <div class="field-group">
            <label class="field-label">PINFL (14 digits)</label>
            <input
              v-model="detailsForm.yattDetails.pinfl"
              type="text"
              class="field-input"
              placeholder="e.g. 31402914820192"
            >
            <span
              v-if="detailsErrors.yattPinfl"
              class="field-error"
              >{{ detailsErrors.yattPinfl }}</span
            >
          </div>
        </div>
        <div class="field-row">
          <div class="field-group">
            <label class="field-label">Registration number</label>
            <input
              v-model="detailsForm.yattDetails.registrationNumber"
              type="text"
              class="field-input"
              placeholder="e.g. YTT-948291"
            >
            <span
              v-if="detailsErrors.yattRegistrationNumber"
              class="field-error"
              >{{ detailsErrors.yattRegistrationNumber }}</span
            >
          </div>
          <div class="field-group">
            <label class="field-label">Registration date</label>
            <input
              v-model="detailsForm.yattDetails.registeredDate"
              type="date"
              class="field-input"
            >
          </div>
        </div>
      </template>

      <template v-else>
        <div class="field-group">
          <label class="field-label">Full name</label>
          <input
            v-model="detailsForm.selfEmployedDetails.fullName"
            type="text"
            class="field-input field-input-full"
            placeholder="e.g. Aziz Karimov"
          >
          <span
            v-if="detailsErrors.seFullName"
            class="field-error"
            >{{ detailsErrors.seFullName }}</span
          >
        </div>
        <div class="field-row">
          <div class="field-group">
            <label class="field-label">Passport series &amp; number</label>
            <input
              v-model="detailsForm.selfEmployedDetails.passportSeries"
              type="text"
              class="field-input"
              placeholder="e.g. AA1234567"
            >
            <span
              v-if="detailsErrors.sePassportSeries"
              class="field-error"
              >{{ detailsErrors.sePassportSeries }}</span
            >
          </div>
          <div class="field-group">
            <label class="field-label">PINFL (14 digits)</label>
            <input
              v-model="detailsForm.selfEmployedDetails.pinfl"
              type="text"
              class="field-input"
              placeholder="e.g. 31402914820192"
            >
            <span
              v-if="detailsErrors.sePinfl"
              class="field-error"
              >{{ detailsErrors.sePinfl }}</span
            >
          </div>
        </div>
        <div class="field-group">
          <label class="field-label">Activity type</label>
          <input
            v-model="detailsForm.selfEmployedDetails.activityType"
            type="text"
            class="field-input"
            placeholder="e.g. Auto repair service, diagnostics"
          >
          <span
            v-if="detailsErrors.seActivityType"
            class="field-error"
            >{{ detailsErrors.seActivityType }}</span
          >
        </div>
      </template>
    </div>

    <div
      v-if="loadingDetails"
      class="section-card"
    >
      <h2 class="section-title">Registered entity details</h2>
      <p class="section-desc">Loading registered details&hellip;</p>
    </div>

    <div
      v-else-if="detailFields.length > 0"
      class="section-card"
    >
      <h2 class="section-title">Registered entity details</h2>
      <div class="detail-grid">
        <div
          v-for="field in detailFields"
          :key="field.label"
          class="field-group"
        >
          <label class="field-label">{{ field.label }}</label>
          <div class="field-value">
            {{ field.value || '—' }}
          </div>
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

    <div
      v-if="mapLocation"
      class="section-card"
    >
      <div class="section-header">
        <h2 class="section-title">Location on map</h2>
        <p class="section-desc">
          Where your business is registered and located.
        </p>
      </div>
      <div
        id="legal-info-map"
        class="map-container"
      />
    </div>

    <div class="section-card">
      <div class="section-header section-header-row">
        <h2 class="section-title">Legal documents</h2>
        <div class="header-actions">
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
        <div
          v-for="file in files"
          :key="file.id"
          class="doc-row"
        >
          <div
            class="file-type-badge"
            :class="`type-${fileIcon(file.file.contentType)}`"
          >
            <FileText :size="16" />
          </div>
          <div class="doc-info">
            <span class="doc-name">{{ file.file.originalName }}</span>
            <span class="doc-meta"
              >{{ file.file.contentType }}
              &middot; {{ formatSize(file.file.size) }}</span
            >
          </div>
          <span class="doc-date">{{ formatDate(file.file.createdDate) }}</span>
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
      v-if="deleteTarget"
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
.field-error {
  font-family: Inter, sans-serif;
  font-size: 11px;
  color: #d32f2f;
}
.map-container {
  z-index: 1;
  width: 100%;
  height: 280px;
  overflow: hidden;
  border: 1px solid #c5c5cb;
  border-radius: 24px;
}
.field-row {
  display: flex;
  gap: 14px;
}
.field-row .field-group {
  flex: 1;
}
.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
@media (max-width: 640px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
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
