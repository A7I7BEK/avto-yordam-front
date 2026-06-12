import { createRouter, createWebHistory } from 'vue-router';
import {
  accountSelectionRoutes,
  businessAuthRoutes,
  businessOnboardingRoutes,
  professionalAuthRoutes,
  professionalOnboardingRoutes,
} from './auth.routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Redirect root to account type selection
    {
      path: '/',
      redirect: '/auth/account-type',
    },

    // === Auth (no layout) ===
    {
      path: '/auth',
      children: [
        ...accountSelectionRoutes,
        ...businessAuthRoutes,
        ...professionalAuthRoutes,
      ],
    },

    // === Onboarding (no layout) ===
    ...businessOnboardingRoutes,
    ...professionalOnboardingRoutes,

    // === Business Workspace (placeholder) ===
    {
      path: '/business',
      redirect: '/auth/account-type',
    },

    // === Professional Workspace (placeholder) ===
    {
      path: '/professional',
      redirect: '/auth/account-type',
    },

    // === Utility (no layout) ===
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/utility/NotFound.vue'),
    },
  ],
});

export default router;
