import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import {
  colorSwatches,
  getPermissionCategoriesForRole,
  permissionTemplates,
  roles as rawRoles,
} from '@/data/roles';
import type {
  PermissionCategory,
  PermissionResponse,
  Role,
  RoleRequestDto,
  RoleResponse,
} from '@/types/business';

const colorPalette = colorSwatches;

let colorIndex = 0;
function nextColor(): string {
  const c = colorPalette[colorIndex % colorPalette.length] ?? '#5749F4';
  colorIndex++;
  return c;
}

function formatDate(dateStr: string): string {
  if (!dateStr) {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  }
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function mapRoleResponseToRole(r: RoleResponse): Role {
  return {
    id: r.id,
    name: r.name,
    description: r.code || r.name,
    color: nextColor(),
    isSystem: false,
    memberCount: 0,
    enabledPermissionCount: r.permissions?.length ?? 0,
    totalPermissionCount: 30,
    createdDate: formatDate(''),
    createdBy: 'You',
    lastEditedDate: formatDate(''),
    lastEditedBy: 'You',
  };
}

function mapBackendPermissionsToCategories(
  backendPerms: { id: string }[],
): PermissionCategory[] {
  const template = JSON.parse(
    JSON.stringify(permissionTemplates.blank),
  ) as PermissionCategory[];
  const backendIds = new Set(backendPerms.map((p) => p.id));
  for (const cat of template) {
    for (const perm of cat.permissions) {
      if (backendIds.has(perm.id)) {
        perm.allowed = true;
      }
    }
  }
  return template;
}

function collectAllowedPermissionIds(
  categories: PermissionCategory[],
): string[] {
  const ids: string[] = [];
  for (const cat of categories) {
    for (const perm of cat.permissions) {
      if (perm.allowed) {
        ids.push(perm.id);
      }
    }
  }
  return ids;
}

export async function getPermissions(): Promise<PermissionResponse[]> {
  if (isMockMode()) {
    const all: PermissionResponse[] = [];
    for (const cat of Object.values(permissionTemplates).flat()) {
      for (const perm of cat.permissions) {
        all.push({ id: perm.id, name: perm.label, code: perm.id });
      }
    }
    return all;
  }

  try {
    const data: PermissionResponse[] = await apiClient.get('/permission');
    return data || [];
  } catch {
    return [];
  }
}

export async function getRoles(): Promise<Role[]> {
  if (isMockMode()) {
    return rawRoles;
  }
  try {
    const data: RoleResponse[] = await apiClient.get(
      '/role/get-for-organization',
    );
    colorIndex = 0;
    return data.map(mapRoleResponseToRole);
  } catch {
    return rawRoles;
  }
}

export async function getRole(id: string): Promise<Role | null> {
  const all = await getRoles();
  return all.find((r) => r.id === id) ?? null;
}

export async function createRole(
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
  permissionIds?: string[],
): Promise<Role> {
  if (isMockMode()) {
    const newRole: Role = {
      id: `r${Date.now()}`,
      ...data,
      isSystem: false,
      memberCount: 0,
      enabledPermissionCount: permissionIds?.length ?? 0,
      totalPermissionCount: 30,
      createdDate: formatDate(''),
      createdBy: 'You',
      lastEditedDate: formatDate(''),
      lastEditedBy: 'You',
    };
    rawRoles.push(newRole);
    return newRole;
  }

  const body: RoleRequestDto = {
    name: data.name,
    code: data.description || data.name,
    permissions: permissionIds ?? [],
  };
  const created: RoleResponse = await apiClient.post('/role', body);
  return mapRoleResponseToRole(created);
}

export async function updateRole(
  id: string,
  data: Partial<Pick<Role, 'name' | 'description' | 'color'>>,
  permissionIds?: string[],
): Promise<Role | null> {
  if (isMockMode()) {
    const role = rawRoles.find((r) => r.id === id);
    if (!role) {
      return null;
    }
    Object.assign(role, data, {
      enabledPermissionCount:
        permissionIds?.length ?? role.enabledPermissionCount,
      lastEditedDate: formatDate(''),
      lastEditedBy: 'You',
    });
    return role;
  }

  const body: RoleRequestDto = {
    name: data.name ?? '',
    code: data.description ?? data.name ?? '',
    permissions: permissionIds ?? [],
  };
  const updated: RoleResponse = await apiClient.put(`/role/${id}`, body);
  return mapRoleResponseToRole(updated);
}

export async function deleteRole(id: string): Promise<boolean> {
  if (isMockMode()) {
    const idx = rawRoles.findIndex((r) => r.id === id);
    if (idx === -1) {
      return false;
    }
    rawRoles.splice(idx, 1);
    return true;
  }
  await apiClient.delete(`/role/${id}`);
  return true;
}

export async function getRolePermissionIds(roleId: string): Promise<string[]> {
  if (isMockMode()) {
    const cats = getPermissionCategoriesForRole(roleId);
    const ids: string[] = [];
    for (const cat of cats) {
      for (const perm of cat.permissions) {
        if (perm.allowed) {
          ids.push(perm.id);
        }
      }
    }
    return ids;
  }

  try {
    const data: RoleResponse = await apiClient.get(`/role/${roleId}`);
    return data.permissions?.map((p) => p.id) ?? [];
  } catch {
    return [];
  }
}

export async function getRolePermissions(
  roleId: string,
): Promise<PermissionCategory[]> {
  if (isMockMode()) {
    return getPermissionCategoriesForRole(roleId);
  }

  try {
    const data: RoleResponse = await apiClient.get(`/role/${roleId}`);
    return mapBackendPermissionsToCategories(data.permissions ?? []);
  } catch {
    return getPermissionCategoriesForRole(roleId);
  }
}

export async function saveRolePermissions(
  roleId: string,
  categories: PermissionCategory[],
): Promise<void> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 200));
    return;
  }

  const permissionIds = collectAllowedPermissionIds(categories);

  // Fetch current role data to preserve name/code
  const current: RoleResponse = await apiClient.get(`/role/${roleId}`);
  const body: RoleRequestDto = {
    name: current.name,
    code: current.code,
    permissions: permissionIds,
  };
  await apiClient.put(`/role/${roleId}`, body);
}
