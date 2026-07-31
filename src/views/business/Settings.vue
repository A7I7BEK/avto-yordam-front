<script
  setup
  lang="ts"
>
import {
  Bell,
  Building2,
  CreditCard,
  Image,
  Landmark,
  Palette,
  Timer,
  TriangleAlert,
} from '@lucide/vue';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BreadcrumbBar from '@/components/app/BreadcrumbBar.vue';
import SettingsAppearance from './settings/SettingsAppearance.vue';
import SettingsBankInfo from './settings/SettingsBankInfo.vue';
import SettingsDangerZone from './settings/SettingsDangerZone.vue';
import SettingsHours from './settings/SettingsHours.vue';
import SettingsLegal from './settings/SettingsLegal.vue';
import SettingsNotifications from './settings/SettingsNotifications.vue';
import SettingsPayment from './settings/SettingsPayment.vue';
import SettingsPhotos from './settings/SettingsPhotos.vue';

const route = useRoute();
const router = useRouter();

const section = computed(() => {
  const path = route.path;
  if (path.includes('/settings/legal')) {
    return 'legal';
  }
  if (path.includes('/settings/hours')) {
    return 'hours';
  }
  if (path.includes('/settings/photos')) {
    return 'photos';
  }
  if (path.includes('/settings/bank-info')) {
    return 'bank-info';
  }
  if (path.includes('/settings/payment')) {
    return 'payment';
  }
  if (path.includes('/settings/notifications')) {
    return 'notifications';
  }
  if (path.includes('/settings/appearance')) {
    return 'appearance';
  }
  if (path.includes('/settings/danger-zone')) {
    return 'danger-zone';
  }
  return 'legal';
});

const subNavItems = [
  { key: 'legal', icon: Building2, label: 'Legal info' },
  { key: 'hours', icon: Timer, label: 'Operating hours' },
  { key: 'photos', icon: Image, label: 'Photos' },
  { key: 'bank-info', icon: Landmark, label: 'Bank info' },
  { key: 'payment', icon: CreditCard, label: 'Payment providers' },
  { key: 'notifications', icon: Bell, label: 'Notification policy' },
  { key: 'appearance', icon: Palette, label: 'Appearance & language' },
  { key: 'danger-zone', icon: TriangleAlert, label: 'Danger zone' },
];

function navigateToSection(key: string) {
  const base = '/business/settings';
  if (key === 'legal') {
    router.push(`${base}/legal`);
  } else if (key === 'hours') {
    router.push(`${base}/hours`);
  } else if (key === 'photos') {
    router.push(`${base}/photos`);
  } else if (key === 'bank-info') {
    router.push(`${base}/bank-info`);
  } else if (key === 'payment') {
    router.push(`${base}/payment`);
  } else if (key === 'notifications') {
    router.push(`${base}/notifications`);
  } else if (key === 'appearance') {
    router.push(`${base}/appearance`);
  } else if (key === 'danger-zone') {
    router.push(`${base}/danger-zone`);
  }
}

function breadcrumbItems() {
  const items = ['Workspace', 'Settings'];
  if (section.value === 'legal') {
    items.push('Legal info');
  } else if (section.value === 'hours') {
    items.push('Operating hours');
  } else if (section.value === 'photos') {
    items.push('Photos');
  } else if (section.value === 'bank-info') {
    items.push('Bank info');
  } else if (section.value === 'payment') {
    items.push('Payment providers');
  } else if (section.value === 'notifications') {
    items.push('Notification policy');
  } else if (section.value === 'appearance') {
    items.push('Appearance & language');
  } else if (section.value === 'danger-zone') {
    items.push('Danger zone');
  }
  return items;
}
</script>

<template>
  <div class="settings-page">
    <!-- Sub Navigation -->
    <nav class="sub-nav">
      <button
        v-for="item in subNavItems"
        :key="item.key"
        class="nav-item"
        :class="{
          active: section === item.key,
          'nav-item-danger': item.key === 'danger-zone',
        }"
        type="button"
        @click="navigateToSection(item.key)"
      >
        <component
          :is="item.icon"
          :size="16"
        />
        <span>{{ item.label }}</span>
      </button>
    </nav>

    <!-- Content -->
    <div class="settings-content">
      <BreadcrumbBar :items="breadcrumbItems()" />

      <SettingsLegal v-if="section === 'legal'" />
      <SettingsHours v-else-if="section === 'hours'" />
      <SettingsPhotos v-else-if="section === 'photos'" />
      <SettingsBankInfo v-else-if="section === 'bank-info'" />
      <SettingsPayment v-else-if="section === 'payment'" />
      <SettingsNotifications v-else-if="section === 'notifications'" />
      <SettingsAppearance v-else-if="section === 'appearance'" />
      <SettingsDangerZone v-else-if="section === 'danger-zone'" />
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  display: flex;
  height: 100%;
}

.sub-nav {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 4px;
  width: 240px;
  padding: 24px 16px;
  background: #ffffff;
  border-right: 1px solid #c5c5cb;
}

.nav-item {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #939399;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-item:hover {
  color: var(--foreground);
  background: var(--accent);
}

.nav-item.active {
  color: #fff;
  background: var(--primary);
}

.nav-item-danger,
.nav-item-danger:hover {
  color: var(--destructive);
}

.nav-item-danger.active {
  color: #fff;
  background: var(--destructive);
}

.settings-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  padding: 24px 32px;
  overflow-y: auto;
}
</style>
