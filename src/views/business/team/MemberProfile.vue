<script
  setup
  lang="ts"
>
import { Clock, Pencil, Star, Trash2 } from '@lucide/vue';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RemoveMemberModal from '@/components/business/RemoveMemberModal.vue';
import { members as rawMembers } from '@/data/members';
import type { TeamMember } from '@/types/business';

const route = useRoute();
const router = useRouter();

const member = computed<TeamMember | null>(() => {
  const id = route.params.id as string;
  return rawMembers.find((m) => m.id === id) ?? null;
});

const activeTab = ref('Overview');

// ── Remove modal ──────────────────────────────────────────
const showRemoveModal = ref(false);

function confirmRemove() {
  showRemoveModal.value = false;
  const idx = rawMembers.findIndex((m) => m.id === member.value?.id);
  if (idx >= 0) {
    rawMembers.splice(idx, 1);
  }
  router.push('/business/team/members');
}
</script>

<template>
  <div
    v-if="!member"
    class="profile-not-found"
  >
    Member not found
  </div>

  <div
    v-else
    class="profile-page"
  >
    <!-- Header -->
    <div class="profile-header">
      <div class="profile-header__left">
        <h1 class="profile-header__name">{{ member.name }}</h1>
        <p class="profile-header__subtitle">
          {{ member.role }}
          · Joined {{ member.joined }}
        </p>
      </div>
      <button
        type="button"
        class="profile-header__remove-btn"
        @click="showRemoveModal = true"
      >
        <Trash2 :size="14" />
        Remove member
      </button>
    </div>

    <!-- Two Column Grid -->
    <div class="profile-grid">
      <!-- Left Column -->
      <div class="profile-grid__left">
        <!-- Profile Card -->
        <div class="profile-card">
          <div class="profile-card__avatar">
            {{ member.initials }}
          </div>
          <div class="profile-card__name-block">
            <span class="profile-card__display-name">{{ member.name }}</span>
            <span class="profile-card__email">{{ member.email }}</span>
          </div>
          <div class="profile-card__badges">
            <span class="profile-badge profile-badge--role"
              >{{ member.role }}</span
            >
            <span
              class="profile-badge profile-badge--status"
              :class="{
                'profile-badge--accepted': member.status === 'Accepted',
                'profile-badge--invited': member.status === 'Invited',
                'profile-badge--declined': member.status === 'Declined',
                'profile-badge--expired': member.status === 'Expired',
              }"
            >
              {{ member.status }}
            </span>
          </div>
          <div class="profile-card__divider" />
          <div class="profile-card__meta">
            <div class="profile-meta-row">
              <span class="profile-meta-row__label">Phone</span>
              <span class="profile-meta-row__value">+998 90 234 56 78</span>
            </div>
            <div class="profile-meta-row">
              <span class="profile-meta-row__label">Location</span>
              <span class="profile-meta-row__value">Tashkent</span>
            </div>
            <div class="profile-meta-row">
              <span class="profile-meta-row__label">Hired</span>
              <span class="profile-meta-row__value">{{ member.joined }}</span>
            </div>
          </div>
        </div>

        <!-- Stats Card -->
        <div class="stats-card">
          <h3 class="stats-card__title">Performance</h3>
          <div class="stats-row">
            <span class="stats-row__label">Bookings completed</span>
            <span class="stats-row__value">{{ member.orders }}</span>
          </div>
          <div class="stats-row">
            <span class="stats-row__label">Avg rating</span>
            <span class="stats-row__value">
              <Star
                :size="14"
                class="stats-row__star"
              />
              {{ member.rating.toFixed(1) }}
            </span>
          </div>
          <div class="stats-row">
            <span class="stats-row__label">Customer reviews</span>
            <span class="stats-row__value">132</span>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="profile-grid__right">
        <!-- Tabs -->
        <div class="profile-tabs">
          <button
            v-for="tab in ['Overview', 'Bookings', 'Schedule', 'Activity log']"
            :key="tab"
            type="button"
            class="profile-tabs__btn"
            :class="{ 'profile-tabs__btn--active': activeTab === tab }"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Personal Card -->
        <div class="personal-card">
          <div class="personal-card__header">
            <h3 class="personal-card__title">Personal information</h3>
          </div>
          <div class="personal-card__body">
            <div class="personal-field-row">
              <div class="personal-field">
                <span class="personal-field__label">Full name</span>
                <span class="personal-field__value">{{ member.name }}</span>
              </div>
              <div class="personal-field">
                <span class="personal-field__label">Email</span>
                <span class="personal-field__value">{{ member.email }}</span>
              </div>
            </div>
            <div class="personal-field-row">
              <div class="personal-field">
                <span class="personal-field__label">Phone</span>
                <span class="personal-field__value">+998 90 234 56 78</span>
              </div>
              <div class="personal-field">
                <span class="personal-field__label">Role</span>
                <span class="personal-field__value">{{ member.role }}</span>
              </div>
            </div>
            <div class="personal-field-row">
              <div class="personal-field">
                <span class="personal-field__label">Specialty</span>
                <span class="personal-field__value"
                  >{{ member.specialties.join(', ') || '—' }}</span
                >
              </div>
              <div class="personal-field">
                <span class="personal-field__label">Workspace access</span>
                <span class="personal-field__value">AutoFix MCHJ</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Card -->
        <div class="activity-card">
          <div class="activity-card__header">
            <h3 class="activity-card__title">Recent activity</h3>
            <span class="activity-card__view-all">View all</span>
          </div>
          <div class="activity-card__body">
            <div class="activity-row">
              <div class="activity-row__icon"><Clock :size="14" /></div>
              <div class="activity-row__text">
                <span class="activity-row__title">Completed booking #1421</span>
                <span class="activity-row__time">2 hours ago</span>
              </div>
            </div>
            <div class="activity-row">
              <div class="activity-row__icon"><Clock :size="14" /></div>
              <div class="activity-row__text">
                <span class="activity-row__title">Received 5-star review</span>
                <span class="activity-row__time">Yesterday</span>
              </div>
            </div>
            <div class="activity-row">
              <div class="activity-row__icon"><Clock :size="14" /></div>
              <div class="activity-row__text">
                <span class="activity-row__title"
                  >Updated availability schedule</span
                >
                <span class="activity-row__time">2 days ago</span>
              </div>
            </div>
            <div class="activity-row">
              <div class="activity-row__icon"><Clock :size="14" /></div>
              <div class="activity-row__text">
                <span class="activity-row__title">Joined AutoFix MCHJ</span>
                <span class="activity-row__time">{{ member.joined }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <RemoveMemberModal
      :is-open="showRemoveModal"
      :member-name="member.name"
      org-name="AutoFix MCHJ"
      @cancel="showRemoveModal = false"
      @confirm="confirmRemove"
    />
  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
}
.profile-not-found {
  padding: 40px 24px;
  font-size: 14px;
  color: var(--muted-foreground);
  text-align: center;
}

/* Header */
.profile-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.profile-header__left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.profile-header__name {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
}
.profile-header__subtitle {
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-foreground);
}
.profile-header__remove-btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--destructive-foreground);
  white-space: nowrap;
  cursor: pointer;
  background: var(--destructive);
  border: none;
  border-radius: var(--radius-pill);
  transition: opacity 0.15s;
}
.profile-header__remove-btn:hover {
  opacity: 0.9;
}

/* Grid */
.profile-grid {
  display: flex;
  gap: 18px;
  align-items: flex-start;
}
.profile-grid__left {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 18px;
  width: 320px;
}
.profile-grid__right {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

/* Profile Card */
.profile-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  padding: 24px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
}
.profile-card__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  font-size: 32px;
  font-weight: 700;
  color: var(--primary-foreground);
  background: var(--primary);
  border-radius: var(--radius-pill);
}
.profile-card__name-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  width: 100%;
}
.profile-card__display-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
  text-align: center;
}
.profile-card__email {
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-foreground);
  text-align: center;
}
.profile-card__badges {
  display: flex;
  gap: 6px;
  justify-content: center;
}
.profile-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  border-radius: var(--radius-pill);
}
.profile-badge--role {
  color: var(--color-info-foreground);
  background: var(--color-info);
}
.profile-badge--accepted {
  color: var(--color-success-foreground);
  background: var(--color-success);
}
.profile-badge--invited {
  color: var(--color-warning-foreground);
  background: var(--color-warning);
}
.profile-badge--declined {
  color: var(--color-error-foreground);
  background: var(--color-error);
}
.profile-badge--expired {
  color: var(--muted-foreground);
  background: var(--muted);
}
.profile-card__divider {
  width: 100%;
  height: 1px;
  background: var(--border);
}
.profile-card__meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
.profile-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.profile-meta-row__label {
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}
.profile-meta-row__value {
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
}

/* Stats Card */
.stats-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
}
.stats-card__title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}
.stats-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.stats-row__label {
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-foreground);
}
.stats-row__value {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}
.stats-row__star {
  flex-shrink: 0;
  color: #f5b400;
  fill: #f5b400;
}

/* Tabs */
.profile-tabs {
  display: flex;
  gap: 4px;
  padding: 5px;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: 12px;
}
.profile-tabs__btn {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted-foreground);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 8px;
  transition:
    background 0.15s,
    color 0.15s,
    box-shadow 0.15s;
}
.profile-tabs__btn--active {
  font-weight: 600;
  color: var(--foreground);
  background: var(--background);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Personal Card */
.personal-card {
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
}
.personal-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}
.personal-card__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
}

.personal-card__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}
.personal-field-row {
  display: flex;
  gap: 24px;
}
.personal-field {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.personal-field__label {
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}
.personal-field__value {
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
}

/* Activity Card */
.activity-card {
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
}
.activity-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}
.activity-card__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
}
.activity-card__view-all {
  font-size: 12px;
  font-weight: 500;
  color: var(--primary);
  cursor: pointer;
}
.activity-card__body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
}
.activity-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.activity-row__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--muted-foreground);
  background: var(--accent);
  border-radius: var(--radius-pill);
}
.activity-row__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.activity-row__title {
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
}
.activity-row__time {
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}
</style>
