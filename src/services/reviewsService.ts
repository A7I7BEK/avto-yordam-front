import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import type { ReviewResponse } from '@/types/user';

const mockReviews: ReviewResponse[] = [
  {
    id: 'rev-001',
    order: {
      id: 'ord-001',
      client: {
        id: 'client-001',
        fullName: 'Aziz Karimov',
        phone: '+998 90 123 45 67',
        email: 'aziz@mail.uz',
        isVerified: true,
        type: 'CLIENT',
        birthDay: '1991-02-14',
        languages: [],
      },
      master: {
        id: 'master-001',
        fullName: 'Bekzod Rakhimov',
        phone: '+998 90 111 22 33',
        email: 'bekzod@autofix.uz',
        isVerified: true,
        type: 'PROFESSIONAL',
        birthDay: null,
        languages: [],
      },
      organizationServices: {
        id: 'svc-001',
        organizationId: 'org-001',
        serviceId: 'svc-001',
        name: 'Engine diagnostics',
        minPrice: 300_000,
        maxPrice: 400_000,
        minDurationMinutes: 45,
        maxDurationMinutes: 90,
      },
      slotId: null,
      createdByTypeId: null,
      status: 'COMPLETED',
      createdDate: '2026-07-10T10:00:00Z',
      estimatedPrice: 350_000,
      finalPrice: 350_000,
      problemDescription: 'Engine light on, rough idle',
      carDescription: 'Chevrolet Lacetti, 2019',
      confirmedAt: '2026-07-10T10:30:00Z',
      completedAt: '2026-07-10T12:00:00Z',
      cancelledAt: null,
    },
    clientId: 'client-001',
    organizationId: 'org-001',
    masterId: 'master-001',
    rating: 5,
    comment:
      'Excellent service! Fixed the issue quickly and explained everything clearly.',
  },
  {
    id: 'rev-002',
    order: {
      id: 'ord-002',
      client: {
        id: 'client-002',
        fullName: 'Madina Tursunova',
        phone: '+998 90 987 65 43',
        email: 'madina@mail.uz',
        isVerified: true,
        type: 'CLIENT',
        birthDay: null,
        languages: [],
      },
      master: {
        id: 'master-002',
        fullName: 'Jasur Tursunov',
        phone: '+998 90 444 55 66',
        email: 'jasur@autofix.uz',
        isVerified: true,
        type: 'PROFESSIONAL',
        birthDay: null,
        languages: [],
      },
      organizationServices: {
        id: 'svc-002',
        organizationId: 'org-001',
        serviceId: 'svc-002',
        name: 'Brake pad replacement',
        minPrice: 750_000,
        maxPrice: 950_000,
        minDurationMinutes: 60,
        maxDurationMinutes: 120,
      },
      slotId: null,
      createdByTypeId: null,
      status: 'COMPLETED',
      createdDate: '2026-07-12T14:00:00Z',
      estimatedPrice: 850_000,
      finalPrice: 800_000,
      problemDescription: 'Squeaking noise when braking',
      carDescription: 'Kia Optima, 2020',
      confirmedAt: '2026-07-12T14:30:00Z',
      completedAt: '2026-07-12T16:00:00Z',
      cancelledAt: null,
    },
    clientId: 'client-002',
    organizationId: 'org-001',
    masterId: 'master-002',
    rating: 4,
    comment: 'Good work. The noise is gone. Took a bit longer than expected.',
  },
  {
    id: 'rev-003',
    order: {
      id: 'ord-003',
      client: {
        id: 'client-003',
        fullName: 'Nodir Ergashev',
        phone: '+998 90 777 88 99',
        email: 'nodir@mail.uz',
        isVerified: true,
        type: 'CLIENT',
        birthDay: '1985-06-30',
        languages: [],
      },
      master: {
        id: 'master-001',
        fullName: 'Bekzod Rakhimov',
        phone: '+998 90 111 22 33',
        email: 'bekzod@autofix.uz',
        isVerified: true,
        type: 'PROFESSIONAL',
        birthDay: null,
        languages: [],
      },
      organizationServices: {
        id: 'svc-003',
        organizationId: 'org-001',
        serviceId: 'svc-003',
        name: 'Oil change',
        minPrice: 180_000,
        maxPrice: 250_000,
        minDurationMinutes: 20,
        maxDurationMinutes: 40,
      },
      slotId: null,
      createdByTypeId: null,
      status: 'COMPLETED',
      createdDate: '2026-07-14T09:00:00Z',
      estimatedPrice: 220_000,
      finalPrice: 220_000,
      problemDescription: 'Regular oil change',
      carDescription: 'Toyota Camry, 2021',
      confirmedAt: '2026-07-14T09:15:00Z',
      completedAt: '2026-07-14T09:45:00Z',
      cancelledAt: null,
    },
    clientId: 'client-003',
    organizationId: 'org-001',
    masterId: 'master-001',
    rating: 3,
    comment: 'Okay service. Did not clean up after themselves properly.',
  },
];

export async function getReviews(): Promise<ReviewResponse[]> {
  if (isMockMode()) {
    return mockReviews;
  }
  try {
    const data = await apiClient.get('/review/page');
    // /review/page returns a Spring Page wrapper ({ content: [...] }).
    const list = Array.isArray(data) ? data : (data?.content ?? []);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function getMyReviews(): Promise<ReviewResponse[]> {
  if (isMockMode()) {
    return mockReviews;
  }
  try {
    const data = await apiClient.get('/review/get-by-master');
    const list = Array.isArray(data) ? data : (data?.content ?? []);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function getReviewById(
  id: string,
): Promise<ReviewResponse | null> {
  if (isMockMode()) {
    return mockReviews.find((r) => r.id === id) ?? null;
  }
  try {
    return await apiClient.get(`/review/${id}`);
  } catch {
    return null;
  }
}

export async function deleteReview(id: string): Promise<void> {
  if (isMockMode()) {
    return;
  }
  await apiClient.delete(`/review/${id}`);
}
