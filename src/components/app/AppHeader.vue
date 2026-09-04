<script
  setup
  lang="ts"
>
import { Menu } from '@lucide/vue';
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
      <button
        class="menu-btn"
        type="button"
        aria-label="Toggle navigation menu"
        @click="store.toggleMobileSidebar"
      >
        <Menu :size="22" />
      </button>
      <div class="user-block">
        <span class="user-name"
          >{{ store.userName }}
          <span class="user-spec">— {{ store.userSpecialization }}</span></span
        >
        <div class="org-line">
          <span class="accent-dot" />
          <span class="org-names">{{ store.organizations.join(', ') }}</span>
        </div>
      </div>
    </div>

    <!-- Right: Utility Controls -->
    <div class="header-right">
      <LanguageSwitcher class="header-desktop-only" />
      <ThemeToggle class="header-desktop-only" />
      <NotificationBell />
      <UserAvatarDropdown class="header-desktop-only" />
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
  background: var(--header-bg);
  border-bottom: 1px solid var(--border);
}

.header-left {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
}

.menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  color: var(--foreground);
  cursor: pointer;
  background: var(--muted);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: background 0.15s;
}

.menu-btn:hover {
  background: var(--accent);
}

.user-block {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.user-name {
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--foreground);
  letter-spacing: -0.3px;
  white-space: nowrap;
}

.user-spec {
  font-weight: 400;
  color: var(--muted-icon);
}

.org-line {
  display: flex;
  gap: 6px;
  align-items: center;
  white-space: nowrap;
}

.accent-dot {
  flex-shrink: 0;
  width: 5px;
  height: 5px;
  background: var(--primary);
  border-radius: 999px;
}

.org-names {
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.3;
  color: var(--muted-foreground);
  letter-spacing: 0.2px;
}

.header-right {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
}

@media (max-width: 1023px) {
  .menu-btn {
    display: inline-flex;
  }

  .header-desktop-only {
    display: none !important;
  }
}

@media (max-width: 640px) {
  .header {
    height: 64px;
    padding: 0 16px;
  }

  .user-name {
    font-size: 14px;
  }

  .user-spec {
    font-size: 12px;
  }

  .org-line {
    display: flex;
  }

  .org-names {
    font-size: 11px;
  }
}
</style>
