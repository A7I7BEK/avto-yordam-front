<script
  setup
  lang="ts"
>
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Footprints,
  Users,
  X,
} from '@lucide/vue';
import { onMounted, ref } from 'vue';
import BreadcrumbBar from '@/components/app/BreadcrumbBar.vue';
import { getReceptionistDashboard } from '@/services/dashboardService';

interface KpiStat {
  todayBookings: number;
  pending: number;
  confirmedToday: number;
  walkIns: number;
}

interface QueueBooking {
  id: string;
  customerName: string;
  customerInitials: string;
  service: string;
  vehicle: string;
  time: string;
  status: string;
}

interface BookingSlot {
  time: string;
  service: string;
  vehicle: string;
  status: string;
}

interface MasterSchedule {
  masterName: string;
  masterInitials: string;
  bookingCount: number;
  bookings: BookingSlot[];
}

interface DashboardData {
  kpi: KpiStat;
  queue: QueueBooking[];
  schedules: MasterSchedule[];
}

const data = ref<DashboardData | null>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const result = await getReceptionistDashboard();
    data.value = result as unknown as DashboardData;
  } finally {
    loading.value = false;
  }
});

function statusColor(status: string): string {
  const map: Record<string, string> = {
    confirmed: 'var(--success)',
    'in-progress': 'var(--primary)',
    pending: 'var(--warning)',
    done: 'var(--muted-foreground)',
  };
  return map[status] || 'var(--muted-foreground)';
}

function statusBg(status: string): string {
  const map: Record<string, string> = {
    confirmed: 'var(--success-bg)',
    'in-progress': 'var(--primary-tint)',
    pending: 'var(--warning-bg)',
    done: 'var(--muted)',
  };
  return map[status] || 'var(--muted)';
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
    class="receptionist-dashboard"
  >
    <!-- Breadcrumb -->
    <BreadcrumbBar :items="['Home', 'Dashboard']" />

    <!-- Title -->
    <h1 class="page-title">Front desk overview</h1>

    <!-- KPI Row -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div
          class="kpi-icon-wrap"
          style="background: var(--primary-tint); color: var(--primary);"
        >
          <Calendar :size="20" />
        </div>
        <div class="kpi-body">
          <span class="kpi-label">Today's bookings</span>
          <span class="kpi-value">{{ data.kpi.todayBookings }}</span>
        </div>
      </div>
      <div class="kpi-card">
        <div
          class="kpi-icon-wrap"
          style="background: var(--warning-bg); color: var(--warning);"
        >
          <Clock :size="20" />
        </div>
        <div class="kpi-body">
          <span class="kpi-label">Pending</span>
          <span class="kpi-value">{{ data.kpi.pending }}</span>
        </div>
      </div>
      <div class="kpi-card">
        <div
          class="kpi-icon-wrap"
          style="background: var(--success-bg); color: var(--success);"
        >
          <CheckCircle :size="20" />
        </div>
        <div class="kpi-body">
          <span class="kpi-label">Confirmed today</span>
          <span class="kpi-value">{{ data.kpi.confirmedToday }}</span>
        </div>
      </div>
      <div class="kpi-card">
        <div
          class="kpi-icon-wrap"
          style="background: #F3E8FF; color: #7C3AED;"
        >
          <Footprints :size="20" />
        </div>
        <div class="kpi-body">
          <span class="kpi-label">Walk-ins</span>
          <span class="kpi-value">{{ data.kpi.walkIns }}</span>
        </div>
      </div>
    </div>

    <!-- Two-column layout -->
    <div class="columns">
      <!-- Left: Incoming bookings queue -->
      <div class="card queue-card">
        <div class="card-header">
          <span class="card-title">Incoming bookings</span>
          <span class="card-badge">{{ data.queue.length }} pending</span>
        </div>
        <div class="queue-list">
          <div
            v-for="booking in data.queue"
            :key="booking.id"
            class="queue-item"
          >
            <div class="queue-top">
              <div class="queue-customer">
                <div class="queue-avatar">{{ booking.customerInitials }}</div>
                <div class="queue-customer-info">
                  <span class="queue-name">{{ booking.customerName }}</span>
                  <span class="queue-vehicle">{{ booking.vehicle }}</span>
                </div>
              </div>
              <span class="queue-time">{{ booking.time }}</span>
            </div>
            <span class="queue-service">{{ booking.service }}</span>
            <div class="queue-actions">
              <button
                class="btn-accept"
                type="button"
              >
                <CheckCircle :size="14" />
                Accept
              </button>
              <button
                class="btn-decline"
                type="button"
              >
                <X :size="14" />
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Today's schedule by master -->
      <div class="card schedule-card">
        <div class="card-header">
          <span class="card-title">Today's schedule</span>
        </div>
        <div class="schedule-list">
          <div
            v-for="(master, mIdx) in data.schedules"
            :key="mIdx"
            class="master-block"
          >
            <div class="master-header">
              <div class="master-avatar">{{ master.masterInitials }}</div>
              <div class="master-info">
                <span class="master-name">{{ master.masterName }}</span>
                <span class="master-count"
                  >{{ master.bookingCount }}
                  bookings</span
                >
              </div>
            </div>
            <div class="booking-slots">
              <div
                v-for="(slot, sIdx) in master.bookings"
                :key="sIdx"
                class="slot-item"
                :style="{ background: statusBg(slot.status), borderLeftColor: statusColor(slot.status) }"
              >
                <span class="slot-time">{{ slot.time }}</span>
                <div class="slot-details">
                  <span class="slot-service">{{ slot.service }}</span>
                  <span class="slot-vehicle">{{ slot.vehicle }}</span>
                </div>
                <span
                  class="slot-status"
                  :style="{ color: statusColor(slot.status) }"
                >
                  {{ slot.status }}
                </span>
              </div>
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
  color: var(--muted-foreground);
}

.receptionist-dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 24px;
  font-family: Inter, sans-serif;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: var(--foreground);
}

/* KPI Row */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.kpi-card {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 18px;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 24px;
}

.kpi-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
}

.kpi-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kpi-label {
  font-size: 13px;
  color: var(--muted-foreground);
}

.kpi-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
}

/* Columns */
.columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Shared Card */
.card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 24px;
}

@media (max-width: 1023px) {
  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .columns {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .receptionist-dashboard {
    padding: 12px;
  }

  .kpi-row {
    grid-template-columns: 1fr;
  }

  .card {
    padding: 16px;
    border-radius: 20px;
  }
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

.card-badge {
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 500;
  color: var(--primary);
  background: var(--primary-tint);
  border-radius: 999px;
}

/* Queue List */
.queue-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.queue-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: 16px;
}

.queue-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.queue-customer {
  display: flex;
  gap: 10px;
  align-items: center;
}

.queue-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  font-size: 12px;
  font-weight: 700;
  color: var(--primary);
  background: var(--primary-tint);
  border-radius: 999px;
}

.queue-customer-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.queue-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.queue-vehicle {
  font-size: 11px;
  color: var(--muted-foreground);
}

.queue-time {
  font-size: 12px;
  color: var(--muted-foreground);
  white-space: nowrap;
}

.queue-service {
  font-size: 13px;
  color: var(--muted-foreground);
}

.queue-actions {
  display: flex;
  gap: 8px;
}

.btn-accept {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 6px 14px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  background: #25603a;
  border: none;
  border-radius: 8px;
}

.btn-decline {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 6px 14px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-foreground);
  cursor: pointer;
  background: var(--muted);
  border: 1px solid var(--border);
  border-radius: 8px;
}

/* Schedule */
.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.master-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.master-header {
  display: flex;
  gap: 10px;
  align-items: center;
}

.master-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-size: 11px;
  font-weight: 700;
  color: var(--primary);
  background: var(--primary-tint);
  border-radius: 999px;
}

.master-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.master-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.master-count {
  font-size: 11px;
  color: var(--muted-foreground);
}

.booking-slots {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.slot-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 8px 12px;
  border-left: 3px solid;
  border-radius: 8px;
}

.slot-time {
  min-width: 44px;
  font-size: 12px;
  font-weight: 600;
  color: var(--foreground);
  white-space: nowrap;
}

.slot-details {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1px;
}

.slot-service {
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
}

.slot-vehicle {
  font-size: 11px;
  color: var(--muted-foreground);
}

.slot-status {
  font-size: 11px;
  font-weight: 500;
  text-transform: capitalize;
  white-space: nowrap;
}
</style>
