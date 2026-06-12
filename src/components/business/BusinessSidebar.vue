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
        label="Categories"
        :is-active="isActive('/business/categories')"
      />

      <SidebarNavItem
        :to="'/business/schedules'"
        :icon="Calendar"
        label="Schedules"
        :is-active="isActive('/business/schedules')"
      />

      <!-- Team expandable -->
      <div class="sidebar__team-group">
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
  gap: 12px;
  align-items: center;
  padding: 24px;
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
  gap: 2px;
  padding: 8px 16px;
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
  transition:
    background 0.15s,
    color 0.15s;
}

.sidebar__team-header:hover {
  color: #2a2933;
  background: rgba(245, 245, 245, 0.5);
}

.sidebar__team-header.active {
  font-weight: 600;
  color: #2a2933;
  background: #f5f5f5;
}

.sidebar__team-header .label {
  flex: 1;
  text-align: left;
}

.sidebar__chevron {
  transition: transform 0.2s ease;
}

.sidebar__chevron.rotated {
  transform: rotate(180deg);
}

.sidebar__submenu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 16px;
}

.sidebar__sub-item {
  display: flex;
  gap: 12px;
  align-items: center;
  height: 32px;
  padding: 8px 12px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #939399;
  text-decoration: none;
  border-radius: 6px;
  transition:
    background 0.15s,
    color 0.15s;
}

.sidebar__sub-item:hover {
  color: #2a2933;
  background: rgba(245, 245, 245, 0.5);
}

.sidebar__sub-item.active {
  font-weight: 600;
  color: #2a2933;
  background: #f5f5f5;
}

/* Override for Transactions item — border-radius 6px */
:deep(.sidebar__nav-item--rounded) .nav-item {
  border-radius: 6px;
}
</style>
