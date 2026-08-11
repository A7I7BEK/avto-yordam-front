/**
 * Payment transaction types (backend: /api/payment-transaction).
 * Enums are returned as uppercase strings by the backend.
 */

export type PaymentMethod = 'CASH' | 'PAYME' | 'CLICK' | 'PAYNET';

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REFUNDED';

export const PAYMENT_METHODS: PaymentMethod[] = [
  'CASH',
  'PAYME',
  'CLICK',
  'PAYNET',
];

export const PAYMENT_STATUSES: PaymentStatus[] = [
  'PENDING',
  'PAID',
  'FAILED',
  'CANCELLED',
  'EXPIRED',
  'REFUNDED',
];

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  externalTransactionId: string | null;
  paidAt: string | null;
  createdDate: string;
}

export interface PaymentTransactionRequest {
  /** Optional; present when updating. */
  id?: string;
  orderId: string;
  /** Decimal number (BigDecimal). */
  amount: number;
  method: PaymentMethod;
  /** Optional; defaults to PENDING on create when omitted. */
  status?: PaymentStatus;
  externalTransactionId?: string;
  paidAt?: string;
}

export interface PaymentTransactionPageResponse {
  content: PaymentTransaction[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  total?: number;
  pageable?: unknown;
  last?: boolean;
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}
