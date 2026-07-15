<script
  setup
  lang="ts"
>
import { useProfessionalAppStore } from '@/stores/professionalApp';
import LanguageSwitcher from './LanguageSwitcher.vue';
import NotificationBell from './NotificationBell.vue';
import ThemeToggle from './ThemeToggle.vue';
import UserAvatarDropdown from './UserAvatarDropdown.vue';

const store = useProfessionalAppStore();
</script>

<template>
  <header class="header">
    <!-- Left: User Identity -->
    <div class="header-left">
      <span class="user-name"
        >{{ store.userName }}
        — {{ store.userSpecialization }}</span
      >
      <div class="org-line">
        <span class="accent-dot" />
        <span class="org-names">{{ store.organizations.join(', ') }}</span>
      </div>
    </div>

    <!-- Right: Utility Controls -->
    <div class="header-right">
      <LanguageSwitcher />
      <ThemeToggle />
      <NotificationBell />
      <UserAvatarDropdown />
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  padding: 0 24px;
  background: #ffffff;
  border-bottom: 1px solid #d9d9db;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.user-name {
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: #2a2933;
  letter-spacing: -0.3px;
}

.org-line {
  display: flex;
  gap: 6px;
  align-items: center;
}

.accent-dot {
  flex-shrink: 0;
  width: 5px;
  height: 5px;
  background: #5749f4;
  border-radius: 999px;
}

.org-names {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.3;
  color: #616167;
  letter-spacing: 0.2px;
}

.header-right {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
