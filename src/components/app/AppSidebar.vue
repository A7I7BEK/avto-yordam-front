<script
  setup
  lang="ts"
>
import { Layers, LayoutDashboard, Mail, Settings, Star } from '@lucide/vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import logoUrl from '@/assets/logo/avto-yordam-logo.png';
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
</style>
