import { isMockMode } from '@/config';
import { transactionDetail } from '@/data/transactionDetail';
import { transactions } from '@/data/transactions';

export function getTransactions() {
  if (isMockMode()) {
    return transactions;
  }
  throw new Error('API not implemented');
}

export function getTransactionDetail(_id: string) {
  if (isMockMode()) {
    return transactionDetail;
  }
  throw new Error('API not implemented');
}
