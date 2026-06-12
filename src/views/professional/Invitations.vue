<script
  setup
  lang="ts"
>
import {
  Building,
  Check,
  ChevronRight,
  Clock3,
  Hourglass,
} from '@lucide/vue';
import { ref } from 'vue';
import BreadcrumbBar from '@/components/app/BreadcrumbBar.vue';
import { useProfessionalAppStore } from '@/stores/professionalApp';

const store = useProfessionalAppStore();

interface Invitation {
  id: number;
  orgName: string;
  initials: string;
  avatarBg: string;
  avatarTextColor: string;
  location: string;
  role: string;
  tags: string[];
  message: string;
  sent: string;
  expiresIn: string;
}

const invitations = ref<Invitation[]>([
  {
    id: 1,
    orgName: 'AutoFix MCHJ',
    initials: 'AF',
    avatarBg: '#5749F4',
    avatarTextColor: '#FFFFFF',
    location: 'from Tashkent',
    role: 'Master Electrician',
    tags: ['Full-time', 'Brakes', 'Suspension'],
    message:
      "Hi! Your portfolio for brake work caught our attention. We'd love to have you cover the Tuesday/Thursday afternoon shifts. Welcome.",
    sent: 'Sent 2 days ago',
    expiresIn: 'Expires in 5 days',
  },
  {
    id: 2,
    orgName: 'Rahimov Service',
    initials: 'RS',
    avatarBg: '#FFD9B2',
    avatarTextColor: '#4D2700',
    location: 'from Samarkand',
    role: 'Transmission Specialist',
    tags: ['Night shift', 'Premium rate'],
    message:
      "We're growing the night shift and your transmission expertise is exactly what we need. Flexible hours, premium rate.",
    sent: 'Sent 6 hours ago',
    expiresIn: 'Expires in 7 days',
  },
  {
    id: 3,
    orgName: 'Green Auto',
    initials: 'GA',
    avatarBg: '#A1E5A1',
    avatarTextColor: '#003300',
    location: 'from Bukhara',
    role: 'Diagnostics Technician',
    tags: ['Part-time', 'Weekends'],
    message:
      "We're looking for a skilled diagnostics tech for our new Bukhara branch. Your engine and electrical skills are a perfect match.",
    sent: 'Sent 1 day ago',
    expiresIn: 'Expires in 4 days',
  },
]);

function acceptInvitation(id: number) {
  invitations.value = invitations.value.filter((inv) => inv.id !== id);
  store.decrementInvitationCount();
}

function declineInvitation(id: number) {
  invitations.value = invitations.value.filter((inv) => inv.id !== id);
  store.decrementInvitationCount();
}
</script>

<template>
  <div class="page">
    <BreadcrumbBar :items="['Workspace', 'My invitations']" />

    <div class="page-header">
      <div class="title-row">
        <h1 class="page-title">My invitations</h1>
        <span
          v-if="invitations.length > 0"
          class="new-badge"
        >
          {{ invitations.length }}
          new
        </span>
      </div>
      <p class="page-subtitle">
        Workshops want you on their team — review and decide.
      </p>
    </div>

    <div class="invitations-list">
      <article
        v-for="inv in invitations"
        :key="inv.id"
        class="invitation-card"
      >
        <div class="card-body">
          <!-- Top Row -->
          <div class="top-row">
            <div class="org-section">
              <div
                class="inv-avatar"
                :style="{
                  background: inv.avatarBg,
                  color: inv.avatarTextColor,
                }"
              >
                {{ inv.initials }}
              </div>
              <div class="inv-info">
                <div class="name-row">
                  <span class="org-name">{{ inv.orgName }}</span>
                  <span class="org-location">{{ inv.location }}</span>
                </div>
                <div class="meta-row">
                  <Building
                    :size="12"
                    color="#616167"
                  />
                  <span>{{ inv.role }}</span>
                  <span
                    v-for="tag in inv.tags"
                    :key="tag"
                    class="tag-chip"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
            <div class="time-section">
              <div class="sent-time">
                <Clock3
                  :size="12"
                  color="#616167"
                />
                <span>{{ inv.sent }}</span>
              </div>
              <div class="expiry-badge">
                <Hourglass
                  :size="11"
                  color="#4D2700"
                />
                <span>{{ inv.expiresIn }}</span>
              </div>
            </div>
          </div>

          <!-- Message -->
          <div class="message-body">
            {{ inv.message }}
          </div>
        </div>

        <!-- Footer -->
        <div class="card-footer">
          <button
            class="btn btn-decline"
            type="button"
            @click="declineInvitation(inv.id)"
          >
            Decline
          </button>
          <button
            class="btn btn-accept"
            type="button"
            @click="acceptInvitation(inv.id)"
          >
            <Check :size="13" />
            Accept
          </button>
        </div>
      </article>

      <div
        v-if="invitations.length === 0"
        class="empty-state"
      >
        <p>No pending invitations. You're all caught up!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  padding: 24px;
  overflow-y: auto;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #2a2933;
}

.new-badge {
  padding: 3px 9px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  background: #5749f4;
  border-radius: 999px;
}

.page-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
}

.invitations-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.invitation-card {
  width: 100%;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 16px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 20px;
}

.top-row {
  display: flex;
  justify-content: space-between;
}

.org-section {
  display: flex;
  gap: 14px;
}

.inv-avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 700;
  border-radius: 12px;
}

.inv-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.name-row {
  display: flex;
  gap: 3px;
  align-items: baseline;
}

.org-name {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #2a2933;
}

.org-location {
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #616167;
}

.meta-row {
  display: flex;
  gap: 10px;
  align-items: center;
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #616167;
}

.tag-chip {
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 500;
  color: #616167;
  background: #f5f5f5;
  border-radius: 999px;
}

.time-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
}

.sent-time {
  display: flex;
  gap: 5px;
  align-items: center;
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #616167;
}

.expiry-badge {
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 3px 9px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #4d2700;
  background: #ffd9b2;
  border-radius: 999px;
}

.message-body {
  padding: 12px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-style: italic;
  line-height: 1.5;
  color: #2a2933;
  background: #f5f5f5;
  border-radius: 12px;
}

.card-footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding: 14px 20px;
  border-top: 1px solid #c5c5cb;
}

.btn {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 999px;
  transition: opacity 0.15s;
}

.btn-decline {
  color: #2a2933;
  background: transparent;
  border: 1px solid #c5c5cb;
}

.btn-accept {
  padding: 10px 22px;
  font-weight: 700;
  color: #ffffff;
  background: #5749f4;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #616167;
}
</style>
