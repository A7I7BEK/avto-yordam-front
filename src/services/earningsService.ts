import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import {
  categoryBreakdown,
  kpiCards,
  topMasters,
  weeklyRevenue,
} from '@/data/earnings';

export async function getEarnings(dateRange: string) {
  if (isMockMode()) {
    return {
      kpi: kpiCards,
      weekly: weeklyRevenue,
      categories: categoryBreakdown,
      masters: topMasters,
    };
  }

  try {
    return await apiClient.get('/dashboard/earnings', {
      params: { dateRange },
    });
  } catch {
    return {
      kpi: kpiCards,
      weekly: weeklyRevenue,
      categories: categoryBreakdown,
      masters: topMasters,
    };
  }
}
