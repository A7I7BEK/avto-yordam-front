import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import { members as rawMembers } from '@/data/members';
import type { TeamMember } from '@/types/business';

async function getMyOrgId(): Promise<string | null> {
  try {
    const orgMembers = await apiClient.get('/organization-member/get-by-user');
    if (orgMembers && orgMembers.length > 0) {
      return orgMembers[0].organizationId;
    }
  } catch {
    /* no org members yet */
  }
  return null;
}

export async function getMembers(): Promise<TeamMember[]> {
  if (isMockMode()) {
    return rawMembers as TeamMember[];
  }

  const orgId = await getMyOrgId();
  if (!orgId) {
    return [];
  }

  try {
    const apiMembers = await apiClient.get(
      `/organization-member/get-by-organization-id/${orgId}`,
    );
    return apiMembers.map((m: any) => ({
      id: m.id,
      name: m.userName || 'Unknown Member',
      email: m.email || '',
      initials: (m.userName || 'UM')
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      avatarColor: '#D9D9DB',
      role: m.role?.name || 'Employee',
      specialties: m.specialties || [],
      rating: m.rating || 0,
      orders: m.orders || 0,
      status: m.status || 'Accepted',
      joined: m.joined || '',
    }));
  } catch {
    return [];
  }
}

export async function getMember(id: string): Promise<TeamMember | null> {
  if (isMockMode()) {
    return (rawMembers as TeamMember[]).find((m) => m.id === id) || null;
  }
  const all = await getMembers();
  return all.find((m) => m.id === id) || null;
}
