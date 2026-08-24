<script
  setup
  lang="ts"
>
import {
  Calendar,
  CalendarCheck,
  Car,
  ChevronDown,
  ChevronRight,
  Cog,
  Droplet,
  Star,
  Timer,
  TrendingUp,
  Wallet,
  Zap,
} from '@lucide/vue';
import BreadcrumbBar from '@/components/app/BreadcrumbBar.vue';
import KpiCard from '@/components/app/KpiCard.vue';
import StatusBadge from '@/components/app/StatusBadge.vue';

const kpiCards = [
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
    value: '$24,860',
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
  {
    label: 'Response time',
    value: '3m 12s',
    trend: '-18s',
    icon: Timer,
    iconBg: 'rgba(201,214,240,0.4)',
    iconColor: '#1E3A8A',
  },
];

const performanceRows = [
  {
    icon: Droplet,
    name: 'Engine',
    subcats: '8 subcategories',
    rating: 4.9,
    orders: 148,
    trendPct: '+12%',
    trendWidth: 166,
  },
  {
    icon: Car,
    name: 'Chassis',
    subcats: '6 subcategories',
    rating: 4.8,
    orders: 92,
    trendPct: '+8%',
    trendWidth: 126,
  },
  {
    icon: Zap,
    name: 'Electrical',
    subcats: '5 subcategories',
    rating: 4.7,
    orders: 54,
    trendPct: '+3%',
    trendWidth: 81,
  },
  {
    icon: Cog,
    name: 'Transmission',
    subcats: '4 subcategories',
    rating: 4.6,
    orders: 31,
    trendPct: '+5%',
    trendWidth: 54,
  },
];

const recentBookings = [
  {
    id: '#ORD-2847',
    customer: 'Alisher Usmonov',
    service: 'Engine diagnostic',
    date: 'Jun 10, 2026',
    status: 'Completed',
    variant: 'green' as const,
    amount: '$320',
  },
  {
    id: '#ORD-2846',
    customer: 'Bekzod Toshmatov',
    service: 'Oil change',
    date: 'Jun 10, 2026',
    status: 'In progress',
    variant: 'amber' as const,
    amount: '$85',
  },
  {
    id: '#ORD-2845',
    customer: 'Dilshod Karimov',
    service: 'Brake replacement',
    date: 'Jun 9, 2026',
    status: 'Completed',
    variant: 'green' as const,
    amount: '$450',
  },
  {
    id: '#ORD-2844',
    customer: 'Farhod Rahimov',
    service: 'A/C service',
    date: 'Jun 9, 2026',
    status: 'Cancelled',
    variant: 'grey' as const,
    amount: '$120',
  },
  {
    id: '#ORD-2843',
    customer: 'Gulnora Azizova',
    service: 'Transmission flush',
    date: 'Jun 8, 2026',
    status: 'Completed',
    variant: 'green' as const,
    amount: '$280',
  },
];

const chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const chartData = [
  { completed: 85, cancelled: 8 },
  { completed: 92, cancelled: 5 },
  { completed: 78, cancelled: 12 },
  { completed: 108, cancelled: 10 },
  { completed: 64, cancelled: 6 },
  { completed: 45, cancelled: 3 },
  { completed: 38, cancelled: 2 },
];

const maxCompleted = Math.max(...chartData.map((d) => d.completed));
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
        <span>Last 6 months</span>
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
        <div class="table-header">
          <span class="col-category">CATEGORY</span>
          <span class="col-rating">RATING</span>
          <span class="col-orders">ORDERS</span>
          <span class="col-trend">TREND</span>
        </div>
        <div
          v-for="row in performanceRows"
          :key="row.name"
          class="table-row"
        >
          <div class="col-category">
            <div class="cat-icon">
              <component
                :is="row.icon"
                :size="16"
                color="var(--muted-foreground)"
              />
            </div>
            <div class="cat-text">
              <span class="cat-name">{{ row.name }}</span>
              <span class="cat-sub">{{ row.subcats }}</span>
            </div>
          </div>
          <div class="col-rating">
            <Star
              :size="14"
              color="#FBBF24"
            />
            <span>{{ row.rating }}</span>
          </div>
          <div class="col-orders">
            {{ row.orders }}
          </div>
          <div class="col-trend">
            <div class="trend-track">
              <div
                class="trend-fill"
                :style="{ width: `${(row.trendWidth / 180) * 100}%` }"
              />
            </div>
            <span class="trend-pct">{{ row.trendPct }}</span>
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

    <!-- Recent Bookings -->
    <div class="table-card">
      <div class="card-title-bar">Recent bookings</div>
      <table class="bookings-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Service</th>
            <th>Date</th>
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
            <td>{{ b.date }}</td>
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
  display: flex;
  gap: 14px;
}

.split-row {
  display: flex;
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
