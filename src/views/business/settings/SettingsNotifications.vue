<script
  setup
  lang="ts"
>
import { Bell, Info, Lock, Mail, MessageSquare, Send } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { getSettingsNotifications } from '@/services/settingsService';

interface Channel {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  configurable: boolean;
}

const channels = ref<Channel[]>([]);

onMounted(async () => {
  const data = await getSettingsNotifications();
  if (data) {
    channels.value = [
      {
        id: 'in-app',
        name: 'In-app',
        description: 'Bell menu inside Masters. Not configurable.',
        enabled: true,
        configurable: false,
      },
      {
        id: 'sms',
        name: 'SMS',
        description:
          'Sent to the phone number on file. Telecom fees apply at standard rates.',
        enabled: data.sms?.sms ?? true,
        configurable: true,
      },
      {
        id: 'telegram',
        name: 'Telegram',
        description: 'Members link their Telegram once. Free to use.',
        enabled: false,
        configurable: true,
      },
      {
        id: 'email',
        name: 'Email',
        description: "Sent to the email address on each member's profile.",
        enabled: data.email?.email ?? false,
        configurable: true,
      },
    ];
  }
});

function toggleChannel(id: string) {
  const channel = channels.value.find((c) => c.id === id);
  if (channel?.configurable) {
    channel.enabled = !channel.enabled;
  }
}
</script>

<template>
  <div class="notif-page">
    <!-- Page header -->
    <div class="page-header">
      <h1 class="page-title">Notification policy</h1>
      <p class="page-subtitle">
        Controls which delivery channels are available org-wide. Members cannot
        enable a channel that is disabled here.
      </p>
    </div>

    <!-- Info banner -->
    <div class="info-banner">
      <Info
        :size="16"
        class="info-icon"
      />
      <div class="info-text">
        <span class="info-title">In-app notifications are always on</span>
        <span class="info-desc">
          Every team member always receives in-app notifications in the bell
          menu. The other channels below are opt-in.
        </span>
      </div>
    </div>

    <!-- Channels card -->
    <div class="channels-card">
      <div
        v-for="(channel, index) in channels"
        :key="channel.id"
        class="channel-row"
        :class="{ 'channel-row--last': index === channels.length - 1 }"
      >
        <!-- Left: icon + text -->
        <div class="channel-left">
          <div class="channel-icon">
            <Bell
              v-if="channel.id === 'in-app'"
              :size="18"
            />
            <MessageSquare
              v-else-if="channel.id === 'sms'"
              :size="18"
            />
            <Send
              v-else-if="channel.id === 'telegram'"
              :size="18"
            />
            <Mail
              v-else-if="channel.id === 'email'"
              :size="18"
            />
          </div>
          <div class="channel-text">
            <div class="channel-name-row">
              <span class="channel-name">{{ channel.name }}</span>
              <span
                v-if="channel.id === 'in-app'"
                class="always-on-badge"
                >Always on</span
              >
            </div>
            <span class="channel-desc">{{ channel.description }}</span>
          </div>
        </div>

        <!-- Right: lock or toggle -->
        <div class="channel-right">
          <Lock
            v-if="!channel.configurable"
            :size="14"
            class="lock-icon"
          />
          <button
            v-else
            type="button"
            class="toggle-switch"
            :class="{ 'toggle-switch--on': channel.enabled }"
            :aria-label="`Toggle ${channel.name}`"
            @click="toggleChannel(channel.id)"
          >
            <span class="toggle-knob" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== Page header ===== */
.page-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--foreground);
}

.page-subtitle {
  max-width: 780px;
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Info banner ===== */
.info-banner {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 14px;
  margin-bottom: 16px;
  background: #c9d6f0;
  border: 1px solid #001133;
  border-radius: var(--radius-xl);
}

.info-icon {
  flex-shrink: 0;
  margin-top: 1px;
  color: #001133;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-title {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #001133;
}

.info-desc {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: #001133;
}

/* ===== Channels card ===== */
.channels-card {
  overflow: hidden;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

/* ===== Channel row ===== */
.channel-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid var(--border);
}

.channel-row--last {
  border-bottom: none;
}

.channel-left {
  display: flex;
  gap: 14px;
  align-items: center;
  min-width: 0;
}

.channel-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--foreground);
  background: var(--accent);
  border-radius: var(--radius-sm);
}

.channel-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.channel-name-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.channel-name {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.always-on-badge {
  padding: 2px 8px;
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: #003300;
  white-space: nowrap;
  background: #a1e5a1;
  border-radius: var(--radius-pill);
}

.channel-desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.channel-right {
  display: flex;
  flex-shrink: 0;
  align-items: center;
}

.lock-icon {
  color: var(--muted-foreground);
}

/* ===== Toggle switch ===== */
.toggle-switch {
  display: flex;
  align-items: center;
  width: 40px;
  height: 22px;
  padding: 3px;
  cursor: pointer;
  background: var(--border-soft);
  border: none;
  border-radius: var(--radius-pill);
  transition: background 0.2s ease;
}

.toggle-switch--on {
  justify-content: flex-end;
  background: var(--primary);
}

.toggle-knob {
  display: block;
  width: 16px;
  height: 16px;
  background: var(--background);
  border-radius: var(--radius-pill);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}
</style>
