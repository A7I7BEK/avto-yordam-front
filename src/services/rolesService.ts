import { isMockMode } from '@/config';
import { roles as rawRoles } from '@/data/roles';
import type { Role } from '@/types/business';

export function getRoles(): Role[] {
  if (isMockMode()) {
    return rawRoles as Role[];
  }
  throw new Error('API not implemented');
}

export function getRole(id: string): Role | null {
  if (isMockMode()) {
    return (rawRoles as Role[]).find((r) => r.id === id) || null;
  }
  throw new Error('API not implemented');
}
