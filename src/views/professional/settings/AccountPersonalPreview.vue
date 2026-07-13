<script
  setup
  lang="ts"
>
import { BadgeCheck, Pencil } from '@lucide/vue';
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

const router = useRouter();
const route = useRoute();

const fullName = ref('');
const dateOfBirth = ref('');
const specialization = ref('');
const workingHours = ref('');
const yearsOfExperience = ref('');
const isLoading = ref(false);
const isCreationMode = ref(false);

const initials = computed(
  () =>
    fullName.value
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'AI',
);

const profileRole = computed(() => {
  const spec = specialization.value
    ? specialization.value.split(' · ')[0]
    : 'Master mechanic';
  return `${spec} · Tashkent, Uzbekistan`;
});

function goToEdit() {
  router.push({
    path: route.path,
    query: { tab: 'personal', mode: 'edit' },
  });
}

function goToCreate() {
  router.push({
    path: route.path,
    query: { tab: 'personal', mode: 'create' },
  });
}

function formatWorkingDays(workingDays: string[] | string | undefined): string {
  if (!workingDays) {
    return '';
  }
  if (Array.isArray(workingDays)) {
    if (workingDays.length === 0) {
      return '';
    }
    const formattedDays = workingDays.map(
      (d: string) => d.charAt(0).toUpperCase() + d.slice(1),
    );
    if (formattedDays.length === 7) {
      return 'Everyday';
    }
    if (
      formattedDays.length === 5 &&
      !formattedDays.includes('Sat') &&
      !formattedDays.includes('Sun')
    ) {
      return 'Mon–Fri';
    }
    if (formattedDays.length === 6 && !formattedDays.includes('Sun')) {
      return 'Mon–Sat';
    }
    return formattedDays.join(', ');
  }
  return workingDays;
}

function formatWorkingHours(masterInfo: MasterInfoType | undefined) {
  if (!masterInfo) {
    return 'Mon–Sat · 09:00–19:00';
  }

  const daysStr = formatWorkingDays(masterInfo.workingDays);

  // Format hours
  let hoursStr = '';
  if (masterInfo.workingTimeStart && masterInfo.workingTimeEnd) {
    hoursStr = `${masterInfo.workingTimeStart.slice(0, 5)}–${masterInfo.workingTimeEnd.slice(0, 5)}`;
  } else if (
    masterInfo.workingHours &&
    typeof masterInfo.workingHours === 'object'
  ) {
    hoursStr = `${masterInfo.workingHours.from || '09:00'}–${masterInfo.workingHours.to || '18:00'}`;
  } else if (masterInfo.workingFrom && masterInfo.workingTo) {
    hoursStr = `${masterInfo.workingFrom}–${masterInfo.workingTo}`;
  } else {
    hoursStr = '09:00–19:00';
  }

  if (daysStr && hoursStr) {
    return `${daysStr} · ${hoursStr}`;
  }
  return daysStr || hoursStr || 'Mon–Sat · 09:00–19:00';
}

function formatBirthDate(dateStr: string) {
  if (!dateStr) {
    return '';
  }
  if (DATE_ISO_REGEX.test(dateStr)) {
    const [y, m, d] = dateStr.split('-');
    return `${d} / ${m} / ${y}`;
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
    if (user.birthDay) {
      dateOfBirth.value = formatBirthDate(user.birthDay);
    }
  }

  if (masterInfo.experienceStartDate) {
    yearsOfExperience.value = calculateYearsOfExperience(
      masterInfo.experienceStartDate,
    );
  }

  if (masterInfo.specializationName) {
    specialization.value = masterInfo.specializationName;
  }

  workingHours.value = formatWorkingHours(masterInfo);
}

async function loadData() {
  if (isMockMode()) {
    fullName.value = 'Aziz Ismoilov';
    dateOfBirth.value = '14 / 02 / 1991';
    specialization.value = 'European brands · Engine & diagnostics';
    workingHours.value = 'Mon–Sat · 09:00–19:00';
    yearsOfExperience.value = '8';
    return;
  }

  isLoading.value = true;
  isCreationMode.value = false;
  try {
    const masterRes = await apiClient.get('/master-info/get-own');
    if (masterRes) {
      const masterInfo = (
        Array.isArray(masterRes) ? masterRes[0] : masterRes
      ) as MasterInfoType;
      if (masterInfo) {
        mapMasterInfo(masterInfo);
      } else {
        router.replace({
          path: route.path,
          query: { tab: 'personal', mode: 'edit' },
        });
      }
    } else {
      router.replace({
        path: route.path,
        query: { tab: 'personal', mode: 'edit' },
      });
    }
  } catch (err: unknown) {
    const errorVal = err as Record<string, unknown> | null;
    const msg = String(errorVal?.message || '');
    if (msg.includes('404')) {
      router.replace({
        path: route.path,
        query: { tab: 'personal', mode: 'edit' },
      });
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="section">
    <div
      v-if="isLoading"
      class="loading-state"
    >
      Loading personal information...
    </div>
    <template v-else>
      <div
        v-if="isCreationMode"
        class="creation-prompt"
      >
        <div class="prompt-card">
          <span class="prompt-title">Profile not created yet</span>
          <span class="prompt-desc"
            >You need to set up your master profile to start receiving orders
            and managing settings.</span
          >
          <button
            class="create-btn"
            type="button"
            @click="goToCreate"
          >
            <span>Create Profile</span>
          </button>
        </div>
      </div>
      <template v-else>
        <div class="section-header">
          <div class="section-title-group">
            <span class="section-title">Personal information</span>
            <span class="section-desc"
              >How customers and teammates see you. Read-only preview.</span
            >
          </div>
          <button
            class="edit-btn"
            type="button"
            @click="goToEdit"
          >
            <Pencil
              :size="13"
              color="#FFFFFF"
            />
            <span>Edit profile</span>
          </button>
        </div>

        <!-- Profile Header -->
        <div class="profile-header">
          <div class="profile-avatar">{{ initials }}</div>
          <div class="profile-info">
            <span class="profile-name">{{ fullName }}</span>
            <span class="profile-role">{{ profileRole }}</span>
          </div>
          <div class="verified-badge">
            <BadgeCheck
              :size="14"
              color="#003300"
            />
            <span>Verified master</span>
          </div>
        </div>

        <div class="divider" />

        <!-- Detail Cards -->
        <div class="details-grid">
          <div class="detail-card">
            <span class="detail-label">Full name</span>
            <span class="detail-value">{{ fullName }}</span>
          </div>
          <div class="detail-card">
            <span class="detail-label">Date of birth</span>
            <span class="detail-value">{{ dateOfBirth }}</span>
          </div>
          <div class="detail-card">
            <span class="detail-label">Specialization</span>
            <span class="detail-value">{{ specialization }}</span>
          </div>
          <div class="detail-card">
            <span class="detail-label">Working time</span>
            <span class="detail-value">{{ workingHours }}</span>
          </div>
          <div class="detail-card full-width">
            <span class="detail-label"
              >Years of experience (self-reported)</span
            >
            <span class="detail-value">{{ yearsOfExperience }} years</span>
          </div>
        </div>
      </template>
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

.edit-btn {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  background: #5749f4;
  border: none;
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

.profile-role {
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
}

.verified-badge {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 6px 12px;
  margin-left: auto;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #003300;
  background: #a1e5a1;
  border-radius: 999px;
}

.divider {
  width: 100%;
  height: 1px;
  background: #c5c5cb;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.detail-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
  border-radius: 6px;
}

.detail-card.full-width {
  grid-column: 1 / -1;
}

.detail-label {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #616167;
}

.detail-value {
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #2a2933;
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

.creation-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.prompt-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  max-width: 400px;
  padding: 24px;
  text-align: center;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.prompt-title {
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #2a2933;
}

.prompt-desc {
  font-family: Inter, sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: #616167;
}

.create-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  margin-top: 8px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  background: #5749f4;
  border: none;
  border-radius: 999px;
  transition: background 0.15s;
}

.create-btn:hover {
  background: #4335da;
}
</style>
