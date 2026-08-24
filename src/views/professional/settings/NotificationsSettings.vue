<script
  setup
  lang="ts"
>
import { Check, LoaderCircle } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import {
  getNotificationPreferences,
  updateNotificationPreferencesBulk,
} from '@/services/notificationSettingsService';
import type {
  NotificationChannel,
  NotificationEvent as NotificationEventType,
  UserPreferenceResponse,
} from '@/types/notification';

interface ChannelKey {
  key: 'inApp' | 'sms' | 'telegram' | 'email';
  channel: NotificationChannel;
}

interface EventRow {
  eventType: NotificationEventType;
  label: string;
  description: string;
  channels: Record<ChannelKey['key'], boolean>;
}

const EVENT_DEFS: Omit<EventRow, 'channels'>[] = [
  {
    eventType: 'ORDER_CREATED',
    label: 'New order received',
    description: 'A customer placed a new booking request',
  },
  {
    eventType: 'ORDER_ACCEPTED',
    label: 'Order confirmed',
    description: 'You or your team accepted a pending order',
  },
  {
    eventType: 'ORDER_REJECTED',
    label: 'Order rejected',
    description: 'You or your team declined a pending order',
  },
  {
    eventType: 'ORDER_CANCELLED',
    label: 'Order cancelled',
    description: 'A previously confirmed order was cancelled',
  },
  {
    eventType: 'ORDER_COMPLETED',
    label: 'Order completed',
    description: 'A job was finished and handed back to the customer',
  },
  {
    eventType: 'PAYMENT_SUCCESS',
    label: 'Payment received',
    description: 'Funds have been credited for a completed job',
  },
  {
    eventType: 'PAYMENT_FAILED',
    label: 'Payment failed',
    description: 'A payment attempt did not go through',
  },
];

const CHANNEL_DEFS: ChannelKey[] = [
  { key: 'inApp', channel: 'IN_APP' },
  { key: 'sms', channel: 'SMS' },
  { key: 'telegram', channel: 'TELEGRAM' },
  { key: 'email', channel: 'EMAIL' },
];

const events = ref<EventRow[]>([]);
const saving = ref(false);
const saved = ref(false);

const saveLabel = computed(() => {
  if (saving.value) {
    return 'Saving...';
  }
  return saved.value ? 'Saved' : 'Save changes';
});

function defaultEnabled(key: ChannelKey['key']): boolean {
  if (key === 'inApp' || key === 'email') {
    return true;
  }
  return false;
}

function buildEvents(preferences: UserPreferenceResponse[]) {
  const enabledMap = new Map<string, boolean>();
  for (const pref of preferences) {
    enabledMap.set(`${pref.eventType}:${pref.channel}`, pref.enabled);
  }

  events.value = EVENT_DEFS.map((def) => {
    const channels = {} as Record<ChannelKey['key'], boolean>;
    for (const ch of CHANNEL_DEFS) {
      const value = enabledMap.get(`${def.eventType}:${ch.channel}`);
      channels[ch.key] = value ?? defaultEnabled(ch.key);
    }
    return { ...def, channels };
  });
}

onMounted(async () => {
  const preferences = await getNotificationPreferences();
  if (preferences && preferences.length > 0) {
    buildEvents(preferences);
  } else {
    buildEvents([]);
  }
});

function toggleChannel(eventIdx: number, channel: ChannelKey['key']) {
  const evt = events.value[eventIdx];
  if (evt) {
    evt.channels[channel] = !evt.channels[channel];
    saved.value = false;
  }
}

async function saveChanges() {
  if (saving.value) {
    return;
  }
  saving.value = true;
  try {
    const preferences = events.value.flatMap((evt) =>
      CHANNEL_DEFS.map((ch) => ({
        eventType: evt.eventType,
        channel: ch.channel,
        enabled: evt.channels[ch.key],
      })),
    );
    await updateNotificationPreferencesBulk(preferences);
    saved.value = true;
  } catch {
    saved.value = false;
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="notif-page">
    <div class="page-header">
      <div class="header-row">
        <div class="header-text">
          <h2 class="page-title">Notifications</h2>
          <p class="page-subtitle">
            Pick how you'd like to be reached for each event.
          </p>
        </div>
        <button
          type="button"
          class="btn-save"
          :disabled="saving"
          @click="saveChanges"
        >
          <LoaderCircle
            v-if="saving"
            :size="14"
            class="spin"
          />
          <Check
            v-else
            :size="14"
          />
          {{ saveLabel }}
        </button>
      </div>
    </div>

    <!-- Matrix Table -->
    <div class="matrix-card">
      <!-- Column Headers -->
      <div class="matrix-header">
        <span class="col-event">Event</span>
        <div class="channel-headers">
          <span class="col-channel">In-app</span>
          <span class="col-channel">SMS</span>
          <span class="col-channel">Telegram</span>
          <span class="col-channel">Email</span>
        </div>
      </div>

      <!-- Rows -->
      <div
        v-for="(evt, idx) in events"
        :key="evt.eventType"
        class="matrix-row"
      >
        <div class="col-event">
          <span class="evt-name">{{ evt.label }}</span>
          <span class="evt-desc">{{ evt.description }}</span>
        </div>
        <div class="channel-cells">
          <button
            v-for="channel in ['inApp', 'sms', 'telegram', 'email'] as const"
            :key="channel"
            class="cell-checkbox"
            :class="{ checked: evt.channels[channel] }"
            type="button"
            @click="toggleChannel(idx, channel)"
          >
            <Check
              v-if="evt.channels[channel]"
              :size="10"
              color="#FFFFFF"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notif-page {
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

.page-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--muted-foreground);
}

.matrix-card {
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 16px;
}

.matrix-header {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  background: var(--muted);
  border-bottom: 1px solid var(--border-soft);
}

.channel-headers {
  display: flex;
  flex-shrink: 0;
  width: 336px;
}

.col-channel {
  width: 84px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-foreground);
  text-align: center;
}

.col-event {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
}

.matrix-row {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border-soft);
}

.matrix-row:last-child {
  border-bottom: none;
}

.evt-name {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
}

.evt-desc {
  font-family: Inter, sans-serif;
  font-size: 11px;
  color: var(--muted-foreground);
}

.channel-cells {
  display: flex;
  flex-shrink: 0;
  width: 336px;
}

.cell-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  margin: 0 auto;
  cursor: pointer;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 4px;
}

.cell-checkbox.checked {
  background: var(--primary);
  border-color: var(--primary);
}

/* ===== Header + save button ===== */
.header-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.btn-save {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
  padding: 10px 18px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-foreground);
  cursor: pointer;
  background: var(--primary);
  border: none;
  border-radius: 999px;
  transition: opacity 0.15s;
}

.btn-save:disabled {
  cursor: default;
  opacity: 0.6;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
