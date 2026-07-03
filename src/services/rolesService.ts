import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import { roles as rawRoles } from '@/data/roles';
import type { Role } from '@/types/business';

export async function getRoles(): Promise<Role[]> {
  if (isMockMode()) {
    return rawRoles as Role[];
  }

  try {
    const backendRoles = await apiClient.get('/role/get-for-organization');
    return backendRoles.map((r: any) => ({
      id: r.id,
      name: r.name,
      description: r.code || '',
      members: r.permissions?.length || 0,
      type: 'built-in' as const,
      iconColor: '#5749F4',
    }));
  } catch (_) {
    try {
      const backendRoles = await apiClient.get('/role');
      return backendRoles.map((r: any) => ({
        id: r.id,
        name: r.name,
        description: r.code || '',
        members: r.permissions?.length || 0,
        type: 'built-in' as const,
        iconColor: '#5749F4',
      }));
    } catch (e) {
      return [];
    }
  }
}

export async function getRole(id: string): Promise<Role | null> {
  if (isMockMode()) {
    return (rawRoles as Role[]).find((r) => r.id === id) || null;
  }
  const all = await getRoles();
  return all.find((r) => r.id === id) || null;
}
