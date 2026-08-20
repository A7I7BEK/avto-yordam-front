/**
 * Types for the redesigned notification module
 * (backend `autoflow` — see `design/NOTIFICATION_MODULE.md`).
 */

export type NotificationChannel =
  | 'SMS'
  | 'EMAIL'
  | 'TELEGRAM'
  | 'PUSH'
  | 'IN_APP';

export type NotificationEvent =
  | 'ORDER_CREATED'
  | 'ORDER_ACCEPTED'
  | 'ORDER_REJECTED'
  | 'ORDER_CANCELLED'
  | 'ORDER_COMPLETED'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED';

export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED';

/** Per-user, per-event channel preference. */
export interface UserPreferenceResponse {
  id?: string;
  userId?: string;
  eventType: NotificationEvent;
  channel: NotificationChannel;
  enabled: boolean;
}

export interface UserPreferenceRequest {
  eventType: NotificationEvent;
  channel: NotificationChannel;
  enabled: boolean;
}

/** Organization-level channel availability. */
export interface OrganizationChannelResponse {
  id?: string;
  organizationId?: string;
  channel: NotificationChannel;
  enabled: boolean;
}

export interface OrganizationChannelRequest {
  channel: NotificationChannel;
  enabled: boolean;
}

/** A single notification history record (GET /api/notifications → NotificationResponse). */
export interface NotificationRecordResponse {
  id?: string;
  organizationId?: string;
  userId?: string;
  eventType?: NotificationEvent;
  channel?: NotificationChannel;
  /** Localized title, resolved by the current user language. */
  title?: string;
  /** Localized message, resolved by the current user language. */
  message?: string;
  /** Legacy free-form type tag, kept for backward compatibility. */
  type?: string;
  /** Whether the recipient has read this in-app notification. */
  isRead?: boolean;
  status?: NotificationStatus;
  providerResponse?: string;
  errorMessage?: string;
  createdAt?: string;
  sentAt?: string;
  retryCount?: number;
}

export interface NotificationHistoryFilter {
  status?: NotificationStatus;
  eventType?: NotificationEvent;
  channel?: NotificationChannel;
  userId?: string;
  organizationId?: string;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}
