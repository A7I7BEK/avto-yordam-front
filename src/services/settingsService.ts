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

async function getMyOrgId(): Promise<string | null> {
  try {
    const members = await apiClient.get('/organization-member/get-by-user');
    if (members && members.length > 0) {
      return members[0].organizationId;
    }
  } catch {
    /* no org members yet */
  }
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
      name: org.name || legalInfo.name,
      address: org.address || legalInfo.address,
      inn: org.inn || legalInfo.inn,
      director: 'Director Full Name',
    };
  } catch {
    return legalInfo;
  }
}

export function getSettingsHours() {
  return operatingHours;
}

export function getSettingsPhotos() {
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
      holder: org.name || bankInfo.holder,
      bank: org.bankName || bankInfo.bank,
      mfo: org.mfo || bankInfo.mfo,
      inn: org.inn || bankInfo.inn,
      account: org.bankAccount || bankInfo.account,
    };
  } catch {
    return bankInfo;
  }
}

export function getSettingsPayment() {
  return paymentProviders;
}

export function getSettingsNotifications() {
  return notificationPreferences;
}

export function getSettingsAppearance() {
  return appearanceSettings;
}

export function getSettingsDangerZone() {
  return dangerZoneData;
}
