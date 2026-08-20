import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import type {
  NotificationHistoryFilter,
  NotificationRecordResponse,
  OrganizationChannelRequest,
  OrganizationChannelResponse,
  UserPreferenceRequest,
  UserPreferenceResponse,
} from '@/types/notification';

const PREFERENCES_BASE = '/notification/preferences';
const ORG_CHANNELS_BASE = '/notification/organizations/channels';

/* ───── User preferences ───── */

export async function getNotificationPreferences(): Promise<
  UserPreferenceResponse[]
> {
  if (isMockMode()) {
    return [];
  }
  try {
    return await apiClient.get(PREFERENCES_BASE);
  } catch {
    return [];
  }
}

export async function updateNotificationPreference(
  request: UserPreferenceRequest,
): Promise<UserPreferenceResponse | null> {
  if (isMockMode()) {
    return null;
  }
  try {
    return await apiClient.put(PREFERENCES_BASE, request);
  } catch {
    return null;
  }
}

export async function updateNotificationPreferencesBulk(
  preferences: UserPreferenceRequest[],
): Promise<UserPreferenceResponse[]> {
  if (isMockMode()) {
    return [];
  }
  try {
    return await apiClient.put(`${PREFERENCES_BASE}/bulk`, { preferences });
  } catch {
    return [];
  }
}

export async function enableAllNotificationPreferences(): Promise<void> {
  if (isMockMode()) {
    return;
  }
  await apiClient.post(`${PREFERENCES_BASE}/enable-all`);
}

export async function disableAllNotificationPreferences(): Promise<void> {
  if (isMockMode()) {
    return;
  }
  await apiClient.post(`${PREFERENCES_BASE}/disable-all`);
}

/* ───── Organization channels ───── */

export async function getOrganizationNotificationChannels(): Promise<
  OrganizationChannelResponse[]
> {
  if (isMockMode()) {
    return [];
  }
  try {
    return await apiClient.get(ORG_CHANNELS_BASE);
  } catch {
    return [];
  }
}

export async function updateOrganizationNotificationChannel(
  request: OrganizationChannelRequest,
): Promise<OrganizationChannelResponse | null> {
  if (isMockMode()) {
    return null;
  }
  try {
    return await apiClient.put(ORG_CHANNELS_BASE, request);
  } catch {
    return null;
  }
}

export async function updateOrganizationNotificationChannelsBulk(
  channels: OrganizationChannelRequest[],
): Promise<OrganizationChannelResponse[]> {
  if (isMockMode()) {
    return [];
  }
  try {
    return await apiClient.put(`${ORG_CHANNELS_BASE}/bulk`, { channels });
  } catch {
    return [];
  }
}

/* ───── Notification history ───── */

export async function getNotificationHistory(
  filter: NotificationHistoryFilter = {},
): Promise<NotificationRecordResponse[]> {
  if (isMockMode()) {
    return [];
  }
  try {
    const params: Record<string, unknown> = {};
    if (filter.status) {
      params.status = filter.status;
    }
    if (filter.eventType) {
      params.eventType = filter.eventType;
    }
    if (filter.channel) {
      params.channel = filter.channel;
    }
    if (filter.userId) {
      params.userId = filter.userId;
    }
    if (filter.organizationId) {
      params.organizationId = filter.organizationId;
    }
    if (filter.from) {
      params.from = filter.from;
    }
    if (filter.to) {
      params.to = filter.to;
    }
    if (filter.page !== undefined) {
      params.page = filter.page;
    }
    if (filter.size !== undefined) {
      params.size = filter.size;
    }
    const data = await apiClient.get('/notifications', { params });
    return data?.content ?? [];
  } catch {
    return [];
  }
}
