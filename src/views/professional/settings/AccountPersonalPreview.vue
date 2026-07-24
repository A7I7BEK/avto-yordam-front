<script
  setup
  lang="ts"
>
import { BadgeCheck, Loader2, Lock, Pencil, Star } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getOwnMasterInfo, getUserProfile } from '@/services/userService';
import type { MasterInfoResponse, UserResponse } from '@/types/user';

const router = useRouter();
const route = useRoute();

const user = ref<UserResponse | null>(null);
const masterInfo = ref<MasterInfoResponse | null>(null);
const loading = ref(true);

function goToEdit() {
  router.push({
    path: route.path,
    query: { tab: 'personal', mode: 'edit' },
  });
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) {
    return '—';
  }
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day} / ${month} / ${year}`;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function calcYearsOfExperience(startDate: string | null): string {
  if (!startDate) {
    return '—';
  }
  const start = new Date(startDate);
  const now = new Date();
  const years = now.getFullYear() - start.getFullYear();
  const months = now.getMonth() - start.getMonth();
  const totalYears = months < 0 ? years - 1 : years;
  if (totalYears < 1) {
    return '< 1 year';
  }
  return `${totalYears} years`;
}

function formatWorkingTime(start: string | null, end: string | null): string {
  if (!(start && end)) {
    return '—';
  }
  return `${start.slice(0, 5)}–${end.slice(0, 5)}`;
}

onMounted(async () => {
  try {
    const [userData, masterInfoData] = await Promise.all([
      getUserProfile(),
      getOwnMasterInfo(),
    ]);
    user.value = userData;
    masterInfo.value = masterInfoData;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="card">
    <!-- Header -->
    <div class="card-header">
      <div class="card-title-group">
        <span class="card-title">Personal information</span>
        <span class="card-desc"
          >How customers and teammates see you. Read-only preview.</span
        >
      </div>
      <button
        class="edit-btn"
        type="button"
        @click="goToEdit"
      >
        <Pencil :size="13" />
        <span>Edit profile</span>
      </button>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="loading-state"
    >
      <Loader2
        :size="20"
        color="#616167"
        class="spin"
      />
      <span>Loading profile...</span>
    </div>

    <!-- Profile Content -->
    <template v-else>
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-avatar">
          {{ user ? getInitials(user.fullName) : 'AI' }}
        </div>
        <div class="profile-info">
          <span class="profile-name"
            >{{ user?.fullName ?? 'Aziz Ismoilov' }}</span
          >
          <span class="profile-role"
            >Master mechanic · Tashkent, Uzbekistan</span
          >
        </div>
        <div class="verified-badge">
          <BadgeCheck :size="13" />
          <span>Verified master</span>
        </div>
      </div>

      <div class="divider" />

      <!-- Profile Details -->
      <div class="details-section">
        <div class="section-heading">
          <Pencil :size="13" />
          <span>Profile details</span>
        </div>

        <div class="details-grid">
          <div class="detail-card">
            <span class="detail-label">Full name</span>
            <span class="detail-value"
              >{{ user?.fullName ?? 'Aziz Ismoilov' }}</span
            >
          </div>
          <div class="detail-card">
            <span class="detail-label">Date of birth</span>
            <span class="detail-value"
              >{{ user ? formatDate(user.birthDay) : '14 / 02 / 1991' }}</span
            >
          </div>
          <div class="detail-card">
            <span class="detail-label">Specialization</span>
            <span class="detail-value"
              >{{ masterInfo?.specializationName ?? '—' }}</span
            >
          </div>
          <div class="detail-card">
            <span class="detail-label">Working time</span>
            <span class="detail-value"
              >{{ masterInfo ? formatWorkingTime(masterInfo.workingTimeStart, masterInfo.workingTimeEnd) : 'Mon–Sat · 09:00–19:00' }}</span
            >
          </div>
        </div>

        <div class="detail-card full-width">
          <span class="detail-label">Years of experience (self-reported)</span>
          <span class="detail-value"
            >{{ masterInfo ? calcYearsOfExperience(masterInfo.experienceStartDate) : '8 years' }}</span
          >
        </div>

        <div class="detail-card full-width bio-card">
          <span class="detail-label">Short bio</span>
          <span class="detail-value bio-text"
            >{{ masterInfo?.description || 'Master mechanic specializing in European brands. 8 years of hands-on garage experience in Tashkent.' }}</span
          >
        </div>
      </div>

      <div class="divider" />

      <!-- Verified by Platform -->
      <div class="verified-section">
        <div class="verified-header">
          <div class="section-heading">
            <Lock :size="13" />
            <span>Verified by platform</span>
          </div>
          <span class="verified-sub">Auto-tracked · not editable</span>
        </div>

        <div class="verified-grid">
          <div class="detail-card">
            <div class="verified-stat-header">
              <span class="detail-label">Experience on platform</span>
              <Lock
                :size="12"
                color="#616167"
              />
            </div>
            <span class="verified-stat-value">1 yr 2 mo</span>
          </div>
          <div class="detail-card">
            <div class="verified-stat-header">
              <span class="detail-label">Completed orders</span>
              <Lock
                :size="12"
                color="#616167"
              />
            </div>
            <span class="verified-stat-value">342</span>
          </div>
          <div class="detail-card">
            <div class="verified-stat-header">
              <span class="detail-label">Rating</span>
              <Lock
                :size="12"
                color="#616167"
              />
            </div>
            <div class="verified-stat-row">
              <span class="verified-stat-value">4.9</span>
              <div class="stars-row">
                <Star
                  :size="12"
                  color="#FFD9B2"
                />
                <Star
                  :size="12"
                  color="#FFD9B2"
                />
                <Star
                  :size="12"
                  color="#FFD9B2"
                />
                <Star
                  :size="12"
                  color="#FFD9B2"
                />
                <Star
                  :size="12"
                  color="#FFD9B2"
                />
              </div>
              <span class="rating-max">/ 5.0</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 24px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.card-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2a2933;
}

.loading-state {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
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

.card-desc {
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
  flex: 1;
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

/* Profile Details Section */
.details-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-heading {
  display: flex;
  gap: 6px;
  align-items: center;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #2a2933;
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

.detail-card.bio-card {
  height: 64px;
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

.detail-value.bio-text {
  font-size: 13px;
  font-weight: normal;
}

/* Verified Section */
.verified-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.verified-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.verified-sub {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #616167;
}

.verified-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.verified-stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.verified-stat-value {
  font-family: Inter, sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #2a2933;
}

.verified-stat-row {
  display: flex;
  gap: 6px;
  align-items: center;
}

.stars-row {
  display: flex;
  gap: 2px;
}

.rating-max {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #616167;
}
</style>
