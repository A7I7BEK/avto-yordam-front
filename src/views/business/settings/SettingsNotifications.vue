<script
  setup
  lang="ts"
>
import { onMounted, ref } from 'vue';
import { getSettingsNotifications } from '@/services/settingsService';

interface ChannelSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
}

interface NotificationData {
  [category: string]: ChannelSettings;
}

const categoryLabels: Record<string, string> = {
  bookings: 'Bookings',
  reviews: 'Reviews',
  payments: 'Payments',
  reminders: 'Reminders',
  marketing: 'Marketing',
};

const preferences = ref<NotificationData>({});

onMounted(async () => {
  const data = await getSettingsNotifications();
  if (data) {
    preferences.value = {
      bookings: { ...data.bookings },
      reviews: { ...data.reviews },
      payments: { ...data.payments },
      reminders: { ...data.reminders },
      marketing: { ...data.marketing },
    };
  }
});

function toggle(category: string, channel: 'push' | 'email' | 'sms') {
  if (preferences.value[category]) {
    preferences.value[category][channel] =
      !preferences.value[category][channel];
  }
}
</script>

<template>
  <div class="settings-page">
    <div class="header-row">
      <h1 class="page-title">Notification preferences</h1>
    </div>

    <div class="prefs-card">
      <!-- Header row -->
      <div class="prefs-header">
        <span class="prefs-header__label">Category</span>
        <div class="prefs-header__channels">
          <span class="channel-label">Push</span>
          <span class="channel-label">Email</span>
          <span class="channel-label">SMS</span>
        </div>
      </div>

      <!-- Rows -->
      <div
        v-for="(settings, category) in preferences"
        :key="category"
        class="prefs-row"
      >
        <span class="prefs-row__name"
          >{{ categoryLabels[category] || category }}</span
        >
        <div class="prefs-row__toggles">
          <label class="toggle-switch">
            <input
              type="checkbox"
              :checked="settings.push"
              @change="toggle(category, 'push')"
            >
            <span class="toggle-slider" />
          </label>
          <label class="toggle-switch">
            <input
              type="checkbox"
              :checked="settings.email"
              @change="toggle(category, 'email')"
            >
            <span class="toggle-slider" />
          </label>
          <label class="toggle-switch">
            <input
              type="checkbox"
              :checked="settings.sms"
              @change="toggle(category, 'sms')"
            >
            <span class="toggle-slider" />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  max-width: 600px;
  padding: 24px 32px;
}

.header-row {
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #2a2933;
}

.prefs-card {
  overflow: hidden;
  border: 1px solid #d9d9db;
  border-radius: 10px;
}

.prefs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #fafafa;
  border-bottom: 1px solid #d9d9db;
}

.prefs-header__label {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #939399;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.prefs-header__channels {
  display: flex;
  gap: 48px;
}

.channel-label {
  width: 40px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #939399;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.prefs-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.prefs-row:last-child {
  border-bottom: none;
}

.prefs-row__name {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #2a2933;
}

.prefs-row__toggles {
  display: flex;
  gap: 40px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  cursor: pointer;
}

.toggle-switch input {
  width: 0;
  height: 0;
  opacity: 0;
}

.toggle-slider {
  position: absolute;
  inset: 0;
  background: #d9d9db;
  border-radius: 22px;
  transition: background 0.2s;
}

.toggle-slider::before {
  position: absolute;
  bottom: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  content: "";
  background: #ffffff;
  border-radius: 50%;
  transition: transform 0.2s;
}

.toggle-switch input:checked + .toggle-slider {
  background: #5749f4;
}

.toggle-switch input:checked + .toggle-slider::before {
  transform: translateX(18px);
}
</style>
