import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import { transactionDetail } from '@/data/transactionDetail';
import type {
  PaymentTransaction,
  PaymentTransactionPageResponse,
  PaymentTransactionRequest,
} from '@/types/payment';
import { getOrders } from './ordersService';

/**
 * Build a mock PaymentTransaction from an order so mock mode keeps the page
 * working while the backend is not available.
 */
function toMockTransaction(order: any): PaymentTransaction {
  const finalAmount = Number(order.finalPrice ?? order.estimatedPrice ?? 0);
  return {
    id: `tx-${order.backendId ?? order.id}`,
    orderId: order.backendId ?? order.id ?? '',
    amount: finalAmount,
    method: 'PAYME',
    status: 'PAID',
    externalTransactionId: null,
    paidAt: order.date ? new Date(order.date).toISOString() : null,
    createdDate: order.date
      ? new Date(order.date).toISOString()
      : new Date().toISOString(),
  };
}

/** GET /api/payment-transaction — all transactions. */
export async function getPaymentTransactions(): Promise<PaymentTransaction[]> {
  if (isMockMode()) {
    const list = await getOrders();
    return list.map(toMockTransaction);
  }

  try {
    const data = await apiClient.get('/payment-transaction');
    return (data ?? []) as PaymentTransaction[];
  } catch {
    return [];
  }
}

/** GET /api/payment-transaction/{id} — one transaction by id. */
export async function getPaymentTransaction(
  id: string,
): Promise<PaymentTransaction | null> {
  if (isMockMode()) {
    return transactionDetail as unknown as PaymentTransaction;
  }
  try {
    return (await apiClient.get(
      `/payment-transaction/${id}`,
    )) as PaymentTransaction;
  } catch {
    return null;
  }
}

/** GET /api/payment-transaction/get-by-order/{orderId}. */
export async function getTransactionsByOrder(
  orderId: string,
): Promise<PaymentTransaction[]> {
  if (isMockMode()) {
    const list = await getOrders();
    return list.filter((o) => o.backendId === orderId).map(toMockTransaction);
  }
  try {
    return (await apiClient.get(
      `/payment-transaction/get-by-order/${orderId}`,
    )) as PaymentTransaction[];
  } catch {
    return [];
  }
}

/** GET /api/payment-transaction/get-by-master — current logged-in master. */
export async function getTransactionsByMaster(): Promise<PaymentTransaction[]> {
  if (isMockMode()) {
    const list = await getOrders();
    return list.map(toMockTransaction);
  }
  try {
    return (await apiClient.get(
      '/payment-transaction/get-by-master',
    )) as PaymentTransaction[];
  } catch {
    return [];
  }
}

/** GET /api/payment-transaction/page — paged list with search/sort. */
export async function getPaymentTransactionPage(params: {
  page?: number;
  size?: number;
  sortField?: string;
  sortOrder?: string;
  search?: string;
}): Promise<PaymentTransactionPageResponse> {
  if (isMockMode()) {
    const list = await getPaymentTransactions();
    const page = params.page ?? 0;
    const size = params.size ?? 10;
    const start = page * size;
    const content = list.slice(start, start + size);
    return {
      content,
      totalElements: list.length,
      totalPages: Math.max(1, Math.ceil(list.length / size)),
      number: page,
      size,
      first: page === 0,
      last: start + size >= list.length,
      empty: content.length === 0,
    };
  }

  const data = await apiClient.get('/payment-transaction/page', {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 10,
      sortField: params.sortField ?? 'createdDate',
      sortOrder: params.sortOrder ?? 'desc',
      search: params.search ?? '',
    },
  });
  return data as PaymentTransactionPageResponse;
}

/** POST /api/payment-transaction — create a transaction. */
export async function createPaymentTransaction(
  data: PaymentTransactionRequest,
): Promise<PaymentTransaction> {
  if (isMockMode()) {
    return {
      id: `tx-${Date.now()}`,
      orderId: data.orderId,
      amount: data.amount,
      method: data.method,
      status: data.status ?? 'PENDING',
      externalTransactionId: data.externalTransactionId ?? null,
      paidAt: data.paidAt ?? null,
      createdDate: new Date().toISOString(),
    };
  }
  return (await apiClient.post(
    '/payment-transaction',
    data,
  )) as PaymentTransaction;
}

/** PUT /api/payment-transaction/{id} — update a transaction. */
export async function updatePaymentTransaction(
  id: string,
  data: PaymentTransactionRequest,
): Promise<PaymentTransaction> {
  if (isMockMode()) {
    return {
      id,
      orderId: data.orderId,
      amount: data.amount,
      method: data.method,
      status: data.status ?? 'PENDING',
      externalTransactionId: data.externalTransactionId ?? null,
      paidAt: data.paidAt ?? null,
      createdDate: new Date().toISOString(),
    };
  }
  return (await apiClient.put(
    `/payment-transaction/${id}`,
    data,
  )) as PaymentTransaction;
}

/** DELETE /api/payment-transaction/{id} — soft delete. */
export async function deletePaymentTransaction(id: string): Promise<void> {
  if (isMockMode()) {
    return;
  }
  await apiClient.delete(`/payment-transaction/${id}`);
}

/** LEGACY — keep for other callers until fully migrated. */
export function getTransactions(): Promise<PaymentTransaction[]> {
  return getPaymentTransactions();
}

export function getTransactionDetail(_id: string) {
  if (isMockMode()) {
    return transactionDetail;
  }
  return transactionDetail;
}
