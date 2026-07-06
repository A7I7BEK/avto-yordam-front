import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import { members as rawMembers } from '@/data/members';
import type { TeamMember } from '@/types/business';

async function getMyOrgId(): Promise<string | null> {
  try {
    const members = await apiClient.get('/organization-member/get-by-user');
    if (members && members.length > 0) {
      return members[0].organizationId;
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
    const members = await apiClient.get(
      `/organization-member/get-by-organization-id/${orgId}`,
    );
    return members.map((m: any) => ({
      id: m.id,
      name: m.userName || 'Unknown Member',
      initials: (m.userName || 'UM')
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      role: m.role?.name || 'Employee',
      org: m.organizationName || 'Auto Yordam',
      phone: '',
      status: 'Active' as const,
      avatarColor: '#2A2933',
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
