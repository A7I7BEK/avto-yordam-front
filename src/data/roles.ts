import type { PermissionCategory, Role } from '@/types/business';

export const roles: Role[] = [
  {
    id: 'r1',
    name: 'Owner',
    description: 'Full system access, cannot be modified',
    color: '#5749F4',
    isSystem: true,
    memberCount: 1,
    enabledPermissionCount: 30,
    totalPermissionCount: 30,
    createdDate: 'Mar 14, 2024',
    createdBy: 'System',
    lastEditedDate: 'Mar 14, 2024',
    lastEditedBy: 'System',
  },
  {
    id: 'r2',
    name: 'Manager',
    description: 'Manages users, settings and reports',
    color: '#CC3314',
    isSystem: false,
    memberCount: 3,
    enabledPermissionCount: 18,
    totalPermissionCount: 30,
    createdDate: 'Mar 14, 2024',
    createdBy: 'System',
    lastEditedDate: 'Apr 09, 2026',
    lastEditedBy: 'Aziz K.',
  },
  {
    id: 'r3',
    name: 'Dispatcher',
    description: 'Oversees daily operations and orders',
    color: '#F77E40',
    isSystem: false,
    memberCount: 5,
    enabledPermissionCount: 14,
    totalPermissionCount: 30,
    createdDate: 'Apr 07, 2026',
    createdBy: 'Aziz K.',
    lastEditedDate: 'Apr 11, 2026',
    lastEditedBy: 'Aziz K.',
  },
  {
    id: 'r4',
    name: 'Mechanic',
    description: 'Works on assigned service orders',
    color: '#1FAA59',
    isSystem: false,
    memberCount: 12,
    enabledPermissionCount: 6,
    totalPermissionCount: 30,
    createdDate: 'Mar 22, 2026',
    createdBy: 'Saida M.',
    lastEditedDate: 'Apr 07, 2026',
    lastEditedBy: 'Saida M.',
  },
  {
    id: 'r5',
    name: 'Accountant',
    description: 'Handles billing and transactions',
    color: '#2BC8B6',
    isSystem: false,
    memberCount: 2,
    enabledPermissionCount: 9,
    totalPermissionCount: 30,
    createdDate: 'Mar 28, 2026',
    createdBy: 'Aziz K.',
    lastEditedDate: 'Mar 28, 2026',
    lastEditedBy: 'Aziz K.',
  },
  {
    id: 'r6',
    name: 'Viewer',
    description: 'Read-only access to selected pages',
    color: '#A35BFF',
    isSystem: false,
    memberCount: 4,
    enabledPermissionCount: 3,
    totalPermissionCount: 30,
    createdDate: 'Mar 22, 2026',
    createdBy: 'Aziz K.',
    lastEditedDate: 'Mar 22, 2026',
    lastEditedBy: 'Aziz K.',
  },
];

export const colorSwatches = [
  '#5749F4',
  '#0F5FFE',
  '#16A34A',
  '#F97316',
  '#EAB308',
  '#EC4899',
];

export const permissionTemplates = {
  blank: [
    {
      id: 'cat-bookings',
      name: 'Bookings',
      permissions: [
        { id: 'perm-view-bookings', label: 'View bookings', allowed: false },
        {
          id: 'perm-create-bookings',
          label: 'Create bookings',
          allowed: false,
        },
        { id: 'perm-edit-bookings', label: 'Edit bookings', allowed: false },
        {
          id: 'perm-cancel-bookings',
          label: 'Cancel bookings',
          allowed: false,
        },
        {
          id: 'perm-reassign-bookings',
          label: 'Reassign bookings',
          allowed: false,
        },
        {
          id: 'perm-delete-bookings',
          label: 'Delete bookings',
          allowed: false,
        },
      ],
    },
    {
      id: 'cat-catalog',
      name: 'Catalog',
      permissions: [
        {
          id: 'perm-view-services',
          label: 'View services & prices',
          allowed: false,
        },
        { id: 'perm-add-services', label: 'Add new services', allowed: false },
        {
          id: 'perm-edit-services',
          label: 'Edit service details',
          allowed: false,
        },
        { id: 'perm-change-prices', label: 'Change prices', allowed: false },
        {
          id: 'perm-archive-services',
          label: 'Archive services',
          allowed: false,
        },
        {
          id: 'perm-delete-services',
          label: 'Delete services',
          allowed: false,
        },
      ],
    },
    {
      id: 'cat-schedule',
      name: 'Schedule & Team',
      permissions: [
        {
          id: 'perm-view-schedule',
          label: 'View team schedule',
          allowed: false,
        },
        {
          id: 'perm-edit-own-schedule',
          label: 'Edit own schedule',
          allowed: false,
        },
        {
          id: 'perm-edit-team-schedule',
          label: 'Edit team schedules',
          allowed: false,
        },
        {
          id: 'perm-invite-members',
          label: 'Invite new members',
          allowed: false,
        },
        {
          id: 'perm-assign-roles',
          label: 'Assign roles to members',
          allowed: false,
        },
        { id: 'perm-remove-members', label: 'Remove members', allowed: false },
      ],
    },
    {
      id: 'cat-finance',
      name: 'Finance',
      permissions: [
        {
          id: 'perm-view-earnings',
          label: 'View earnings overview',
          allowed: false,
        },
        {
          id: 'perm-view-transactions',
          label: 'View transactions',
          allowed: false,
        },
        {
          id: 'perm-export-reports',
          label: 'Export financial reports',
          allowed: false,
        },
        { id: 'perm-issue-refunds', label: 'Issue refunds', allowed: false },
        {
          id: 'perm-manage-payments',
          label: 'Manage payment providers',
          allowed: false,
        },
        {
          id: 'perm-edit-bank',
          label: 'Edit bank account details',
          allowed: false,
        },
      ],
    },
    {
      id: 'cat-settings',
      name: 'Settings & Workspace',
      permissions: [
        {
          id: 'perm-view-settings',
          label: 'View workspace settings',
          allowed: false,
        },
        {
          id: 'perm-edit-profile',
          label: 'Edit business profile',
          allowed: false,
        },
        {
          id: 'perm-manage-hours',
          label: 'Manage operating hours',
          allowed: false,
        },
        {
          id: 'perm-manage-roles',
          label: 'Manage roles & permissions',
          allowed: false,
        },
        {
          id: 'perm-manage-notifications',
          label: 'Manage notification policy',
          allowed: false,
        },
        { id: 'perm-danger-zone', label: 'Access danger zone', allowed: false },
      ],
    },
  ],
  manager: [
    {
      id: 'cat-bookings',
      name: 'Bookings',
      permissions: [
        { id: 'perm-view-bookings', label: 'View bookings', allowed: true },
        { id: 'perm-create-bookings', label: 'Create bookings', allowed: true },
        { id: 'perm-edit-bookings', label: 'Edit bookings', allowed: true },
        {
          id: 'perm-cancel-bookings',
          label: 'Cancel bookings',
          allowed: false,
        },
        {
          id: 'perm-reassign-bookings',
          label: 'Reassign bookings',
          allowed: false,
        },
        {
          id: 'perm-delete-bookings',
          label: 'Delete bookings',
          allowed: false,
        },
      ],
    },
    {
      id: 'cat-catalog',
      name: 'Catalog',
      permissions: [
        {
          id: 'perm-view-services',
          label: 'View services & prices',
          allowed: true,
        },
        { id: 'perm-add-services', label: 'Add new services', allowed: true },
        {
          id: 'perm-edit-services',
          label: 'Edit service details',
          allowed: true,
        },
        { id: 'perm-change-prices', label: 'Change prices', allowed: false },
        {
          id: 'perm-archive-services',
          label: 'Archive services',
          allowed: false,
        },
        {
          id: 'perm-delete-services',
          label: 'Delete services',
          allowed: false,
        },
      ],
    },
    {
      id: 'cat-schedule',
      name: 'Schedule & Team',
      permissions: [
        {
          id: 'perm-view-schedule',
          label: 'View team schedule',
          allowed: true,
        },
        {
          id: 'perm-edit-own-schedule',
          label: 'Edit own schedule',
          allowed: true,
        },
        {
          id: 'perm-edit-team-schedule',
          label: 'Edit team schedules',
          allowed: true,
        },
        {
          id: 'perm-invite-members',
          label: 'Invite new members',
          allowed: false,
        },
        {
          id: 'perm-assign-roles',
          label: 'Assign roles to members',
          allowed: false,
        },
        { id: 'perm-remove-members', label: 'Remove members', allowed: false },
      ],
    },
    {
      id: 'cat-finance',
      name: 'Finance',
      permissions: [
        {
          id: 'perm-view-earnings',
          label: 'View earnings overview',
          allowed: true,
        },
        {
          id: 'perm-view-transactions',
          label: 'View transactions',
          allowed: true,
        },
        {
          id: 'perm-export-reports',
          label: 'Export financial reports',
          allowed: false,
        },
        { id: 'perm-issue-refunds', label: 'Issue refunds', allowed: false },
        {
          id: 'perm-manage-payments',
          label: 'Manage payment providers',
          allowed: false,
        },
        {
          id: 'perm-edit-bank',
          label: 'Edit bank account details',
          allowed: false,
        },
      ],
    },
    {
      id: 'cat-settings',
      name: 'Settings & Workspace',
      permissions: [
        {
          id: 'perm-view-settings',
          label: 'View workspace settings',
          allowed: true,
        },
        {
          id: 'perm-edit-profile',
          label: 'Edit business profile',
          allowed: false,
        },
        {
          id: 'perm-manage-hours',
          label: 'Manage operating hours',
          allowed: false,
        },
        {
          id: 'perm-manage-roles',
          label: 'Manage roles & permissions',
          allowed: false,
        },
        {
          id: 'perm-manage-notifications',
          label: 'Manage notification policy',
          allowed: false,
        },
        { id: 'perm-danger-zone', label: 'Access danger zone', allowed: false },
      ],
    },
  ],
  dispatcher: [
    {
      id: 'cat-bookings',
      name: 'Bookings',
      permissions: [
        { id: 'perm-view-bookings', label: 'View bookings', allowed: true },
        { id: 'perm-create-bookings', label: 'Create bookings', allowed: true },
        { id: 'perm-edit-bookings', label: 'Edit bookings', allowed: true },
        { id: 'perm-cancel-bookings', label: 'Cancel bookings', allowed: true },
        {
          id: 'perm-reassign-bookings',
          label: 'Reassign bookings',
          allowed: true,
        },
        {
          id: 'perm-delete-bookings',
          label: 'Delete bookings',
          allowed: false,
        },
      ],
    },
    {
      id: 'cat-catalog',
      name: 'Catalog',
      permissions: [
        {
          id: 'perm-view-services',
          label: 'View services & prices',
          allowed: true,
        },
        { id: 'perm-add-services', label: 'Add new services', allowed: false },
        {
          id: 'perm-edit-services',
          label: 'Edit service details',
          allowed: false,
        },
        { id: 'perm-change-prices', label: 'Change prices', allowed: false },
        {
          id: 'perm-archive-services',
          label: 'Archive services',
          allowed: false,
        },
        {
          id: 'perm-delete-services',
          label: 'Delete services',
          allowed: false,
        },
      ],
    },
    {
      id: 'cat-schedule',
      name: 'Schedule & Team',
      permissions: [
        {
          id: 'perm-view-schedule',
          label: 'View team schedule',
          allowed: true,
        },
        {
          id: 'perm-edit-own-schedule',
          label: 'Edit own schedule',
          allowed: true,
        },
        {
          id: 'perm-edit-team-schedule',
          label: 'Edit team schedules',
          allowed: true,
        },
        {
          id: 'perm-invite-members',
          label: 'Invite new members',
          allowed: false,
        },
        {
          id: 'perm-assign-roles',
          label: 'Assign roles to members',
          allowed: false,
        },
        { id: 'perm-remove-members', label: 'Remove members', allowed: false },
      ],
    },
    {
      id: 'cat-finance',
      name: 'Finance',
      permissions: [
        {
          id: 'perm-view-earnings',
          label: 'View earnings overview',
          allowed: false,
        },
        {
          id: 'perm-view-transactions',
          label: 'View transactions',
          allowed: true,
        },
        {
          id: 'perm-export-reports',
          label: 'Export financial reports',
          allowed: false,
        },
        { id: 'perm-issue-refunds', label: 'Issue refunds', allowed: false },
        {
          id: 'perm-manage-payments',
          label: 'Manage payment providers',
          allowed: false,
        },
        {
          id: 'perm-edit-bank',
          label: 'Edit bank account details',
          allowed: false,
        },
      ],
    },
    {
      id: 'cat-settings',
      name: 'Settings & Workspace',
      permissions: [
        {
          id: 'perm-view-settings',
          label: 'View workspace settings',
          allowed: true,
        },
        {
          id: 'perm-edit-profile',
          label: 'Edit business profile',
          allowed: false,
        },
        {
          id: 'perm-manage-hours',
          label: 'Manage operating hours',
          allowed: false,
        },
        {
          id: 'perm-manage-roles',
          label: 'Manage roles & permissions',
          allowed: false,
        },
        {
          id: 'perm-manage-notifications',
          label: 'Manage notification policy',
          allowed: false,
        },
        { id: 'perm-danger-zone', label: 'Access danger zone', allowed: false },
      ],
    },
  ],
};

export function getPermissionCategoriesForRole(
  roleId: string,
): PermissionCategory[] {
  if (roleId === 'r2') {
    return permissionTemplates.manager;
  }
  if (roleId === 'r3') {
    return permissionTemplates.dispatcher;
  }
  if (roleId === 'r1') {
    return permissionTemplates.blank.map((cat) => ({
      ...cat,
      permissions: cat.permissions.map((p) => ({ ...p, allowed: true })),
    }));
  }
  return permissionTemplates.blank;
}
