<script
  setup
  lang="ts"
>
import {
  ArrowRightLeft,
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
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import logoUrl from '@/assets/logo/avto-yordam-logo.png';
import SidebarNavItem from '@/components/app/SidebarNavItem.vue';
import { countNewOrders, getOrders } from '@/services/ordersService';
import { useBusinessAppStore } from '@/stores/businessApp';

const route = useRoute();
const store = useBusinessAppStore();

const isActive = (path: string) => route.path.startsWith(path);

// Load the real "new orders" count for the sidebar badge.
onMounted(async () => {
  try {
    const orders = await getOrders();
    store.setOrdersBadgeCount(countNewOrders(orders));
  } catch {
    // Keep the last known count if the fetch fails.
  }
});

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
      <img
        class="sidebar__logo"
        :src="logoUrl"
        alt="Avto Yordam logo"
      >
      <div class="sidebar__brand">
        <span class="sidebar__brand-name">Avto Yordam</span>
        <span class="sidebar__brand-caption">Business</span>
      </div>
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
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border);
}

.sidebar__header {
  display: flex;
  gap: 8px;
  align-items: center;
  height: 80px;
  padding: 0 28px;
  border-bottom: 1px solid var(--border);
}

.sidebar__logo {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  object-fit: contain;
  border-radius: 9px;
}

.sidebar__brand {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.sidebar__brand-name {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--foreground);
}

.sidebar__brand-caption {
  font-family: Inter, sans-serif;
  font-size: 9px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 1.1px;
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
  color: var(--muted-icon);
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
  background: var(--primary-tint);
  border-bottom: 1px solid color-mix(in srgb, var(--primary) 35%, transparent);
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
  color: var(--muted-icon);
  text-decoration: none;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.sidebar__sub-item:hover {
  color: var(--foreground);
  background: var(--hover);
}

.sidebar__sub-item.active {
  color: var(--primary-foreground);
  background: var(--primary);
}

/* Override for Transactions item — border-radius 6px */
:deep(.sidebar__nav-item--rounded) .nav-item {
  border-radius: 6px;
}
</style>
