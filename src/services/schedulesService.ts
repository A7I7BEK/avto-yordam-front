import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import { monthBookings } from '@/data/schedules';

export async function getRealBookings() {
  if (isMockMode()) {
    // Map weekBookings/monthBookings for mock mode
    return monthBookings.map((b) => ({
      date: b.date,
      time: b.time,
      endTime:
        (b as any).endTime ||
        `${(Number(b.time.split(':')[0]) + 1).toString().padStart(2, '0')}:00`,
      master: b.master,
      service: b.service,
      customer: (b as any).customer || 'Client',
      customerInitials: (b as any).customerInitials || 'C',
      orderId: b.orderId,
    }));
  }

  try {
    const backendOrders = await apiClient.get('/order/get-by-master');
    if (!backendOrders || backendOrders.length === 0) {
      return [];
    }

    return backendOrders.map((o: any) => {
      let date = '';
      let time = '';
      let endTime = '';

      if (o.slot) {
        date = o.slot.slotDate || '';
        time = o.slot.startTime ? o.slot.startTime.slice(0, 5) : '';
        endTime = o.slot.endTime ? o.slot.endTime.slice(0, 5) : '';
      } else if (o.createdDate) {
        const d = new Date(o.createdDate);
        const pad = (n: number) => n.toString().padStart(2, '0');
        date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
        const endH = (d.getHours() + 1) % 24;
        endTime = `${pad(endH)}:${pad(d.getMinutes())}`;
      }

      return {
        date,
        time,
        endTime: endTime || time,
        master: o.masterName || (o.masterId ? `Master #${o.masterId}` : '—'),
        service: o.problemDescription || 'General Repair',
        customer: o.carDescription || o.clientName || 'Client',
        customerInitials: (o.clientName || 'C')
          .split(' ')
          .map((n: any) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        orderId: o.id ? `#BK-${o.id.slice(0, 4).toUpperCase()}` : '#BK-0000',
        rawId: o.id,
        status: o.status,
      };
    });
  } catch {
    return [];
  }
}

export async function getMonthBookings() {
  return await getRealBookings();
}

export async function getWeekBookings() {
  return await getRealBookings();
}

export async function getDayBookings() {
  return await getRealBookings();
}
