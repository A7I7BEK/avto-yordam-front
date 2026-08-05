import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getStoredLanguageCode,
  type LanguageCode,
  setStoredLanguageCode,
} from '@/config/language';

export const useProfessionalAppStore = defineStore('professional-app', () => {
  const activeNavItem = ref<
    'dashboard' | 'organizations' | 'invitations' | 'reviews' | 'settings'
  >('invitations');
  const invitationCount = ref(2);
  const userName = ref('Rustam Karimov');
  const userInitials = ref('AI');
  const userSpecialization = ref('Electric');
  const organizations = ref(['AutoFix MCHJ', 'Something MCHJ']);
  const activeOrganization = ref('AutoFix MCHJ');
  const notificationCount = ref(3);
  const language = ref<LanguageCode>(getStoredLanguageCode());
  const theme = ref<'light' | 'dark'>('light');

  function setActiveNavItem(item: typeof activeNavItem.value) {
    activeNavItem.value = item;
  }

  function decrementInvitationCount() {
    if (invitationCount.value > 0) {
      invitationCount.value--;
    }
  }

  function setLanguage(lang: LanguageCode) {
    language.value = lang;
    setStoredLanguageCode(lang);
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  }

  return {
    activeNavItem,
    invitationCount,
    userName,
    userInitials,
    userSpecialization,
    organizations,
    activeOrganization,
    notificationCount,
    language,
    theme,
    setActiveNavItem,
    decrementInvitationCount,
    setLanguage,
    toggleTheme,
  };
});
