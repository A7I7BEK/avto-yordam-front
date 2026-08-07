import type { FileResponse } from '@/services/documentsService';

export interface LanguageResponse {
  id: string;
  name: string;
  code: string;
}

export interface UserResponse {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  isVerified: boolean;
  type: string;
  birthDay: string | null;
  languages: LanguageResponse[];
  /** Profile photo returned by the user APIs (absent when not set). */
  profilePhoto?: FileResponse | null;
}

export interface MasterInfoResponse {
  id: string;
  master: UserResponse;
  experienceStartDate: string | null;
  description: string;
  specializationId: string;
  specializationName: string;
  workingTimeStart: string | null;
  workingTimeEnd: string | null;
  /** Auto-tracked platform stats. */
  experienceYears?: number | null;
  completedOrders?: number | null;
  rating?: number | null;
}

export interface MasterInfoRequest {
  experienceStartDate: string | null;
  description: string;
  specializationId: string;
  workingTimeStart: string | null;
  workingTimeEnd: string | null;
}

export interface MasterSpecializationResponse {
  id: string;
  name: string;
  description: string;
}

export type OrderStatus =
  | 'CREATED'
  | 'PENDING_MASTER_CONFIRMATION'
  | 'PENDING_USER_CONFIRMATION'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

export type ServiceCenterType = 'MCHJ' | 'YATT' | 'SELF_EMPLOYED';

export interface OrganizationResponse {
  id: string;
  type?: ServiceCenterType;
  name: string;
  description?: string;
  phone: string;
  inn?: string;
  bankAccount?: string;
  mfo?: string;
  bankName?: string;
  email: string;
  latitude?: string;
  longitude?: string;
  address: string;
  ratingAvg?: number;
  ratingCount?: number;
  ownerId?: string;
  ownerName?: string;
  isActive?: boolean;
}

export interface OrganizationRequest {
  type: ServiceCenterType;
  name: string;
  description?: string | null;
  phone: string;
  email?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  address: string;
  ownerId: string;
  inn: string;
  bankAccount?: string | null;
  mfo?: string | null;
  bankName?: string | null;
}

export interface OrganizationMemberResponse {
  id: string;
  master: UserResponse;
  experienceStartDate: string | null;
  description: string;
  specializationId: string;
  specializationName: string;
  workingTimeStart: string | null;
  workingTimeEnd: string | null;
}

export interface OrganizationServiceResponse {
  id: string;
  organizationId: string;
  organizationName?: string;
  organization?: OrganizationResponse;
  serviceId: string;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  minDurationMinutes?: number;
  maxDurationMinutes?: number;
  masters?: OrganizationMemberResponse[];
}

export interface OrderResponse {
  id: string;
  client: UserResponse | null;
  master: UserResponse | null;
  organizationServices: OrganizationServiceResponse | null;
  slotId: string | null;
  status: OrderStatus;
  createdByTypeId: string | null;
  createdDate: string;
  estimatedPrice: number | null;
  finalPrice: number | null;
  problemDescription: string;
  carDescription: string;
  confirmedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
}

export interface ReviewResponse {
  id: string;
  order: OrderResponse | null;
  clientId: string;
  organizationId: string;
  masterId: string;
  rating: number;
  comment: string;
}

export interface NotificationResponse {
  id?: string;
  message: string;
  type?: string;
  userId?: string;
  createdDate?: string;
  isRead?: boolean;
}
