import { isMockMode } from '@/config';
import { dayBookings, monthBookings, weekBookings } from '@/data/schedules';

export async function getMonthBookings() {
  if (isMockMode()) {
    return monthBookings;
  }
  return monthBookings;
}

export async function getWeekBookings() {
  if (isMockMode()) {
    return weekBookings;
  }
  return weekBookings;
}

export async function getDayBookings() {
  if (isMockMode()) {
    return dayBookings;
  }
  return dayBookings;
}
