import type { ServiceCenterType } from '@/types/user';

export interface OrganizationOperatingHoursRequest {
  id?: string;
  dayOfWeek: DayOfWeek;
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
  twentyFourHours: boolean;
}

export interface OrganizationOperatingHoursResponse {
  id: string;
  organizationId: string;
  dayOfWeek: DayOfWeek;
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
  twentyFourHours: boolean;
}

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface DaySchedule {
  /** Backend record ID (present when loaded from the API, absent for defaults). */
  id?: string;
  open: string;
  close: string;
  closed: boolean;
}

export const DAY_KEY_TO_DAY_OF_WEEK: Record<string, DayOfWeek> = {
  monday: 'MONDAY',
  tuesday: 'TUESDAY',
  wednesday: 'WEDNESDAY',
  thursday: 'THURSDAY',
  friday: 'FRIDAY',
  saturday: 'SATURDAY',
  sunday: 'SUNDAY',
};

export const DAY_OF_WEEK_TO_DAY_KEY: Record<DayOfWeek, string> = {
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday',
};

/* ───── Payment Provider Types ───── */

export type PaymentProviderType =
  | 'PAYME'
  | 'CLICK'
  | 'PAYNET'
  | 'UZUM'
  | 'CASH';

export interface OrganizationPaymentProviderRequest {
  id?: string;
  /** Omitted — derived from the authenticated user on the backend. */
  organizationId?: string;
  type: PaymentProviderType;
  credentials: string | null;
  enabled: boolean;
}

export interface OrganizationPaymentProviderResponse {
  id: string;
  organizationId: string;
  type: PaymentProviderType;
  credentials: string | null;
  enabled: boolean;
}

/* ───── Payment Provider Master (from GET /api/payment-providers) ───── */

export interface PaymentProviderFieldResponse {
  id: string;
  paymentProviderId: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  orderNo: number;
  placeHolder: string;
}

export interface PaymentProviderResponse {
  id: string;
  code: string;
  displayName: string;
  logoUrl: string;
  fields: PaymentProviderFieldResponse[];
}

/* ───── Danger Zone ───── */

export interface OrganizationTransferOwnerShipRequest {
  newOwnerPhoneNumber: string;
  /** Omitted — derived from the authenticated user on the backend. */
  organizationId?: string;
}

/* ───── Organization Details (GET /organization/{id}/details) ───── */

export interface OrganizationCompanyDetailsResponse {
  id: string;
  directorFullName: string;
  directorPinfl: string;
  registrationNumber: string;
  registeredDate: string | null;
  oked: string | null;
  charterCapital: number | null;
}

export interface OrganizationYattDetailsResponse {
  id: string;
  fullName: string;
  passport: string;
  pinfl: string;
  registrationNumber: string;
  registeredDate: string | null;
}

export interface OrganizationSelfEmployedDetailsResponse {
  id: string;
  fullName: string;
  pinfl: string;
  passportSeries: string;
  passportGivenDate: string | null;
  activityType: string;
  phoneNumber: string;
  address: string;
}

export interface OrganizationDetailsResponse {
  companyDetails: OrganizationCompanyDetailsResponse | null;
  yattDetails: OrganizationYattDetailsResponse | null;
  selfEmployedDetails: OrganizationSelfEmployedDetailsResponse | null;
}

/* ───── Organization Details Change (POST /organization/save-new-details) ───── */

export interface YattDetailsRequest {
  fullName: string;
  passport: string;
  pinfl: string;
  registrationNumber: string;
  registeredDate: string | null;
}

export interface CompanyDetailsRequest {
  directorFullName: string;
  directorPinfl: string;
  registrationNumber: string;
  registeredDate: string | null;
  oked: string | null;
  charterCapital: number | null;
}

export interface SelfEmployedDetailsRequest {
  fullName: string;
  pinfl: string;
  passportSeries: string;
  passportGivenDate: string | null;
  activityType: string;
  phoneNumber: string;
  address: string | null;
}

export interface OrganizationDetailsChangeRequest {
  yattDetails: YattDetailsRequest | null;
  companyDetails: CompanyDetailsRequest | null;
  selfEmployedDetails: SelfEmployedDetailsRequest | null;
  oldDetailsId: string;
  oldDetailsType: ServiceCenterType;
  type: ServiceCenterType;
}
