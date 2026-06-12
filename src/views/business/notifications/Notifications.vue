<script
  setup
  lang="ts"
>
import { CheckCheck, Settings, Trash2 } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { getNotifications } from '@/services/notificationsService';

interface Notification {
  id: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
  time: string;
  timeGroup: string;
  category: string;
  unread: boolean;
}

const notifications = ref<Notification[]>([]);
const activeTab = ref('All');

onMounted(async () => {
  notifications.value = await getNotifications();
});

const unreadCount = computed(
  () => notifications.value.filter((n) => n.unread).length,
);

const tabs = computed(() => {
  const categories = [
    'All',
    'Unread',
    ...new Set(notifications.value.map((n) => n.category).filter(Boolean)),
  ];
  return categories;
});

const filteredNotifications = computed(() => {
  if (activeTab.value === 'All') {
    return notifications.value;
  }
  if (activeTab.value === 'Unread') {
    return notifications.value.filter((n) => n.unread);
  }
  return notifications.value.filter((n) => n.category === activeTab.value);
});

const groupedNotifications = computed(() => {
  const groups: Record<string, Notification[]> = {};
  for (const n of filteredNotifications.value) {
    const group = n.timeGroup;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(n);
  }
  return groups;
});

function deleteNotification(id: string) {
  notifications.value = notifications.value.filter((n) => n.id !== id);
}

function markAllAsRead() {
  for (const n of notifications.value) {
    n.unread = false;
  }
}
</script>

<template>
  <div class="notifications-page">
    <!-- Header -->
    <div class="page-header">
      <div class="page-header__left">
        <div class="page-header__title-row">
          <h1 class="page-title">Notifications</h1>
          <span
            v-if="unreadCount > 0"
            class="unread-badge"
            >{{ unreadCount }}
            new</span
          >
        </div>
        <p class="page-subtitle">
          Stay updated with bookings, reviews, and system notifications
        </p>
      </div>
      <div class="page-header__right">
        <button
          type="button"
          class="btn btn--ghost"
          @click="markAllAsRead"
        >
          <CheckCheck :size="16" />
          <span class="btn__text">Mark all as read</span>
        </button>
        <button
          type="button"
          class="btn btn--outline"
        >
          <Settings :size="16" />
          <span class="btn__text">Preferences</span>
        </button>
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="tabs">
      <button
        type="button"
        v-for="tab in tabs"
        :key="tab"
        class="tab"
        :class="{ 'tab--active': activeTab === tab }"
        @click="activeTab = tab"
      >
        <span>{{ tab }}</span>
        <span
          v-if="tab === 'Unread'"
          class="tab__count"
          >{{ unreadCount }}</span
        >
      </button>
    </div>

    <!-- Notifications List -->
    <div class="notifications-list">
      <div
        v-for="(group, groupName) in groupedNotifications"
        :key="groupName"
        class="group"
      >
        <h3 class="group__title">{{ groupName }}</h3>
        <div class="group__items">
          <div
            v-for="item in group"
            :key="item.id"
            class="notification-item"
            :class="{ 'notification-item--unread': item.unread }"
          >
            <!-- Unread Indicator -->
            <div
              v-if="item.unread"
              class="notification-item__indicator"
            />

            <div
              class="notification-item__icon"
              :style="{ background: item.iconBg }"
            >
              <svg
                v-if="item.icon === 'calendar'"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :color="item.iconColor"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="2"
                  ry="2"
                />
                <line
                  x1="16"
                  y1="2"
                  x2="16"
                  y2="6"
                />
                <line
                  x1="8"
                  y1="2"
                  x2="8"
                  y2="6"
                />
                <line
                  x1="3"
                  y1="10"
                  x2="21"
                  y2="10"
                />
              </svg>
              <svg
                v-else-if="item.icon === 'star'"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :color="item.iconColor"
              >
                <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                />
              </svg>
              <svg
                v-else-if="item.icon === 'arrow-down-left'"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :color="item.iconColor"
              >
                <polyline points="17 7 7 17" />
                <polyline points="17 17 7 17 7 7" />
              </svg>
              <svg
                v-else-if="item.icon === 'user-round'"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :color="item.iconColor"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="5"
                />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
              <svg
                v-else
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :color="item.iconColor"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>

            <div class="notification-item__content">
              <span class="notification-item__title">{{ item.title }}</span>
              <span class="notification-item__desc">{{ item.desc }}</span>
            </div>

            <div class="notification-item__right">
              <span class="notification-item__time">{{ item.time }}</span>
              <button
                type="button"
                class="notification-item__delete"
                title="Delete"
                @click="deleteNotification(item.id)"
              >
                <Trash2
                  :size="14"
                  color="#939399"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="Object.keys(groupedNotifications).length === 0"
        class="empty-state"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#939399"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 4 9 4 9H2s4-2 4-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <h3>All caught up!</h3>
        <p>No notifications to show for this category.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notifications-page {
  padding: 24px 32px;
  font-family: var(--font-primary);
  color: var(--foreground);
}

/* Page Header */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-header__left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-header__title-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--foreground);
}

.unread-badge {
  display: inline-block;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  background: var(--primary);
  border-radius: var(--radius-pill);
}

.page-subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--muted-foreground);
}

.page-header__right {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* Buttons */
.btn {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 8px 16px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-md);
  transition: opacity 0.15s;
}

.btn--outline {
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
}

.btn--ghost {
  padding: 8px 12px;
  color: var(--primary);
  background: transparent;
}

.btn__text {
  font-family: inherit;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 4px;
  padding-bottom: 0;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.tab {
  position: relative;
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 10px 16px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted-foreground);
  cursor: pointer;
  background: transparent;
  border: none;
  transition: color 0.15s;
}

.tab--active {
  color: var(--primary);
}

.tab--active::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  content: "";
  background: var(--primary);
  border-radius: 1px 1px 0 0;
}

.tab__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-foreground);
  background: var(--accent);
  border-radius: var(--radius-pill);
}

.tab--active .tab__count {
  color: var(--primary);
  background: #eae8fd;
}

/* Notifications List */
.notifications-list {
  max-width: 720px;
}

.group {
  margin-bottom: 24px;
}

.group__title {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.group__items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Notification Item */
.notification-item {
  position: relative;
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 16px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: background 0.15s;
}

.notification-item:hover {
  background: var(--accent);
}

.notification-item--unread {
  background: #faf9ff;
  border-left: 3px solid var(--primary);
}

.notification-item--unread:hover {
  background: #f0eeff;
}

.notification-item__indicator {
  display: none;
}

.notification-item__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.notification-item__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.notification-item__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.notification-item__desc {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  color: var(--muted-foreground);
  white-space: nowrap;
}

.notification-item__right {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
}

.notification-item__time {
  font-size: 11px;
  color: var(--muted-icon);
  white-space: nowrap;
}

.notification-item__delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  opacity: 0;
  transition:
    opacity 0.15s,
    background 0.15s;
}

.notification-item:hover .notification-item__delete {
  opacity: 1;
}

.notification-item__delete:hover {
  background: #fee8e3;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  padding: 48px 0;
  text-align: center;
}

.empty-state h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
}

.empty-state p {
  margin: 0;
  font-size: 13px;
  color: var(--muted-foreground);
}
</style>
