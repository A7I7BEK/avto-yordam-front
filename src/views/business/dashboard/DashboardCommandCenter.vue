<script
  setup
  lang="ts"
>
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  ClipboardList,
  Clock,
  Star,
  TrendingUp,
  Users,
} from '@lucide/vue';
import type { Component } from 'vue';
import { onMounted, ref } from 'vue';
import { getCommandCenterDashboard } from '@/services/dashboardService';

interface BigStat {
  label: string;
  value: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  trend: string;
}

interface StatusItem {
  label: string;
  count: number;
  trend: string;
  trendUp: boolean;
  bg: string;
  border?: boolean;
  textColor: string;
}

interface Transaction {
  type: 'incoming' | 'outgoing';
  title: string;
  time: string;
  amount: number;
}

interface Alert {
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  actionLabel: string;
  actionColor: string;
  bg: string;
  titleColor: string;
  descColor: string;
}

interface WeekBottomStat {
  value: string;
  label: string;
  color: string;
}

interface WeeklySummary {
  trendPercent: number;
  newOrders: { count: number; trend: string; trendUp: boolean };
  completed: { count: number; trend: string; trendUp: boolean };
  bottomStats: WeekBottomStat[];
}

interface DashboardData {
  bigStats: BigStat[];
  ordersByStatus: { total: number; statuses: StatusItem[] };
  recentTransactions: Transaction[];
  alerts: Alert[];
  weeklySummary: WeeklySummary;
}

const iconMap: Record<string, Component> = {
  'trending-up': TrendingUp,
  'clipboard-list': ClipboardList,
  users: Users,
  star: Star,
  clock: Clock,
  'alert-triangle': AlertTriangle,
};

const data = ref<DashboardData | null>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const result = await getCommandCenterDashboard();
    data.value = result as unknown as DashboardData;
  } finally {
    loading.value = false;
  }
});

function formatAmount(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`;
  }
  return amount.toLocaleString();
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
    class="command-center"
  >
    <!-- Big stat cards -->
    <div class="big-stats-row">
      <div
        v-for="(stat, idx) in data.bigStats"
        :key="idx"
        class="big-stat-card"
      >
        <div class="big-stat-left">
          <div
            class="big-stat-icon"
            :style="{ background: stat.iconBg, color: stat.iconColor }"
          >
            <component
              :is="iconMap[stat.icon]"
              :size="22"
            />
          </div>
          <div class="big-stat-info">
            <span class="big-stat-label">{{ stat.label }}</span>
            <span class="big-stat-value">{{ stat.value }}</span>
          </div>
        </div>
        <span class="big-stat-trend">{{ stat.trend }}</span>
      </div>
    </div>

    <!-- Middle Row -->
    <div class="two-col-row">
      <!-- Orders by Status -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Orders by Status</span>
          <span class="card-total">{{ data.ordersByStatus.total }} total</span>
        </div>
        <div class="status-grid">
          <div
            v-for="(status, sIdx) in data.ordersByStatus.statuses"
            :key="sIdx"
            class="status-mini-card"
            :style="{ background: status.bg, border: status.border ? '1px solid var(--border)' : 'none' }"
          >
            <div class="status-top">
              <span
                class="status-count"
                :style="{ color: status.textColor }"
                >{{ status.count }}</span
              >
              <span
                class="status-trend"
                :style="{ color: status.trendUp ? 'var(--success)' : 'var(--destructive)' }"
              >
                <ArrowUp
                  v-if="status.trendUp"
                  :size="10"
                />
                <ArrowDown
                  v-else
                  :size="10"
                />
                {{ status.trend }}
              </span>
            </div>
            <span
              class="status-label"
              :style="{ color: status.textColor }"
              >{{ status.label }}</span
            >
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Recent Transactions</span>
        </div>
        <div class="transactions-list">
          <div
            v-for="(txn, tIdx) in data.recentTransactions"
            :key="tIdx"
            class="txn-item"
          >
            <div
              class="txn-direction"
              :style="{ background: txn.type === 'incoming' ? 'var(--success-bg)' : 'var(--destructive-soft)' }"
            >
              <ArrowUp
                v-if="txn.type === 'incoming'"
                :size="14"
                color="var(--success)"
              />
              <ArrowDown
                v-else
                :size="14"
                color="var(--destructive)"
              />
            </div>
            <div class="txn-info">
              <span class="txn-title">{{ txn.title }}</span>
              <span class="txn-time">{{ txn.time }}</span>
            </div>
            <span
              class="txn-amount"
              :style="{ color: txn.type === 'incoming' ? 'var(--success)' : 'var(--destructive)' }"
            >
              {{ txn.type === 'incoming' ? '+' : '' }}
              {{ formatAmount(txn.amount) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="two-col-row">
      <!-- Needs Attention -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Needs Attention</span>
        </div>
        <div class="alerts-list">
          <div
            v-for="(alert, aIdx) in data.alerts"
            :key="aIdx"
            class="alert-item"
            :style="{ background: alert.bg }"
          >
            <div
              class="alert-icon"
              :style="{ background: alert.iconBg }"
            >
              <component
                :is="iconMap[alert.icon]"
                :size="16"
                color="#ffffff"
              />
            </div>
            <div class="alert-body">
              <span
                class="alert-title"
                :style="{ color: alert.titleColor }"
                >{{ alert.title }}</span
              >
              <span
                class="alert-desc"
                :style="{ color: alert.descColor }"
                >{{ alert.description }}</span
              >
            </div>
            <a
              class="alert-action"
              :style="{ color: alert.actionColor }"
              href="#"
              >{{ alert.actionLabel }}</a
            >
          </div>
        </div>
      </div>

      <!-- This Week Summary -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">This Week</span>
          <div class="week-trend-badge">
            <ArrowUp
              :size="11"
              color="#1F8F3D"
            />
            <span>{{ data.weeklySummary.trendPercent }}%</span>
          </div>
        </div>
        <div class="week-sub-cards">
          <div class="week-sub-card">
            <span class="week-sub-value"
              >{{ data.weeklySummary.newOrders.count }}</span
            >
            <div class="week-sub-meta">
              <span class="week-sub-label">New Orders</span>
              <span
                class="week-sub-trend"
                :class="{ up: data.weeklySummary.newOrders.trendUp }"
              >
                <ArrowUp
                  v-if="data.weeklySummary.newOrders.trendUp"
                  :size="10"
                />
                {{ data.weeklySummary.newOrders.trend }}
              </span>
            </div>
          </div>
          <div class="week-sub-card">
            <span class="week-sub-value"
              >{{ data.weeklySummary.completed.count }}</span
            >
            <div class="week-sub-meta">
              <span class="week-sub-label">Completed</span>
              <span
                class="week-sub-trend"
                :class="{ up: data.weeklySummary.completed.trendUp }"
              >
                <ArrowUp
                  v-if="data.weeklySummary.completed.trendUp"
                  :size="10"
                />
                {{ data.weeklySummary.completed.trend }}
              </span>
            </div>
          </div>
        </div>
        <div class="week-bottom-stats">
          <div
            v-for="(stat, wIdx) in data.weeklySummary.bottomStats"
            :key="wIdx"
            class="week-stat"
          >
            <span
              class="week-stat-value"
              :style="{ color: stat.color }"
              >{{ stat.value }}</span
            >
            <span class="week-stat-label">{{ stat.label }}</span>
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
  color: var(--muted-foreground);
}

.command-center {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 24px;
  font-family: Inter, sans-serif;
}

/* Big Stat Cards */
.big-stats-row {
  display: flex;
  gap: 12px;
}

.big-stat-card {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  height: 120px;
  padding: 18px 20px;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 24px;
}

.big-stat-left {
  display: flex;
  gap: 14px;
  align-items: center;
}

.big-stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
}

.big-stat-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.big-stat-label {
  font-size: 13px;
  color: var(--muted-foreground);
}

.big-stat-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--foreground);
}

.big-stat-trend {
  font-size: 12px;
  color: var(--muted-foreground);
  text-align: right;
}

/* Two Column Row */
.two-col-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* Shared Card */
.card {
  display: flex;
  flex-direction: column;
  height: 320px;
  padding: 20px;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 24px;
}

.card:has(.alerts-list),
.card:has(.week-sub-cards) {
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
  color: var(--foreground);
}

.card-total {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* Orders by Status Grid */
.status-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.status-mini-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  border-radius: 14px;
}

.status-mini-card:nth-child(4),
.status-mini-card:nth-child(5) {
  grid-column: span 1;
}

.status-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-count {
  font-size: 20px;
  font-weight: 700;
}

.status-trend {
  display: flex;
  gap: 2px;
  align-items: center;
  font-size: 11px;
  font-weight: 500;
}

.status-label {
  font-size: 12px;
}

/* Transactions */
.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.txn-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}

.txn-item:last-child {
  border-bottom: none;
}

.txn-direction {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
}

.txn-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 3px;
}

.txn-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
}

.txn-time {
  font-size: 11px;
  color: var(--muted-foreground);
}

.txn-amount {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

/* Alerts */
.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.alert-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px;
  border-radius: 14px;
}

.alert-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
}

.alert-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 3px;
}

.alert-title {
  font-size: 13px;
  font-weight: 600;
}

.alert-desc {
  font-size: 11px;
}

.alert-action {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
}

/* Weekly Summary */
.week-trend-badge {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--success);
  background: var(--success-bg);
  border-radius: 999px;
}

.week-sub-cards {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.week-sub-card {
  display: flex;
  flex: 1;
  gap: 12px;
  align-items: center;
  padding: 14px;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: 14px;
}

.week-sub-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--foreground);
}

.week-sub-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.week-sub-label {
  font-size: 12px;
  color: var(--muted-foreground);
}

.week-sub-trend {
  display: flex;
  gap: 2px;
  align-items: center;
  font-size: 11px;
  font-weight: 500;
  color: var(--success);
}

.week-bottom-stats {
  display: flex;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.week-stat {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  align-items: center;
}

.week-stat-value {
  font-size: 16px;
  font-weight: 700;
}

.week-stat-label {
  font-size: 11px;
  color: var(--muted-foreground);
}
</style>
