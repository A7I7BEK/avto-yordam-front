<script
  setup
  lang="ts"
>
import {
  Layers,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  Star,
  User,
  X,
} from '@lucide/vue';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import logoUrl from '@/assets/logo/logo-light.png';
import { useProfessionalAppStore } from '@/stores/professionalApp';
import LanguageSwitcher from './LanguageSwitcher.vue';
import SidebarNavItem from './SidebarNavItem.vue';
import ThemeToggle from './ThemeToggle.vue';

const route = useRoute();
const router = useRouter();
const store = useProfessionalAppStore();

function goToProfile() {
  store.closeMobileSidebar();
  router.push({ name: 'pro-settings' });
}

function handleLogout() {
  store.closeMobileSidebar();
  localStorage.removeItem('token');
  router.push('/auth/login');
}

const activeKey = computed(() => {
  const path = route.path;
  if (path.includes('/dashboard')) {
    return 'dashboard';
  }
  if (path.includes('/organizations')) {
    return 'organizations';
  }
  if (path.includes('/invitations')) {
    return 'invitations';
  }
  if (path.includes('/reviews')) {
    return 'reviews';
  }
  if (path.includes('/settings')) {
    return 'settings';
  }
  return 'invitations';
});

const navItems = [
  {
    key: 'dashboard',
    to: '/professional/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    key: 'organizations',
    to: '/professional/organizations',
    icon: Layers,
    label: 'Organizations',
  },
  {
    key: 'invitations',
    to: '/professional/invitations',
    icon: Mail,
    label: 'Invitations',
    badge: computed(() => store.invitationCount),
  },
  {
    key: 'reviews',
    to: '/professional/reviews',
    icon: Star,
    label: 'Reviews',
  },
  {
    key: 'settings',
    to: '/professional/settings',
    icon: Settings,
    label: 'Settings',
  },
];
</script>

<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="sidebar-header">
      <div class="brand-row">
        <img
          class="brand-logo"
          :src="logoUrl"
          alt="Avto Yordam logo"
        >
        <div class="brand-text">
          <span class="brand-name">Avto Yordam</span>
          <span class="brand-caption">Professional</span>
        </div>
      </div>
      <button
        class="close-btn"
        type="button"
        aria-label="Close navigation sidebar"
        @click="store.closeMobileSidebar"
      >
        <X :size="20" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="nav-container">
      <SidebarNavItem
        v-for="item in navItems"
        :key="item.key"
        :to="item.to"
        :icon="item.icon"
        :label="item.label"
        :badge="item.badge?.value"
        :is-active="activeKey === item.key"
      />
    </nav>

    <!-- Mobile-only utilities & profile -->
    <div class="sidebar-mobile-section">
      <div class="sidebar-mobile-divider" />

      <!-- Language & Theme switcher -->
      <div class="sidebar-mobile-utils">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <!-- User Profile Card -->
      <div class="sidebar-mobile-profile">
        <div class="sidebar-mobile-user-row">
          <div class="sidebar-mobile-avatar">
            {{ store.userInitials || 'U' }}
          </div>
          <div class="sidebar-mobile-user-info">
            <span class="sidebar-mobile-user-name">{{ store.userName }}</span>
            <span class="sidebar-mobile-user-role">{{ store.userSpecialization }}</span>
          </div>
        </div>
        <div class="sidebar-mobile-actions">
          <button
            class="sidebar-mobile-action-btn"
            type="button"
            @click="goToProfile"
          >
            <User :size="15" />
            <span>Profile Settings</span>
          </button>
          <button
            class="sidebar-mobile-action-btn sidebar-mobile-action-btn--danger"
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

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 0 20px;
  border-bottom: 1px solid var(--border);
}

.brand-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.close-btn {
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

.close-btn:hover {
  color: var(--foreground);
  background: var(--accent);
}

@media (max-width: 1023px) {
  .close-btn {
    display: inline-flex;
  }
}

.brand-logo {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  object-fit: contain;
  border-radius: 9px;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.brand-name {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--foreground);
}

.brand-caption {
  font-family: Inter, sans-serif;
  font-size: 9px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 1.1px;
}

.nav-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  padding: 8px 16px;
}

/* Mobile-only utilities & profile section */
.sidebar-mobile-section {
  display: none;
  flex-direction: column;
  gap: 14px;
  padding: 16px 16px 24px;
  margin-top: auto;
}

@media (max-width: 1023px) {
  .sidebar-mobile-section {
    display: flex;
  }
}

.sidebar-mobile-divider {
  width: 100%;
  height: 1px;
  background: var(--border);
}

.sidebar-mobile-utils {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}

.sidebar-mobile-profile {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.sidebar-mobile-user-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sidebar-mobile-avatar {
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

.sidebar-mobile-user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.sidebar-mobile-user-name {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-mobile-user-role {
  font-family: Inter, sans-serif;
  font-size: 11px;
  color: var(--muted-foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
}

.sidebar-mobile-action-btn {
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

.sidebar-mobile-action-btn:hover {
  background: var(--accent);
}

.sidebar-mobile-action-btn--danger {
  color: var(--destructive);
}

.sidebar-mobile-action-btn--danger:hover {
  background: var(--destructive-soft, rgba(239, 68, 68, 0.1));
}
</style>
