import { isMockMode } from '@/config';
import {
  categoryBreakdown,
  kpiCards,
  topMasters,
  weeklyRevenue,
} from '@/data/earnings';
import { getOrders } from './ordersService';

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
    const list = await getOrders();
    const completedOrders = list.filter((o) => o.status === 'done');
    const revenueSum = completedOrders.reduce((sum, o) => {
      const val = parseInt(o.amount.replace(/[^0-9]/g, '')) || 0;
      return sum + val * 1000;
    }, 0);

    const averageOrder = completedOrders.length > 0 ? Math.round(revenueSum / completedOrders.length) : 0;

    const dynamicKpi = [...kpiCards];
    if (dynamicKpi[0]) dynamicKpi[0].value = `${(revenueSum / 1000).toLocaleString()}K UZS`;
    if (dynamicKpi[1]) dynamicKpi[1].value = `${(averageOrder / 1000).toLocaleString()}K UZS`;
    if (dynamicKpi[2]) dynamicKpi[2].value = completedOrders.length.toString();

    return {
      kpi: dynamicKpi,
      weekly: weeklyRevenue,
      categories: categoryBreakdown,
      masters: topMasters,
    };
  } catch (_) {
    return {
      kpi: kpiCards,
      weekly: weeklyRevenue,
      categories: categoryBreakdown,
      masters: topMasters,
    };
  }
}
