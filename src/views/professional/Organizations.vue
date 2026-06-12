<script
  setup
  lang="ts"
>
import { ChevronRight, Crown, Wrench } from '@lucide/vue';
import BreadcrumbBar from '@/components/app/BreadcrumbBar.vue';

const organizations = [
  {
    id: 'af',
    name: 'AutoFix Toshkent',
    initials: 'AF',
    gradient: 'linear-gradient(135deg, #5749F4 0%, #1B1356 100%)',
    border: '#7A6FFF',
    shadowColor: 'rgba(87,73,244,0.29)',
    location: 'Tashkent',
    legalType: 'MCHJ',
    specialization: 'Electrical',
    role: 'Owner',
    isOwner: true,
    memberSince: 'Jan 2023',
    orgId: 'AF-MCHJ-0042',
  },
  {
    id: 'rs',
    name: 'Rapid Service',
    initials: 'RS',
    gradient: 'linear-gradient(135deg, #0F766E 0%, #053330 100%)',
    border: '#14B8A6',
    shadowColor: 'rgba(15,118,110,0.29)',
    location: 'Samarkand',
    legalType: 'YTT',
    specialization: 'Transmission',
    role: 'Master',
    isOwner: false,
    memberSince: 'Aug 2023',
    orgId: 'RS-MCHJ-0118',
  },
  {
    id: 'da',
    name: 'Detailing Auto',
    initials: 'DA',
    gradient: 'linear-gradient(135deg, #B45309 0%, #4A1E02 100%)',
    border: '#F59E0B',
    shadowColor: 'rgba(180,83,9,0.29)',
    location: 'Bukhara',
    legalType: 'MCHJ',
    specialization: 'Bodywork',
    role: 'Master',
    isOwner: false,
    memberSince: 'Mar 2024',
    orgId: 'DA-MCHJ-0271',
  },
];

function getInitialsColor(gradient: string) {
  if (gradient.includes('#5749F4')) {
    return '#5749F4';
  }
  if (gradient.includes('#0F766E')) {
    return '#0F766E';
  }
  return '#B45309';
}
</script>

<template>
  <div class="page">
    <BreadcrumbBar :items="['Workspace', 'My organizations']" />

    <div class="page-header">
      <h1 class="page-title">My organizations</h1>
      <p class="page-subtitle">Shops where you work as a member of the team</p>
    </div>

    <div class="org-list">
      <article
        v-for="org in organizations"
        :key="org.id"
        class="org-card"
        :style="{
          background: org.gradient,
          borderColor: org.border,
          boxShadow: `0 24px 60px ${org.shadowColor}`,
        }"
      >
        <!-- Decorative circles -->
        <div class="deco-circle deco-large" />
        <div class="deco-circle deco-small" />

        <div class="card-header-row">
          <div class="org-identity">
            <div
              class="org-avatar"
              :style="{ color: getInitialsColor(org.gradient) }"
            >
              {{ org.initials }}
            </div>
            <div class="org-info">
              <h2 class="org-name">{{ org.name }}</h2>
              <p class="org-meta">
                {{ org.location }}
                · {{ org.legalType }} ·
                {{ org.specialization }}
              </p>
            </div>
          </div>
          <div class="role-badge">
            <Crown
              v-if="org.isOwner"
              :size="12"
            />
            <Wrench
              v-else
              :size="12"
            />
            <span>{{ org.role }}</span>
          </div>
        </div>

        <div class="card-footer">
          <div class="stat-col">
            <span class="stat-label">MEMBER SINCE</span>
            <span class="stat-value">{{ org.memberSince }}</span>
          </div>
          <div class="stat-col">
            <span class="stat-label">ORG ID</span>
            <span class="stat-value">{{ org.orgId }}</span>
          </div>
        </div>
      </article>
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

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #2a2933;
}

.page-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
}

.org-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.org-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 220px;
  padding: 24px 28px;
  overflow: hidden;
  border: 1px solid;
  border-radius: 20px;
}

.deco-circle {
  position: absolute;
  pointer-events: none;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 50%;
}

.deco-large {
  top: -40px;
  right: -20px;
  width: 280px;
  height: 280px;
}

.deco-small {
  right: -30px;
  bottom: -40px;
  width: 200px;
  height: 200px;
  opacity: 0.04;
}

.card-header-row {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.org-identity {
  display: flex;
  gap: 14px;
  align-items: center;
}

.org-avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 800;
  background: #ffffff;
  border-radius: 12px;
}

.org-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.org-name {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.org-meta {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.role-badge {
  display: flex;
  flex-shrink: 0;
  gap: 6px;
  align-items: center;
  padding: 5px 12px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #2a2933;
  background: #ffffff;
  border-radius: 999px;
}

.card-footer {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 48px;
}

.stat-col {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.stat-label {
  font-family: Inter, sans-serif;
  font-size: 9px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}
</style>
