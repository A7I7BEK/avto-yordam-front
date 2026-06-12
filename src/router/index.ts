import { createRouter, createWebHistory } from 'vue-router';
import {
  accountSelectionRoutes,
  businessAuthRoutes,
  businessOnboardingRoutes,
  professionalAuthRoutes,
  professionalOnboardingRoutes,
} from './auth.routes';
import { businessRoutes } from './business.routes';
import { professionalWorkspaceRoutes } from './professional.routes';

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

    // === Professional Workspace (with AppShell layout) ===
    ...professionalWorkspaceRoutes,

    // === Business Workspace (with AppShell layout) ===
    ...businessRoutes,

    // === Utility (no layout) ===
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/utility/NotFound.vue'),
    },
  ],
});

export default router;
