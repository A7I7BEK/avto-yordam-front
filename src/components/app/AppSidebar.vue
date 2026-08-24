<script
  setup
  lang="ts"
>
import { Layers, LayoutDashboard, Mail, Settings, Star } from '@lucide/vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProfessionalAppStore } from '@/stores/professionalApp';
import SidebarNavItem from './SidebarNavItem.vue';

const route = useRoute();
const store = useProfessionalAppStore();

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
      <div class="logo-mark">P</div>
      <div class="brand-text">Professional</div>
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
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 256px;
  height: 100%;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border);
}

.sidebar-header {
  display: flex;
  gap: 8px;
  align-items: center;
  height: 80px;
  padding: 0 28px;
  border-bottom: 1px solid var(--border);
}

.logo-mark {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--primary-foreground);
  background: var(--primary);
  border-radius: 8px;
}

.brand-text {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--foreground);
  letter-spacing: 1.5px;
}

.nav-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  padding: 8px 16px;
}
</style>
