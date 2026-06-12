import { isMockMode } from '@/config';
import { notifications } from '@/data/notifications';

export function getNotifications() {
  if (isMockMode()) {
    return notifications;
  }
  throw new Error('API not implemented');
}
