import type { RouteRecordRaw } from 'vue-router';

export const businessRoutes: RouteRecordRaw[] = [
  {
    path: '/business',
    component: () => import('@/layouts/BusinessAppShell.vue'),
    children: [
      {
        path: '',
        redirect: '/business/dashboard',
      },

      // === Dashboard ===
      {
        path: 'dashboard',
        redirect: '/business/dashboard/overview',
      },
      {
        path: 'dashboard/overview',
        name: 'biz-dashboard-overview',
        component: () =>
          import('@/views/business/dashboard/DashboardOverview.vue'),
      },
      {
        path: 'dashboard/receptionist',
        name: 'biz-dashboard-receptionist',
        component: () =>
          import('@/views/business/dashboard/DashboardReceptionist.vue'),
      },
      {
        path: 'dashboard/command-center',
        name: 'biz-dashboard-command-center',
        component: () =>
          import('@/views/business/dashboard/DashboardCommandCenter.vue'),
      },

      // === Orders ===
      {
        path: 'orders',
        name: 'biz-orders',
        component: () => import('@/views/business/orders/OrdersList.vue'),
      },
      {
        path: 'orders/:id',
        name: 'biz-order-detail',
        component: () => import('@/views/business/orders/OrderDetail.vue'),
      },

      // === Categories ===
      {
        path: 'categories',
        name: 'biz-categories',
        component: () => import('@/views/business/categories/Categories.vue'),
      },

      // === Schedules ===
      {
        path: 'schedules',
        name: 'biz-schedules-month',
        component: () =>
          import('@/views/business/schedules/SchedulesMonth.vue'),
      },
      {
        path: 'schedules/week',
        name: 'biz-schedules-week',
        component: () => import('@/views/business/schedules/SchedulesWeek.vue'),
      },
      {
        path: 'schedules/day',
        name: 'biz-schedules-day',
        component: () => import('@/views/business/schedules/SchedulesDay.vue'),
      },
      {
        path: 'schedules/slots',
        name: 'biz-schedules-slots',
        component: () =>
          import('@/views/business/schedules/SchedulesSlots.vue'),
      },

      // === Team / Employees ===
      {
        path: 'team/employees',
        name: 'biz-employees-list',
        component: () => import('@/views/business/team/EmployeesList.vue'),
      },
      {
        path: 'team/employees/new',
        name: 'biz-employee-create',
        component: () => import('@/views/business/team/EmployeeCreate.vue'),
      },
      {
        path: 'team/employees/:id',
        name: 'biz-employee-view',
        component: () => import('@/views/business/team/EmployeeView.vue'),
      },
      {
        path: 'team/employees/:id/edit',
        name: 'biz-employee-edit',
        component: () => import('@/views/business/team/EmployeeEdit.vue'),
      },

      // === Team / Members ===
      {
        path: 'team/members',
        name: 'biz-members-list',
        component: () => import('@/views/business/team/MembersList.vue'),
      },
      {
        path: 'team/members/invite',
        name: 'biz-member-invite',
        component: () => import('@/views/business/team/MemberInvite.vue'),
      },
      {
        path: 'team/members/:id',
        name: 'biz-member-profile',
        component: () => import('@/views/business/team/MemberProfile.vue'),
      },

      // === Team / Invitations ===
      {
        path: 'team/invitations',
        name: 'biz-invitations-list',
        component: () => import('@/views/business/team/InvitationsList.vue'),
      },

      // === Earnings ===
      {
        path: 'earnings',
        name: 'biz-earnings',
        component: () => import('@/views/business/earnings/Earnings.vue'),
      },

      // === Transactions ===
      {
        path: 'transactions',
        name: 'biz-transactions',
        component: () =>
          import('@/views/business/transactions/Transactions.vue'),
      },
      {
        path: 'transactions/:id',
        name: 'biz-transaction-detail',
        component: () =>
          import('@/views/business/transactions/TransactionDetail.vue'),
      },

      // === Reviews ===
      {
        path: 'reviews',
        name: 'biz-reviews',
        component: () => import('@/views/business/reviews/Reviews.vue'),
      },

      // === Roles & Permissions ===
      {
        path: 'roles-permissions',
        name: 'biz-roles-list',
        component: () =>
          import('@/views/business/roles-permissions/RolesList.vue'),
      },
      {
        path: 'roles-permissions/new',
        name: 'biz-role-form-new',
        component: () =>
          import('@/views/business/roles-permissions/RoleForm.vue'),
      },
      {
        path: 'roles-permissions/:id',
        name: 'biz-role-detail',
        component: () =>
          import('@/views/business/roles-permissions/RoleDetail.vue'),
      },
      {
        path: 'roles-permissions/:id/edit',
        name: 'biz-role-form-edit',
        component: () =>
          import('@/views/business/roles-permissions/RoleForm.vue'),
      },
      {
        path: 'roles-permissions/:id/permissions',
        name: 'biz-role-permissions',
        component: () =>
          import('@/views/business/roles-permissions/AssignPermissions.vue'),
      },

      // === Notifications ===
      {
        path: 'notifications',
        name: 'biz-notifications',
        component: () =>
          import('@/views/business/notifications/Notifications.vue'),
      },

      // === Settings ===
      {
        path: 'settings',
        redirect: '/business/settings/profile',
      },
      {
        path: 'settings/profile',
        name: 'biz-settings-profile',
        component: () => import('@/views/business/Settings.vue'),
      },
      {
        path: 'settings/legal',
        name: 'biz-settings-legal',
        component: () => import('@/views/business/Settings.vue'),
      },
      {
        path: 'settings/hours',
        name: 'biz-settings-hours',
        component: () => import('@/views/business/Settings.vue'),
      },
      {
        path: 'settings/photos',
        name: 'biz-settings-photos',
        component: () => import('@/views/business/Settings.vue'),
      },
      {
        path: 'settings/bank-info',
        name: 'biz-settings-bank-info',
        component: () => import('@/views/business/Settings.vue'),
      },
      {
        path: 'settings/payment',
        name: 'biz-settings-payment',
        component: () => import('@/views/business/Settings.vue'),
      },
      {
        path: 'settings/notifications',
        name: 'biz-settings-notifications',
        component: () => import('@/views/business/Settings.vue'),
      },
      {
        path: 'settings/appearance',
        name: 'biz-settings-appearance',
        component: () => import('@/views/business/Settings.vue'),
      },
      {
        path: 'settings/danger-zone',
        name: 'biz-settings-danger-zone',
        component: () => import('@/views/business/Settings.vue'),
      },
    ],
  },
];
