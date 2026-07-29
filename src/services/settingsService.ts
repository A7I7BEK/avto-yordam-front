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
  OrganizationPaymentProviderRequest,
  OrganizationPaymentProviderResponse,
  PaymentProviderResponse,
  PaymentProviderType,
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
  id?: string,
): OrganizationOperatingHoursRequest {
  return {
    id,
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
 * Save the weekly schedule via batch update.
 * Sends all days as a single PUT request to the /week endpoint with IDs included.
 */
export async function saveSettingsHours(
  orgId: string,
  schedule: Record<string, DaySchedule>,
): Promise<void> {
  if (isMockMode()) {
    return;
  }

  // 1. Fetch existing records to get their IDs
  const existing: OrganizationOperatingHoursResponse[] = await apiClient.get(
    `${HOURS_BASE}/organization/${orgId}`,
  );

  // 2. Build a lookup: dayOfWeek → existing record ID
  const existingIdByDay: Record<string, string> = {};
  for (const record of existing || []) {
    const dayKey = DAY_OF_WEEK_TO_DAY_KEY[record.dayOfWeek];
    if (dayKey) {
      existingIdByDay[dayKey] = record.id;
    }
  }

  // 3. Build requests with IDs included
  const dayKeys = Object.keys(schedule);
  const requests: OrganizationOperatingHoursRequest[] = dayKeys.map((dayKey) =>
    toRequest(orgId, dayKey, schedule[dayKey], existingIdByDay[dayKey]),
  );

  await apiClient.put(`${HOURS_BASE}/week`, requests);
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

const PAYMENT_BASE = '/organization-payment-providers';
const PROVIDERS_BASE = '/payment-providers';

function getMockPaymentProviders(): PaymentProviderResponse[] {
  return [
    {
      id: 'payme-mock',
      code: 'PAYME',
      displayName: 'PayMe',
      logoUrl: '',
      fields: [
        { id: 'f1', paymentProviderId: 'payme-mock', name: 'merchant_id', label: 'Merchant ID', type: 'text', required: true, orderNo: 1, placeHolder: 'Enter merchant ID' },
        { id: 'f2', paymentProviderId: 'payme-mock', name: 'secret_key', label: 'Secret key', type: 'password', required: true, orderNo: 2, placeHolder: 'Enter secret key' },
      ],
    },
    {
      id: 'click-mock',
      code: 'CLICK',
      displayName: 'Click',
      logoUrl: '',
      fields: [
        { id: 'f3', paymentProviderId: 'click-mock', name: 'service_id', label: 'Service ID', type: 'text', required: true, orderNo: 1, placeHolder: 'Enter service ID' },
        { id: 'f4', paymentProviderId: 'click-mock', name: 'secret_key', label: 'Secret key', type: 'password', required: true, orderNo: 2, placeHolder: 'Enter secret key' },
      ],
    },
    {
      id: 'paynet-mock',
      code: 'PAYNET',
      displayName: 'Paynet',
      logoUrl: '',
      fields: [
        { id: 'f5', paymentProviderId: 'paynet-mock', name: 'terminal_id', label: 'Terminal ID', type: 'text', required: true, orderNo: 1, placeHolder: 'Enter terminal ID' },
        { id: 'f6', paymentProviderId: 'paynet-mock', name: 'api_token', label: 'API token', type: 'text', required: true, orderNo: 2, placeHolder: 'Enter API token' },
      ],
    },
    {
      id: 'uzum-mock',
      code: 'UZUM',
      displayName: 'Uzum',
      logoUrl: '',
      fields: [
        { id: 'f7', paymentProviderId: 'uzum-mock', name: 'merchant_id', label: 'Merchant ID', type: 'text', required: true, orderNo: 1, placeHolder: 'Enter merchant ID' },
        { id: 'f8', paymentProviderId: 'uzum-mock', name: 'secret_key', label: 'Secret key', type: 'password', required: true, orderNo: 2, placeHolder: 'Enter secret key' },
      ],
    },
  ];
}

export async function getPaymentProviders(): Promise<PaymentProviderResponse[]> {
  if (isMockMode()) {
    return getMockPaymentProviders();
  }

  try {
    return await apiClient.get(PROVIDERS_BASE);
  } catch {
    return [];
  }
}

export async function getSettingsPayment(): Promise<
  OrganizationPaymentProviderResponse[]
> {
  if (isMockMode()) {
    return paymentProviders.map((p) => ({
      id: p.id,
      organizationId: '',
      type: p.id.toUpperCase() as PaymentProviderType,
      credentials: null,
      enabled: p.enabled,
    }));
  }

  try {
    return await apiClient.get(`${PAYMENT_BASE}/organization`);
  } catch {
    return [];
  }
}

export async function createSettingsPayment(
  request: OrganizationPaymentProviderRequest,
): Promise<OrganizationPaymentProviderResponse> {
  return await apiClient.post(`${PAYMENT_BASE}`, request);
}

export async function updateSettingsPayment(
  id: string,
  request: OrganizationPaymentProviderRequest,
): Promise<OrganizationPaymentProviderResponse> {
  return await apiClient.put(`${PAYMENT_BASE}/${id}`, request);
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
