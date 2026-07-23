import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import {
  appearanceSettings,
  bankInfo,
  dangerZoneData,
  legalInfo,
  notificationPreferences,
  operatingHours,
  paymentProviders,
  photos,
} from '@/data/settings';
import type {
  DayOfWeek,
  DaySchedule,
  OrganizationOperatingHoursRequest,
  OrganizationOperatingHoursResponse,
} from '@/types/settings';
import {
  DAY_KEY_TO_DAY_OF_WEEK,
  DAY_OF_WEEK_TO_DAY_KEY,
} from '@/types/settings';

export async function getMyOrgId(): Promise<string | null> {
  try {
    const members = await apiClient.get('/organization-member/get-by-user');
    if (members && members.length > 0) {
      return members[0].organizationId;
    }
  } catch (_) {}
  return null;
}

export async function getSettingsLegal() {
  if (isMockMode()) {
    return legalInfo;
  }

  try {
    const orgId = await getMyOrgId();
    if (!orgId) {
      return legalInfo;
    }

    const org = await apiClient.get(`/organization/${orgId}`);
    return {
      orgType: org.orgType || legalInfo.orgType,
      legalEntityName: org.name || legalInfo.legalEntityName,
      stateRegNumber: org.stateRegNumber || legalInfo.stateRegNumber,
      taxId: org.taxId || legalInfo.taxId,
      vatStatus: org.vatStatus || legalInfo.vatStatus,
      foundingDate: org.foundingDate || legalInfo.foundingDate,
      country: org.country || legalInfo.country,
      region: org.region || legalInfo.region,
      city: org.city || legalInfo.city,
      postalCode: org.postalCode || legalInfo.postalCode,
      street: org.street || legalInfo.street,
      documents: org.documents || legalInfo.documents,
    };
  } catch (_) {
    return legalInfo;
  }
}

const HOURS_BASE = '/organization-operating-hours';

/**
 * Convert a backend response record to the frontend DaySchedule shape.
 */
function responseToDaySchedule(
  resp: OrganizationOperatingHoursResponse,
): DaySchedule {
  return {
    open: resp.openTime ?? '',
    close: resp.closeTime ?? '',
    closed: !resp.isOpen,
  };
}

/**
 * Convert a day key + DaySchedule to a backend request DTO.
 */
function toRequest(
  organizationId: string,
  dayKey: string,
  schedule: DaySchedule,
): OrganizationOperatingHoursRequest {
  return {
    organizationId,
    dayOfWeek: DAY_KEY_TO_DAY_OF_WEEK[dayKey] as DayOfWeek,
    isOpen: !schedule.closed,
    openTime: schedule.closed ? null : schedule.open || null,
    closeTime: schedule.closed ? null : schedule.close || null,
    twentyFourHours: false,
  };
}

export async function getSettingsHours(): Promise<Record<string, DaySchedule>> {
  if (isMockMode()) {
    return operatingHours;
  }

  try {
    const orgId = await getMyOrgId();
    if (!orgId) {
      return operatingHours;
    }

    const records: OrganizationOperatingHoursResponse[] = await apiClient.get(
      `${HOURS_BASE}/organization/${orgId}`,
    );

    if (!records || records.length === 0) {
      return operatingHours;
    }

    const schedule: Record<string, DaySchedule> = {};
    for (const record of records) {
      const dayKey = DAY_OF_WEEK_TO_DAY_KEY[record.dayOfWeek];
      if (dayKey) {
        schedule[dayKey] = responseToDaySchedule(record);
      }
    }
    return schedule;
  } catch {
    return operatingHours;
  }
}

/**
 * Save the full weekly schedule.
 * Deletes all existing records for the organization, then creates a fresh week batch.
 */
export async function saveSettingsHours(
  orgId: string,
  schedule: Record<string, DaySchedule>,
): Promise<void> {
  if (isMockMode()) {
    return;
  }

  // 1. Delete existing records
  const existing: OrganizationOperatingHoursResponse[] = await apiClient.get(
    `${HOURS_BASE}/organization/${orgId}`,
  );
  if (existing && existing.length > 0) {
    await Promise.all(
      existing.map((record) => apiClient.delete(`${HOURS_BASE}/${record.id}`)),
    );
  }

  // 2. Create the full week batch
  const dayKeys = Object.keys(schedule);
  const requests: OrganizationOperatingHoursRequest[] = dayKeys.map((dayKey) =>
    toRequest(orgId, dayKey, schedule[dayKey]),
  );

  await apiClient.post(`${HOURS_BASE}/week`, requests);
}

export async function getSettingsPhotos() {
  return photos;
}

export async function getSettingsBankInfo() {
  if (isMockMode()) {
    return bankInfo;
  }

  try {
    const orgId = await getMyOrgId();
    if (!orgId) {
      return bankInfo;
    }

    const org = await apiClient.get(`/organization/${orgId}`);
    return {
      accountHolder: org.name || bankInfo.accountHolder,
      bank: org.bankName || bankInfo.bank,
      mfo: org.mfo || bankInfo.mfo,
      inn: org.inn || bankInfo.inn,
      accountNumber: org.bankAccount || bankInfo.accountNumber,
      currency: 'UZS',
    };
  } catch (_) {
    return bankInfo;
  }
}

export async function getSettingsPayment() {
  return paymentProviders;
}

export async function getSettingsNotifications() {
  return notificationPreferences;
}

export async function getSettingsAppearance() {
  return appearanceSettings;
}

export async function getSettingsDangerZone() {
  return dangerZoneData;
}
