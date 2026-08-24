<script
  setup
  lang="ts"
>
import { Download, Shield, TriangleAlert } from '@lucide/vue';
import { ref } from 'vue';
import ToggleSwitch from '@/components/app/ToggleSwitch.vue';

const toggles = ref([
  {
    id: 'search',
    label: 'Show me in Drivers app search',
    desc: 'Drivers can find you as an individual master in the customer app.',
    value: true,
  },
  {
    id: 'rating',
    label: 'Share rating publicly',
    desc: 'Display your average rating on your public profile.',
    value: true,
  },
  {
    id: 'analytics',
    label: 'Allow Masters to use my data for product analytics',
    desc: 'Aggregated usage signals only. Never shared with third parties.',
    value: false,
  },
  {
    id: 'contact',
    label: 'Share my contact info with confirmed customers',
    desc: 'After an order is confirmed, customers can call your direct phone.',
    value: true,
  },
]);

const exportMessage = ref('');

function requestExport() {
  exportMessage.value =
    'Export requested. You will receive an email within 24 hours.';
}
</script>

<template>
  <div class="privacy-page">
    <div class="page-header">
      <h2 class="page-title">Privacy &amp; data</h2>
    </div>

    <!-- Privacy Toggles -->
    <div class="toggles-card">
      <div
        v-for="(item, idx) in toggles"
        :key="item.id"
        class="toggle-row"
        :class="{ 'no-border': idx === toggles.length - 1 }"
      >
        <div class="toggle-info">
          <span class="toggle-label">{{ item.label }}</span>
          <span class="toggle-desc">{{ item.desc }}</span>
        </div>
        <ToggleSwitch v-model="(toggles[idx] as { value: boolean }).value" />
      </div>
    </div>

    <!-- Download My Data -->
    <div class="action-card">
      <div class="action-info">
        <span class="action-title">Download my data</span>
        <span class="action-desc"
          >Export every order, review, invitation and message ever recorded
          under your account. Ready in 24h.</span
        >
      </div>
      <button
        class="action-btn"
        type="button"
        @click="requestExport"
      >
        <Download :size="12" />
        <span>Request export</span>
      </button>
    </div>
    <div
      v-if="exportMessage"
      class="success-message"
    >
      {{ exportMessage }}
    </div>

    <!-- Delete Account -->
    <div class="action-card danger">
      <div class="action-info">
        <div class="danger-title-row">
          <TriangleAlert
            :size="14"
            color="var(--destructive)"
          />
          <span class="action-title danger-text">Delete account</span>
        </div>
        <span class="action-desc"
          >Permanently delete your Employee profile. Organizations you own must
          be deactivated or transferred first.</span
        >
      </div>
      <button
        class="action-btn danger-outline"
        type="button"
      >
        Delete account
      </button>
    </div>
  </div>
</template>

<style scoped>
.privacy-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--foreground);
}

.toggles-card {
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 24px;
}

.toggle-row {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-soft);
}

.toggle-row.no-border {
  border-bottom: none;
}

.toggle-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
}

.toggle-label {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.toggle-desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: var(--muted-foreground);
}

.action-card {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 18px;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 24px;
}

.action-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.action-title {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.action-desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: var(--muted-foreground);
}

.danger-title-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.danger-text {
  color: var(--destructive);
}

.action-btn {
  display: flex;
  flex-shrink: 0;
  gap: 6px;
  align-items: center;
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--foreground);
  cursor: pointer;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
}

.danger-outline {
  color: var(--destructive);
  border-color: var(--destructive);
}

.success-message {
  padding: 12px 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--success);
  text-align: center;
  background: var(--success-bg);
  border: 1px solid var(--success);
  border-radius: 12px;
}
</style>
