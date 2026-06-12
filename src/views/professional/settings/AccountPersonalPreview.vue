<script
  setup
  lang="ts"
>
import { BadgeCheck, Pencil } from '@lucide/vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

function goToEdit() {
  router.push({
    path: route.path,
    query: { tab: 'personal', mode: 'edit' },
  });
}
</script>

<template>
  <div class="section">
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
      <div class="profile-avatar">AI</div>
      <div class="profile-info">
        <span class="profile-name">Aziz Ismoilov</span>
        <span class="profile-role">Master mechanic · Tashkent, Uzbekistan</span>
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
        <span class="detail-value">Aziz Ismoilov</span>
      </div>
      <div class="detail-card">
        <span class="detail-label">Date of birth</span>
        <span class="detail-value">14 / 02 / 1991</span>
      </div>
      <div class="detail-card">
        <span class="detail-label">Specialization</span>
        <span class="detail-value"
          >European brands · Engine &amp; diagnostics</span
        >
      </div>
      <div class="detail-card">
        <span class="detail-label">Working time</span>
        <span class="detail-value">Mon–Sat · 09:00–19:00</span>
      </div>
      <div class="detail-card full-width">
        <span class="detail-label">Years of experience (self-reported)</span>
        <span class="detail-value">8 years</span>
      </div>
    </div>
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
</style>
