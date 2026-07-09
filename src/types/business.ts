export type EmployeeStatus = 'Active' | 'Inactive';
export type MemberStatus = 'Active' | 'Inactive' | 'Pending';
export type RoleType = 'built-in' | 'custom';
export type ScheduleView = 'month' | 'week' | 'day';
export type NotificationCategory =
  | 'Bookings'
  | 'Reviews'
  | 'Payments'
  | 'Invitations'
  | 'Team';

export interface Employee {
  id: string;
  name: string;
  initials: string;
  role: string;
  phone: string;
  status: EmployeeStatus;
  avatarColor: string;
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  org: string;
  phone: string;
  status: MemberStatus;
  avatarColor: string;
}

export interface Order {
  id: string;
  customer: string;
  initials: string;
  service: string;
  date: string;
  master: string;
  amount: string;
  status: string;
}

export interface RolePermission {
  id: string;
  label: string;
  allowed: boolean;
}

export interface PermissionCategory {
  id: string;
  name: string;
  permissions: RolePermission[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  isSystem: boolean;
  memberCount: number;
  enabledPermissionCount: number;
  totalPermissionCount: number;
  createdDate: string;
  createdBy: string;
  lastEditedDate: string;
  lastEditedBy: string;
}
