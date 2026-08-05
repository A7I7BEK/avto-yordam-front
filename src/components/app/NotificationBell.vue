<script
  setup
  lang="ts"
>
import {
  ArrowDownLeft,
  Bell,
  CalendarDays,
  CheckCheck,
  Star,
  Trash2,
  UserRound,
} from '@lucide/vue';
import {
  type Component,
  computed,
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  type AppNotification,
  deleteNotification,
  getNotifications,
  markNotificationRead,
} from '@/services/notificationsService';
import { useProfessionalAppStore } from '@/stores/professionalApp';

const store = useProfessionalAppStore();
const route = useRoute();
const router = useRouter();

const open = ref(false);
const loading = ref(false);
const notifications = ref<AppNotification[]>([]);
const dropdownStyle = ref<{ top: string; right: string }>({
  top: '0px',
  right: '0px',
});

const bellWrapRef = ref<HTMLElement | null>(null);
const bellRef = ref<HTMLButtonElement | null>(null);

const iconMap: Record<string, Component> = {
  calendar: CalendarDays,
  star: Star,
  'arrow-down-left': ArrowDownLeft,
  'user-round': UserRound,
};

const unreadCount = computed(
  () => notifications.value.filter((n) => n.unread).length,
);
const badgeCount = computed(
  () => unreadCount.value || store.notificationCount,
);

async function loadNotifications() {
  loading.value = true;
  try {
    notifications.value = await getNotifications();
  } finally {
    loading.value = false;
  }
}

async function toggleDropdown() {
  open.value = !open.value;
  if (open.value) {
    const rect = bellRef.value?.getBoundingClientRect();
    if (rect) {
      dropdownStyle.value = {
        top: `${rect.bottom + 8}px`,
        right: `${window.innerWidth - rect.right}px`,
      };
    }
    await loadNotifications();
  }
}

function closeDropdown() {
  open.value = false;
}

async function handleItemClick(n: AppNotification) {
  if (n.unread && n.id) {
    try {
      await markNotificationRead(n.id);
    } catch {
      // Global error toast surfaces the failure
    }
    n.unread = false;
  }
}

async function removeNotification(n: AppNotification) {
  if (!n.id) {
    return;
  }
  try {
    await deleteNotification(n.id);
    notifications.value = notifications.value.filter((x) => x.id !== n.id);
  } catch {
    // Global error toast surfaces the failure
  }
}

async function markAllRead() {
  const unread = notifications.value.filter((n) => n.unread && n.id);
  try {
    await Promise.all(unread.map((n) => markNotificationRead(n.id)));
  } catch {
    // Global error toast surfaces the failure
  }
  for (const n of notifications.value) {
    n.unread = false;
  }
}

function goToAll() {
  closeDropdown();
  const target = route.path.startsWith('/business')
    ? '/business/notifications'
    : '/professional/settings/notifications';
  router.push(target);
}

function onDocumentClick(e: MouseEvent) {
  if (bellWrapRef.value?.contains(e.target as Node)) {
    return;
  }
  closeDropdown();
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeDropdown();
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick);
  document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <div
    ref="bellWrapRef"
    class="bell-wrap"
  >
    <button
      ref="bellRef"
      type="button"
      class="bell-container"
      aria-label="Notifications"
      :aria-expanded="open"
      @click="toggleDropdown"
    >
      <Bell
        :size="16"
        color="#2A2933"
      />
      <span
        v-if="badgeCount > 0"
        class="badge"
      >
        {{ badgeCount }}
      </span>
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        class="bell-dropdown"
        :style="dropdownStyle"
        @click.stop
      >
        <div class="bell-dropdown__header">
          <span class="bell-dropdown__title">Notifications</span>
          <button
            type="button"
            class="bell-dropdown__mark-all"
            :disabled="unreadCount === 0"
            @click="markAllRead"
          >
            <CheckCheck :size="14" />
            <span>Mark all read</span>
          </button>
        </div>

        <div
          v-if="loading"
          class="bell-dropdown__state"
        >
          Loading…
        </div>
        <div
          v-else-if="notifications.length === 0"
          class="bell-dropdown__state"
        >
          No notifications
        </div>

        <div
          v-else
          class="bell-dropdown__list"
        >
          <button
            v-for="n in notifications"
            :key="n.id"
            type="button"
            class="bell-notif"
            :class="{ 'bell-notif--unread': n.unread }"
            @click="handleItemClick(n)"
          >
            <span
              class="bell-notif__icon"
              :style="{ background: n.iconBg }"
            >
              <component
                :is="iconMap[n.icon] ?? Bell"
                :size="13"
                :color="n.iconColor"
              />
            </span>
            <span class="bell-notif__body">
              <span class="bell-notif__title">{{ n.title }}</span>
              <span class="bell-notif__desc">{{ n.desc }}</span>
              <span class="bell-notif__time">{{ n.time }}</span>
            </span>
            <span
              class="bell-notif__delete"
              role="button"
              tabindex="0"
              :aria-label="'Delete notification'"
              @click.stop="removeNotification(n)"
              @keydown.enter="removeNotification(n)"
            >
              <Trash2 :size="13" />
            </span>
          </button>
        </div>

        <div class="bell-dropdown__footer">
          <button
            type="button"
            class="bell-dropdown__all"
            @click="goToAll"
          >
            View all notifications
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.bell-wrap {
  position: relative;
}

.bell-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  cursor: pointer;
  background: #f5f5f5;
  border: none;
  border-radius: 999px;
}

.badge {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
  font-family: Inter, sans-serif;
  font-size: 9px;
  font-weight: 700;
  color: #ffffff;
  background: #cc3314;
  border-radius: 999px;
}

.bell-dropdown {
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 320px;
  max-height: 420px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e5e5ea;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.bell-dropdown__header {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid #f0f0f3;
}

.bell-dropdown__title {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #2a2933;
}

.bell-dropdown__mark-all,
.bell-dropdown__all {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #5749f4;
  cursor: pointer;
  background: transparent;
  border: none;
}

.bell-dropdown__mark-all:disabled {
  cursor: default;
  opacity: 0.4;
}

.bell-dropdown__list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.bell-notif {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 10px 14px;
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: none;
  border-bottom: 1px solid #f0f0f3;
}

.bell-notif:hover {
  background: #fafafa;
}

.bell-notif--unread {
  background: #f7f6ff;
}

.bell-notif__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.bell-notif__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.bell-notif__title {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #2a2933;
}

.bell-notif__desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  line-height: 1.4;
  color: #616167;
  word-break: break-word;
}

.bell-notif__time {
  font-family: Inter, sans-serif;
  font-size: 11px;
  color: #939399;
}

.bell-notif__delete {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 4px;
  color: #939399;
  cursor: pointer;
  border-radius: 6px;
}

.bell-notif__delete:hover {
  color: #cc3314;
  background: #fde8e8;
}

.bell-dropdown__state {
  padding: 30px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #939399;
  text-align: center;
}

.bell-dropdown__footer {
  padding: 10px 14px;
  text-align: center;
  border-top: 1px solid #f0f0f3;
}
</style>
