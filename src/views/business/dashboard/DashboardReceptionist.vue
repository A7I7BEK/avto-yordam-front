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
    confirmed: '#25603A',
    'in-progress': '#5749F4',
    pending: '#B45309',
    done: '#616167',
  };
  return map[status] || '#616167';
}

function statusBg(status: string): string {
  const map: Record<string, string> = {
    confirmed: '#E8FAF0',
    'in-progress': '#EEF0FF',
    pending: '#FFF6E9',
    done: '#F5F5F5',
  };
  return map[status] || '#F5F5F5';
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
          style="background: #EEF0FF; color: #5749F4;"
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
          style="background: #FFF6E9; color: #B45309;"
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
          style="background: #E8FAF0; color: #25603A;"
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
  color: #616167;
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
  color: #2a2933;
}

/* KPI Row */
.kpi-row {
  display: flex;
  gap: 12px;
}

.kpi-card {
  display: flex;
  flex: 1;
  gap: 14px;
  align-items: center;
  padding: 18px;
  background: #ffffff;
  border: 1px solid #c5c5cb;
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
  color: #616167;
}

.kpi-value {
  font-size: 24px;
  font-weight: 700;
  color: #2a2933;
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
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 24px;
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

.card-badge {
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 500;
  color: #5749f4;
  background: #eef0ff;
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
  background: #fafafa;
  border: 1px solid #eaeaea;
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
  color: #5749f4;
  background: #eef0ff;
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
  color: #2a2933;
}

.queue-vehicle {
  font-size: 11px;
  color: #616167;
}

.queue-time {
  font-size: 12px;
  color: #616167;
  white-space: nowrap;
}

.queue-service {
  font-size: 13px;
  color: #616167;
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
  color: #616167;
  cursor: pointer;
  background: #f5f5f5;
  border: 1px solid #d9d9db;
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
  color: #5749f4;
  background: #eef0ff;
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
  color: #2a2933;
}

.master-count {
  font-size: 11px;
  color: #616167;
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
  color: #2a2933;
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
  color: #2a2933;
}

.slot-vehicle {
  font-size: 11px;
  color: #616167;
}

.slot-status {
  font-size: 11px;
  font-weight: 500;
  text-transform: capitalize;
  white-space: nowrap;
}
</style>
