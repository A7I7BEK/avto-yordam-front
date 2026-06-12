<script
  setup
  lang="ts"
>
import { ArrowLeft, Shield, Trash2 } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getMember } from '@/services/membersService';
import type { TeamMember } from '@/types/business';

const route = useRoute();
const router = useRouter();

const member = ref<TeamMember | null>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const id = route.params.id as string;
    member.value = await getMember(id);
  } finally {
    loading.value = false;
  }
});

function goBack() {
  router.push('/business/team/members');
}

function editRole() {
  // biome-ignore lint/suspicious/noConsole: allowed in handler
  console.log('Edit role for', member.value?.id);
}

function removeMember() {
  // biome-ignore lint/suspicious/noConsole: allowed in handler
  console.log('Remove member', member.value?.id);
}
</script>

<template>
  <div class="page">
    <div class="page__header">
      <div class="page__header-left">
        <button
          type="button"
          class="icon-btn"
          title="Back"
          @click="goBack"
        >
          <ArrowLeft :size="20" />
        </button>
        <div>
          <h1 class="page__title">{{ member?.name ?? 'Member' }}</h1>
          <p class="page__subtitle">Member profile</p>
        </div>
      </div>
      <div
        class="page__header-actions"
        v-if="member"
      >
        <button
          type="button"
          class="btn btn--outline"
          @click="editRole"
        >
          <Shield :size="16" />
          Edit role
        </button>
        <button
          type="button"
          class="btn btn--danger"
          @click="removeMember"
        >
          <Trash2 :size="16" />
          Remove member
        </button>
      </div>
    </div>

    <div
      v-if="loading"
      class="loading"
    >
      Loading...
    </div>

    <div
      v-else-if="!member"
      class="loading"
    >
      Member not found
    </div>

    <div
      v-else
      class="detail-card"
    >
      <div class="detail-card__header">
        <div
          class="avatar"
          :style="{ background: member.avatarColor }"
        >
          {{ member.initials }}
        </div>
        <div>
          <h2 class="detail-card__name">{{ member.name }}</h2>
          <span
            class="badge badge--status"
            :class="{
              'badge--success': member.status === 'Active',
              'badge--muted': member.status === 'Inactive',
              'badge--warning': member.status === 'Pending',
            }"
          >
            {{ member.status }}
          </span>
        </div>
      </div>

      <div class="detail-card__body">
        <div class="detail-row">
          <span class="detail-row__label">Full name</span>
          <span class="detail-row__value">{{ member.name }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-row__label">Phone</span>
          <span class="detail-row__value">{{ member.phone }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-row__label">Email</span>
          <span class="detail-row__value">—</span>
        </div>
        <div class="detail-row">
          <span class="detail-row__label">Role</span>
          <span class="detail-row__value">
            <span class="badge badge--role">{{ member.role }}</span>
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-row__label">Organization</span>
          <span class="detail-row__value">{{ member.org }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-row__label">Status</span>
          <span class="detail-row__value">
            <span
              class="badge badge--status"
              :class="{
                'badge--success': member.status === 'Active',
                'badge--muted': member.status === 'Inactive',
                'badge--warning': member.status === 'Pending',
              }"
            >
              {{ member.status }}
            </span>
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-row__label">Joined date</span>
          <span class="detail-row__value">—</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
}

.page__header {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
}

.page__header-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.page__title {
  margin: 0;
  font-family: var(--font-primary);
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
}

.page__subtitle {
  margin: 4px 0 0;
  font-family: var(--font-primary);
  font-size: 14px;
  color: var(--muted-foreground);
}

.page__header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Buttons */
.btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 10px 20px;
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-md);
  transition: opacity 0.15s;
}

.btn:hover {
  opacity: 0.9;
}

.btn--outline {
  color: var(--foreground);
  background: transparent;
  border: 1px solid var(--border);
}

.btn--danger {
  color: #ffffff;
  background: var(--destructive);
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--foreground);
  cursor: pointer;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: background 0.15s;
}

.icon-btn:hover {
  background: var(--accent);
}

/* Loading */
.loading {
  padding: 32px 0;
  font-family: var(--font-primary);
  font-size: 14px;
  color: var(--muted-foreground);
}

/* Detail card */
.detail-card {
  max-width: 640px;
  overflow: hidden;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.detail-card__header {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--border);
}

.avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  font-family: var(--font-primary);
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  border-radius: 50%;
}

.detail-card__name {
  margin: 0 0 4px;
  font-family: var(--font-primary);
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
}

.detail-card__body {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 24px;
}

.detail-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--accent);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row__label {
  flex-shrink: 0;
  width: 160px;
  font-family: var(--font-primary);
  font-size: 14px;
  color: var(--muted-foreground);
}

.detail-row__value {
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

/* Badges */
.badge {
  display: inline-block;
  padding: 3px 10px;
  font-family: var(--font-primary);
  font-size: 12px;
  font-weight: 500;
  border-radius: var(--radius-pill);
}

.badge--role {
  color: var(--foreground);
  background: var(--accent);
}

.badge--status {
  font-weight: 600;
}

.badge--success {
  color: var(--success);
  background: var(--success-bg);
}

.badge--muted {
  color: var(--muted-foreground);
  background: var(--accent);
}

.badge--warning {
  color: var(--warning);
  background: var(--warning-bg);
}
</style>
