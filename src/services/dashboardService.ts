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

    const dynamicKpi = {
      ...kpiStats,
      todayBookings: list.length,
      pending: list.filter((o) => o.status === 'new' || o.status === 'pending')
        .length,
      confirmedToday: list.filter((o) => o.status === 'confirmed').length,
    };

    return {
      kpi: dynamicKpi,
      queue: queueBookings,
      schedules: masterSchedules,
    };
  } catch (_) {
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
        const val = Number.parseInt(o.amount.replace(/[^0-9]/g, '')) || 0;
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
  } catch (_) {
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
    const totalOrders = list.length;

    const newCount = list.filter((o) => o.status === 'new').length;
    const progressCount = list.filter(
      (o) => o.status === 'in-progress' || o.status === 'pending',
    ).length;
    const completedCount = list.filter((o) => o.status === 'done').length;

    const dynamicStats = {
      total: totalOrders,
      statuses: ordersByStatus.statuses.map((statusObj) => {
        let count = statusObj.count;
        if (statusObj.label === 'Completed') {
          count = completedCount;
        } else if (statusObj.label === 'Active') {
          count = list.filter(
            (o) => o.status === 'in-progress' || o.status === 'confirmed',
          ).length;
        } else if (statusObj.label === 'Incoming') {
          count = newCount;
        } else if (statusObj.label === 'Pending') {
          count = list.filter((o) => o.status === 'pending').length;
        } else if (statusObj.label === 'Cancelled') {
          count = list.filter((o) => o.status === 'cancelled').length;
        }
        return { ...statusObj, count };
      }),
    };

    return {
      bigStats,
      ordersByStatus: dynamicStats,
      recentTransactions,
      alerts,
      weeklySummary,
    };
  } catch (_) {
    return {
      bigStats,
      ordersByStatus,
      recentTransactions,
      alerts,
      weeklySummary,
    };
  }
}
