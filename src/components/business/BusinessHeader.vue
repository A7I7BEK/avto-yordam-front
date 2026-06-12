<script
  setup
  lang="ts"
>
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
      <div class="header__user-info">
        <span class="header__user-name">{{ store.userName }}</span>
        <span class="header__user-role">— {{ store.userRole }}</span>
      </div>
      <div class="header__org">
        <span class="header__org-dot" />
        <span class="header__org-name">{{ store.orgName }}</span>
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
  padding: 0 32px;
  background: #ffffff;
  border: 1px solid #d9d9db;
  border-top: none;
  border-right: none;
  border-bottom: 1px solid #d9d9db;
}

.header__left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header__user-info {
  display: flex;
  gap: 4px;
  align-items: center;
}

.header__user-name {
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2a2933;
}

.header__user-role {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #939399;
}

.header__org {
  display: flex;
  gap: 6px;
  align-items: center;
}

.header__org-dot {
  width: 6px;
  height: 6px;
  background: #5749f4;
  border-radius: 50%;
}

.header__org-name {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #939399;
}

.header__right {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
