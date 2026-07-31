export interface OrganizationOperatingHoursRequest {
  id?: string;
  organizationId: string;
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
  organizationId: string;
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
  organizationId: string;
}
