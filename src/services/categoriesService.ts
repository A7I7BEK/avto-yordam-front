import { isMockMode } from '@/config';
import { allServices, categoryTree } from '@/data/categories';

export function getCategories() {
  if (isMockMode()) {
    return { categories: categoryTree, services: allServices };
  }
  throw new Error('API not implemented');
}
