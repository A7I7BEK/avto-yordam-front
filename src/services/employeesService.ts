import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import { employees as rawEmployees } from '@/data/employees';
import type { Employee } from '@/types/business';

export async function getEmployees(): Promise<Employee[]> {
  if (isMockMode()) {
    return rawEmployees as Employee[];
  }

  try {
    const members = await apiClient.get(
      '/organization-member/get-organization-employees',
    );
    return members.map((m: any) => {
      const user = m.master ?? m.user ?? m;
      const fullName = user.fullName ?? m.userName ?? 'Unknown Member';
      return {
        id: m.id ?? user.id,
        name: fullName,
        initials: (fullName || 'UM')
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        role: m.role?.name ?? user.type ?? 'Employee',
        phone: user.phone ?? '',
        status: 'Active' as const,
        avatarColor: '#5749F4',
      };
    });
  } catch {
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

export async function createEmployee(data: {
  phone?: string;
  password: string;
  email?: string;
  fullName: string;
  roleId: string;
}): Promise<void> {
  if (isMockMode()) {
    return;
  }
  await apiClient.post('/user', data);
}
