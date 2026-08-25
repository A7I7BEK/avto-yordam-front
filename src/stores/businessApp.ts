import { defineStore } from 'pinia';
import { ref } from 'vue';
import { decodeUserToken, formatRoleLabel, initialsFromName } from '@/config';
import {
  getStoredLanguageCode,
  type LanguageCode,
  setStoredLanguageCode,
} from '@/config/language';

export const useBusinessAppStore = defineStore('businessApp', () => {
  const tokenUser = decodeUserToken();
  const tokenName = String(tokenUser.fullName ?? tokenUser.name ?? '');
  const tokenRole = String(tokenUser.organizationRole ?? '');
  const tokenOrgName = String(tokenUser.organizationName ?? '');

  const userName = ref(tokenName || 'Rustam Karimov');
  const userRole = ref(formatRoleLabel(tokenRole) || 'Owner');
  const orgName = ref(tokenOrgName || 'AutoFix MCHJ');
  const userInitials = ref(tokenName ? initialsFromName(tokenName) : 'RK');
  const language = ref<LanguageCode>(getStoredLanguageCode());
  const notificationCount = ref(3);
  const ordersBadgeCount = ref(0);
  const teamSubmenuOpen = ref(false);
  const activeTeamSubItem = ref<'employees' | 'members' | 'invitations' | null>(
    null,
  );

  const isMobileSidebarOpen = ref(false);

  function setLanguage(lang: LanguageCode) {
    language.value = lang;
    setStoredLanguageCode(lang);
  }

  function setNotificationCount(count: number) {
    notificationCount.value = count;
  }

  function setOrdersBadgeCount(count: number) {
    ordersBadgeCount.value = count;
  }

  function toggleTeamSubmenu() {
    teamSubmenuOpen.value = !teamSubmenuOpen.value;
  }

  function toggleMobileSidebar() {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
  }

  function closeMobileSidebar() {
    isMobileSidebarOpen.value = false;
  }

  return {
    userName,
    userRole,
    orgName,
    userInitials,
    language,
    notificationCount,
    ordersBadgeCount,
    teamSubmenuOpen,
    activeTeamSubItem,
    isMobileSidebarOpen,
    setLanguage,
    setNotificationCount,
    setOrdersBadgeCount,
    toggleTeamSubmenu,
    toggleMobileSidebar,
    closeMobileSidebar,
  };
});
