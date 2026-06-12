<script
  setup
  lang="ts"
>
import {
  Banknote,
  Download,
  Receipt,
  Smartphone,
  TrendingUp,
  Wallet,
} from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { getEarnings } from '@/services/earningsService';

const dateRange = ref('Last 30 days');
const kpiCards = ref<
  Array<{
    label: string;
    value: string;
    icon: string;
    detail: string;
    trendUp: boolean | null;
  }>
>([]);
const weeklyRevenue = ref<
  Array<{ week: string; online: number; cash: number }>
>([]);
const categoryBreakdown = ref<
  Array<{ name: string; amount: number; barWidth: number }>
>([]);
const topMasters = ref<
  Array<{
    initials: string;
    name: string;
    avatarBg: string;
    orders: number;
    revenue: number;
  }>
>([]);

const kpiIcons: Record<string, typeof Wallet> = {
  wallet: Wallet,
  smartphone: Smartphone,
  banknote: Banknote,
  receipt: Receipt,
};

onMounted(async () => {
  const data = await getEarnings('30d');
  kpiCards.value = data.kpi;
  weeklyRevenue.value = data.weekly;
  categoryBreakdown.value = data.categories;
  topMasters.value = data.masters;
});

function formatAmount(amount: number): string {
  return `${(amount / 1000).toFixed(0)}K UZS`;
}
</script>

<template>
  <div class="earnings-page">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <span class="breadcrumb__item">Finance</span>
      <span class="breadcrumb__separator">-</span>
      <span class="breadcrumb__item breadcrumb__item--active">Earnings</span>
    </nav>

    <!-- Header -->
    <div class="page-header">
      <div class="page-header__left">
        <h1 class="page-title">Earnings overview</h1>
        <p class="page-subtitle">
          Track your revenue, payments, and performance metrics
        </p>
      </div>
      <div class="page-header__right">
        <button
          type="button"
          class="btn btn--outline"
        >
          <span class="btn__text">{{ dateRange }}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect
              x="3"
              y="4"
              width="18"
              height="18"
              rx="2"
            />
            <path d="M3 10h18" />
          </svg>
        </button>
        <button
          type="button"
          class="btn btn--primary"
        >
          <Download :size="16" />
          <span class="btn__text">Export</span>
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div
        v-for="(card, index) in kpiCards"
        :key="index"
        class="kpi-card"
      >
        <div class="kpi-card__top">
          <div class="kpi-card__icon">
            <component
              :is="kpiIcons[card.icon] || Wallet"
              :size="20"
              color="#616167"
            />
          </div>
          <div
            v-if="card.trendUp !== null"
            class="kpi-card__trend"
            :class="{ 'kpi-card__trend--up': card.trendUp }"
          >
            <TrendingUp :size="14" />
          </div>
        </div>
        <div class="kpi-card__value">{{ card.value }}</div>
        <div class="kpi-card__label">{{ card.label }}</div>
        <div class="kpi-card__detail">{{ card.detail }}</div>
      </div>
    </div>

    <!-- Revenue Chart + Bottom Row -->
    <div class="content-grid">
      <!-- Revenue by Week Chart -->
      <div class="card chart-card">
        <h2 class="card__title">Revenue by week</h2>
        <div class="chart">
          <div class="chart__bars">
            <div
              v-for="(item, index) in weeklyRevenue"
              :key="index"
              class="chart__bar-group"
            >
              <div class="chart__bar-stack">
                <div
                  class="chart__bar chart__bar--online"
                  :style="{ height: `${item.online}px` }"
                />
                <div
                  class="chart__bar chart__bar--cash"
                  :style="{ height: `${item.cash}px` }"
                />
              </div>
              <span class="chart__label">{{ item.week }}</span>
            </div>
          </div>
          <div class="chart__legend">
            <div class="chart__legend-item">
              <span class="chart__legend-dot chart__legend-dot--online" />
              <span>Online payments</span>
            </div>
            <div class="chart__legend-item">
              <span class="chart__legend-dot chart__legend-dot--cash" />
              <span>Cash collected</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Breakdown by Category -->
      <div class="card breakdown-card">
        <h2 class="card__title">Breakdown by category</h2>
        <div class="breakdown">
          <div
            v-for="(cat, index) in categoryBreakdown"
            :key="index"
            class="breakdown__row"
          >
            <div class="breakdown__row-header">
              <span class="breakdown__name">{{ cat.name }}</span>
              <span class="breakdown__amount"
                >{{ formatAmount(cat.amount) }}</span
              >
            </div>
            <div class="breakdown__bar-track">
              <div
                class="breakdown__bar-fill"
                :style="{ width: `${cat.barWidth}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Top Masters -->
      <div class="card masters-card">
        <h2 class="card__title">Top masters</h2>
        <div class="masters">
          <div
            v-for="(master, index) in topMasters"
            :key="index"
            class="master-row"
          >
            <div
              class="master-row__avatar"
              :style="{ background: master.avatarBg }"
            >
              {{ master.initials }}
            </div>
            <div class="master-row__info">
              <span class="master-row__name">{{ master.name }}</span>
              <span class="master-row__orders">{{ master.orders }} orders</span>
            </div>
            <span class="master-row__revenue"
              >{{ formatAmount(master.revenue) }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.earnings-page {
  padding: 24px 32px;
  font-family: var(--font-primary);
  color: var(--foreground);
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 20px;
  font-size: 13px;
}

.breadcrumb__item {
  color: var(--muted-foreground);
}

.breadcrumb__item--active {
  font-weight: 500;
  color: var(--foreground);
}

.breadcrumb__separator {
  color: var(--muted-icon);
}

/* Page Header */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-header__left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--foreground);
}

.page-subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--muted-foreground);
}

.page-header__right {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* Buttons */
.btn {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 8px 16px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-md);
  transition: opacity 0.15s;
}

.btn--outline {
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
}

.btn--primary {
  color: #ffffff;
  background: var(--primary);
}

.btn__text {
  font-family: inherit;
}

/* KPI Cards */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.kpi-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.kpi-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.kpi-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--accent);
  border-radius: var(--radius-md);
}

.kpi-card__trend {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: var(--success);
  background: #e8faf0;
  border-radius: 50%;
}

.kpi-card__trend--up {
  color: var(--success);
}

.kpi-card__value {
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
}

.kpi-card__label {
  font-size: 13px;
  color: var(--muted-foreground);
}

.kpi-card__detail {
  font-size: 12px;
  color: var(--success);
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.chart-card {
  grid-column: 1 / -1;
}

/* Card */
.card {
  padding: 24px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.card__title {
  margin: 0 0 20px;
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
}

/* Chart */
.chart__bars {
  position: relative;
  display: flex;
  gap: 12px;
  align-items: flex-end;
  height: 180px;
  padding-bottom: 28px;
}

.chart__bar-group {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.chart__bar-stack {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
  justify-content: flex-end;
  width: 32px;
  height: 100%;
}

.chart__bar {
  width: 100%;
  min-height: 4px;
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
}

.chart__bar--online {
  background: var(--primary);
}

.chart__bar--cash {
  background: var(--border);
}

.chart__label {
  font-size: 12px;
  color: var(--muted-foreground);
}

.chart__legend {
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-top: 16px;
}

.chart__legend-item {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  color: var(--muted-foreground);
}

.chart__legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.chart__legend-dot--online {
  background: var(--primary);
}

.chart__legend-dot--cash {
  background: var(--border);
}

/* Breakdown */
.breakdown {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.breakdown__row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.breakdown__row-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.breakdown__name {
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
}

.breakdown__amount {
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.breakdown__bar-track {
  width: 100%;
  height: 8px;
  overflow: hidden;
  background: var(--accent);
  border-radius: var(--radius-pill);
}

.breakdown__bar-fill {
  height: 100%;
  background: var(--primary);
  border-radius: var(--radius-pill);
  transition: width 0.3s ease;
}

/* Masters */
.masters {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.master-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.master-row__avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  border-radius: 50%;
}

.master-row__info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
}

.master-row__name {
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.master-row__orders {
  font-size: 12px;
  color: var(--muted-foreground);
}

.master-row__revenue {
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}
</style>
