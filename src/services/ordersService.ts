import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import { orders as rawOrders } from '@/data/orders';

export async function getOrders() {
  if (isMockMode()) {
    return rawOrders;
  }

  try {
    let backendOrders: any[] = [];
    try {
      backendOrders = await apiClient.get('/order/get-by-master');
    } catch {
      try {
        const pageData = await apiClient.get('/order/page', {
          params: { size: 50 },
        });
        backendOrders = pageData.content || [];
      } catch {
        backendOrders = [];
      }
    }

    if (!backendOrders || backendOrders.length === 0) {
      return [];
    }

    return backendOrders.map((o: any) => {
      const clientName = o.client?.fullName ?? '';
      const masterName = o.master?.fullName ?? '';
      const serviceName = o.organizationServices?.name ?? '';
      const initials = clientName
        ? clientName
            .split(' ')
            .map((p: string) => p.charAt(0))
            .join('')
            .slice(0, 2)
        : 'C';
      const finalAmount = o.finalPrice ?? o.estimatedPrice ?? 0;
      const amount =
        finalAmount > 0 ? `${(finalAmount / 1000).toLocaleString()}K UZS` : '—';

      return {
        id: `#BK-${o.id.slice(0, 4).toUpperCase()}`,
        backendId: o.id,
        customer: clientName || o.carDescription || 'Client',
        initials,
        service: serviceName || o.problemDescription || 'General Repair',
        date: o.createdDate
          ? new Date(o.createdDate).toLocaleString()
          : 'Just now',
        master: masterName || '—',
        amount,
        status: String(o.status || 'new').toLowerCase(),
      };
    });
  } catch {
    return [];
  }
}

export async function getOrder(id: string) {
  return await apiClient.get(`/order/${id}`);
}

export async function acceptOrder(id: string) {
  return await apiClient.post(`/order/${id}/confirm`);
}

export async function sendOrderToMaster(id: string) {
  return await apiClient.post(`/order/${id}/send-to-master`);
}

export async function rejectOrder(id: string, reason: string) {
  return await apiClient.post(`/order/${id}/reject`, undefined, {
    params: { reason },
  });
}

export async function proposeOrderTime(
  id: string,
  slotDate: string,
  startTime: string,
) {
  return await apiClient.post(`/order/${id}/propose-time`, undefined, {
    params: { slotDate, startTime },
  });
}

export async function createOrderWithMaster(data: any) {
  return await apiClient.post('/order/save-with-master', data);
}

export async function createOrderByOwner(data: any) {
  return await apiClient.post('/order/save-with-master', data);
}

export async function startOrder(id: string) {
  return await apiClient.post(`/order/${id}/start`);
}

/**
 * Complete an order. Optionally pass a payment method; the backend defaults
 * to CASH when omitted, marks the order COMPLETED and auto-creates a PAID
 * PaymentTransaction. Returns 400 when the order already has a transaction.
 */
export async function completeOrder(
  id: string,
  method?: 'CASH' | 'PAYME' | 'CLICK' | 'PAYNET',
) {
  return await apiClient.post(`/order/${id}/complete`, undefined, {
    params: method ? { method } : {},
  });
}

export async function cancelOrder(id: string) {
  return await apiClient.post(`/order/${id}/cancel`);
}

export async function deleteOrder(id: string) {
  return await apiClient.delete(`/order/${id}`);
}

/** Order statuses that count as "new" / needing attention (sidebar badge). */
const NEW_ORDER_STATUSES = new Set([
  'new',
  'created',
  'pending_master_confirmation',
  'pending_user_confirmation',
]);

/** Number of orders in a "new" (pre-confirmation) state. */
export function countNewOrders(orders: Array<{ status?: string }>): number {
  return orders.filter((o) =>
    NEW_ORDER_STATUSES.has(String(o.status ?? '').toLowerCase()),
  ).length;
}
