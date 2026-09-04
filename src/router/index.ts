import { createRouter, createWebHistory } from 'vue-router';
import {
  accountSelectionRoutes,
  businessAuthRoutes,
  businessOnboardingRoutes,
  professionalAuthRoutes,
  professionalOnboardingRoutes,
  unifiedAuthRoutes,
} from './auth.routes';
import { businessRoutes } from './business.routes';
import { professionalWorkspaceRoutes } from './professional.routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Redirect root to unified login
    {
      path: '/',
      redirect: '/auth/login',
    },

    // === Auth (no layout) ===
    {
      path: '/auth',
      children: [
        ...accountSelectionRoutes,
        ...unifiedAuthRoutes,
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

    // === Public invite link landing ===
    {
      path: '/invite/:invitationId',
      name: 'invite-landing',
      component: () => import('@/views/utility/InviteLanding.vue'),
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
