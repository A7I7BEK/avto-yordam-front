import { isMockMode } from '@/config';
import { dayBookings, monthBookings, weekBookings } from '@/data/schedules';

export function getMonthBookings() {
  if (isMockMode()) {
    return monthBookings;
  }
  throw new Error('API not implemented');
}

export function getWeekBookings() {
  if (isMockMode()) {
    return weekBookings;
  }
  throw new Error('API not implemented');
}

export function getDayBookings() {
  if (isMockMode()) {
    return dayBookings;
  }
  throw new Error('API not implemented');
}
