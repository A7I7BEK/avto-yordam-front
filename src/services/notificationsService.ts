import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import { notifications as rawNotifications } from '@/data/notifications';
import type { NotificationResponse } from '@/types/user';

const TYPE_SPLIT_REGEX = /[_\s]+/;

export interface AppNotification {
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

function humanizeType(type?: string): string {
  if (!type) {
    return 'Notification';
  }
  return type
    .toLowerCase()
    .split(TYPE_SPLIT_REGEX)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function iconForType(type?: string) {
  const t = (type ?? '').toUpperCase();
  if (t.includes('BOOK')) {
    return {
      icon: 'calendar',
      iconBg: 'var(--color-warning)',
      iconColor: 'var(--warning)',
    };
  }
  if (t.includes('REVIEW') || t.includes('RATING')) {
    return {
      icon: 'star',
      iconBg: 'var(--color-info)',
      iconColor: 'var(--primary)',
    };
  }
  if (t.includes('PAY')) {
    return {
      icon: 'arrow-down-left',
      iconBg: 'var(--success-bg)',
      iconColor: 'var(--success)',
    };
  }
  if (t.includes('INVIT')) {
    return {
      icon: 'user-round',
      iconBg: 'var(--primary-tint)',
      iconColor: 'var(--primary)',
    };
  }
  return {
    icon: 'bell',
    iconBg: 'var(--muted)',
    iconColor: 'var(--muted-foreground)',
  };
}

function formatTime(iso?: string): string {
  if (!iso) {
    return 'Just now';
  }
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 1) {
    return 'Just now';
  }
  if (mins < 60) {
    return `${mins} min ago`;
  }
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

function timeGroupFor(iso?: string): string {
  if (!iso) {
    return 'Today';
  }
  const time = new Date(iso).getTime();
  const now = new Date();
  const startToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  if (time >= startToday) {
    return 'Today';
  }
  if (time >= startToday - 86_400_000) {
    return 'Yesterday';
  }
  return 'Earlier';
}

function mapNotification(n: NotificationResponse): AppNotification {
  const visual = iconForType(n.type);
  const category = humanizeType(n.type);
  return {
    id: n.id ?? '',
    icon: visual.icon,
    iconBg: visual.iconBg,
    iconColor: visual.iconColor,
    title: n.title ?? category,
    desc: n.message ?? '',
    time: formatTime(n.createdAt),
    timeGroup: timeGroupFor(n.createdAt),
    category,
    unread: n.isRead === false,
  };
}

export async function getNotifications(): Promise<AppNotification[]> {
  if (isMockMode()) {
    return rawNotifications as AppNotification[];
  }
  try {
    const data = await apiClient.get('/notification/get-by-user');
    return (data ?? []).map(mapNotification);
  } catch {
    return [];
  }
}

export async function getUnreadNotifications(): Promise<AppNotification[]> {
  if (isMockMode()) {
    return (rawNotifications as AppNotification[]).filter((n) => n.unread);
  }
  try {
    const data = await apiClient.get('/notification/unread');
    return (data ?? []).map(mapNotification);
  } catch {
    return [];
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  if (isMockMode()) {
    return;
  }
  await apiClient.put(`/notification/read/${id}`);
}

export async function deleteNotification(id: string): Promise<void> {
  if (isMockMode()) {
    return;
  }
  await apiClient.delete(`/notification/${id}`);
}
