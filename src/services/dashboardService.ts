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
    const response = await apiClient.get('/dashboard/overview');
    return normalizeOverview(response);
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

const KPI_META: Record<string, { icon: string; iconBg: string; iconColor: string }> = {
  "Today's Bookings": {
    icon: 'clipboard-list',
    iconBg: 'var(--primary-tint)',
    iconColor: 'var(--primary)',
  },
  'Monthly Revenue': {
    icon: 'trending-up',
    iconBg: 'var(--success-bg)',
    iconColor: 'var(--success)',
  },
  'Active Employees': {
    icon: 'users',
    iconBg: '#FFF0E9',
    iconColor: '#A05A00',
  },
  'Pending Orders': {
    icon: 'clock',
    iconBg: 'var(--warning-bg)',
    iconColor: 'var(--warning)',
  },
  'Avg Order Value': {
    icon: 'banknote',
    iconBg: '#F3E8FF',
    iconColor: '#7C3AED',
  },
  'Completion Rate': {
    icon: 'circle-check',
    iconBg: 'var(--info-soft)',
    iconColor: 'var(--info-strong)',
  },
};

interface OverviewKpiItem {
  label: string;
  value: string;
  trend: string | null;
  trendUp: boolean;
  [key: string]: unknown;
}

function formatCompactUzs(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M UZS`;
  }
  if (num >= 1_000) {
    return `${Math.round(num / 1_000)}K UZS`;
  }
  return `${Math.round(num)} UZS`;
}

function formatKpiValue(label: string, rawValue: string): string {
  const num = Number(rawValue);
  if (Number.isNaN(num)) {
    return rawValue;
  }
  if (label === 'Monthly Revenue' || label === 'Avg Order Value') {
    return formatCompactUzs(num);
  }
  if (label === 'Completion Rate') {
    return `${Math.round(num)}%`;
  }
  return String(num);
}

function scaleChartData(chartData: Array<{ day: string; value: number }>) {
  const max = Math.max(...chartData.map((d) => d.value ?? 0), 1);
  return chartData.map((d) => ({
    ...d,
    value: Math.round(((d.value ?? 0) / max) * 100),
  }));
}

function normalizeOverview(overview: {
  kpi?: OverviewKpiItem[];
  earnings?: {
    chartData?: Array<{ day: string; value: number }>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}) {
  const kpi = (overview.kpi ?? []).map((item) => {
    const meta = KPI_META[item.label] ?? {};
    return {
      ...item,
      icon: meta.icon ?? 'clipboard-list',
      iconBg: meta.iconBg ?? 'var(--muted)',
      iconColor: meta.iconColor ?? 'var(--muted-foreground)',
      trendColor: item.trend
        ? item.trendUp
          ? 'var(--color-success-foreground)'
          : 'var(--color-destructive-foreground)'
        : '',
      value: formatKpiValue(item.label, item.value),
    };
  });

  const earnings = overview.earnings
    ? {
        ...overview.earnings,
        chartData: scaleChartData(overview.earnings.chartData ?? []),
      }
    : undefined;

  return { ...overview, kpi, earnings };
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
