<script
  setup
  lang="ts"
>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SettingsProfileEdit from './SettingsProfileEdit.vue';
import SettingsProfileLanguages from './SettingsProfileLanguages.vue';
import SettingsProfilePhoneEmail from './SettingsProfilePhoneEmail.vue';
import SettingsProfilePreview from './SettingsProfilePreview.vue';

const route = useRoute();
const router = useRouter();

const tab = computed(() => (route.query.tab as string) || 'personal');
const mode = computed(() => (route.query.mode as string) || 'preview');

const accountTabs = [
  { key: 'personal', label: 'Personal info' },
  { key: 'phone-email', label: 'Phone & email' },
  { key: 'languages', label: 'Languages' },
];

function switchAccountTab(key: string) {
  router.push({
    path: route.path,
    query: { tab: key },
  });
}
</script>

<template>
  <div class="profile-page">
    <!-- Page header -->
    <div class="page-header">
      <h1 class="page-title">Profile info</h1>
      <p class="page-subtitle">Manage your account and preferences</p>
    </div>

    <!-- Tabs -->
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

    <!-- Tab content -->
    <SettingsProfilePreview v-if="tab === 'personal' && mode === 'preview'" />
    <SettingsProfileEdit v-else-if="tab === 'personal' && mode === 'edit'" />
    <SettingsProfilePhoneEmail v-else-if="tab === 'phone-email'" />
    <SettingsProfileLanguages v-else-if="tab === 'languages'" />
  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
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

.account-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid var(--border-soft);
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  margin-bottom: -1px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted-foreground);
  cursor: pointer;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: var(--foreground);
}

.tab-btn.active {
  font-weight: 600;
  color: var(--primary);
  border-bottom-color: var(--primary);
}

@media (max-width: 640px) {
  .account-tabs {
    gap: 2px;
  }

  .tab-btn {
    flex-shrink: 0;
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style>
