<script
  setup
  lang="ts"
>
import { Eye, Plus, Search } from '@lucide/vue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { countNewOrders, getOrders } from '@/services/ordersService';
import { useBusinessAppStore } from '@/stores/businessApp';
import type { Order } from '@/types/business';
import OrdersKanban from './OrdersKanban.vue';

const router = useRouter();
const store = useBusinessAppStore();
const orders = ref<Order[]>([]);
const activeTab = ref('all');
const searchQuery = ref('');
const viewMode = ref<'list' | 'board'>('list');

async function loadOrders() {
  orders.value = await getOrders();
  store.setOrdersBadgeCount(countNewOrders(orders.value));
}
loadOrders();

const newOrdersCount = computed(() => countNewOrders(orders.value));

const tabs = [
  { key: 'all', label: 'All', count: orders.value.length },
  {
    key: 'pending-master-confirmation',
    label: 'Pending Master',
    count: orders.value.filter(
      (o) => o.status === 'pending-master-confirmation',
    ).length,
  },
  {
    key: 'pending-user-confirmation',
    label: 'Pending User',
    count: orders.value.filter((o) => o.status === 'pending-user-confirmation')
      .length,
  },
  {
    key: 'confirmed',
    label: 'Confirmed',
    count: orders.value.filter((o) => o.status === 'confirmed').length,
  },
  {
    key: 'in-progress',
    label: 'In Progress',
    count: orders.value.filter((o) => o.status === 'in-progress').length,
  },
  {
    key: 'completed',
    label: 'Completed',
    count: orders.value.filter((o) => o.status === 'completed').length,
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    count: orders.value.filter((o) => o.status === 'cancelled').length,
  },
  {
    key: 'rejected',
    label: 'Rejected',
    count: orders.value.filter((o) => o.status === 'rejected').length,
  },
];

const statusMap: Record<string, { label: string; class: string }> = {
  created: { label: 'Created', class: 'status-badge--new' },
  'pending-master-confirmation': {
    label: 'Pending Master',
    class: 'status-badge--pending',
  },
  'pending-user-confirmation': {
    label: 'Pending User',
    class: 'status-badge--pending',
  },
  confirmed: { label: 'Confirmed', class: 'status-badge--confirmed' },
  'in-progress': { label: 'In Progress', class: 'status-badge--progress' },
  completed: { label: 'Completed', class: 'status-badge--done' },
  cancelled: { label: 'Cancelled', class: 'status-badge--cancelled' },
  rejected: { label: 'Rejected', class: 'status-badge--cancelled' },
};

const filteredOrders = computed(() => {
  let result = orders.value;
  if (activeTab.value !== 'all') {
    result = result.filter((o) => o.status === activeTab.value);
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.service.toLowerCase().includes(q),
    );
  }
  return result;
});

function viewOrder(id: string) {
  router.push(`/business/orders/${encodeURIComponent(id)}`);
}

function goToCreateOrder() {
  // Navigate to the create order flow
}
</script>

<template>
  <div class="orders-page">
    <!-- Header -->
    <div class="header-row">
      <div class="header-row__left">
        <h1 class="page-title">
          Orders
          <span
            v-if="newOrdersCount > 0"
            class="badge-new"
            >{{ newOrdersCount }}
            new</span
          >
        </h1>
        <p class="page-subtitle">Manage and track all bookings</p>
      </div>
      <div
        class="header-actions-group"
        style="display: flex; align-items: center; gap: 12px;"
      >
        <!-- View toggle -->
        <div class="view-toggle">
          <button
            type="button"
            class="view-toggle__btn"
            :class="{ active: viewMode === 'list' }"
            @click="viewMode = 'list'"
          >
            List
          </button>
          <button
            type="button"
            class="view-toggle__btn"
            :class="{ active: viewMode === 'board' }"
            @click="viewMode = 'board'"
          >
            Board
          </button>
        </div>
        <button
          v-if="viewMode === 'list'"
          type="button"
          class="btn btn--outline"
          @click="goToCreateOrder"
        >
          <Plus :size="16" />
          Create order
        </button>
      </div>
    </div>

    <template v-if="viewMode === 'list'">
      <!-- Tabs & Search -->
      <div class="toolbar">
        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            class="tab"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
            <span
              v-if="tab.count > 0"
              class="tab-count"
              :class="{ 'tab-count--purple': tab.key === 'new' }"
              >{{ tab.count }}</span
            >
          </button>
        </div>
        <div class="search-wrapper">
          <Search
            :size="16"
            class="search-icon"
          />
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Search orders..."
          >
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Date / Time</th>
              <th>Master</th>
              <th>Amount</th>
              <th>Status</th>
              <th class="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in filteredOrders"
              :key="order.id"
              class="table-row"
            >
              <td>
                <button
                  type="button"
                  class="link-order"
                  @click="viewOrder(order.backendId)"
                >
                  {{ order.id }}
                </button>
              </td>
              <td>
                <div class="customer-cell">
                  <div class="avatar-sm">{{ order.initials }}</div>
                  <span>{{ order.customer }}</span>
                </div>
              </td>
              <td>{{ order.service }}</td>
              <td>{{ order.date }}</td>
              <td>{{ order.master }}</td>
              <td class="amount">{{ order.amount }}</td>
              <td>
                <span
                  class="status-badge"
                  :class="statusMap[order.status]?.class"
                >
                  {{ statusMap[order.status]?.label || order.status }}
                </span>
              </td>
              <td class="actions-cell">
                <button
                  type="button"
                  class="btn-icon"
                  title="View order"
                  @click="viewOrder(order.backendId)"
                >
                  <Eye :size="16" />
                </button>
              </td>
            </tr>
            <tr v-if="filteredOrders.length === 0">
              <td
                colspan="8"
                class="empty-cell"
              >
                No orders found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-else>
      <OrdersKanban />
    </template>
  </div>
</template>

<style scoped>
.orders-page {
  padding: 24px 32px;
}

.header-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.header-row__left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--foreground);
}

.badge-new {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
  color: var(--primary);
  background: var(--primary-tint);
  border-radius: 999px;
}

.page-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: var(--muted-foreground);
}

.btn {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 10px 20px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 999px;
  transition: background 0.15s;
}

.btn--outline {
  color: var(--primary);
  background: var(--card);
  border: 1px solid var(--border);
}

.btn--outline:hover {
  background: var(--muted);
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  gap: 4px;
  max-width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;
}

.tab {
  display: inline-flex;
  flex-shrink: 0;
  gap: 6px;
  align-items: center;
  padding: 6px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted-foreground);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 999px;
  transition: all 0.15s;
}

.tab:hover {
  color: var(--foreground);
  background: var(--muted);
}

.tab.active {
  font-weight: 600;
  color: var(--foreground);
  background: var(--muted);
}

.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 10px;
  font-weight: 700;
  color: var(--muted-foreground);
  background: var(--hover);
  border-radius: 999px;
}

.tab-count--purple {
  color: var(--primary);
  background: var(--primary-tint);
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--muted-icon);
  pointer-events: none;
}

.search-input {
  width: 220px;
  padding: 8px 12px 8px 36px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--foreground);
  outline: none;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: border-color 0.15s;
}

.search-input:focus {
  border-color: var(--primary);
}

.search-input::placeholder {
  color: var(--muted-icon);
}

.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid var(--border);
  border-radius: 10px;
}

.table {
  width: 100%;
  min-width: 680px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  border-collapse: collapse;
}

@media (max-width: 768px) {
  .orders-page {
    padding: 16px;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-wrapper,
  .search-input {
    width: 100%;
  }
}

.table th {
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-icon);
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--accent);
  border-bottom: 1px solid var(--border);
}

.th-actions {
  width: 60px;
  text-align: center;
}

.table-row {
  transition: background 0.15s;
}

.table-row:hover {
  background: var(--accent);
}

.table-row td {
  padding: 14px 16px;
  color: var(--foreground);
  border-bottom: 1px solid var(--border);
}

.table-row:last-child td {
  border-bottom: none;
}

.link-order {
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
}

.link-order:hover {
  text-decoration: underline;
}

.customer-cell {
  display: flex;
  gap: 8px;
  align-items: center;
}

.avatar-sm {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
  background: var(--primary);
  border-radius: 50%;
}

.amount {
  font-weight: 600;
}

.status-badge {
  display: inline-flex;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 999px;
}

.status-badge--new {
  color: var(--primary);
  background: var(--primary-tint);
}

.status-badge--pending {
  color: var(--warning);
  background: var(--warning-bg);
}

.status-badge--confirmed {
  color: var(--success);
  background: var(--success-bg);
}

.status-badge--progress {
  color: var(--info-strong);
  background: var(--info-soft);
}

.status-badge--done {
  color: var(--success);
  background: var(--success-bg);
}

.status-badge--cancelled {
  color: var(--destructive);
  background: var(--destructive-soft);
}

.actions-cell {
  text-align: center;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: var(--muted-icon);
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 6px;
  transition: all 0.15s;
}

.btn-icon:hover {
  color: var(--foreground);
  background: var(--muted);
}

.empty-cell {
  padding: 40px 16px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: var(--muted-icon);
  text-align: center;
}

/* View toggle pills */
.view-toggle {
  display: flex;
  gap: 8px;
}

.view-toggle__btn {
  padding: 6px 16px;
  font-family: var(--font-primary);
  font-size: 13px;
  font-weight: 500;
  color: var(--muted-foreground);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  transition: all 0.15s;
}

.view-toggle__btn:hover {
  color: var(--foreground);
  background: var(--accent);
}

.view-toggle__btn.active {
  color: #ffffff;
  background: var(--primary);
  border-color: var(--primary);
}
</style>
