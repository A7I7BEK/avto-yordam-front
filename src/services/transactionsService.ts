import { isMockMode } from '@/config';
import { transactionDetail } from '@/data/transactionDetail';
import { transactions as mockTransactions } from '@/data/transactions';
import { getOrders } from './ordersService';

export async function getTransactions() {
  if (isMockMode()) {
    return mockTransactions;
  }

  try {
    const list = await getOrders();
    const completed = list.filter((o) => o.status === 'done');

    if (completed.length === 0) {
      return mockTransactions;
    }

    return completed.map((o) => ({
      id: o.id.replace('#', 'TX-'),
      orderId: o.id,
      customerName: o.customer,
      customerInitials: o.initials,
      avatarColor: '#5749F4',
      amount: o.amount,
      provider: 'PayMe',
      providerDot: '#00A0E9',
      providerBg: '#C9D6F0',
      status: 'Paid',
      date: o.date,
    }));
  } catch (_) {
    return mockTransactions;
  }
}

export async function getTransactionDetail(id: string) {
  if (isMockMode()) {
    return transactionDetail;
  }
  return transactionDetail;
}
