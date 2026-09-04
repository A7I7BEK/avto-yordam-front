<script
  setup
  lang="ts"
>
import {
  Calendar,
  CalendarCheck,
  ChevronDown,
  Star,
  Wallet,
} from '@lucide/vue';
import type { Component } from 'vue';
import { computed, onMounted, ref } from 'vue';
import BreadcrumbBar from '@/components/app/BreadcrumbBar.vue';
import KpiCard from '@/components/app/KpiCard.vue';
import StatusBadge from '@/components/app/StatusBadge.vue';
import { getMasterOverviewDashboard } from '@/services/dashboardService';

interface KpiItem {
  label: string;
  value: string;
  trend: string;
  icon: Component;
  iconBg: string;
  iconColor: string;
}

interface PerfRow {
  name: string;
  orders: number;
  trendPct: string | null;
  trendUp: boolean;
}

interface ChartBar {
  completed: number;
  cancelled: number;
}

interface BookingRow {
  id: string;
  customer: string;
  service: string;
  status: string;
  variant: 'green' | 'amber' | 'grey';
  amount: string;
}

const fallbackKpi: KpiItem[] = [
  {
    label: 'Total bookings',
    value: '1,284',
    trend: '+12.4%',
    icon: CalendarCheck,
    iconBg: 'rgba(87,73,244,0.1)',
    iconColor: 'var(--primary)',
  },
  {
    label: 'Revenue this month',
    value: '48.2M UZS',
    trend: '+8.2%',
    icon: Wallet,
    iconBg: 'rgba(161,229,161,0.2)',
    iconColor: '#1F8F3D',
  },
  {
    label: 'Avg rating',
    value: '4.92',
    trend: '+0.05',
    icon: Star,
    iconBg: 'rgba(255,217,178,0.4)',
    iconColor: '#B26B00',
  },
];

const fallbackPerf: PerfRow[] = [
  { name: 'Engine', orders: 148, trendPct: '+12%', trendUp: true },
  { name: 'Chassis', orders: 92, trendPct: '+8%', trendUp: true },
  { name: 'Electrical', orders: 54, trendPct: '+3%', trendUp: true },
  { name: 'Transmission', orders: 31, trendPct: '+5%', trendUp: true },
];

const fallbackChart: ChartBar[] = [
  { completed: 85, cancelled: 8 },
  { completed: 92, cancelled: 5 },
  { completed: 78, cancelled: 12 },
  { completed: 108, cancelled: 10 },
  { completed: 64, cancelled: 6 },
  { completed: 45, cancelled: 3 },
  { completed: 38, cancelled: 2 },
];

const fallbackBookings: BookingRow[] = [
  {
    id: '#ORD-2847',
    customer: 'Alisher Usmonov',
    service: 'Engine diagnostic',
    status: 'Completed',
    variant: 'green',
    amount: '320K UZS',
  },
  {
    id: '#ORD-2846',
    customer: 'Bekzod Toshmatov',
    service: 'Oil change',
    status: 'In progress',
    variant: 'green',
    amount: '85K UZS',
  },
  {
    id: '#ORD-2845',
    customer: 'Dilshod Karimov',
    service: 'Brake replacement',
    status: 'Completed',
    variant: 'green',
    amount: '450K UZS',
  },
  {
    id: '#ORD-2844',
    customer: 'Farhod Rahimov',
    service: 'A/C service',
    status: 'Cancelled',
    variant: 'grey',
    amount: '120K UZS',
  },
  {
    id: '#ORD-2843',
    customer: 'Gulnora Azizova',
    service: 'Transmission flush',
    status: 'Completed',
    variant: 'green',
    amount: '280K UZS',
  },
];

const chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const kpiCards = ref<KpiItem[]>(fallbackKpi);
const performanceRows = ref<PerfRow[]>(fallbackPerf);
const chartData = ref<ChartBar[]>(fallbackChart);
const recentBookings = ref<BookingRow[]>(fallbackBookings);

const maxCompleted = computed(() =>
  Math.max(...chartData.value.map((d) => d.completed), 1),
);

const maxOrders = computed(() =>
  Math.max(...performanceRows.value.map((r) => r.orders), 1),
);

function perfBarWidth(orders: number): number {
  return Math.max(Math.round((orders / maxOrders.value) * 100), 4);
}

function formatCount(value: number): string {
  return value.toLocaleString('en-US');
}

function formatRevenue(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M UZS`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}K UZS`;
  }
  return `${Math.round(value)} UZS`;
}

function statusMeta(
  status: string,
): { label: string; variant: 'green' | 'amber' | 'grey' } {
  switch (status) {
    case 'done':
      return { label: 'Completed', variant: 'green' };
    case 'active':
      return { label: 'In progress', variant: 'green' };
    case 'pending':
      return { label: 'Pending', variant: 'amber' };
    default:
      return { label: 'Cancelled', variant: 'grey' };
  }
}

onMounted(async () => {
  const data = await getMasterOverviewDashboard();
  if (!data) {
    return;
  }

  const kpi: KpiItem[] = [];
  if (data.totalBookings != null) {
    kpi.push({
      label: 'Total bookings',
      value: formatCount(Number(data.totalBookings)),
      trend: data.totalBookingsTrend || '—',
      icon: CalendarCheck,
      iconBg: 'rgba(87,73,244,0.1)',
      iconColor: 'var(--primary)',
    });
  }
  if (data.revenueMonth != null) {
    kpi.push({
      label: 'Revenue this month',
      value: formatRevenue(Number(data.revenueMonth)),
      trend: data.revenueMonthTrend || '—',
      icon: Wallet,
      iconBg: 'rgba(161,229,161,0.2)',
      iconColor: '#1F8F3D',
    });
  }
  if (data.avgRating != null) {
    kpi.push({
      label: 'Avg rating',
      value: Number(data.avgRating).toFixed(2),
      trend: data.avgRatingTrend || '—',
      icon: Star,
      iconBg: 'rgba(255,217,178,0.4)',
      iconColor: '#B26B00',
    });
  }

  performanceRows.value = (data.catalogOrders ?? []).map((c) => ({
    name: c.service ?? '—',
    orders: Math.round(Number(c.ordersCount ?? 0)),
    trendPct: c.avgRatingTrend,
    trendUp: c.avgRatingTrendUp,
  }));

  chartData.value = (data.weeklyOrders ?? []).map((w) => ({
    completed: Math.round(Number(w.countCompleted ?? 0)),
    cancelled: Math.round(Number(w.countCancelled ?? 0)),
  }));

  recentBookings.value = (data.recentOrders ?? []).map((r) => {
    const meta = statusMeta(r.status);
    return {
      id: r.id ?? '—',
      customer: r.customerName ?? '—',
      service: r.service ?? '—',
      status: meta.label,
      variant: meta.variant,
      amount: r.amount ?? '0 UZS',
    };
  });

  kpiCards.value = kpi;
});
</script>

<template>
  <div class="dashboard">
    <BreadcrumbBar :items="['Workspace', 'Dashboard']" />

    <!-- Header Row -->
    <div class="header-row">
      <div class="header-left">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Your performance at a glance</p>
      </div>
      <div class="date-filter">
        <Calendar
          :size="13"
          color="var(--foreground)"
        />
        <span>This month</span>
        <ChevronDown
          :size="12"
          color="var(--muted-foreground)"
        />
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-row">
      <KpiCard
        v-for="card in kpiCards"
        :key="card.label"
        v-bind="card"
      />
    </div>

    <!-- Performance Table + Chart -->
    <div class="split-row">
      <!-- Performance Table -->
      <div class="table-card">
        <div class="card-title-bar">Performance by service category</div>
        <div class="table-scroll-wrapper">
          <div class="table-header">
            <span class="col-category">CATEGORY</span>
            <span class="col-orders">ORDERS</span>
            <span class="col-trend">TREND</span>
          </div>
          <div
            v-for="row in performanceRows"
            :key="row.name"
            class="table-row"
          >
            <div class="col-category">
              <div class="cat-text">
                <span class="cat-name">{{ row.name }}</span>
              </div>
            </div>
            <div class="col-orders">
              {{ row.orders }}
            </div>
            <div class="col-trend">
              <div class="trend-track">
                <div
                  class="trend-fill"
                  :style="{
                    width: `${perfBarWidth(row.orders)}%`,
                    background: row.trendUp
                      ? 'var(--success)'
                      : 'var(--muted-foreground)',
                  }"
                />
              </div>
              <span class="trend-pct">{{ row.trendPct ?? '—' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly Chart -->
      <div class="chart-card">
        <div class="chart-title-row">
          <span class="card-title-bar">Weekly bookings</span>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="legend-dot completed" />
              <span>Completed</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot cancelled" />
              <span>Cancelled</span>
            </div>
          </div>
        </div>
        <div class="chart-scroll-wrapper">
          <div class="chart-body">
            <div
              v-for="(day, idx) in chartDays"
              :key="day"
              class="chart-column"
            >
              <div class="bar-container">
                <div
                  class="bar bar-cancelled"
                  :style="{
                    height: `${((chartData[idx]?.cancelled ?? 0) / maxCompleted) * 100}%`,
                  }"
                />
                <div
                  class="bar bar-completed"
                  :style="{
                    height: `${((chartData[idx]?.completed ?? 0) / maxCompleted) * 100}%`,
                  }"
                />
              </div>
              <span class="bar-label">{{ day }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Bookings -->
    <div class="table-card">
      <div class="card-title-bar">Recent bookings</div>
      <div class="table-scroll-wrapper">
        <table class="bookings-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="b in recentBookings"
              :key="b.id"
            >
              <td class="order-id">{{ b.id }}</td>
              <td>{{ b.customer }}</td>
              <td>{{ b.service }}</td>
              <td>
                <StatusBadge
                  :status="b.status"
                  :variant="b.variant"
                />
              </td>
              <td class="amount">{{ b.amount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  padding: 24px;
  overflow-y: auto;
}

.header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
}

.page-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--muted-foreground);
}

.date-filter {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 12px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
  background: var(--muted);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
}

.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.split-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.table-card,
.chart-card {
  flex: 1;
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 16px;
}

.table-scroll-wrapper,
.chart-scroll-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 1023px) {
  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .split-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .dashboard {
    padding: 16px 12px;
  }

  .header-row {
    flex-direction: column;
    gap: 12px;
  }

  .kpi-row {
    grid-template-columns: 1fr;
  }
}

.card-title-bar {
  padding: 14px 18px;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
  border-bottom: 1px solid var(--border-soft);
}

.table-header {
  display: flex;
  align-items: center;
  min-width: 540px;
  padding: 10px 18px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-foreground);
  letter-spacing: 0.5px;
  background: var(--muted);
  border-bottom: 1px solid var(--border-soft);
}

.col-category {
  display: flex;
  flex: 1;
  gap: 12px;
  align-items: center;
}

.col-rating {
  display: flex;
  gap: 6px;
  align-items: center;
  width: 120px;
}

.col-orders {
  width: 120px;
}

.col-trend {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 280px;
}

.table-row {
  display: flex;
  align-items: center;
  min-width: 540px;
  padding: 12px 18px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--foreground);
  border-bottom: 1px solid var(--border-soft);
}

.cat-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--muted);
  border: 1px solid var(--border-soft);
  border-radius: 8px;
}

.cat-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cat-name {
  font-weight: 600;
}

.cat-sub {
  font-size: 11px;
  color: var(--muted-foreground);
}

.trend-track {
  width: 180px;
  height: 6px;
  overflow: hidden;
  background: var(--muted);
  border-radius: 999px;
}

.trend-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 999px;
}

.trend-pct {
  font-weight: 600;
  color: var(--color-success-foreground);
}

.chart-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 18px;
}

.chart-legend {
  display: flex;
  gap: 14px;
  align-items: center;
  font-family: Inter, sans-serif;
  font-size: 11px;
  color: var(--muted-foreground);
}

.legend-item {
  display: flex;
  gap: 6px;
  align-items: center;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
}

.legend-dot.completed {
  background: var(--primary);
}

.legend-dot.cancelled {
  background: var(--border-soft);
}

.chart-body {
  display: flex;
  gap: 8px;
  justify-content: space-between;
  padding: 18px;
}

.chart-column {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.bar-container {
  display: flex;
  flex-direction: column-reverse;
  gap: 2px;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--muted);
  border-radius: 6px;
}

.bar {
  width: 100%;
  border-radius: 6px 6px 0 0;
  transition: height 0.3s;
}

.bar-completed {
  background: var(--primary);
}

.bar-cancelled {
  background: var(--border-soft);
}

.bar-label {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: var(--muted-foreground);
}

.bookings-table {
  width: 100%;
  min-width: 540px;
  font-family: Inter, sans-serif;
  border-collapse: collapse;
}

.bookings-table th {
  padding: 10px 18px;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-foreground);
  text-align: left;
  letter-spacing: 0.5px;
  background: var(--muted);
  border-bottom: 1px solid var(--border-soft);
}

.bookings-table td {
  padding: 12px 18px;
  font-size: 13px;
  color: var(--foreground);
  border-bottom: 1px solid var(--border-soft);
}

.order-id {
  font-weight: 600;
}

.amount {
  font-weight: 600;
}
</style>
