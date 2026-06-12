import { isMockMode } from '@/config';
import { employees as rawEmployees } from '@/data/employees';
import type { Employee } from '@/types/business';

export function getEmployees(): Employee[] {
  if (isMockMode()) {
    return rawEmployees as Employee[];
  }
  throw new Error('API not implemented');
}

export function getEmployee(id: string): Employee | null {
  if (isMockMode()) {
    return (rawEmployees as Employee[]).find((e) => e.id === id) || null;
  }
  throw new Error('API not implemented');
}
