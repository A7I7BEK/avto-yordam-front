import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import {
  categoryBreakdown,
  kpiCards,
  topMasters,
  weeklyRevenue,
} from '@/data/earnings';

const EARNINGS_KPI_ICONS: Record<string, string> = {
  'Total earnings': 'wallet',
  'Online payments': 'smartphone',
  'Cash collected': 'banknote',
  'Avg order value': 'receipt',
};

const MASTER_AVATAR_COLORS = ['#5749F4', '#FF7A4B', '#1FAA59', '#00A0E9', '#7C3AED'];

function normalizeEarnings(data: {
  kpi?: Array<{ label: string; [key: string]: unknown }>;
  masters?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}) {
  const kpi = (data.kpi ?? []).map((card) => ({
    ...card,
    icon: EARNINGS_KPI_ICONS[card.label] ?? 'wallet',
  }));

  const masters = (data.masters ?? []).map((master, idx) => ({
    ...master,
    avatarBg: MASTER_AVATAR_COLORS[idx % MASTER_AVATAR_COLORS.length],
  }));

  return { ...data, kpi, masters };
}

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
    const response = await apiClient.get('/dashboard/earnings', {
      params: { dateRange },
    });
    return normalizeEarnings(response);
  } catch {
    return {
      kpi: kpiCards,
      weekly: weeklyRevenue,
      categories: categoryBreakdown,
      masters: topMasters,
    };
  }
}
