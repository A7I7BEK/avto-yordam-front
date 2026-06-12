export interface KpiStats {
  totalOrders: number;
  activeOrders: number;
  completedToday: number;
  revenueToday: string;
  customersWaiting: number;
  avgServiceTime: string;
}

export interface QueueBooking {
  id: string;
  customer: string;
  initials: string;
  service: string;
  vehicle: string;
  time: string;
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo?: string;
}

export interface BookingSlot {
  id: string;
  time: string;
  customer?: string;
  service?: string;
  master?: string;
  duration: number;
  status: 'available' | 'booked' | 'in-progress' | 'completed';
}

export interface MasterSchedule {
  id: string;
  name: string;
  initials: string;
  specialization: string;
  avatarColor: string;
  slots: BookingSlot[];
  isAvailable: boolean;
}

export interface ReceptionistDashboardData {
  kpiStats: KpiStats;
  queue: QueueBooking[];
  masterSchedules: MasterSchedule[];
}
