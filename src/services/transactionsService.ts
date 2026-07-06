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
      bookingId: o.id,
      customer: o.customer,
      initials: o.initials,
      service: o.service,
      date: o.date,
      amount: o.amount,
      status: 'Paid',
      provider: 'PayMe',
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
