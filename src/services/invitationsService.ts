import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import { getMyOrgId } from '@/services/settingsService';
import type {
  OrganizationInvitation,
  OrganizationInvitationRequest,
} from '@/types/business';

const BASE = '/organization-invitation';

const mockInvitations: OrganizationInvitation[] = [
  {
    id: 'inv-001',
    organizationId: 'org-1',
    organizationName: 'AutoFix MCHJ',
    userId: 'u-101',
    userName: 'Bob Master',
    email: 'bob.master@gmail.com',
    roleId: 'r-1',
    roleName: 'Master',
    roleCode: 'MASTER',
    inviteMessage: "We'd like you to join AutoFix MCHJ as a master.",
    canReject: false,
    canAccept: false,
    canDelete: true,
  },
  {
    id: 'inv-002',
    organizationId: 'org-1',
    organizationName: 'AutoFix MCHJ',
    userId: 'u-102',
    userName: 'Anna Reception',
    email: 'anna.reception@gmail.com',
    roleId: 'r-2',
    roleName: 'Receptionist',
    roleCode: 'RECEPTIONIST',
    inviteMessage: 'Join our reception team.',
    canReject: false,
    canAccept: false,
    canDelete: false,
  },
];

function mapInvitation(raw: any): OrganizationInvitation {
  return {
    id: raw.id,
    organizationId: raw.organizationId ?? '',
    organizationName: raw.organizationName ?? undefined,
    userId: raw.userId ?? undefined,
    userName: raw.userName ?? undefined,
    phoneNumber: raw.phoneNumber ?? undefined,
    email: raw.email ?? undefined,
    roleId: raw.roleId ?? undefined,
    roleName: raw.roleName ?? 'Member',
    roleCode: raw.roleCode ?? undefined,
    inviteMessage: raw.inviteMessage ?? undefined,
    canReject: Boolean(raw.canReject),
    canAccept: Boolean(raw.canAccept),
    canDelete: Boolean(raw.canDelete),
  };
}

export async function getOrganizationInvitations(): Promise<
  OrganizationInvitation[]
> {
  if (isMockMode()) {
    return mockInvitations;
  }
  const orgId = await getMyOrgId();
  if (!orgId) {
    return [];
  }
  try {
    const data = await apiClient.get(`${BASE}/get-by-organization-id/${orgId}`);
    return (data ?? []).map(mapInvitation);
  } catch {
    return [];
  }
}

export async function createInvitation(
  data: OrganizationInvitationRequest,
): Promise<OrganizationInvitation> {
  if (isMockMode()) {
    return {
      id: `inv-${Date.now()}`,
      organizationId: '',
      email: data.email,
      phoneNumber: data.phoneNumber,
      roleId: data.roleId,
      roleName: 'Member',
      inviteMessage: data.inviteMessage,
      canReject: false,
      canAccept: false,
      canDelete: true,
    };
  }
  const resp = await apiClient.post(BASE, data);
  return mapInvitation(resp);
}

export async function acceptInvitation(
  id: string,
): Promise<OrganizationInvitation> {
  if (isMockMode()) {
    const base = mockInvitations.find((i) => i.id === id) ?? mockInvitations[0];
    return {
      id,
      organizationId: base?.organizationId ?? '',
      organizationName: base?.organizationName,
      userId: base?.userId,
      userName: base?.userName,
      phoneNumber: base?.phoneNumber,
      email: base?.email,
      roleId: base?.roleId,
      roleName: base?.roleName ?? 'Member',
      roleCode: base?.roleCode,
      inviteMessage: base?.inviteMessage,
      canReject: false,
      canAccept: false,
      canDelete: false,
    };
  }
  const resp = await apiClient.put(`${BASE}/accept/${id}`);
  return mapInvitation(resp);
}

export async function rejectInvitation(id: string): Promise<void> {
  if (isMockMode()) {
    return;
  }
  await apiClient.put(`${BASE}/reject/${id}`);
}

export async function deleteInvitation(id: string): Promise<void> {
  if (isMockMode()) {
    return;
  }
  await apiClient.delete(`${BASE}/${id}`);
}
