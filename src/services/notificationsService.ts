import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import { notifications as rawNotifications } from '@/data/notifications';

export async function getNotifications() {
  if (isMockMode()) {
    return rawNotifications;
  }

  try {
    const data = await apiClient.get('/notification/get-by-user');
    return data.map((n: any) => ({
      id: n.id,
      icon: 'calendar',
      iconBg: '#FFD9B2',
      iconColor: '#B45309',
      title: n.title || 'Notification',
      desc: n.message || '',
      time: 'Just now',
      timeGroup: 'Today',
      category: n.category || 'Bookings',
      unread: n.isRead === false,
    }));
  } catch (_) {
    return rawNotifications;
  }
}
