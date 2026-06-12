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

export function getReceptionistDashboard() {
  if (isMockMode()) {
    return { kpi: kpiStats, queue: queueBookings, schedules: masterSchedules };
  }
  throw new Error('API not implemented');
}

export function getOverviewDashboard() {
  if (isMockMode()) {
    return {
      kpi: kpiItems,
      recentOrders,
      earnings,
      topEmployees,
      serviceBreakdown,
    };
  }
  throw new Error('API not implemented');
}

export function getCommandCenterDashboard() {
  if (isMockMode()) {
    return {
      bigStats,
      ordersByStatus,
      recentTransactions,
      alerts,
      weeklySummary,
    };
  }
  throw new Error('API not implemented');
}
