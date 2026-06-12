<script
  setup
  lang="ts"
>
import { Check } from 'lucide-vue-next';
import { ref } from 'vue';

interface NotificationEvent {
  event: string;
  description: string;
  channels: {
    inApp: boolean;
    sms: boolean;
    telegram: boolean;
    email: boolean;
  };
}

const events = ref<NotificationEvent[]>([
  {
    event: 'New order received',
    description: 'A customer placed a new booking request',
    channels: { inApp: true, sms: true, telegram: false, email: true },
  },
  {
    event: 'Order confirmed',
    description: 'You or your team accepted a pending order',
    channels: { inApp: true, sms: false, telegram: false, email: true },
  },
  {
    event: 'Order cancelled',
    description: 'A previously confirmed order was cancelled',
    channels: { inApp: true, sms: true, telegram: true, email: true },
  },
  {
    event: 'Payment received',
    description: 'Funds have been credited for a completed job',
    channels: { inApp: true, sms: true, telegram: false, email: true },
  },
  {
    event: 'New review',
    description: 'A customer left a rating and feedback',
    channels: { inApp: true, sms: false, telegram: true, email: true },
  },
  {
    event: 'Invitation received',
    description: 'An organization invited you to join their team',
    channels: { inApp: true, sms: true, telegram: true, email: true },
  },
  {
    event: 'System updates',
    description: 'Platform announcements and maintenance notices',
    channels: { inApp: true, sms: false, telegram: false, email: false },
  },
]);

function toggleChannel(
  eventIdx: number,
  channel: keyof NotificationEvent['channels'],
) {
  const evt = events.value[eventIdx];
  if (evt) {
    evt.channels[channel] = !evt.channels[channel];
  }
}
</script>

<template>
  <div class="notif-page">
    <div class="page-header">
      <h2 class="page-title">Notifications</h2>
      <p class="page-subtitle">
        Pick how you'd like to be reached for each event.
      </p>
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
        :key="evt.event"
        class="matrix-row"
      >
        <div class="col-event">
          <span class="evt-name">{{ evt.event }}</span>
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

    <!-- Footer -->
    <div class="footer-actions">
      <button
        class="btn btn-reset"
        type="button"
      >
        Reset to defaults
      </button>
      <button
        class="btn btn-save"
        type="button"
      >
        Save changes
      </button>
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
  color: #2a2933;
}

.page-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
}

.matrix-card {
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 16px;
}

.matrix-header {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  background: #f5f5f5;
  border-bottom: 1px solid #c5c5cb;
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
  color: #616167;
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
  border-bottom: 1px solid #c5c5cb;
}

.matrix-row:last-child {
  border-bottom: none;
}

.evt-name {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #2a2933;
}

.evt-desc {
  font-family: Inter, sans-serif;
  font-size: 11px;
  color: #616167;
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
  width: 84px;
  height: 28px;
  cursor: pointer;
  background: transparent;
  border: none;
}

.cell-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 4px;
}

.cell-checkbox.checked {
  background: #5749f4;
  border-color: #5749f4;
}

.footer-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 999px;
}

.btn-reset {
  color: #2a2933;
  background: transparent;
  border: 1px solid #c5c5cb;
}

.btn-save {
  color: #ffffff;
  background: #5749f4;
}
</style>
