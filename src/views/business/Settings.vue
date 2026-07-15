<script
  setup
  lang="ts"
>
import {
  Bell,
  Building2,
  ChevronRight,
  Palette,
  Shield,
  User,
} from '@lucide/vue';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BreadcrumbBar from '@/components/app/BreadcrumbBar.vue';
import AccountLanguages from '@/views/professional/settings/AccountLanguages.vue';
import AccountPersonalEdit from '@/views/professional/settings/AccountPersonalEdit.vue';
import AccountPersonalPreview from '@/views/professional/settings/AccountPersonalPreview.vue';
import AccountPhoneEmail from '@/views/professional/settings/AccountPhoneEmail.vue';
import AppearanceSettings from '@/views/professional/settings/AppearanceSettings.vue';
import NotificationsSettings from '@/views/professional/settings/NotificationsSettings.vue';
import PrivacySettings from '@/views/professional/settings/PrivacySettings.vue';
import SettingsLegal from './settings/SettingsLegal.vue';

const route = useRoute();
const router = useRouter();

const section = computed(() => {
  const path = route.path;
  if (path.includes('/settings/notifications')) {
    return 'notifications';
  }
  if (path.includes('/settings/appearance')) {
    return 'appearance';
  }
  if (path.includes('/settings/privacy')) {
    return 'privacy';
  }
  if (path.includes('/settings/organization')) {
    return 'organization';
  }
  return 'account';
});

const tab = computed(() => (route.query.tab as string) || 'personal');
const mode = computed(() => (route.query.mode as string) || 'preview');

const subNavItems = [
  { key: 'account', icon: User, label: 'Account', group: 'PERSONAL' },
  {
    key: 'notifications',
    icon: Bell,
    label: 'Notifications',
    group: 'PERSONAL',
  },
  {
    key: 'appearance',
    icon: Palette,
    label: 'Appearance & language',
    group: 'PREFERENCES',
  },
  {
    key: 'privacy',
    icon: Shield,
    label: 'Privacy & data',
    group: 'PREFERENCES',
  },
  {
    key: 'organization',
    icon: Building2,
    label: 'Organization',
    group: 'BUSINESS',
  },
];

const accountTabs = [
  { key: 'personal', label: 'Personal info' },
  { key: 'phone-email', label: 'Phone & email' },
  { key: 'languages', label: 'Languages' },
];

function navigateToSection(key: string) {
  const base = '/business/settings';
  if (key === 'account') {
    router.push(`${base}?tab=${tab.value}`);
  } else if (key === 'notifications') {
    router.push(`${base}/notifications`);
  } else if (key === 'appearance') {
    router.push(`${base}/appearance`);
  } else if (key === 'privacy') {
    router.push(`${base}/privacy`);
  } else if (key === 'organization') {
    router.push(`${base}/organization`);
  }
}

function switchAccountTab(key: string) {
  const base = '/business/settings';
  router.push(`${base}?tab=${key}`);
}

function breadcrumbItems() {
  const items = ['Workspace', 'Settings'];
  if (section.value === 'notifications') {
    items.push('Notifications');
  }
  if (section.value === 'appearance') {
    items.push('Appearance & language');
  }
  if (section.value === 'privacy') {
    items.push('Privacy & data');
  }
  if (section.value === 'organization') {
    items.push('Organization settings');
  }
  return items;
}
</script>

<template>
  <div class="settings-page">
    <BreadcrumbBar :items="breadcrumbItems()" />

    <div class="page-header">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Manage your account and preferences</p>
    </div>

    <div class="settings-layout">
      <!-- Sub Navigation -->
      <nav class="sub-nav">
        <template
          v-for="item in subNavItems"
          :key="item.key"
        >
          <span class="nav-group-label">{{ item.group }}</span>
          <button
            class="nav-item"
            :class="{ active: section === item.key }"
            type="button"
            @click="navigateToSection(item.key)"
          >
            <component
              :is="item.icon"
              :size="16"
            />
            <span>{{ item.label }}</span>
          </button>
        </template>
      </nav>

      <!-- Content -->
      <div class="settings-content">
        <!-- Account Section -->
        <template v-if="section === 'account'">
          <!-- Account Tabs -->
          <div class="account-tabs">
            <button
              v-for="t in accountTabs"
              :key="t.key"
              class="tab-btn"
              :class="{ active: tab === t.key }"
              type="button"
              @click="switchAccountTab(t.key)"
            >
              {{ t.label }}
            </button>
          </div>

          <AccountPersonalPreview
            v-if="tab === 'personal' && mode === 'preview'"
          />
          <AccountPersonalEdit
            v-else-if="tab === 'personal' && mode === 'edit'"
          />
          <AccountPhoneEmail v-else-if="tab === 'phone-email'" />
          <AccountLanguages v-else-if="tab === 'languages'" />
        </template>

        <NotificationsSettings v-else-if="section === 'notifications'" />
        <AppearanceSettings v-else-if="section === 'appearance'" />
        <PrivacySettings v-else-if="section === 'privacy'" />
        <SettingsLegal v-else-if="section === 'organization'" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
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

.settings-layout {
  display: flex;
  flex: 1;
  gap: 24px;
}

.sub-nav {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 2px;
  width: 200px;
}

.nav-group-label {
  padding: 12px 12px 4px;
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: #616167;
  letter-spacing: 0.5px;
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
  color: #2a2933;
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 6px;
  transition: background 0.15s;
}

.nav-item.active {
  font-weight: 600;
  background: #f5f5f5;
}

.settings-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.account-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #c5c5cb;
}

.tab-btn {
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #616167;
  cursor: pointer;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  transition: all 0.15s;
}

.tab-btn.active {
  font-weight: 600;
  color: #5749f4;
  border-bottom-color: #5749f4;
}
</style>
