import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import { allServices, categoryTree } from '@/data/categories';

export async function getCategories() {
  if (isMockMode()) {
    return { categories: categoryTree, services: allServices };
  }

  try {
    const services = await apiClient.get('/service');
    const formattedServices = services.map((svc: any) => ({
      id: svc.id,
      name: svc.name,
      description: svc.description || '',
      durationMinutes: svc.durationMinutes || 60,
      price: svc.basePrice || 0,
      enabled: true,
      category: 'Engine',
      notes: '',
      suggestedPriceLow: Math.round((svc.basePrice || 100000) * 0.8),
      suggestedPriceHigh: Math.round((svc.basePrice || 100000) * 1.2),
      suggestedDurationLow: Math.round((svc.durationMinutes || 60) * 0.8),
      suggestedDurationHigh: Math.round((svc.durationMinutes || 60) * 1.2),
    }));

    const categories = categoryTree.map((cat) => {
      const count = formattedServices.filter((s: any) => s.category === cat.name).length;
      return { ...cat, count };
    });

    return { categories, services: formattedServices };
  } catch (_) {
    return { categories: categoryTree, services: allServices };
  }
}
