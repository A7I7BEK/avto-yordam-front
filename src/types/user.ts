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

export interface OrganizationResponse {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
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
