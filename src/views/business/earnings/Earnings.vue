<script
  setup
  lang="ts"
>
import {
  Banknote,
  Calendar,
  ChevronDown,
  Download,
  Receipt,
  Smartphone,
  TrendingUp,
  Wallet,
} from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import { getEarnings } from '@/services/earningsService';

interface KpiCard {
  label: string;
  value: string;
  icon: string;
  detail: string;
  trendUp: boolean | null;
}

interface WeeklyBar {
  week: string;
  online: number;
  cash: number;
}

interface CategoryRow {
  name: string;
  amount: number;
  barWidth: number;
}

interface MasterRow {
  initials: string;
  name: string;
  avatarBg: string;
  orders: number;
  revenue: number;
}

const dateFilter = ref('');
const kpiCards = ref<KpiCard[]>([]);
const weeklyRevenue = ref<WeeklyBar[]>([]);
const categoryBreakdown = ref<CategoryRow[]>([]);
const topMasters = ref<MasterRow[]>([]);
const loading = ref(true);

const dateOptions = [
  { label: 'All time', value: '' },
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'This week', value: 'this-week' },
  { label: 'Last week', value: 'last-week' },
  { label: 'This month', value: 'this-month' },
  { label: 'Last month', value: 'last-month' },
  { label: 'This year', value: 'this-year' },
  { label: 'Last year', value: 'last-year' },
  { label: 'Last 30 days', value: 'last-30' },
];

const kpiIcons: Record<string, typeof Wallet> = {
  wallet: Wallet,
  smartphone: Smartphone,
  banknote: Banknote,
  receipt: Receipt,
};

async function loadEarnings() {
  try {
    loading.value = true;
    const data = await getEarnings(dateFilter.value || 'all');
    kpiCards.value = data.kpi;
    weeklyRevenue.value = data.weekly;
    categoryBreakdown.value = data.categories;
    topMasters.value = data.masters;
  } finally {
    loading.value = false;
  }
}

loadEarnings();

watch(dateFilter, () => {
  loadEarnings();
});

function formatAmount(amount: number): string {
  return `${(amount / 1000).toFixed(0)}K UZS`;
}

const maxOnline = computed(() =>
  Math.max(...weeklyRevenue.value.map((w) => w.online), 1),
);

const maxCash = computed(() =>
  Math.max(...weeklyRevenue.value.map((w) => w.cash), 1),
);

function onlineHeight(val: number): number {
  return (val / maxOnline.value) * 120;
}

function cashHeight(val: number): number {
  return (val / maxCash.value) * 120;
}
</script>

<template>
  <div class="earnings-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-text">
        <h1 class="page-title">Earnings overview</h1>
        <p class="page-subtitle">
          Combined online and cash collections across your organization.
        </p>
      </div>
      <div class="header-actions">
        <div class="date-pill">
          <Calendar :size="14" />
          <span class="date-pill__text"
            >{{ dateOptions.find((d) => d.value === dateFilter)?.label ?? 'All time' }}</span
          >
          <ChevronDown :size="12" />
          <select
            v-model="dateFilter"
            class="date-pill__select"
          >
            <option
              v-for="d in dateOptions"
              :key="d.value"
              :value="d.value"
            >
              {{ d.label }}
            </option>
          </select>
        </div>
        <button
          type="button"
          class="btn-export"
        >
          <Download :size="14" />
          Export report
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="loading"
    >
      Loading earnings data...
    </div>

    <template v-else>
      <!-- KPI Strip -->
      <div class="kpi-strip">
        <div
          v-for="card in kpiCards"
          :key="card.label"
          class="kpi-card"
        >
          <div class="kpi-card__header">
            <span class="kpi-card__label">{{ card.label }}</span>
            <component
              :is="kpiIcons[card.icon]"
              :size="16"
            />
          </div>
          <span class="kpi-card__value">{{ card.value }}</span>
          <div class="kpi-card__detail">
            <TrendingUp
              v-if="card.trendUp"
              :size="12"
              class="kpi-card__trend"
            />
            <span
              class="kpi-card__detail-text"
              :class="{ 'kpi-card__detail-text--up': card.trendUp }"
            >
              {{ card.detail }}
            </span>
          </div>
        </div>
      </div>

      <!-- Revenue by week chart -->
      <div class="chart-card">
        <div class="chart-card__header">
          <div class="chart-card__header-left">
            <h2 class="chart-card__title">Revenue by week</h2>
            <p class="chart-card__subtitle">
              Comparing online (PayMe / Click / Paynet) vs cash collected
            </p>
          </div>
          <div class="chart-card__legend">
            <div class="legend-item">
              <span class="legend-dot legend-dot--online" />
              <span class="legend-text">Online</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot legend-dot--cash" />
              <span class="legend-text">Cash</span>
            </div>
          </div>
        </div>
        <div class="chart-bars">
          <div
            v-for="week in weeklyRevenue"
            :key="week.week"
            class="chart-bar-group"
          >
            <div class="chart-bar-group__bars">
              <div
                class="chart-bar chart-bar--online"
                :style="{ height: `${onlineHeight(week.online)}px` }"
              />
              <div
                class="chart-bar chart-bar--cash"
                :style="{ height: `${cashHeight(week.cash)}px` }"
              />
            </div>
            <span class="chart-bar-group__label">{{ week.week }}</span>
          </div>
        </div>
      </div>

      <!-- Two-column section -->
      <div class="bottom-grid">
        <!-- Breakdown by category -->
        <div class="info-card">
          <h2 class="info-card__title">Breakdown by category</h2>
          <div class="category-list">
            <div
              v-for="cat in categoryBreakdown"
              :key="cat.name"
              class="category-row"
            >
              <div class="category-row__header">
                <span class="category-row__name">{{ cat.name }}</span>
                <span class="category-row__amount"
                  >{{ formatAmount(cat.amount) }}</span
                >
              </div>
              <div class="category-row__bar-track">
                <div
                  class="category-row__bar-fill"
                  :style="{ width: `${cat.barWidth}%` }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Top masters -->
        <div class="info-card">
          <h2 class="info-card__title">Top masters</h2>
          <div class="masters-list">
            <div
              v-for="master in topMasters"
              :key="master.name"
              class="master-row"
            >
              <div
                class="master-avatar"
                :style="{ background: master.avatarBg }"
              >
                {{ master.initials }}
              </div>
              <div class="master-info">
                <span class="master-name">{{ master.name }}</span>
                <span class="master-orders">{{ master.orders }} orders</span>
              </div>
              <span class="master-revenue"
                >{{ formatAmount(master.revenue) }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* ===== Page layout ===== */
.earnings-page {
  padding: 24px 32px;
}

/* ===== Header ===== */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.header-text {
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
  font-weight: 400;
  color: var(--muted-foreground);
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.date-pill {
  position: relative;
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 14px;
  color: var(--foreground);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
}

.date-pill__text {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
}

.date-pill__select {
  position: absolute;
  inset: 0;
  width: 100%;
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  border: none;
  border-radius: var(--radius-pill);
  opacity: 0;
}

.date-pill__select option {
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
  background: var(--card);
}

.btn-export {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-foreground);
  cursor: pointer;
  background: var(--primary);
  border: none;
  border-radius: var(--radius-pill);
  transition: opacity 0.15s;
}

.btn-export:hover {
  opacity: 0.9;
}

/* ===== Loading ===== */
.loading {
  padding: 40px 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: var(--muted-foreground);
  text-align: center;
}

/* ===== KPI strip ===== */
.kpi-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.kpi-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  padding: 20px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

@media (max-width: 1023px) {
  .kpi-strip {
    grid-template-columns: 1fr;
  }

  .bottom-grid {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .earnings-page {
    padding: 16px 12px;
  }

  .page-header {
    flex-direction: column;
    gap: 12px;
  }

  .header-actions {
    justify-content: space-between;
    width: 100%;
  }

  .chart-card {
    padding: 16px;
  }

  .chart-bars {
    gap: 16px;
  }

  .info-card {
    padding: 16px;
  }
}

.kpi-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kpi-card__label {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-foreground);
}

.kpi-card__value {
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--foreground);
}

.kpi-card__detail {
  display: flex;
  gap: 4px;
  align-items: center;
}

.kpi-card__trend {
  flex-shrink: 0;
  color: var(--color-success-foreground);
}

.kpi-card__detail-text {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.kpi-card__detail-text--up {
  font-weight: 600;
  color: var(--color-success-foreground);
}

/* ===== Chart card ===== */
.chart-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  margin-bottom: 16px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

.chart-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.chart-card__header-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chart-card__title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
}

.chart-card__subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.chart-card__legend {
  display: flex;
  gap: 12px;
}

.legend-item {
  display: flex;
  gap: 6px;
  align-items: center;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.legend-dot--online {
  background: var(--primary);
}

.legend-dot--cash {
  background: var(--secondary);
}

.legend-text {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Chart bars ===== */
.chart-bars {
  display: flex;
  gap: 32px;
  align-items: flex-end;
  height: 180px;
  padding: 0 8px;
}

.chart-bar-group {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  min-width: 0;
}

.chart-bar-group__bars {
  display: flex;
  gap: 4px;
  align-items: flex-end;
}

.chart-bar {
  width: 18px;
  border-radius: var(--radius-sm);
}

.chart-bar--online {
  background: var(--primary);
}

.chart-bar--cash {
  background: var(--secondary);
}

.chart-bar-group__label {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Bottom grid ===== */
.bottom-grid {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

/* ===== Info card ===== */
.info-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
  padding: 24px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

.info-card__title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
}

/* ===== Category list ===== */
.category-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.category-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category-row__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.category-row__name {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
}

.category-row__amount {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.category-row__bar-track {
  height: 6px;
  background: var(--muted);
  border-radius: var(--radius-pill);
}

.category-row__bar-fill {
  height: 6px;
  background: var(--primary);
  border-radius: var(--radius-pill);
}

/* ===== Masters list ===== */
.masters-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.master-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.master-avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: var(--primary-foreground);
  border-radius: var(--radius-pill);
}

.master-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.master-name {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.master-orders {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.master-revenue {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
  white-space: nowrap;
}
</style>
