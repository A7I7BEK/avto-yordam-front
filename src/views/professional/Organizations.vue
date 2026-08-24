<script
  setup
  lang="ts"
>
import { Building2, ChevronRight, Crown, Wrench } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiClient } from '@/api/client';
import BreadcrumbBar from '@/components/app/BreadcrumbBar.vue';
import { isMockMode } from '@/config';
import { useErrorStore } from '@/stores/errorStore';

const router = useRouter();

const staticOrganizations = [
  {
    id: 'af',
    organizationId: 'af-org-uuid',
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
    organizationId: 'rs-org-uuid',
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
    organizationId: 'da-org-uuid',
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

const organizations = ref<any[]>([]);
const isLoading = ref(false);

const gradients = [
  {
    gradient: 'linear-gradient(135deg, #5749F4 0%, #1B1356 100%)',
    border: '#7A6FFF',
    shadowColor: 'rgba(87,73,244,0.29)',
  },
  {
    gradient: 'linear-gradient(135deg, #0F766E 0%, #053330 100%)',
    border: '#14B8A6',
    shadowColor: 'rgba(15,118,110,0.29)',
  },
  {
    gradient: 'linear-gradient(135deg, #B45309 0%, #4A1E02 100%)',
    border: '#F59E0B',
    shadowColor: 'rgba(180,83,9,0.29)',
  },
];

async function loadOrganizations() {
  if (isMockMode()) {
    organizations.value = staticOrganizations;
    return;
  }

  isLoading.value = true;
  try {
    const data = await apiClient.get('/organization-member/get-by-user');

    if (!data || data.length === 0) {
      organizations.value = [];
      return;
    }

    organizations.value = data.map((item: any, index: number) => {
      const g = gradients[index % gradients.length] || {
        gradient: 'linear-gradient(135deg, #5749F4 0%, #1B1356 100%)',
        border: '#7A6FFF',
        shadowColor: 'rgba(87,73,244,0.29)',
      };
      const name = item.organizationName || 'Auto Service';
      const initials = name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      const roleName = item.role?.name || 'Master';
      const isOwner =
        String(item.role?.code || '').toUpperCase() === 'OWNER' ||
        String(item.role?.code || '').toUpperCase() === 'ORGANIZATION_ADMIN';

      return {
        id: item.id,
        organizationId: item.organizationId,
        name,
        initials,
        gradient: g.gradient,
        border: g.border,
        shadowColor: g.shadowColor,
        location: 'Tashkent',
        legalType: 'MCHJ',
        specialization: 'General Repair',
        role: roleName,
        isOwner,
        memberSince: 'Active',
        orgId: `#ORG-${item.organizationId.slice(0, 4).toUpperCase()}`,
      };
    });
  } catch {
    organizations.value = [];
  } finally {
    isLoading.value = false;
  }
}

async function enterOrganization(organizationId: string) {
  if (isMockMode()) {
    router.push({ name: 'biz-dashboard-overview' });
    return;
  }

  try {
    const result = await apiClient.post(
      `/user/change-organization/${organizationId}`,
    );
    if (result?.accessToken) {
      localStorage.setItem('token', result.accessToken);
      router.push({ name: 'biz-dashboard-overview' });
    }
  } catch {
    useErrorStore().showError(
      'Failed to switch to organization workspace. Please try again.',
    );
  }
}

onMounted(() => {
  loadOrganizations();
});

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
      <div
        v-if="isLoading"
        class="loading-state"
      >
        Loading organization assignments...
      </div>
      <div
        v-else-if="organizations.length === 0"
        class="empty-state"
      >
        <Building2
          class="empty-icon"
          :size="48"
        />
        <h3 class="empty-title">No Organizations Found</h3>
        <p class="empty-subtitle">
          You are not a member of any organization workspaces yet.
        </p>
      </div>
      <article
        v-else
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
          <div class="stats-row">
            <div class="stat-col">
              <span class="stat-label">MEMBER SINCE</span>
              <span class="stat-value">{{ org.memberSince }}</span>
            </div>
            <div class="stat-col">
              <span class="stat-label">ORG ID</span>
              <span class="stat-value">{{ org.orgId }}</span>
            </div>
          </div>

          <button
            class="enter-btn"
            type="button"
            @click.stop="enterOrganization(org.organizationId || org.id)"
          >
            <span>Enter Workspace</span>
            <ChevronRight :size="16" />
          </button>
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
  color: var(--foreground);
}

.page-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--muted-foreground);
}

.org-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.loading-state {
  padding: 40px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: var(--muted-foreground);
  text-align: center;
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
  background: var(--card);
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
  color: var(--foreground);
  background: var(--card);
  border-radius: 999px;
}

.card-footer {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
}

.stats-row {
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

.enter-btn {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
  cursor: pointer;
  background: var(--card);
  border: none;
  border-radius: 999px;
  transition:
    transform 0.15s,
    background 0.15s;
}

.enter-btn:hover {
  background: var(--muted);
  transform: translateY(-1px);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
  background: var(--card);
  border: 1px dashed var(--border-soft);
  border-radius: 20px;
}

.empty-icon {
  margin-bottom: 16px;
  color: var(--muted-icon);
}

.empty-title {
  margin: 0 0 6px 0;
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
}

.empty-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: var(--muted-foreground);
}
</style>
