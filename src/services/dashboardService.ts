import { apiClient } from '@/api/client';
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
    const _activeCount = list.filter(
      (o) =>
        o.status === 'new' ||
        o.status === 'pending' ||
        o.status === 'confirmed',
    ).length;
    const _completedCount = list.filter((o) => o.status === 'done').length;

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
    return await apiClient.get('/dashboard/overview');
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
    const totalOrders = list.length;

    const newCount = list.filter((o) => o.status === 'new').length;
    const _progressCount = list.filter(
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
