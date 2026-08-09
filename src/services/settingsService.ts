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
  OrganizationDetailsChangeRequest,
  OrganizationDetailsResponse,
  OrganizationOperatingHoursRequest,
  OrganizationOperatingHoursResponse,
  OrganizationPaymentProviderRequest,
  OrganizationPaymentProviderResponse,
  OrganizationTransferOwnerShipRequest,
  PaymentProviderResponse,
  PaymentProviderType,
} from '@/types/settings';
import {
  DAY_KEY_TO_DAY_OF_WEEK,
  DAY_OF_WEEK_TO_DAY_KEY,
} from '@/types/settings';
import type {
  OrganizationRequest,
  OrganizationResponse,
} from '@/types/user';

/**
 * Fetch the authenticated user's current organization. The backend derives
 * the organization from the JWT, so no org id is sent from the client.
 */
export async function getMyOrg(): Promise<OrganizationResponse | null> {
  if (isMockMode()) {
    return null;
  }
  try {
    return await apiClient.get('/organization/get-user-current-organization');
  } catch {
    return null;
  }
}

/**
 * Map a backend ServiceCenterType to the frontend org-type keys used by the
 * legal info form (mchj | ytt | self-employed). Returns '' when unknown.
 */
function normalizeOrgType(type?: string): string {
  const t = (type ?? '').toUpperCase();
  if (t.includes('YATT') || t.includes('YTT')) {
    return 'ytt';
  }
  if (t.includes('SELF')) {
    return 'self-employed';
  }
  if (t.includes('MCHJ')) {
    return 'mchj';
  }
  return '';
}

export interface RegisteredLegalDetails {
  registrationNumber?: string;
  registeredDate?: string;
}

function registeredLegalDetails(
  type?: string,
  details?: OrganizationDetailsResponse | null,
): RegisteredLegalDetails | null {
  if (!details) {
    return null;
  }
  const t = (type ?? '').toUpperCase();
  if (t.includes('YATT') || t.includes('YTT')) {
    const y = details.yattDetails;
    if (!y) {
      return null;
    }
    return {
      registrationNumber: y.registrationNumber,
      registeredDate: y.registeredDate ?? undefined,
    };
  }
  if (t.includes('SELF')) {
    const s = details.selfEmployedDetails;
    if (!s) {
      return null;
    }
    return {
      registeredDate: s.passportGivenDate ?? undefined,
    };
  }
  const c = details.companyDetails;
  if (!c) {
    return null;
  }
  return {
    registrationNumber: c.registrationNumber,
    registeredDate: c.registeredDate ?? undefined,
  };
}

export async function getSettingsLegal() {
  if (isMockMode()) {
    return legalInfo;
  }

  try {
    const org = await getMyOrg();
    if (!org) {
      return null;
    }
    const details = await getOrganizationDetails();
    const registered = registeredLegalDetails(org.type, details);

    return {
      orgType: normalizeOrgType(org.type) || '',
      legalEntityName: org.name || '',
      stateRegNumber: registered?.registrationNumber ?? '',
      taxId: org.inn || '',
      vatStatus: '',
      foundingDate: registered?.registeredDate ?? '',
      country: '',
      region: '',
      city: '',
      postalCode: '',
      street: org.address || '',
      documents: legalInfo.documents,
    };
  } catch (_) {
    return null;
  }
}

export async function getOrganizationDetails(): Promise<
  OrganizationDetailsResponse | null
> {
  if (isMockMode()) {
    return null;
  }
  try {
    return await apiClient.get('/organization/details');
  } catch {
    return null;
  }
}

export async function getOrganization(): Promise<OrganizationResponse | null> {
  return getMyOrg();
}

const HOURS_BASE = '/organization-operating-hours';

const DEFAULT_OPEN_TIME = '09:00';
const DEFAULT_CLOSE_TIME = '18:00';

/**
 * Convert a backend response record to the frontend DaySchedule shape.
 * Closed days keep the default working times (09:00-18:00) so the times
 * are always visible in the UI.
 */
function responseToDaySchedule(
  resp: OrganizationOperatingHoursResponse,
): DaySchedule {
  return {
    id: resp.id,
    open: resp.openTime ?? DEFAULT_OPEN_TIME,
    close: resp.closeTime ?? DEFAULT_CLOSE_TIME,
    closed: !resp.isOpen,
  };
}

/**
 * Convert a day key + DaySchedule to a backend request DTO.
 */
function toRequest(
  dayKey: string,
  schedule: DaySchedule,
  id?: string,
): OrganizationOperatingHoursRequest {
  return {
    id,
    dayOfWeek: DAY_KEY_TO_DAY_OF_WEEK[dayKey] as DayOfWeek,
    isOpen: !schedule.closed,
    openTime: schedule.closed ? null : schedule.open || null,
    closeTime: schedule.closed ? null : schedule.close || null,
    twentyFourHours: false,
  };
}

export async function getSettingsHours(): Promise<
  Record<string, DaySchedule> | null
> {
  if (isMockMode()) {
    return operatingHours;
  }

  try {
    const records: OrganizationOperatingHoursResponse[] = await apiClient.get(
      `${HOURS_BASE}/get-by-organization`,
    );

    if (!records || records.length === 0) {
      return null;
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
    return null;
  }
}

/**
 * Save the weekly schedule via batch update.
 * Sends all days as a single PUT request to the /week endpoint, reusing the
 * record IDs loaded by getSettingsHours so existing rows are updated in place.
 */
export async function saveSettingsHours(
  schedule: Record<string, DaySchedule>,
): Promise<void> {
  if (isMockMode()) {
    return;
  }

  const dayKeys = Object.keys(schedule);
  const requests: OrganizationOperatingHoursRequest[] = dayKeys.map((dayKey) =>
    toRequest(dayKey, schedule[dayKey], schedule[dayKey].id),
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
    const org = await getMyOrg();
    if (!org) {
      return null;
    }
    return {
      accountHolder: org.name || '',
      bank: org.bankName || '',
      mfo: org.mfo || '',
      inn: org.inn || '',
      accountNumber: org.bankAccount || '',
      currency: 'UZS',
    };
  } catch (_) {
    return null;
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
        {
          id: 'f1',
          paymentProviderId: 'payme-mock',
          name: 'merchant_id',
          label: 'Merchant ID',
          type: 'text',
          required: true,
          orderNo: 1,
          placeHolder: 'Enter merchant ID',
        },
        {
          id: 'f2',
          paymentProviderId: 'payme-mock',
          name: 'secret_key',
          label: 'Secret key',
          type: 'password',
          required: true,
          orderNo: 2,
          placeHolder: 'Enter secret key',
        },
      ],
    },
    {
      id: 'click-mock',
      code: 'CLICK',
      displayName: 'Click',
      logoUrl: '',
      fields: [
        {
          id: 'f3',
          paymentProviderId: 'click-mock',
          name: 'service_id',
          label: 'Service ID',
          type: 'text',
          required: true,
          orderNo: 1,
          placeHolder: 'Enter service ID',
        },
        {
          id: 'f4',
          paymentProviderId: 'click-mock',
          name: 'secret_key',
          label: 'Secret key',
          type: 'password',
          required: true,
          orderNo: 2,
          placeHolder: 'Enter secret key',
        },
      ],
    },
    {
      id: 'paynet-mock',
      code: 'PAYNET',
      displayName: 'Paynet',
      logoUrl: '',
      fields: [
        {
          id: 'f5',
          paymentProviderId: 'paynet-mock',
          name: 'terminal_id',
          label: 'Terminal ID',
          type: 'text',
          required: true,
          orderNo: 1,
          placeHolder: 'Enter terminal ID',
        },
        {
          id: 'f6',
          paymentProviderId: 'paynet-mock',
          name: 'api_token',
          label: 'API token',
          type: 'text',
          required: true,
          orderNo: 2,
          placeHolder: 'Enter API token',
        },
      ],
    },
    {
      id: 'uzum-mock',
      code: 'UZUM',
      displayName: 'Uzum',
      logoUrl: '',
      fields: [
        {
          id: 'f7',
          paymentProviderId: 'uzum-mock',
          name: 'merchant_id',
          label: 'Merchant ID',
          type: 'text',
          required: true,
          orderNo: 1,
          placeHolder: 'Enter merchant ID',
        },
        {
          id: 'f8',
          paymentProviderId: 'uzum-mock',
          name: 'secret_key',
          label: 'Secret key',
          type: 'password',
          required: true,
          orderNo: 2,
          placeHolder: 'Enter secret key',
        },
      ],
    },
  ];
}

export async function getPaymentProviders(): Promise<
  PaymentProviderResponse[]
> {
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

const ORG_BASE = '/organization';

/**
 * Update the organization's information.
 * Sends a PUT to /organization/{id} with the full OrganizationRequest DTO
 * (required fields such as phone/ownerId must be included).
 */
export async function updateOrganization(
  data: OrganizationRequest,
): Promise<OrganizationResponse> {
  return await apiClient.put(ORG_BASE, data);
}

/**
 * Change the organization's service center type together with its registered
 * details. POSTs to /organization/save-new-details with the details for the
 * new type plus the id/type of the details record being replaced.
 */
export async function saveNewOrganizationDetails(
  request: OrganizationDetailsChangeRequest,
): Promise<OrganizationResponse> {
  return await apiClient.post(`${ORG_BASE}/save-new-details`, request);
}

export async function transferOrganizationOwnership(
  request: OrganizationTransferOwnerShipRequest,
): Promise<unknown> {
  return await apiClient.put(`${ORG_BASE}/transfer-ownership`, request);
}

export async function activateOrganization(): Promise<unknown> {
  return await apiClient.put(`${ORG_BASE}/activate`);
}

export async function deactivateOrganization(): Promise<unknown> {
  return await apiClient.put(`${ORG_BASE}/deactivate`);
}

/**
 * Determine whether the organization is currently active.
 * Prefers the boolean `active` flag; falls back to a `status` enum where
 * anything other than `INACTIVE` is treated as active.
 */
export async function getOrganizationActiveState(): Promise<boolean> {
  try {
    const org = await getMyOrg();
    if (!org) {
      return true;
    }
    const record = org as OrganizationResponse & {
      active?: boolean;
      status?: string;
    };
    if (typeof record.active === 'boolean') {
      return record.active;
    }
    if (typeof record.isActive === 'boolean') {
      return record.isActive;
    }
    return String(record.status ?? '').toUpperCase() !== 'INACTIVE';
  } catch {
    return true;
  }
}
