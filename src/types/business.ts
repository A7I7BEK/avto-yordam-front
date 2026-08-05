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
  email: string;
  initials: string;
  avatarColor: string;
  role: string;
  specialties: string[];
  rating: number;
  orders: number;
  status: 'Accepted' | 'Invited' | 'Declined' | 'Expired';
  joined: string;
}

export interface Order {
  id: string;
  backendId: string;
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

// ── Backend API types ──

export interface PermissionResponse {
  id: string;
  name: string;
  code: string;
}

export interface RoleResponse {
  id: string;
  name: string;
  code: string;
  permissions: PermissionResponse[];
}

export interface RoleRequestDto {
  name: string;
  code: string;
  permissions: string[];
}

export type InvitationStatus = 'PENDING' | 'RESOLVED';

export interface OrganizationInvitation {
  id: string;
  organizationId: string;
  organizationName?: string;
  userId?: string;
  userName?: string;
  phoneNumber?: string;
  email?: string;
  roleId?: string;
  roleName: string;
  roleCode?: string;
  inviteMessage?: string;
  canReject: boolean;
  canAccept: boolean;
  canDelete: boolean;
}

export interface OrganizationInvitationRequest {
  /** At least one of email / phoneNumber should be provided. */
  phoneNumber?: string;
  email?: string;
  roleId: string;
  inviteMessage?: string;
}
