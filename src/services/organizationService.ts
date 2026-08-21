import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import type { OrganizationServiceResponse } from '@/types/user';

const mockOrgServices: OrganizationServiceResponse[] = [
  {
    id: 'org-svc-1',
    organizationId: 'org-001',
    serviceId: 'svc-1',
    name: 'Brake pads exchange',
    minPrice: 750_000,
    maxPrice: 950_000,
    minDurationMinutes: 60,
    maxDurationMinutes: 120,
  },
  {
    id: 'org-svc-2',
    organizationId: 'org-001',
    serviceId: 'svc-2',
    name: 'Engine oil change',
    minPrice: 180_000,
    maxPrice: 350_000,
    minDurationMinutes: 30,
    maxDurationMinutes: 60,
  },
  {
    id: 'org-svc-3',
    organizationId: 'org-001',
    serviceId: 'svc-3',
    name: 'Timing belt replace',
    minPrice: 1_500_000,
    maxPrice: 2_200_000,
    minDurationMinutes: 120,
    maxDurationMinutes: 240,
  },
  {
    id: 'org-svc-4',
    organizationId: 'org-001',
    serviceId: 'svc-4',
    name: 'AC recharge',
    minPrice: 300_000,
    maxPrice: 500_000,
    minDurationMinutes: 45,
    maxDurationMinutes: 90,
  },
  {
    id: 'org-svc-5',
    organizationId: 'org-001',
    serviceId: 'svc-5',
    name: 'Diagnostics',
    minPrice: 150_000,
    maxPrice: 400_000,
    minDurationMinutes: 30,
    maxDurationMinutes: 90,
  },
];

export async function getOrganizationServices(
  orgId: string,
): Promise<OrganizationServiceResponse[]> {
  if (isMockMode()) {
    return mockOrgServices;
  }
  try {
    return await apiClient.get(
      `/organization-catalog/get-by-organization-id/${orgId}`,
    );
  } catch {
    return [];
  }
}
