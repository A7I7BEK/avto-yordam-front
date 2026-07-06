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
      return rawOrders;
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
  } catch {
    return rawOrders;
  }
}

export async function getOrder(id: string) {
  if (isMockMode()) {
    return rawOrders.find((o) => o.id === id) || null;
  }
  const all = await getOrders();
  return all.find((o) => o.id === id) || null;
}
