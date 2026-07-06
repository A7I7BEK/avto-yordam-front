import { isMockMode } from '@/config';
import {
  alerts,
  bigStats,
  ordersByStatus,
  recentTransactions,
  weeklySummary,
} from '@/data/dashboardCommandCenter';
import {
  earnings,
  kpiItems,
  recentOrders,
  serviceBreakdown,
  topEmployees,
} from '@/data/dashboardOverview';
import {
  kpiStats,
  masterSchedules,
  queueBookings,
} from '@/data/dashboardReceptionist';
import { getOrders } from './ordersService';

export async function getReceptionistDashboard() {
  if (isMockMode()) {
    return { kpi: kpiStats, queue: queueBookings, schedules: masterSchedules };
  }

  try {
    const list = await getOrders();
    const activeCount = list.filter(
      (o) =>
        o.status === 'new' ||
        o.status === 'pending' ||
        o.status === 'confirmed',
    ).length;
    const completedCount = list.filter((o) => o.status === 'done').length;

    const dynamicKpi = [...kpiStats];
    if (dynamicKpi[0]) {
      dynamicKpi[0].value = activeCount.toString();
    }
    if (dynamicKpi[1]) {
      dynamicKpi[1].value = completedCount.toString();
    }

    return {
      kpi: dynamicKpi,
      queue: queueBookings,
      schedules: masterSchedules,
    };
  } catch {
    return { kpi: kpiStats, queue: queueBookings, schedules: masterSchedules };
  }
}

export async function getOverviewDashboard() {
  if (isMockMode()) {
    return {
      kpi: kpiItems,
      recentOrders,
      earnings,
      topEmployees,
      serviceBreakdown,
    };
  }

  try {
    const list = await getOrders();
    const totalCount = list.length;
    const revenueSum = list
      .filter((o) => o.status === 'done')
      .reduce((sum, o) => {
        const val = Number.parseInt(o.amount.replace(/[^0-9]/g, ''), 10) || 0;
        return sum + val * 1000;
      }, 0);

    const dynamicKpi = [...kpiItems];
    if (dynamicKpi[0]) {
      dynamicKpi[0].value = `${(revenueSum / 1_000_000).toFixed(1)}M UZS`;
    }
    if (dynamicKpi[1]) {
      dynamicKpi[1].value = totalCount.toString();
    }

    return {
      kpi: dynamicKpi,
      recentOrders: list.slice(0, 5),
      earnings,
      topEmployees,
      serviceBreakdown,
    };
  } catch {
    return {
      kpi: kpiItems,
      recentOrders,
      earnings,
      topEmployees,
      serviceBreakdown,
    };
  }
}

export async function getCommandCenterDashboard() {
  if (isMockMode()) {
    return {
      bigStats,
      ordersByStatus,
      recentTransactions,
      alerts,
      weeklySummary,
    };
  }

  try {
    const list = await getOrders();
    const _totalOrders = list.length;

    const newCount = list.filter((o) => o.status === 'new').length;
    const progressCount = list.filter(
      (o) => o.status === 'in-progress' || o.status === 'pending',
    ).length;
    const completedCount = list.filter((o) => o.status === 'done').length;

    const dynamicStats = { ...ordersByStatus };
    dynamicStats.new = newCount;
    dynamicStats.inProgress = progressCount;
    dynamicStats.completed = completedCount;

    return {
      bigStats,
      ordersByStatus: dynamicStats,
      recentTransactions,
      alerts,
      weeklySummary,
    };
  } catch {
    return {
      bigStats,
      ordersByStatus,
      recentTransactions,
      alerts,
      weeklySummary,
    };
  }
}
