import { isMockMode } from '@/config';
import {
  getPermissionCategoriesForRole,
  roles as rawRoles,
} from '@/data/roles';
import type { PermissionCategory, Role } from '@/types/business';

export function getRoles(): Role[] {
  if (isMockMode()) {
    return rawRoles;
  }
  return rawRoles;
}

export function getRole(id: string): Role | null {
  const all = getRoles();
  return all.find((r) => r.id === id) ?? null;
}

export function createRole(
  data: Omit<
    Role,
    | 'id'
    | 'isSystem'
    | 'memberCount'
    | 'enabledPermissionCount'
    | 'totalPermissionCount'
    | 'createdDate'
    | 'createdBy'
    | 'lastEditedDate'
    | 'lastEditedBy'
  >,
): Role {
  const newRole: Role = {
    id: `r${Date.now()}`,
    ...data,
    isSystem: false,
    memberCount: 0,
    enabledPermissionCount: 0,
    totalPermissionCount: 30,
    createdDate: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    createdBy: 'You',
    lastEditedDate: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    lastEditedBy: 'You',
  };
  rawRoles.push(newRole);
  return newRole;
}

export function updateRole(
  id: string,
  data: Partial<Pick<Role, 'name' | 'description' | 'color'>>,
): Role | null {
  const role = rawRoles.find((r) => r.id === id);
  if (!role) {
    return null;
  }
  Object.assign(role, data, {
    lastEditedDate: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    lastEditedBy: 'You',
  });
  return role;
}

export function deleteRole(id: string): boolean {
  const idx = rawRoles.findIndex((r) => r.id === id);
  if (idx === -1) {
    return false;
  }
  rawRoles.splice(idx, 1);
  return true;
}

export function getRolePermissions(roleId: string): PermissionCategory[] {
  return getPermissionCategoriesForRole(roleId);
}

export async function saveRolePermissions(
  _roleId: string,
  _categories: PermissionCategory[],
): Promise<void> {
  // In mock mode, just resolve
  await new Promise((r) => setTimeout(r, 200));
}
