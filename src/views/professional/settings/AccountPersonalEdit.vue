<script
  setup
  lang="ts"
>
import {
  Calendar,
  Check,
  ChevronDown,
  Loader2,
  Pencil,
  Upload,
} from '@lucide/vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getFileUrl } from '@/services/documentsService';
import {
  deleteProfilePhoto,
  getAllMasterSpecializations,
  getOwnMasterInfo,
  getUserProfile,
  saveBirthday,
  saveMasterInfo,
  uploadProfilePhoto,
} from '@/services/userService';
import type {
  MasterInfoResponse,
  MasterSpecializationResponse,
} from '@/types/user';

const router = useRouter();
const route = useRoute();

const loading = ref(true);
const saving = ref(false);

const fullName = ref('Aziz Ismoilov');
const dateOfBirth = ref('');
const yearsOfExperience = ref('8');
const workFrom = ref('09:00');
const workTo = ref('19:00');
const bio = ref(
  'Master mechanic specializing in European brands. 8 years of hands-on garage experience in Tashkent.',
);

const profilePhotoUrl = ref('');
const uploadingPhoto = ref(false);
const photoInputRef = ref<HTMLInputElement | null>(null);

const specializations = ref<MasterSpecializationResponse[]>([]);
const selectedSpecializationId = ref('');

let existingMasterInfoId: string | undefined;

const selectedCount = ref(0);

function toggleSpecialization(spec: MasterSpecializationResponse) {
  selectedSpecializationId.value =
    selectedSpecializationId.value === spec.id ? '' : spec.id;
  selectedCount.value = selectedSpecializationId.value ? 1 : 0;
}

const days = reactive([
  { key: 'mon', label: 'Mon', active: true },
  { key: 'tue', label: 'Tue', active: true },
  { key: 'wed', label: 'Wed', active: true },
  { key: 'thu', label: 'Thu', active: true },
  { key: 'fri', label: 'Fri', active: true },
  { key: 'sat', label: 'Sat', active: true },
  { key: 'sun', label: 'Sun', active: false },
]);

function toggleDay(day: { key: string; label: string; active: boolean }) {
  day.active = !day.active;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function triggerUploadPhoto() {
  photoInputRef.value?.click();
}

async function onPhotoSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    return;
  }

  uploadingPhoto.value = true;
  try {
    const updated = await uploadProfilePhoto(file);
    profilePhotoUrl.value = updated.profilePhoto?.path
      ? getFileUrl(updated.profilePhoto.path)
      : '';
  } finally {
    uploadingPhoto.value = false;
    input.value = '';
  }
}

async function removePhoto() {
  uploadingPhoto.value = true;
  try {
    await deleteProfilePhoto();
    profilePhotoUrl.value = '';
  } finally {
    uploadingPhoto.value = false;
  }
}

function calcYearsToDate(years: string): string {
  const num = Number(years);
  if (!num || num < 1) {
    return '';
  }
  const now = new Date();
  const start = new Date(
    now.getFullYear() - num,
    now.getMonth(),
    now.getDate(),
  );
  return start.toISOString().split('T')[0] ?? '';
}

function calcDateToYears(dateStr: string | null): string {
  if (!dateStr) {
    return '';
  }
  const start = new Date(dateStr);
  const now = new Date();
  const years = now.getFullYear() - start.getFullYear();
  const months = now.getMonth() - start.getMonth();
  const totalYears = months < 0 ? years - 1 : years;
  return String(Math.max(1, totalYears));
}

function goToPreview() {
  router.push({
    path: route.path,
    query: { tab: 'personal', mode: 'preview' },
  });
}

async function saveChanges() {
  saving.value = true;
  try {
    if (dateOfBirth.value) {
      await saveBirthday(dateOfBirth.value);
    }

    await saveMasterInfo(
      {
        experienceStartDate: calcYearsToDate(yearsOfExperience.value),
        description: bio.value,
        specializationId: selectedSpecializationId.value,
        workingTimeStart: workFrom.value || null,
        workingTimeEnd: workTo.value || null,
      },
      existingMasterInfoId,
    );

    await goToPreview();
  } finally {
    saving.value = false;
  }
}

function applyMasterInfo(masterInfoData: MasterInfoResponse) {
  // Match specialization by name
  const match = specializations.value.find(
    (s) =>
      s.name.toLowerCase() === masterInfoData.specializationName.toLowerCase(),
  );
  selectedSpecializationId.value = match?.id ?? '';
  selectedCount.value = selectedSpecializationId.value ? 1 : 0;

  // Experience
  yearsOfExperience.value = calcDateToYears(masterInfoData.experienceStartDate);

  // Working hours
  if (masterInfoData.workingTimeStart) {
    workFrom.value = masterInfoData.workingTimeStart.slice(0, 5);
  }
  if (masterInfoData.workingTimeEnd) {
    workTo.value = masterInfoData.workingTimeEnd.slice(0, 5);
  }

  // Bio
  if (masterInfoData.description) {
    bio.value = masterInfoData.description;
  }

  existingMasterInfoId = masterInfoData.id;
}

onMounted(async () => {
  try {
    const [user, masterInfoData, specs] = await Promise.all([
      getUserProfile(),
      getOwnMasterInfo(),
      getAllMasterSpecializations(),
    ]);
    specializations.value = specs;
    fullName.value = user.fullName;
    profilePhotoUrl.value = user.profilePhoto?.path
      ? getFileUrl(user.profilePhoto.path)
      : '';
    if (user.birthDay) {
      dateOfBirth.value = user.birthDay;
    }
    if (masterInfoData) {
      applyMasterInfo(masterInfoData);
    }
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="card">
    <!-- Header -->
    <div class="card-header">
      <div class="header-title-group">
        <span class="header-title">Edit personal information</span>
        <span class="header-desc"
          >Update the details shown on your public profile.</span
        >
      </div>
      <div class="header-actions">
        <button
          class="btn-outline"
          type="button"
          @click="goToPreview"
        >
          Cancel
        </button>
        <button
          class="btn-primary"
          :disabled="saving"
          type="button"
          @click="saveChanges"
        >
          <Loader2
            v-if="saving"
            :size="13"
            class="spin"
          />
          <Check
            v-else
            :size="13"
          />
          <span>{{ saving ? 'Saving...' : 'Save changes' }}</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="loading-state"
    >
      <Loader2
        :size="20"
        color="var(--muted-foreground)"
        class="spin"
      />
      <span>Loading profile...</span>
    </div>

    <template v-else>
      <!-- Profile Photo -->
      <div class="photo-section">
        <div
          v-if="profilePhotoUrl"
          class="profile-avatar"
        >
          <img
            :src="profilePhotoUrl"
            alt=""
            class="photo-img"
          >
        </div>
        <div
          v-else
          class="profile-avatar"
        >
          {{ getInitials(fullName) }}
        </div>
        <div class="photo-info">
          <span class="photo-title">Profile photo</span>
          <span class="photo-desc"
            >JPG or PNG, max 4 MB. Shown to customers and team members.</span
          >
        </div>
        <div class="photo-actions">
          <input
            ref="photoInputRef"
            class="photo-input"
            type="file"
            accept="image/*"
            @change="onPhotoSelected"
          >
          <button
            class="btn-outline btn-sm"
            type="button"
            :disabled="uploadingPhoto"
            @click="triggerUploadPhoto"
          >
            <Upload :size="12" />
            <span>{{ uploadingPhoto ? 'Uploading...' : 'Replace' }}</span>
          </button>
          <button
            v-if="profilePhotoUrl"
            class="btn-text"
            type="button"
            :disabled="uploadingPhoto"
            @click="removePhoto"
          >
            Remove
          </button>
        </div>
      </div>

      <div class="divider" />

      <!-- Editable Details -->
      <div class="edit-section">
        <div class="section-heading">
          <Pencil :size="13" />
          <span>Editable details</span>
        </div>

        <!-- Full name & Date of birth -->
        <div class="two-col">
          <div class="field-vertical">
            <span class="field-label-sm">Full name</span>
            <input
              v-model="fullName"
              class="input-pill"
              type="text"
            >
          </div>
          <div class="field-vertical">
            <span class="field-label-sm">Date of birth</span>
            <div class="input-pill-wrapper">
              <input
                v-model="dateOfBirth"
                class="input-pill date-input"
                type="date"
              >
              <Calendar
                :size="14"
                color="var(--muted-foreground)"
                class="input-icon"
              />
            </div>
          </div>
        </div>

        <!-- Specialization -->
        <div class="field-block">
          <div class="field-block-header">
            <div class="field-block-title">
              <span class="field-title">Specialization</span>
              <span class="field-desc"
                >Pick everything you confidently work on — you can adjust
                anytime.</span
              >
            </div>
            <span class="selected-count">{{ selectedCount }} selected</span>
          </div>
          <div class="chips-row">
            <button
              v-for="spec in specializations.slice(0, 5)"
              :key="spec.id"
              class="chip"
              :class="{ active: selectedSpecializationId === spec.id }"
              type="button"
              @click="toggleSpecialization(spec)"
            >
              <Check
                v-if="selectedSpecializationId === spec.id"
                :size="12"
              />
              {{ spec.name }}
            </button>
          </div>
          <div class="chips-row">
            <button
              v-for="spec in specializations.slice(5)"
              :key="spec.id"
              class="chip"
              :class="{ active: selectedSpecializationId === spec.id }"
              type="button"
              @click="toggleSpecialization(spec)"
            >
              <Check
                v-if="selectedSpecializationId === spec.id"
                :size="12"
              />
              {{ spec.name }}
            </button>
          </div>
        </div>

        <!-- Years of experience -->
        <div class="field-block">
          <div class="field-block-title">
            <span class="field-title">Years of experience (self-reported)</span>
            <span class="field-desc"
              >Verified time on the platform is tracked separately and shown on
              your public profile.</span
            >
          </div>
          <div class="exp-pill">
            <input
              v-model="yearsOfExperience"
              class="exp-input"
              type="text"
            >
            <span class="exp-unit">years</span>
          </div>
        </div>

        <!-- Working time -->
        <div class="field-block">
          <div class="field-block-title">
            <span class="field-title">Working time</span>
            <span class="field-desc"
              >Your default working hours. Each organization you work for can
              override these on its own schedule.</span
            >
          </div>
          <div class="time-range">
            <div class="time-field">
              <span class="time-label">FROM</span>
              <div class="time-pill">
                <input
                  v-model="workFrom"
                  class="time-input"
                  type="time"
                >
                <ChevronDown
                  :size="14"
                  color="var(--muted-foreground)"
                />
              </div>
            </div>
            <span class="time-sep">&mdash;</span>
            <div class="time-field">
              <span class="time-label">TO</span>
              <div class="time-pill">
                <input
                  v-model="workTo"
                  class="time-input"
                  type="time"
                >
                <ChevronDown
                  :size="14"
                  color="var(--muted-foreground)"
                />
              </div>
            </div>
          </div>
          <div class="days-block">
            <span class="days-label">DAYS</span>
            <div class="days-row">
              <button
                v-for="day in days"
                :key="day.key"
                class="day-chip"
                :class="{ active: day.active }"
                type="button"
                @click="toggleDay(day)"
              >
                {{ day.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Short bio -->
        <div class="field-vertical">
          <span class="field-label-sm">Short bio</span>
          <textarea
            v-model="bio"
            class="bio-input"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 24px;
}

/* Loading state */
.loading-state {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--muted-foreground);
}

/* Header */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-title {
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
}

.header-desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: var(--muted-foreground);
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* Buttons */
.btn-outline {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 16px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-foreground);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--border-soft);
  border-radius: 999px;
}

.btn-primary {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 16px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary-foreground);
  cursor: pointer;
  background: var(--primary);
  border: none;
  border-radius: 999px;
}

.btn-sm {
  padding: 8px 14px;
}

.btn-text {
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-foreground);
  cursor: pointer;
  background: transparent;
  border: none;
}

/* Photo Section */
.photo-section {
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
  overflow: hidden;
  font-family: Inter, sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-foreground);
  background: var(--primary);
  border-radius: 999px;
}

.profile-avatar .photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-input {
  display: none;
}

.photo-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
}

.photo-title {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.photo-desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: var(--muted-foreground);
}

.photo-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* Divider */
.divider {
  width: 100%;
  height: 1px;
  background: var(--border-soft);
}

/* Edit Section */
.edit-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-heading {
  display: flex;
  gap: 6px;
  align-items: center;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

/* Two column layout */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Field vertical */
.field-vertical {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label-sm {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: var(--muted-foreground);
}

.input-pill {
  box-sizing: border-box;
  width: 100%;
  padding: 10px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--foreground);
  outline: none;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
}

.input-pill:focus {
  border-color: var(--primary);
}

.input-pill-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-pill-wrapper .input-pill {
  padding-right: 36px;
}

.input-pill-wrapper .input-icon {
  position: absolute;
  right: 14px;
  pointer-events: none;
}

/* Field block */
.field-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-block-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.field-block-title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.field-title {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.field-desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: var(--muted-foreground);
}

.selected-count {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-style: italic;
  color: var(--muted-foreground);
}

/* Specialization chips */
.chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  transition: all 0.15s;
}

.chip.active {
  color: var(--primary-foreground);
  background: var(--primary);
  border-color: var(--primary);
}

/* Experience pill */
.exp-pill {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 180px;
  padding: 10px 16px;
  background: var(--muted);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
}

.exp-input {
  width: 40px;
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
  outline: none;
  background: transparent;
  border: none;
}

.exp-unit {
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--muted-foreground);
}

/* Working time */
.time-range {
  display: flex;
  gap: 12px;
  align-items: center;
}

.time-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.time-label {
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: var(--muted-foreground);
  letter-spacing: 1.5px;
}

.time-pill {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  width: 140px;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--foreground);
  background: var(--muted);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
}

.time-input {
  width: 80px;
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--foreground);
  outline: none;
  background: transparent;
  border: none;
}

.time-input::-webkit-calendar-picker-indicator {
  display: none;
}

.time-sep {
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: var(--muted-foreground);
}

/* Days */
.days-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.days-label {
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: var(--muted-foreground);
  letter-spacing: 1.5px;
}

.days-row {
  display: flex;
  gap: 6px;
}

.day-chip {
  padding: 8px 12px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--foreground);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  transition: all 0.15s;
}

.day-chip.active {
  color: var(--primary-foreground);
  background: var(--primary);
  border-color: var(--primary);
}

/* Bio display */
.bio-input {
  box-sizing: border-box;
  width: 100%;
  height: 52px;
  padding: 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--foreground);
  resize: vertical;
  outline: none;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 6px;
}

.bio-input:focus {
  border-color: var(--primary);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
