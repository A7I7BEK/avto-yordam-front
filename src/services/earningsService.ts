import { isMockMode } from '@/config';
import {
  categoryBreakdown,
  kpiCards,
  topMasters,
  weeklyRevenue,
} from '@/data/earnings';

export function getEarnings(_dateRange: string) {
  if (isMockMode()) {
    return {
      kpi: kpiCards,
      weekly: weeklyRevenue,
      categories: categoryBreakdown,
      masters: topMasters,
    };
  }
  throw new Error('API not implemented');
}
