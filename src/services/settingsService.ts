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

export function getSettingsLegal() {
  return isMockMode() ? legalInfo : null;
}

export function getSettingsHours() {
  return isMockMode() ? operatingHours : null;
}

export function getSettingsPhotos() {
  return isMockMode() ? photos : null;
}

export function getSettingsBankInfo() {
  return isMockMode() ? bankInfo : null;
}

export function getSettingsPayment() {
  return isMockMode() ? paymentProviders : null;
}

export function getSettingsNotifications() {
  return isMockMode() ? notificationPreferences : null;
}

export function getSettingsAppearance() {
  return isMockMode() ? appearanceSettings : null;
}

export function getSettingsDangerZone() {
  return isMockMode() ? dangerZoneData : null;
}
