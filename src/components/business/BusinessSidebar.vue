<script
  setup
  lang="ts"
>
import {
  ArrowRightLeft,
  Building2,
  Calendar,
  ChevronDown,
  DollarSign,
  Grid3X3,
  LayoutDashboard,
  Mail,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Star,
  UserCheck,
  UserPlus,
  Users,
} from '@lucide/vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SidebarNavItem from '@/components/app/SidebarNavItem.vue';
import { useBusinessAppStore } from '@/stores/businessApp';

const route = useRoute();
const store = useBusinessAppStore();

const isActive = (path: string) => route.path.startsWith(path);

const isTeamOpen = computed(() => store.teamSubmenuOpen);

const isEmployeeActive = computed(() =>
  route.path.startsWith('/business/team/employees'),
);
const isMemberActive = computed(() =>
  route.path.startsWith('/business/team/members'),
);
const isInvitationActive = computed(() =>
  route.path.startsWith('/business/team/invitations'),
);
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__header">
      <div class="sidebar__logo">
        <Building2
          :size="18"
          color="white"
        />
      </div>
      <span class="sidebar__brand">Business</span>
    </div>

    <nav class="sidebar__nav">
      <SidebarNavItem
        :to="'/business/dashboard/overview'"
        :icon="LayoutDashboard"
        label="Dashboard"
        :is-active="isActive('/business/dashboard')"
      />

      <SidebarNavItem
        :to="'/business/orders'"
        :icon="ShoppingCart"
        label="Orders"
        :badge="store.ordersBadgeCount"
        :is-active="isActive('/business/orders')"
      />

      <SidebarNavItem
        :to="'/business/categories'"
        :icon="Grid3X3"
        label="Services"
        :is-active="isActive('/business/categories')"
      />

      <SidebarNavItem
        :to="'/business/schedules'"
        :icon="Calendar"
        label="Schedules"
        :is-active="isActive('/business/schedules')"
      />

      <!-- Team expandable -->
      <div
        class="sidebar__team-group"
        :class="{ open: isTeamOpen }"
      >
        <button
          type="button"
          class="sidebar__team-header"
          :class="{ active: isActive('/business/team') }"
          @click="store.toggleTeamSubmenu()"
        >
          <Users :size="18" />
          <span class="label">Team</span>
          <ChevronDown
            :size="16"
            class="sidebar__chevron"
            :class="{ rotated: isTeamOpen }"
          />
        </button>
        <div
          v-if="isTeamOpen"
          class="sidebar__submenu"
        >
          <router-link
            to="/business/team/employees"
            class="sidebar__sub-item"
            :class="{ active: isEmployeeActive }"
          >
            <UserCheck :size="16" />
            <span>Employees</span>
          </router-link>
          <router-link
            to="/business/team/members"
            class="sidebar__sub-item"
            :class="{ active: isMemberActive }"
          >
            <UserPlus :size="16" />
            <span>Members</span>
          </router-link>
          <router-link
            to="/business/team/invitations"
            class="sidebar__sub-item"
            :class="{ active: isInvitationActive }"
          >
            <Mail :size="16" />
            <span>Invitations</span>
          </router-link>
        </div>
      </div>

      <SidebarNavItem
        :to="'/business/earnings'"
        :icon="DollarSign"
        label="Earnings"
        :is-active="isActive('/business/earnings')"
      />

      <SidebarNavItem
        :to="'/business/transactions'"
        :icon="ArrowRightLeft"
        label="Transactions"
        :is-active="isActive('/business/transactions')"
        class="sidebar__nav-item--rounded"
      />

      <SidebarNavItem
        :to="'/business/reviews'"
        :icon="Star"
        label="Reviews"
        :is-active="isActive('/business/reviews')"
      />

      <SidebarNavItem
        :to="'/business/roles-permissions'"
        :icon="ShieldCheck"
        label="Roles & Permissions"
        :is-active="isActive('/business/roles-permissions')"
      />

      <SidebarNavItem
        :to="'/business/settings'"
        :icon="Settings"
        label="Settings"
        :is-active="isActive('/business/settings')"
      />
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 256px;
  background: #ffffff;
  border-right: 1px solid #d9d9db;
}

.sidebar__header {
  display: flex;
  gap: 8px;
  align-items: center;
  height: 80px;
  padding: 0 28px;
  border-bottom: 1px solid #d9d9db;
}

.sidebar__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #2a2933;
  border-radius: 8px;
}

.sidebar__brand {
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2a2933;
}

.sidebar__nav {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
}

/* Team expandable group */
.sidebar__team-group {
  display: flex;
  flex-direction: column;
}

.sidebar__team-header {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 10px 12px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #939399;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 10px;
  transition: all 0.2s;
}

.sidebar__team-header:hover,
.sidebar__team-header.active,
.sidebar__team-group.open .sidebar__team-header {
  color: var(--foreground);
  background: var(--accent);
}

.sidebar__team-header .label {
  flex: 1;
  text-align: left;
}

.sidebar__chevron {
  transition: all 0.2s ease;
}

.sidebar__chevron.rotated {
  transform: rotate(180deg);
}

.sidebar__submenu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  margin: 4px 0 12px;
  background: color-mix(in srgb, var(--primary) 6%, white);
  border-bottom: 1px solid color-mix(in srgb, var(--primary) 40%, white);
  border-radius: var(--radius-sm);
}

.sidebar__sub-item {
  display: flex;
  gap: 12px;
  align-items: center;
  height: 40px;
  padding: 8px 12px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #939399;
  text-decoration: none;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.sidebar__sub-item:hover {
  color: var(--foreground);
  background: color-mix(in srgb, var(--accent) 95%, black);
}

.sidebar__sub-item.active {
  color: #fff;
  background: var(--primary);
}

/* Override for Transactions item — border-radius 6px */
:deep(.sidebar__nav-item--rounded) .nav-item {
  border-radius: 6px;
}
</style>
