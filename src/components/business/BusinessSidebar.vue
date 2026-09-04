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
  LogOut,
  Mail,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Star,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
} from '@lucide/vue';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import logoUrl from '@/assets/logo/logo-light.png';
import LanguageSwitcher from '@/components/app/LanguageSwitcher.vue';
import SidebarNavItem from '@/components/app/SidebarNavItem.vue';
import ThemeToggle from '@/components/app/ThemeToggle.vue';
import { countNewOrders, getOrders } from '@/services/ordersService';
import { useBusinessAppStore } from '@/stores/businessApp';

const route = useRoute();
const router = useRouter();
const store = useBusinessAppStore();

function goToProfile() {
  store.closeMobileSidebar();
  router.push({ name: 'biz-settings-profile' });
}

function handleLogout() {
  store.closeMobileSidebar();
  localStorage.removeItem('token');
  router.push('/auth/login');
}

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
      <div class="sidebar__brand-row">
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
      <button
        class="sidebar__close-btn"
        type="button"
        aria-label="Close navigation sidebar"
        @click="store.closeMobileSidebar"
      >
        <X :size="20" />
      </button>
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

    <!-- Mobile-only utilities & profile -->
    <div class="sidebar__mobile-section">
      <div class="sidebar__mobile-divider" />

      <!-- Language & Theme switcher -->
      <div class="sidebar__mobile-utils">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <!-- User Profile Card -->
      <div class="sidebar__mobile-profile">
        <div class="sidebar__mobile-user-row">
          <div class="sidebar__mobile-avatar">
            {{ store.userInitials || 'U' }}
          </div>
          <div class="sidebar__mobile-user-info">
            <span class="sidebar__mobile-user-name">{{ store.userName }}</span>
            <span class="sidebar__mobile-user-role"
              >{{ store.userRole }}
              • {{ store.orgName }}</span
            >
          </div>
        </div>
        <div class="sidebar__mobile-actions">
          <button
            class="sidebar__mobile-action-btn"
            type="button"
            @click="goToProfile"
          >
            <User :size="15" />
            <span>Profile Settings</span>
          </button>
          <button
            class="sidebar__mobile-action-btn sidebar__mobile-action-btn--danger"
            type="button"
            @click="handleLogout"
          >
            <LogOut :size="15" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 256px;
  height: 100%;
  overflow-y: auto;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border);
}

.sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 0 20px;
  border-bottom: 1px solid var(--border);
}

.sidebar__brand-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.sidebar__close-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: var(--muted-foreground);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: all 0.15s;
}

.sidebar__close-btn:hover {
  color: var(--foreground);
  background: var(--accent);
}

@media (max-width: 1023px) {
  .sidebar__close-btn {
    display: inline-flex;
  }
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

/* Mobile-only utilities & profile section */
.sidebar__mobile-section {
  display: none;
  flex-direction: column;
  gap: 14px;
  padding: 16px 16px 24px;
  margin-top: auto;
}

@media (max-width: 1023px) {
  .sidebar__mobile-section {
    display: flex;
  }
}

.sidebar__mobile-divider {
  width: 100%;
  height: 1px;
  background: var(--border);
}

.sidebar__mobile-utils {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}

.sidebar__mobile-profile {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.sidebar__mobile-user-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sidebar__mobile-avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: var(--primary-foreground);
  background: var(--primary);
  border-radius: 999px;
}

.sidebar__mobile-user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.sidebar__mobile-user-name {
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
  white-space: nowrap;
}

.sidebar__mobile-user-role {
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: Inter, sans-serif;
  font-size: 11px;
  color: var(--muted-foreground);
  white-space: nowrap;
}

.sidebar__mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
}

.sidebar__mobile-action-btn {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  padding: 8px 10px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  transition: background 0.15s;
}

.sidebar__mobile-action-btn:hover {
  background: var(--accent);
}

.sidebar__mobile-action-btn--danger {
  color: var(--destructive);
}

.sidebar__mobile-action-btn--danger:hover {
  background: var(--destructive-soft, rgba(239, 68, 68, 0.1));
}
</style>
