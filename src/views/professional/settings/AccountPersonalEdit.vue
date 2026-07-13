<script
  setup
  lang="ts"
>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';

interface WorkingHoursObj {
  from?: string;
  to?: string;
}

interface MasterInfoType {
  master?: {
    fullName?: string;
    name?: string;
    birthDay?: string;
    languages?: (string | { code?: string; name?: string })[];
  };
  experienceStartDate?: string;
  specializationName?: string;
  workingTimeStart?: string;
  workingTimeEnd?: string;
  workingDays?: string[] | string;
  workingHours?: WorkingHoursObj;
  workingFrom?: string;
  workingTo?: string;
  description?: string;
  yearsOfExperience?: number | string;
}

const DATE_ISO_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const DATE_SPLIT_REGEX = /[/\-.]/;

const router = useRouter();
const route = useRoute();

const fullName = ref('');
const dateOfBirth = ref('');
const specialization = ref('');
const workingTimeStart = ref('09:00');
const workingTimeEnd = ref('18:00');
const yearsOfExperience = ref('');
const bio = ref('');
const isLoading = ref(false);
const isSaving = ref(false);
const errorMessage = ref('');

const isCreationMode = ref(route.query.mode === 'create');
const specializationsList = ref<
  { id: string; name: string; description?: string }[]
>([]);
const selectedSpecializationId = ref('');
const experienceStartDate = ref('2018-05-12');
const masterInfoId = ref<string | null>(null);

const initials = computed(
  () =>
    fullName.value
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'AI',
);

const saveButtonText = computed(() => {
  if (isSaving.value) {
    return 'Saving...';
  }
  return isCreationMode.value ? 'Create profile' : 'Save changes';
});

function goToPreview() {
  router.push({
    path: route.path,
    query: { tab: 'personal', mode: 'preview' },
  });
}

function parseDateToISO(dateStr: string) {
  if (!dateStr) {
    return '';
  }
  if (DATE_ISO_REGEX.test(dateStr)) {
    return dateStr;
  }
  const parts = dateStr.split(DATE_SPLIT_REGEX).map((p) => p.trim());
  if (parts.length !== 3) {
    return dateStr;
  }
  const [p0, p1, p2] = parts;
  if (!(p0 && p1 && p2)) {
    return dateStr;
  }
  const m = p1.padStart(2, '0');
  const d = p0.padStart(2, '0');
  if (p0.length === 4) {
    return `${p0}-${m}-${p2.padStart(2, '0')}`;
  }
  if (p2.length === 4) {
    return `${p2}-${m}-${d}`;
  }
  return dateStr;
}

function calculateYearsOfExperience(startDateStr: string) {
  if (!startDateStr) {
    return '0';
  }
  const start = new Date(startDateStr);
  if (Number.isNaN(start.getTime())) {
    return '0';
  }
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  const monthDiff = now.getMonth() - start.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < start.getDate())) {
    years--;
  }
  return String(Math.max(0, years));
}

function mapMasterInfo(masterInfo: MasterInfoType) {
  const user = masterInfo.master;
  if (user) {
    fullName.value = user.fullName || user.name || fullName.value;
    dateOfBirth.value = user.birthDay
      ? parseDateToISO(user.birthDay)
      : dateOfBirth.value;
  }

  yearsOfExperience.value = masterInfo.experienceStartDate
    ? calculateYearsOfExperience(masterInfo.experienceStartDate)
    : yearsOfExperience.value;

  bio.value = masterInfo.description || bio.value;
  specialization.value = masterInfo.specializationName || specialization.value;
  workingTimeStart.value = masterInfo.workingTimeStart
    ? masterInfo.workingTimeStart.slice(0, 5)
    : '09:00';
  workingTimeEnd.value = masterInfo.workingTimeEnd
    ? masterInfo.workingTimeEnd.slice(0, 5)
    : '18:00';
}

async function loadSpecializations() {
  try {
    let specs = await apiClient.get('/master-specialization');
    if (!specs) {
      specs = await apiClient.get('/master-specializations');
    }
    if (Array.isArray(specs)) {
      specializationsList.value = specs;
    }
  } catch {
    // Fallback if backend is not available
    specializationsList.value = [
      { id: 'engine', name: 'Engine & diagnostics' },
      { id: 'transmission', name: 'Transmission repair' },
      { id: 'suspension', name: 'Suspension & alignment' },
      { id: 'electrical', name: 'Electrical & A/C' },
    ];
  }
}

function handleLoadedMasterInfo(
  masterInfo: MasterInfoType & { id?: string; specializationId?: string },
) {
  masterInfoId.value = masterInfo.id || null;
  selectedSpecializationId.value = masterInfo.specializationId || '';
  experienceStartDate.value = masterInfo.experienceStartDate || '';
  mapMasterInfo(masterInfo);
}

async function loadUserProfileFallback() {
  try {
    const user = await apiClient.get('/user/me');
    if (user) {
      fullName.value = user.fullName || user.name || '';
      if (user.birthDay) {
        dateOfBirth.value = parseDateToISO(user.birthDay);
      }
    }
  } catch {
    // Silent error fallback
  }
}

async function loadData() {
  if (isMockMode()) {
    fullName.value = 'Aziz Ismoilov';
    dateOfBirth.value = '1991-02-14';
    specialization.value = 'European brands · Engine & diagnostics';
    workingTimeStart.value = '09:00';
    workingTimeEnd.value = '18:00';
    yearsOfExperience.value = '8';
    bio.value =
      'European car specialist with 8 years of hands-on experience in engine diagnostics, brake systems, and electrical repairs. Passionate about delivering quality service.';
    experienceStartDate.value = '2018-05-12';
    return;
  }

  isLoading.value = true;
  isCreationMode.value = route.query.mode === 'create';
  try {
    const masterRes = await apiClient.get('/master-info/get-own');
    const masterInfo = (Array.isArray(masterRes) ? masterRes[0] : masterRes) as
      | (MasterInfoType & { id?: string; specializationId?: string })
      | null;
    if (masterInfo) {
      isCreationMode.value = false;
      handleLoadedMasterInfo(masterInfo);
    } else {
      isCreationMode.value = true;
      await loadUserProfileFallback();
    }
  } catch {
    isCreationMode.value = true;
    await loadUserProfileFallback();
  } finally {
    isLoading.value = false;
  }
}

async function saveBirthDate() {
  const isoDate = parseDateToISO(dateOfBirth.value);
  if (isoDate) {
    await apiClient.post(`/user/birthday?birthday=${isoDate}`);
  }
}

async function saveMasterInfo() {
  let formattedStart = workingTimeStart.value;
  if (formattedStart && formattedStart.length === 5) {
    formattedStart = `${formattedStart}:00`;
  }

  let formattedEnd = workingTimeEnd.value;
  if (formattedEnd && formattedEnd.length === 5) {
    formattedEnd = `${formattedEnd}:00`;
  }

  const masterRequest = {
    experienceStartDate: experienceStartDate.value || null,
    description: bio.value || '',
    specializationId: selectedSpecializationId.value || null,
    workingTimeStart: formattedStart || null,
    workingTimeEnd: formattedEnd || null,
  };

  if (isCreationMode.value || !masterInfoId.value) {
    await apiClient.post('/master-info', masterRequest);
  } else {
    await apiClient.put(`/master-info/${masterInfoId.value}`, masterRequest);
  }
}

async function saveChanges() {
  if (isMockMode()) {
    goToPreview();
    return;
  }

  isSaving.value = true;
  errorMessage.value = '';
  try {
    await saveBirthDate();
    await saveMasterInfo();
    goToPreview();
  } catch (err: unknown) {
    const errorVal = err as Record<string, unknown> | null;
    errorMessage.value =
      String(errorVal?.message || '') ||
      'Failed to save personal information. Please try again.';
  } finally {
    isSaving.value = false;
  }
}

onMounted(() => {
  loadData();
  loadSpecializations();
});
</script>

<template>
  <div class="section">
    <div class="section-header">
      <div class="section-title-group">
        <span class="section-title">
          {{ isCreationMode ? 'Create master profile' : 'Edit personal information' }}
        </span>
        <span class="section-desc">
          {{ isCreationMode
              ? 'Fill in your professional details to get started.'
              : 'Update your profile details below.' }}
        </span>
      </div>
      <button
        class="cancel-btn"
        type="button"
        @click="goToPreview"
      >
        Cancel
      </button>
    </div>

    <div
      v-if="isLoading"
      class="loading-state"
    >
      Loading profile details...
    </div>
    <template v-else>
      <!-- Error Message Banner -->
      <div
        v-if="errorMessage"
        class="error-banner"
      >
        {{ errorMessage }}
      </div>

      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-avatar">{{ initials }}</div>
        <div class="profile-info">
          <span class="profile-name">{{ fullName }}</span>
          <button
            class="change-photo"
            type="button"
          >
            Change photo
          </button>
        </div>
      </div>

      <!-- Form -->
      <div class="form-grid">
        <div class="field-group">
          <label class="field-label">Full name</label>
          <input
            v-model="fullName"
            class="field-input"
            type="text"
          >
        </div>
        <div class="field-group">
          <label class="field-label">Date of birth</label>
          <input
            v-model="dateOfBirth"
            class="field-input"
            type="date"
          >
        </div>
        <div class="field-group">
          <label class="field-label">Specialization</label>
          <select
            v-model="selectedSpecializationId"
            class="field-input"
          >
            <option
              value=""
              disabled
            >
              Select specialization
            </option>
            <option
              v-for="spec in specializationsList"
              :key="spec.id"
              :value="spec.id"
            >
              {{ spec.name }}
            </option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">Experience start date</label>
          <input
            v-model="experienceStartDate"
            class="field-input"
            type="date"
          >
        </div>
        <div class="field-group">
          <label class="field-label">Working hours (start)</label>
          <input
            v-model="workingTimeStart"
            class="field-input"
            type="time"
          >
        </div>
        <div class="field-group">
          <label class="field-label">Working hours (end)</label>
          <input
            v-model="workingTimeEnd"
            class="field-input"
            type="time"
          >
        </div>
      </div>

      <!-- Bio -->
      <div class="field-group">
        <label class="field-label">Short bio</label>
        <textarea
          v-model="bio"
          class="field-textarea"
          placeholder="Tell clients about your experience..."
        />
      </div>

      <!-- Footer -->
      <div class="form-footer">
        <button
          class="btn btn-cancel"
          type="button"
          :disabled="isSaving"
          @click="goToPreview"
        >
          Cancel
        </button>
        <button
          class="btn btn-save"
          type="button"
          :disabled="isSaving"
          @click="saveChanges"
        >
          {{ saveButtonText }}
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.section-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2a2933;
}

.section-desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #616167;
}

.cancel-btn {
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #2a2933;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.profile-header {
  display: flex;
  gap: 18px;
  align-items: center;
}

.profile-avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  font-family: Inter, sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  background: #5749f4;
  border-radius: 999px;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-name {
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #2a2933;
}

.change-photo {
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #5749f4;
  text-align: left;
  cursor: pointer;
  background: none;
  border: none;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #2a2933;
}

.field-input {
  box-sizing: border-box;
  width: 100%;
  padding: 12px 16px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #2a2933;
  outline: none;
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.field-textarea {
  box-sizing: border-box;
  width: 100%;
  min-height: 120px;
  padding: 14px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #2a2933;
  resize: vertical;
  outline: none;
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
  border-radius: 12px;
}

.form-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 999px;
}

.btn-cancel {
  color: #2a2933;
  background: transparent;
  border: 1px solid #c5c5cb;
}

.btn-save {
  color: #ffffff;
  background: #5749f4;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #616167;
}

.error-banner {
  padding: 12px 16px;
  margin-bottom: 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
}
</style>
