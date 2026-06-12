import type { RouteRecordRaw } from 'vue-router';

export const professionalWorkspaceRoutes: RouteRecordRaw[] = [
  {
    path: '/professional',
    component: () => import('@/layouts/AppShell.vue'),
    children: [
      {
        path: '',
        redirect: '/professional/dashboard',
      },
      {
        path: 'dashboard',
        name: 'pro-dashboard',
        component: () => import('@/views/professional/Dashboard.vue'),
      },
      {
        path: 'organizations',
        name: 'pro-organizations',
        component: () => import('@/views/professional/Organizations.vue'),
      },
      {
        path: 'invitations',
        name: 'pro-invitations',
        component: () => import('@/views/professional/Invitations.vue'),
      },
      {
        path: 'reviews',
        name: 'pro-reviews',
        component: () => import('@/views/professional/Reviews.vue'),
      },
      {
        path: 'settings',
        name: 'pro-settings',
        component: () => import('@/views/professional/Settings.vue'),
      },
      {
        path: 'settings/notifications',
        name: 'pro-settings-notifications',
        component: () => import('@/views/professional/Settings.vue'),
      },
      {
        path: 'settings/appearance',
        name: 'pro-settings-appearance',
        component: () => import('@/views/professional/Settings.vue'),
      },
      {
        path: 'settings/privacy',
        name: 'pro-settings-privacy',
        component: () => import('@/views/professional/Settings.vue'),
      },
    ],
  },
];
