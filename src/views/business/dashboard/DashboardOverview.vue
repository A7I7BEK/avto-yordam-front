<script
  setup
  lang="ts"
>
import {
  ArrowDown,
  ArrowUp,
  Banknote,
  CircleCheck,
  ClipboardList,
  Clock,
  Star,
  TrendingUp,
  Users,
} from '@lucide/vue';
import type { Component } from 'vue';
import { onMounted, ref } from 'vue';
import { getOverviewDashboard } from '@/services/dashboardService';

interface KpiItem {
  icon: string;
  iconBg: string;
  iconColor: string;
  trend: string | null;
  trendUp: boolean;
  trendColor: string;
  label: string;
  value: string;
}

interface RecentOrder {
  id: string;
  customerName: string;
  customerInitials: string;
  service: string;
  employeeName: string;
  amount: string;
  status: string;
}

interface ChartDay {
  day: string;
  value: number;
}

interface Earnings {
  totalAmount: number;
  currency: string;
  trendPercent: number;
  chartData: ChartDay[];
  totalTransactions: number;
  avgPerOrder: number;
}

interface TopEmployee {
  initials: string;
  name: string;
  orders: number;
  revenue: string;
  rating: number;
}

interface ServiceItem {
  name: string;
  count: number;
  maxCount: number;
}

interface DashboardData {
  kpi: KpiItem[];
  recentOrders: RecentOrder[];
  earnings: Earnings;
  topEmployees: TopEmployee[];
  serviceBreakdown: ServiceItem[];
}

const iconMap: Record<string, Component> = {
  'clipboard-list': ClipboardList,
  'trending-up': TrendingUp,
  users: Users,
  clock: Clock,
  banknote: Banknote,
  'circle-check': CircleCheck,
};

const data = ref<DashboardData | null>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const result = await getOverviewDashboard();
    data.value = result as unknown as DashboardData;
  } finally {
    loading.value = false;
  }
});

function statusColor(status: string): string {
  if (status === 'active') {
    return '#25603A';
  }
  if (status === 'pending') {
    return '#B45309';
  }
  return '#616167';
}

function statusBg(status: string): string {
  if (status === 'active') {
    return '#E8FAF0';
  }
  if (status === 'pending') {
    return '#FFF6E9';
  }
  return '#F5F5F5';
}

function formatAmount(amount: number, currency: string): string {
  if (currency === 'UZS') {
    return `${amount.toLocaleString('uz-UZ')} UZS`;
  }
  return `${amount.toLocaleString()} ${currency}`;
}
</script>

<template>
  <div
    v-if="loading"
    class="loading-state"
  >
    <span>Loading dashboard...</span>
  </div>

  <div
    v-else-if="data"
    class="overview-dashboard"
  >
    <!-- KPI Row -->
    <div class="kpi-row">
      <div
        v-for="(item, idx) in data.kpi"
        :key="idx"
        class="kpi-card"
      >
        <div class="kpi-card-top">
          <span class="kpi-label">{{ item.label }}</span>
          <div
            class="kpi-icon-circle"
            :style="{ background: item.iconBg, color: item.iconColor }"
          >
            <component
              :is="iconMap[item.icon]"
              :size="18"
            />
          </div>
        </div>
        <span class="kpi-value">{{ item.value }}</span>
        <div
          v-if="item.trend"
          class="trend-badge"
          :style="{ color: item.trendColor, background: item.trendUp ? '#E8FAF0' : '#FDEBEC' }"
        >
          <ArrowUp
            v-if="item.trendUp"
            :size="11"
          />
          <ArrowDown
            v-else
            :size="11"
          />
          <span>{{ item.trend }}</span>
        </div>
      </div>
    </div>

    <!-- Middle Row -->
    <div class="middle-row">
      <!-- Recent Orders -->
      <div class="card recent-orders-card">
        <div class="card-header">
          <span class="card-title">Recent Orders</span>
          <a
            class="view-link"
            href="/business/orders"
            >View all →</a
          >
        </div>
        <table class="orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Master</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in data.recentOrders"
              :key="order.id"
            >
              <td class="order-id">{{ order.id }}</td>
              <td>
                <div class="customer-cell">
                  <div class="avatar-small">{{ order.customerInitials }}</div>
                  <span>{{ order.customerName }}</span>
                </div>
              </td>
              <td class="service-cell">{{ order.service }}</td>
              <td class="employee-cell">{{ order.employeeName }}</td>
              <td class="amount-cell">{{ order.amount }}</td>
              <td>
                <span
                  class="status-dot"
                  :style="{ background: statusBg(order.status), color: statusColor(order.status) }"
                >
                  <span
                    class="dot"
                    :style="{ background: statusColor(order.status) }"
                  />
                  {{ order.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Earnings -->
      <div class="card earnings-card">
        <div class="card-header">
          <span class="card-title">Earnings</span>
        </div>
        <div class="earnings-top">
          <span class="earnings-amount"
            >{{ formatAmount(data.earnings.totalAmount, data.earnings.currency) }}</span
          >
          <div class="trend-up-badge">
            <ArrowUp
              :size="11"
              color="#1F8F3D"
            />
            <span>{{ data.earnings.trendPercent }}% vs last month</span>
          </div>
        </div>
        <!-- Bar Chart -->
        <div class="bar-chart">
          <div
            v-for="(bar, bIdx) in data.earnings.chartData"
            :key="bIdx"
            class="bar-column"
          >
            <div class="bar-track">
              <div
                class="bar-fill"
                :style="{ height: `${bar.value}%` }"
              />
            </div>
            <span class="bar-label">{{ bar.day }}</span>
          </div>
        </div>
        <div class="earnings-bottom">
          <div class="earnings-stat">
            <span class="stat-label">Total transactions</span>
            <span class="stat-value"
              >{{ data.earnings.totalTransactions }}</span
            >
          </div>
          <div class="earnings-stat">
            <span class="stat-label">Avg per order</span>
            <span class="stat-value"
              >{{ formatAmount(data.earnings.avgPerOrder, data.earnings.currency) }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="bottom-row">
      <!-- Top Employees -->
      <div class="card top-employees-card">
        <div class="card-header">
          <span class="card-title">Top Employees</span>
        </div>
        <div class="employee-list">
          <div
            v-for="(emp, eIdx) in data.topEmployees"
            :key="eIdx"
            class="employee-row"
          >
            <div
              class="employee-avatar"
              :style="{ background: ['#EEF0FF', '#E8FAF0', '#FFF0E9'][eIdx] }"
            >
              <span :style="{ color: ['#5749F4', '#25603A', '#A05A00'][eIdx] }"
                >{{ emp.initials }}</span
              >
            </div>
            <div class="employee-info">
              <span class="employee-name">{{ emp.name }}</span>
              <span class="employee-stats"
                >{{ emp.orders }}
                orders · {{ emp.revenue }}</span
              >
            </div>
            <div class="rating-badge">
              <Star
                :size="12"
                color="#B45309"
                fill="#B45309"
              />
              <span>{{ emp.rating }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Service Breakdown -->
      <div class="card service-breakdown-card">
        <div class="card-header">
          <span class="card-title">Service Breakdown</span>
        </div>
        <div class="progress-list">
          <div
            v-for="(svc, sIdx) in data.serviceBreakdown"
            :key="sIdx"
            class="progress-item"
          >
            <div class="progress-top">
              <span class="progress-name">{{ svc.name }}</span>
              <span class="progress-count">{{ svc.count }}</span>
            </div>
            <div class="progress-track">
              <div
                class="progress-fill"
                :style="{ width: `${(svc.count / svc.maxCount) * 100}%`, background: ['#5749F4', '#25603A', '#B45309', '#7C3AED'][sIdx] }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #616167;
}

.overview-dashboard {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 24px;
  font-family: Inter, sans-serif;
}

/* KPI Row */
.kpi-row {
  display: flex;
  gap: 12px;
}

.kpi-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 24px;
}

.kpi-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kpi-label {
  font-size: 13px;
  font-weight: 500;
  color: #616167;
}

.kpi-icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
}

.kpi-value {
  font-size: 24px;
  font-weight: 700;
  color: #2a2933;
}

.trend-badge {
  display: flex;
  gap: 4px;
  align-items: center;
  align-self: flex-start;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 999px;
}

/* Middle Row */
.middle-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* Bottom Row */
.bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* Shared Card */
.card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 24px;
}

.recent-orders-card {
  height: 350px;
}

.earnings-card {
  height: 350px;
}

.top-employees-card {
  height: 250px;
}

.service-breakdown-card {
  height: 250px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #2a2933;
}

.view-link {
  font-size: 13px;
  font-weight: 500;
  color: #5749f4;
  text-decoration: none;
}

.view-link:hover {
  text-decoration: underline;
}

/* Recent Orders Table */
.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th {
  padding: 8px 8px 8px 0;
  font-size: 11px;
  font-weight: 600;
  color: #616167;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-bottom: 1px solid #f0f0f0;
}

.orders-table td {
  padding: 10px 8px 10px 0;
  font-size: 13px;
  color: #2a2933;
  border-bottom: 1px solid #f5f5f5;
}

.orders-table tr:last-child td {
  border-bottom: none;
}

.order-id {
  font-weight: 600;
  color: #5749f4;
}

.customer-cell {
  display: flex;
  gap: 8px;
  align-items: center;
}

.avatar-small {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  font-size: 10px;
  font-weight: 600;
  color: #5749f4;
  background: #eef0ff;
  border-radius: 999px;
}

.service-cell {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #616167;
  white-space: nowrap;
}

.employee-cell {
  color: #616167;
}

.amount-cell {
  font-weight: 600;
}

.status-dot {
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 999px;
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 999px;
}

/* Earnings */
.earnings-top {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.earnings-amount {
  font-size: 22px;
  font-weight: 700;
  color: #2a2933;
}

.trend-up-badge {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 12px;
  color: #25603a;
}

/* Bar Chart */
.bar-chart {
  display: flex;
  flex: 1;
  gap: 6px;
  align-items: flex-end;
  margin-bottom: 16px;
}

.bar-column {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}

.bar-track {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 100px;
  overflow: hidden;
  background: #f5f5f5;
  border-radius: 6px;
}

.bar-fill {
  width: 100%;
  min-height: 4px;
  background: #5749f4;
  border-radius: 6px 6px 0 0;
  transition: height 0.3s;
}

.bar-label {
  font-size: 10px;
  color: #616167;
  text-transform: uppercase;
}

/* Earnings Bottom */
.earnings-bottom {
  display: flex;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.earnings-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 11px;
  color: #616167;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #2a2933;
}

/* Top Employees */
.employee-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0;
}

.employee-row {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.employee-row:last-child {
  border-bottom: none;
}

.employee-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 999px;
}

.employee-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
}

.employee-name {
  font-size: 13px;
  font-weight: 600;
  color: #2a2933;
}

.employee-stats {
  font-size: 11px;
  color: #616167;
}

.rating-badge {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 600;
  color: #b45309;
  background: #fff8e5;
  border-radius: 999px;
}

/* Service Breakdown */
.progress-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 14px;
  justify-content: center;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-top {
  display: flex;
  justify-content: space-between;
}

.progress-name {
  font-size: 13px;
  color: #2a2933;
}

.progress-count {
  font-size: 13px;
  font-weight: 600;
  color: #2a2933;
}

.progress-track {
  width: 100%;
  height: 8px;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 999px;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s;
}
</style>
