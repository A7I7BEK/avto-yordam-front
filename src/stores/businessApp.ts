import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getStoredLanguageCode,
  type LanguageCode,
  setStoredLanguageCode,
} from '@/config/language';

export const useBusinessAppStore = defineStore('businessApp', () => {
  const userName = ref('Rustam Karimov');
  const userRole = ref('Owner');
  const orgName = ref('AutoFix MCHJ');
  const userInitials = ref('RK');
  const language = ref<LanguageCode>(getStoredLanguageCode());
  const notificationCount = ref(3);
  const ordersBadgeCount = ref(7);
  const teamSubmenuOpen = ref(false);
  const activeTeamSubItem = ref<
    'employees' | 'members' | 'invitations' | null
  >(null);

  function setLanguage(lang: LanguageCode) {
    language.value = lang;
    setStoredLanguageCode(lang);
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
