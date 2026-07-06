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
      orgName: org.name || legalInfo.orgName,
      legalForm: org.legalForm || legalInfo.legalForm,
      inn: org.inn || legalInfo.inn,
      regDate: org.regDate || legalInfo.regDate,
      taxRegime: org.taxRegime || legalInfo.taxRegime,
      legalAddress: org.address || legalInfo.legalAddress,
      actualAddress: org.actualAddress || legalInfo.actualAddress,
      sameAsLegal: org.sameAsLegal ?? legalInfo.sameAsLegal,
      bankName: org.bankName || legalInfo.bankName,
      accountNumber: org.accountNumber || legalInfo.accountNumber,
      mfo: org.mfo || legalInfo.mfo,
      okonkh: org.okonkh || legalInfo.okonkh,
      documents: org.documents || [...legalInfo.documents],
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
      accountHolder: org.name || bankInfo.accountHolder,
      bank: org.bankName || bankInfo.bank,
      mfo: org.mfo || bankInfo.mfo,
      inn: org.inn || bankInfo.inn,
      accountNumber: org.bankAccount || bankInfo.accountNumber,
      currency: org.currency || bankInfo.currency,
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
