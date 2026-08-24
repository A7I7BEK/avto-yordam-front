import { defineStore } from 'pinia';
import { ref } from 'vue';
import { decodeUserToken, formatRoleLabel, initialsFromName } from '@/config';
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
  const tokenUser = decodeUserToken();
  const tokenName = String(tokenUser.fullName ?? tokenUser.name ?? '');
  const tokenRole = String(
    tokenUser.specialization ?? tokenUser.platformRole ?? '',
  );

  const userName = ref(tokenName || 'Rustam Karimov');
  const userInitials = ref(tokenName ? initialsFromName(tokenName) : 'AI');
  const userSpecialization = ref(formatRoleLabel(tokenRole) || 'Electric');
  const organizations = ref(['AutoFix MCHJ', 'Something MCHJ']);
  const activeOrganization = ref('AutoFix MCHJ');
  const notificationCount = ref(3);
  const language = ref<LanguageCode>(getStoredLanguageCode());

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

  function setNotificationCount(count: number) {
    notificationCount.value = count;
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
    setActiveNavItem,
    decrementInvitationCount,
    setLanguage,
    setNotificationCount,
  };
});
