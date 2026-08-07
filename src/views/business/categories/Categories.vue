<script
  setup
  lang="ts"
>
import { Clock, Search, X } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { apiClient } from '@/api/client';
import BreadcrumbBar from '@/components/app/BreadcrumbBar.vue';
import { isMockMode } from '@/config';
import { getMyOrg } from '@/services/settingsService';

interface BaseServiceType {
  id: string;
  name: string;
  description?: string;
  basePrice?: number;
  durationMinutes?: number;
}

interface MemberType {
  id: string;
  userName: string;
  name?: string;
}

interface OrganizationServiceType {
  id: string;
  organizationId: string;
  serviceId: string;
  catalogName?: string;
  minPrice: number;
  maxPrice: number;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  masters: MemberType[];
}

// State
const orgServices = ref<OrganizationServiceType[]>([]);
const baseServices = ref<BaseServiceType[]>([]);
const orgMembers = ref<MemberType[]>([]);

const loading = ref(true);
const activeOrgId = ref<string | null>(null);
const searchQuery = ref('');

// Dialog Form State
const showDialog = ref(false);
const editingServiceId = ref<string | null>(null);
const formServiceId = ref('');
const formMinPrice = ref<number>(0);
const formMaxPrice = ref<number>(0);
const formMinDuration = ref<number>(30);
const formMaxDuration = ref<number>(30);
const formMasterIds = ref<string[]>([]);
const formErrorMessage = ref('');
const isSaving = ref(false);

// Mock fallbacks
const mockBaseServices: BaseServiceType[] = [
  {
    id: 's1',
    name: 'Engine oil change',
    description: 'Replace engine oil and filter',
    basePrice: 150_000,
    durationMinutes: 30,
  },
  {
    id: 's2',
    name: 'Brake pad replacement',
    description: 'Replace front or rear brake pads',
    basePrice: 200_000,
    durationMinutes: 45,
  },
  {
    id: 's3',
    name: 'Computer diagnostics',
    description: 'Scan ECU for trouble codes',
    basePrice: 100_000,
    durationMinutes: 20,
  },
];

const mockOrgServices = ref<OrganizationServiceType[]>([
  {
    id: 'os1',
    organizationId: 'af-org-uuid',
    serviceId: 's1',
    minPrice: 130_000,
    maxPrice: 160_000,
    minDurationMinutes: 25,
    maxDurationMinutes: 35,
    masters: [
      { id: 'm1', userName: 'Aziz Karimov' },
      { id: 'm2', userName: 'Sherzod Alimov' },
    ],
  },
  {
    id: 'os2',
    organizationId: 'af-org-uuid',
    serviceId: 's2',
    minPrice: 180_000,
    maxPrice: 220_000,
    minDurationMinutes: 40,
    maxDurationMinutes: 50,
    masters: [{ id: 'm1', userName: 'Aziz Karimov' }],
  },
]);

const mockMembers: MemberType[] = [
  { id: 'm1', userName: 'Aziz Karimov' },
  { id: 'm2', userName: 'Sherzod Alimov' },
  { id: 'm3', userName: 'Rustam Karimov' },
];

async function loadData() {
  loading.value = true;
  try {
    if (isMockMode()) {
      baseServices.value = mockBaseServices;
      orgMembers.value = mockMembers;
      orgServices.value = mockOrgServices.value;
      return;
    }

    const org = await getMyOrg();
    if (!org) {
      orgServices.value = [];
      return;
    }
    activeOrgId.value = org.id;

    // Load base catalog
    const baseList = await apiClient.get('/catalog');
    if (Array.isArray(baseList)) {
      baseServices.value = baseList;
    }

    // Load organization members
    const membersList = await apiClient.get(
      '/organization-member/get-for-organization/',
    );
    if (Array.isArray(membersList)) {
      orgMembers.value = membersList.map((m: unknown) => {
        const item = m as Record<string, unknown>;
        return {
          id: String(item.id || ''),
          userName: String(item.userName || item.name || 'Unknown Specialist'),
        };
      });
    }

    // Load organization catalog
    const servicesList = await apiClient.get(
      `/organization-catalog/get-by-organization-id/${org.id}`,
    );
    if (Array.isArray(servicesList)) {
      orgServices.value = servicesList.map((item: any) => ({
        id: item.id,
        organizationId: item.organizationId,
        serviceId: item.catalogId ?? item.serviceId,
        catalogName: item.catalogName ?? '',
        minPrice: item.minPrice,
        maxPrice: item.maxPrice,
        minDurationMinutes: item.minDurationMinutes,
        maxDurationMinutes: item.maxDurationMinutes,
        masters: (item.masters ?? []).map((m: any) => ({
          id: m.id ?? m.userId ?? '',
          userName:
            m.userName ?? m.name ?? m.fullName ?? 'Unknown Specialist',
        })),
      }));
    }
  } catch {
    // Silent fail
  } finally {
    loading.value = false;
  }
}

function orgServiceName(s: OrganizationServiceType): string {
  return s.catalogName || getServiceName(s.serviceId);
}

const filteredServices = computed(() => {
  let list = orgServices.value;

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter((s) => {
      const name = orgServiceName(s).toLowerCase();
      const desc = getServiceDescription(s.serviceId).toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }

  return list;
});

function getServiceName(serviceId: string): string {
  const s = baseServices.value.find((x) => x.id === serviceId);
  return s ? s.name : 'Unknown Service';
}

function getServiceDescription(serviceId: string): string {
  const s = baseServices.value.find((x) => x.id === serviceId);
  return s?.description || '';
}

function getInitials(name: string): string {
  return (
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'S'
  );
}

function formatPriceRange(minPrice: number, maxPrice: number): string {
  if (!(minPrice || maxPrice)) {
    return 'Free';
  }
  if (minPrice === maxPrice) {
    return `${minPrice.toLocaleString('uz-UZ')} UZS`;
  }
  return `${minPrice.toLocaleString('uz-UZ')} – ${maxPrice.toLocaleString('uz-UZ')} UZS`;
}

function openCreateDialog() {
  editingServiceId.value = null;
  formServiceId.value = '';
  formMinPrice.value = 0;
  formMaxPrice.value = 0;
  formMinDuration.value = 30;
  formMaxDuration.value = 30;
  formMasterIds.value = [];
  formErrorMessage.value = '';
  showDialog.value = true;
}

function openEditDialog(service: OrganizationServiceType) {
  editingServiceId.value = service.id;
  formServiceId.value = service.serviceId;
  formMinPrice.value = service.minPrice;
  formMaxPrice.value = service.maxPrice;
  formMinDuration.value = service.minDurationMinutes;
  formMaxDuration.value = service.maxDurationMinutes;
  formMasterIds.value = service.masters ? service.masters.map((m) => m.id) : [];
  formErrorMessage.value = '';
  showDialog.value = true;
}

function closeDialog() {
  showDialog.value = false;
  editingServiceId.value = null;
  formErrorMessage.value = '';
}

function onServiceChange() {
  const s = baseServices.value.find((x) => x.id === formServiceId.value);
  if (s) {
    formMinPrice.value = s.basePrice || 0;
    formMaxPrice.value = s.basePrice || 0;
    formMinDuration.value = s.durationMinutes || 30;
    formMaxDuration.value = s.durationMinutes || 30;
  }
}

function validateForm() {
  if (!formServiceId.value) {
    return 'Please select a base service.';
  }
  if (formMinPrice.value < 0 || formMaxPrice.value < 0) {
    return 'Price ranges must be positive numbers.';
  }
  if (formMinPrice.value > formMaxPrice.value) {
    return 'Min price cannot exceed max price.';
  }
  if (formMinDuration.value < 0 || formMaxDuration.value < 0) {
    return 'Durations must be positive numbers.';
  }
  if (formMinDuration.value > formMaxDuration.value) {
    return 'Min duration cannot exceed max duration.';
  }
  return '';
}

function saveMockService(payload: {
  organizationId: string | null;
  catalogId: string;
  minPrice: number;
  maxPrice: number;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  masterIds: string[];
}) {
  if (editingServiceId.value) {
    const idx = mockOrgServices.value.findIndex(
      (s) => s.id === editingServiceId.value,
    );
    if (idx >= 0) {
      const serviceObj = mockOrgServices.value[idx];
      if (serviceObj) {
        mockOrgServices.value[idx] = {
          id: serviceObj.id,
          organizationId: serviceObj.organizationId,
          serviceId: payload.catalogId,
          minPrice: payload.minPrice,
          maxPrice: payload.maxPrice,
          minDurationMinutes: payload.minDurationMinutes,
          maxDurationMinutes: payload.maxDurationMinutes,
          masters: orgMembers.value.filter((m) =>
            payload.masterIds.includes(m.id),
          ),
        };
      }
    }
  } else {
    mockOrgServices.value.push({
      id: `os-${Math.random().toString(36).slice(2, 9)}`,
      organizationId: payload.organizationId || 'af-org-uuid',
      serviceId: payload.catalogId,
      minPrice: payload.minPrice,
      maxPrice: payload.maxPrice,
      minDurationMinutes: payload.minDurationMinutes,
      maxDurationMinutes: payload.maxDurationMinutes,
      masters: orgMembers.value.filter((m) => payload.masterIds.includes(m.id)),
    });
  }
}

async function saveOrganizationService() {
  formErrorMessage.value = '';
  const errorMsg = validateForm();
  if (errorMsg) {
    formErrorMessage.value = errorMsg;
    return;
  }

  const payload = {
    organizationId: activeOrgId.value,
    catalogId: formServiceId.value,
    minPrice: formMinPrice.value,
    maxPrice: formMaxPrice.value,
    minDurationMinutes: formMinDuration.value,
    maxDurationMinutes: formMaxDuration.value,
    masterIds: formMasterIds.value,
  };

  isSaving.value = true;
  try {
    if (isMockMode()) {
      saveMockService(payload);
    } else if (editingServiceId.value) {
      await apiClient.put(
        `/organization-catalog/${editingServiceId.value}`,
        payload,
      );
    } else {
      await apiClient.post('/organization-catalog', payload);
    }
    closeDialog();
    await loadData();
  } catch (err: unknown) {
    const errorVal = err as Record<string, unknown> | null;
    formErrorMessage.value =
      String(errorVal?.message || '') ||
      'Failed to save service configuration.';
  } finally {
    isSaving.value = false;
  }
}

const confirmDeleteId = ref<string | null>(null);
const pageErrorMessage = ref('');

async function deleteService(id: string) {
  pageErrorMessage.value = '';
  try {
    if (isMockMode()) {
      mockOrgServices.value = mockOrgServices.value.filter((s) => s.id !== id);
      await loadData();
      return;
    }

    await apiClient.delete(`/organization-catalog/${id}`);
    await loadData();
  } catch (err: unknown) {
    const errorVal = err as Record<string, unknown> | null;
    pageErrorMessage.value =
      String(errorVal?.message || '') ||
      'Failed to remove organization service.';
  } finally {
    confirmDeleteId.value = null;
  }
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div
    v-if="loading"
    class="loading-state"
  >
    <span>Loading organization services...</span>
  </div>

  <div
    v-else
    class="categories-page"
  >
    <!-- Breadcrumb -->
    <BreadcrumbBar :items="['Home', 'Services']" />

    <!-- Title Row -->
    <div class="title-row">
      <div class="title-left">
        <h1 class="page-title">Organization Services</h1>
        <span class="curated-badge">Configured</span>
        <span class="count-badge">{{ filteredServices.length }} services</span>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="search-wrapper">
        <Search
          :size="16"
          color="#939399"
        />
        <input
          v-model="searchQuery"
          class="search-input"
          type="text"
          placeholder="Search organization services..."
        >
      </div>
      <div class="toolbar-actions">
        <button
          class="btn-add-service-main"
          type="button"
          @click="openCreateDialog"
        >
          + Add Service
        </button>
      </div>
    </div>

    <!-- Feedback Banners -->
    <div
      v-if="pageErrorMessage"
      class="error-banner"
    >
      {{ pageErrorMessage }}
    </div>

    <!-- Full-width list layout -->
    <div class="service-list">
      <div
        v-for="service in filteredServices"
        :key="service.id"
        class="service-card"
      >
        <div class="service-main">
          <div class="service-info">
            <span class="service-name"
              >{{ orgServiceName(service) }}</span
            >
            <span class="service-desc"
              >{{ getServiceDescription(service.serviceId) }}</span
            >

            <div class="service-meta">
              <span class="meta-tag">
                <Clock
                  :size="12"
                  color="#616167"
                />
                {{ service.minDurationMinutes }}–{{ service.maxDurationMinutes }}
                min
              </span>
              <span class="meta-price">
                {{ formatPriceRange(service.minPrice, service.maxPrice) }}
              </span>
            </div>

            <!-- Masters list -->
            <div
              v-if="service.masters && service.masters.length > 0"
              class="masters-row"
            >
              <span class="masters-label">Masters:</span>
              <div class="masters-avatars">
                <div
                  v-for="master in service.masters"
                  :key="master.id"
                  class="master-avatar"
                  :title="master.userName"
                >
                  {{ getInitials(master.userName) }}
                </div>
              </div>
            </div>
          </div>

          <div class="service-controls">
            <button
              class="btn-edit-service"
              type="button"
              @click="openEditDialog(service)"
            >
              Edit details
            </button>
            <button
              v-if="confirmDeleteId !== service.id"
              class="btn-delete-service"
              type="button"
              @click="confirmDeleteId = service.id"
            >
              Delete
            </button>
            <button
              v-else
              class="btn-confirm-delete"
              type="button"
              @click="deleteService(service.id)"
            >
              Confirm?
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="filteredServices.length === 0"
        class="empty-state"
      >
        No services found for your organization. Click "+ Add Service" to
        configure one.
      </div>
    </div>

    <!-- inline Dialog for Add/Edit -->
    <div
      v-if="showDialog"
      class="modal-overlay"
    >
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">
            {{ editingServiceId ? 'Edit Service Details' : 'Add Organization Service' }}
          </h3>
          <button
            class="close-x-btn"
            type="button"
            @click="closeDialog"
          >
            <X :size="18" />
          </button>
        </div>

        <div class="modal-body">
          <div
            v-if="formErrorMessage"
            class="error-banner"
          >
            {{ formErrorMessage }}
          </div>

          <!-- Base service select -->
          <div class="form-group">
            <label class="form-label">Base Service</label>
            <select
              v-model="formServiceId"
              class="form-select"
              @change="onServiceChange"
            >
              <option
                value=""
                disabled
              >
                Select a base service
              </option>
              <option
                v-for="base in baseServices"
                :key="base.id"
                :value="base.id"
              >
                {{ base.name }}
              </option>
            </select>
          </div>

          <!-- Price range -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Min Price (UZS)</label>
              <input
                v-model.number="formMinPrice"
                type="number"
                class="form-input"
                min="0"
              >
            </div>
            <div class="form-group">
              <label class="form-label">Max Price (UZS)</label>
              <input
                v-model.number="formMaxPrice"
                type="number"
                class="form-input"
                min="0"
              >
            </div>
          </div>

          <!-- Duration range -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Min Duration (min)</label>
              <input
                v-model.number="formMinDuration"
                type="number"
                class="form-input"
                min="1"
              >
            </div>
            <div class="form-group">
              <label class="form-label">Max Duration (min)</label>
              <input
                v-model.number="formMaxDuration"
                type="number"
                class="form-input"
                min="1"
              >
            </div>
          </div>

          <!-- Masters multi-select -->
          <div class="form-group">
            <label class="form-label">Assign Specialists (Masters)</label>
            <div class="checkbox-list">
              <label
                v-for="member in orgMembers"
                :key="member.id"
                class="checkbox-item"
              >
                <input
                  v-model="formMasterIds"
                  type="checkbox"
                  :value="member.id"
                >
                <span>{{ member.userName }}</span>
              </label>
              <span
                v-if="orgMembers.length === 0"
                class="empty-checkbox-label"
              >
                No organization members available.
              </span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            class="btn-secondary"
            type="button"
            :disabled="isSaving"
            @click="closeDialog"
          >
            Cancel
          </button>
          <button
            class="btn-primary"
            type="button"
            :disabled="isSaving"
            @click="saveOrganizationService"
          >
            {{ isSaving ? 'Saving...' : 'Save Configuration' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #616167;
}

.categories-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 24px;
  font-family: Inter, sans-serif;
}

/* Title */
.title-row {
  display: flex;
  align-items: center;
}

.title-left {
  display: flex;
  gap: 10px;
  align-items: center;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #2a2933;
}

.curated-badge {
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 500;
  color: #5749f4;
  background: #eef0ff;
  border-radius: 999px;
}

.count-badge {
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 500;
  color: #616167;
  background: #f5f5f5;
  border: 1px solid #d9d9db;
  border-radius: 999px;
}

/* Toolbar */
.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;
}

.search-wrapper {
  display: flex;
  flex: 1;
  gap: 8px;
  align-items: center;
  max-width: 340px;
  padding: 8px 14px;
  background: #f5f5f5;
  border: 1px solid #d9d9db;
  border-radius: 999px;
}

.search-input {
  flex: 1;
  padding: 0;
  font-family: inherit;
  font-size: 13px;
  color: #2a2933;
  outline: none;
  background: transparent;
  border: none;
}

.search-input::placeholder {
  color: #939399;
}

.toolbar-actions {
  display: flex;
  margin-left: auto;
}

.btn-add-service-main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  background: #5749f4;
  border: none;
  border-radius: 8px;
  transition: opacity 0.15s;
}

.btn-add-service-main:hover {
  opacity: 0.9;
}

/* Service Cards */
.service-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.service-card {
  padding: 20px;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 24px;
}

.service-main {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
}

.service-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
}

.service-name {
  font-size: 16px;
  font-weight: 600;
  color: #2a2933;
}

.service-desc {
  font-size: 13px;
  color: #616167;
}

.service-meta {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-top: 4px;
}

.meta-tag {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 12px;
  color: #616167;
}

.meta-price {
  font-size: 13px;
  font-weight: 600;
  color: #2a2933;
}

.masters-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 10px;
}

.masters-label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
}

.masters-avatars {
  display: flex;
  gap: 4px;
}

.master-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 9px;
  font-weight: 700;
  color: #374151;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 999px;
}

.service-controls {
  display: flex;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
}

.btn-edit-service {
  padding: 6px 14px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: #5749f4;
  white-space: nowrap;
  cursor: pointer;
  background: #eef0ff;
  border: none;
  border-radius: 8px;
}

.btn-edit-service:hover {
  background: #dfe1ff;
}

.btn-delete-service {
  padding: 6px 14px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: #dc2626;
  white-space: nowrap;
  cursor: pointer;
  background: #fef2f2;
  border: none;
  border-radius: 8px;
}

.btn-confirm-delete {
  padding: 6px 14px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  cursor: pointer;
  background: #dc2626;
  border: none;
  border-radius: 8px;
}

.btn-confirm-delete:hover {
  background: #b91c1c;
}

.btn-delete-service:hover {
  background: #fee2e2;
}

.empty-state {
  padding: 40px;
  font-size: 14px;
  color: #616167;
  text-align: center;
  background: #ffffff;
  border: 1px dashed #d1d5db;
  border-radius: 24px;
}

/* Modal styling */
.modal-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

.modal-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.close-x-btn {
  padding: 0;
  font-size: 20px;
  color: #9ca3af;
  cursor: pointer;
  background: none;
  border: none;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 70vh;
  padding: 24px;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 24px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.form-input {
  padding: 10px 14px;
  font-family: inherit;
  font-size: 13px;
  color: #111827;
  outline: none;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

.form-input:focus {
  border-color: #5749f4;
}

.form-select {
  padding: 10px 14px;
  font-family: inherit;
  font-size: 13px;
  color: #111827;
  cursor: pointer;
  outline: none;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

.form-select:focus {
  border-color: #5749f4;
}

.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 150px;
  padding: 8px;
  overflow-y: auto;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

.checkbox-item {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
}

.empty-checkbox-label {
  padding: 8px;
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
}

.btn-secondary {
  padding: 10px 20px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

.btn-secondary:hover {
  background: #f9fafb;
}

.btn-primary {
  padding: 10px 20px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  background: #5749f4;
  border: none;
  border-radius: 8px;
}

.btn-primary:hover {
  opacity: 0.9;
}

.error-banner {
  padding: 12px 16px;
  margin-bottom: 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}
</style>
