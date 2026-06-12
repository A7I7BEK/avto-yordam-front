import { isMockMode } from '@/config';
import { orders } from '@/data/orders';

export function getOrders() {
  if (isMockMode()) {
    return orders;
  }
  throw new Error('API not implemented');
}

export function getOrder(id: string) {
  if (isMockMode()) {
    return orders.find((o) => o.id === id) || null;
  }
  throw new Error('API not implemented');
}
