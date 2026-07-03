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
  } catch (_) {}
  return null;
}

export async function getSettingsLegal() {
  if (isMockMode()) return legalInfo;
  
  try {
    const orgId = await getMyOrgId();
    if (!orgId) return legalInfo;

    const org = await apiClient.get(`/organization/${orgId}`);
    return {
      name: org.name || legalInfo.name,
      address: org.address || legalInfo.address,
      inn: org.inn || legalInfo.inn,
      director: 'Director Full Name',
    };
  } catch (_) {
    return legalInfo;
  }
}

export async function getSettingsHours() {
  return operatingHours;
}

export async function getSettingsPhotos() {
  return photos;
}

export async function getSettingsBankInfo() {
  if (isMockMode()) return bankInfo;

  try {
    const orgId = await getMyOrgId();
    if (!orgId) return bankInfo;

    const org = await apiClient.get(`/organization/${orgId}`);
    return {
      holder: org.name || bankInfo.holder,
      bank: org.bankName || bankInfo.bank,
      mfo: org.mfo || bankInfo.mfo,
      inn: org.inn || bankInfo.inn,
      account: org.bankAccount || bankInfo.account,
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
