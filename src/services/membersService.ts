import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import { members as rawMembers } from '@/data/members';
import type { TeamMember } from '@/types/business';

export async function getMembers(): Promise<TeamMember[]> {
  if (isMockMode()) {
    return rawMembers as TeamMember[];
  }

  try {
    const apiMembers = await apiClient.get(
      '/organization-member/get-organization-masters',
    );
    return apiMembers.map((m: any) => {
      const user = m.master ?? m.user;
      const fullName = user?.fullName ?? m.userName ?? 'Unknown Member';
      return {
        id: m.id ?? user?.id,
        userId: m.userId ?? user?.id,
        name: fullName,
        email: user?.email ?? m.email ?? '',
        initials: (fullName || 'UM')
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        avatarColor: '#D9D9DB',
        role: m.role?.name ?? (m.specializationName ? 'Master' : 'Employee'),
        specialties: m.specializationName
          ? [m.specializationName]
          : m.specialties || [],
        rating: m.rating || 0,
        orders: m.orders || 0,
        status: m.status || 'Accepted',
        joined: m.joined || '',
      };
    });
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
