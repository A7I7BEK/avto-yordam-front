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
    } catch (_) {
      try {
        const pageData = await apiClient.get('/order/page', {
          params: { size: 50 },
        });
        backendOrders = pageData.content || [];
      } catch (_) {
        backendOrders = [];
      }
    }

    if (!backendOrders || backendOrders.length === 0) {
      return [];
    }

    return backendOrders.map((o: any) => ({
      id: `#BK-${o.id.slice(0, 4).toUpperCase()}`,
      customer: o.carDescription || 'Client',
      initials: 'C',
      service: o.problemDescription || 'General Repair',
      date: o.createdDate
        ? new Date(o.createdDate).toLocaleString()
        : 'Just now',
      master: o.masterId ? 'Master' : '—',
      amount: `${(o.estimatedPrice || 200_000) / 1000}K UZS`,
      status: String(o.status || 'new').toLowerCase(),
    }));
  } catch (_) {
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
  return await apiClient.post('/order/save-by-owner', data);
}

export async function startOrder(id: string) {
  return await apiClient.post(`/order/${id}/start`);
}

export async function completeOrder(id: string) {
  return await apiClient.post(`/order/${id}/complete`);
}

export async function cancelOrder(id: string) {
  return await apiClient.post(`/order/${id}/cancel`);
}

export async function deleteOrder(id: string) {
  return await apiClient.delete(`/order/${id}`);
}
