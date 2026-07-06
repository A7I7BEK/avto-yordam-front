import { isMockMode } from '@/config';
import { dayBookings, monthBookings, weekBookings } from '@/data/schedules';

export function getMonthBookings() {
  if (isMockMode()) {
    return monthBookings;
  }
  return monthBookings;
}

export function getWeekBookings() {
  if (isMockMode()) {
    return weekBookings;
  }
  return weekBookings;
}

export function getDayBookings() {
  if (isMockMode()) {
    return dayBookings;
  }
  return dayBookings;
}
