import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import { employees as rawEmployees } from '@/data/employees';
import type { Employee } from '@/types/business';

async function getMyOrgId(): Promise<string | null> {
  try {
    const members = await apiClient.get('/organization-member/get-by-user');
    if (members && members.length > 0) {
      return members[0].organizationId;
    }
  } catch (_) {}
  return null;
}

export async function getEmployees(): Promise<Employee[]> {
  if (isMockMode()) {
    return rawEmployees as Employee[];
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
      phone: '',
      status: 'Active' as const,
      avatarColor: '#5749F4',
    }));
  } catch (_) {
    return [];
  }
}

export async function getEmployee(id: string): Promise<Employee | null> {
  if (isMockMode()) {
    return (rawEmployees as Employee[]).find((e) => e.id === id) || null;
  }
  const all = await getEmployees();
  return all.find((e) => e.id === id) || null;
}
