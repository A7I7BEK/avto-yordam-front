<script
  setup
  lang="ts"
>
import { Menu } from '@lucide/vue';
import LanguageSwitcher from '@/components/app/LanguageSwitcher.vue';
import NotificationBell from '@/components/app/NotificationBell.vue';
import ThemeToggle from '@/components/app/ThemeToggle.vue';
import UserAvatarDropdown from '@/components/app/UserAvatarDropdown.vue';
import { useBusinessAppStore } from '@/stores/businessApp';

const store = useBusinessAppStore();
</script>

<template>
  <header class="header">
    <div class="header__left">
      <button
        class="header__menu-btn"
        type="button"
        aria-label="Toggle navigation menu"
        @click="store.toggleMobileSidebar"
      >
        <Menu :size="22" />
      </button>
      <div class="header__user-block">
        <div class="header__user-info">
          <span class="header__user-name">{{ store.userName }}</span>
          <span class="header__user-role">— {{ store.userRole }}</span>
        </div>
        <div class="header__org">
          <span class="header__org-dot" />
          <span class="header__org-name">{{ store.orgName }}</span>
        </div>
      </div>
    </div>
    <div class="header__right">
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
  height: 80px;
  padding: 0 24px;
  background: var(--header-bg);
  border-bottom: 1px solid var(--border);
}

.header__left {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
}

.header__menu-btn {
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

.header__menu-btn:hover {
  background: var(--accent);
}

.header__user-block {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.header__user-info {
  display: flex;
  gap: 4px;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header__user-name {
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  overflow: hidden;
  text-overflow: ellipsis;
}

.header__user-role {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--muted-icon);
}

.header__org {
  display: flex;
  gap: 6px;
  align-items: center;
  white-space: nowrap;
}

.header__org-dot {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  background: var(--primary);
  border-radius: 50%;
}

.header__org-name {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-icon);
  overflow: hidden;
  text-overflow: ellipsis;
}

.header__right {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
}

@media (max-width: 1023px) {
  .header__menu-btn {
    display: inline-flex;
  }
}

@media (max-width: 640px) {
  .header {
    height: 64px;
    padding: 0 12px;
  }

  .header__user-role {
    display: none;
  }

  .header__user-name {
    font-size: 14px;
  }

  .header__org {
    display: none;
  }

  .header__right {
    gap: 4px;
  }
}
</style>
