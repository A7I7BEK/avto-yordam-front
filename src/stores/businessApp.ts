import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBusinessAppStore = defineStore('businessApp', () => {
  const userName = ref('Rustam Karimov');
  const userRole = ref('Owner');
  const orgName = ref('AutoFix MCHJ');
  const userInitials = ref('RK');
  const language = ref<'EN' | 'UZ' | 'RU'>('EN');
  const notificationCount = ref(3);
  const ordersBadgeCount = ref(7);
  const teamSubmenuOpen = ref(false);
  const activeTeamSubItem = ref<'employees' | 'members' | null>(null);

  function setLanguage(lang: 'EN' | 'UZ' | 'RU') {
    language.value = lang;
  }

  function setNotificationCount(count: number) {
    notificationCount.value = count;
  }

  function toggleTeamSubmenu() {
    teamSubmenuOpen.value = !teamSubmenuOpen.value;
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
    setLanguage,
    setNotificationCount,
    toggleTeamSubmenu,
  };
});
