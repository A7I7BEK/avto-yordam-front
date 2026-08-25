<script
  setup
  lang="ts"
>
import { Bell, Palette, Shield, UserRound } from '@lucide/vue';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BreadcrumbBar from '@/components/app/BreadcrumbBar.vue';
import AccountLanguages from './settings/AccountLanguages.vue';
import AccountPersonalEdit from './settings/AccountPersonalEdit.vue';
import AccountPersonalPreview from './settings/AccountPersonalPreview.vue';
import AccountPhoneEmail from './settings/AccountPhoneEmail.vue';
import AppearanceSettings from './settings/AppearanceSettings.vue';
import NotificationsSettings from './settings/NotificationsSettings.vue';
import PrivacySettings from './settings/PrivacySettings.vue';

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
  return 'account';
});

const tab = computed(() => (route.query.tab as string) || 'personal');
const mode = computed(() => (route.query.mode as string) || 'preview');

const subNavItems = [
  { key: 'account', icon: UserRound, label: 'Account' },
  {
    key: 'notifications',
    icon: Bell,
    label: 'Notifications',
  },
  {
    key: 'appearance',
    icon: Palette,
    label: 'Appearance & language',
  },
  {
    key: 'privacy',
    icon: Shield,
    label: 'Privacy & data',
  },
];

const accountTabs = [
  { key: 'personal', label: 'Personal info' },
  { key: 'phone-email', label: 'Phone & email' },
  { key: 'languages', label: 'Languages' },
];

function navigateToSection(key: string) {
  const base = '/professional/settings';
  if (key === 'account') {
    router.push(`${base}?tab=${tab.value}`);
  } else if (key === 'notifications') {
    router.push(`${base}/notifications`);
  } else if (key === 'appearance') {
    router.push(`${base}/appearance`);
  } else if (key === 'privacy') {
    router.push(`${base}/privacy`);
  }
}

function switchAccountTab(key: string) {
  const base = '/professional/settings';
  router.push(`${base}?tab=${key}`);
}

function breadcrumbItems() {
  const items = ['Workspace', 'Settings'];
  if (section.value === 'account') {
    items.push('Account');
  }
  if (section.value === 'notifications') {
    items.push('Notifications');
  }
  if (section.value === 'appearance') {
    items.push('Appearance & language');
  }
  if (section.value === 'privacy') {
    items.push('Privacy & data');
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
    </nav>

    <!-- Content -->
    <div class="settings-content">
      <BreadcrumbBar :items="breadcrumbItems()" />

      <div
        v-if="section === 'account'"
        class="page-header"
      >
        <h1 class="page-title">Account</h1>
        <p class="page-subtitle">Manage your account and preferences</p>
      </div>

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
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  display: flex;
  height: 100%;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 4px;
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

.sub-nav {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 4px;
  width: 240px;
  padding: 24px 16px;
  background: var(--card);
  border-right: 1px solid var(--border-soft);
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
  color: var(--muted-icon);
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
  color: var(--primary-foreground);
  background: var(--primary);
}

.nav-item-danger,
.nav-item-danger:hover {
  color: var(--destructive);
}

.nav-item-danger.active {
  color: var(--primary-foreground);
  background: var(--destructive);
}

.account-tabs {
  display: flex;
  gap: 4px;
  max-width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  border-bottom: 1px solid var(--border-soft);
}

.tab-btn {
  display: flex;
  flex-shrink: 0;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted-icon);
  cursor: pointer;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: var(--foreground);
}

.tab-btn.active {
  font-weight: 600;
  color: var(--primary);
  border-bottom-color: var(--primary);
}

@media (max-width: 860px) {
  .settings-page {
    flex-direction: column;
  }

  .sub-nav {
    flex-direction: row;
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    border-right: none;
    border-bottom: 1px solid var(--border-soft);
    padding: 10px 14px;
    gap: 6px;
  }

  .nav-item {
    width: auto;
    flex-shrink: 0;
    padding: 7px 12px;
    font-size: 12px;
  }

  .settings-content {
    padding: 16px 12px;
  }
}
</style>
