import { defineStore } from 'pinia';
import { ref } from 'vue';
import type {
  BusinessOnboardingData,
  OrganizationType,
  ProfessionalInfoData,
  ProfessionalOnboardingData,
} from '@/types/onboarding';

export const useProfessionalOnboardingStore = defineStore(
  'professional-onboarding',
  () => {
    const personalInfo = ref<ProfessionalOnboardingData>({
      avatar: null,
      fullName: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      yearsOfExperience: 0,
    });

    const professionalInfo = ref<ProfessionalInfoData>({
      specializationId: '',
      languages: [],
    });

    function updatePersonalInfo(data: Partial<ProfessionalOnboardingData>) {
      Object.assign(personalInfo.value, data);
    }

    function updateProfessionalInfo(data: Partial<ProfessionalInfoData>) {
      Object.assign(professionalInfo.value, data);
    }

    function $reset() {
      personalInfo.value = {
        avatar: null,
        fullName: '',
        dateOfBirth: '',
        phone: '',
        email: '',
        yearsOfExperience: 0,
      };
      professionalInfo.value = {
        specializationId: '',
        languages: [],
      };
    }

    return {
      personalInfo,
      professionalInfo,
      updatePersonalInfo,
      updateProfessionalInfo,
      $reset,
    };
  },
);

export const useBusinessOnboardingStore = defineStore(
  'business-onboarding',
  () => {
    const data = ref<BusinessOnboardingData>({
      organizationType: 'MCHJ',
      accountHolder: '"AutoFix" Mas\'uliyati Cheklangan Jamiyati',
      bank: 'Hamkorbank — Tashkent City (Yunusobod)',
      mfo: '00832',
      inn: '307284921',
      accountNumber: '20208 000 9001 2347 8965',
      currency: 'UZS',
    });

    function updateOrganizationType(type: OrganizationType) {
      data.value.organizationType = type;
    }

    function updateBankData(partial: Partial<BusinessOnboardingData>) {
      Object.assign(data.value, partial);
    }

    function $reset() {
      data.value = {
        organizationType: 'MCHJ',
        accountHolder: '"AutoFix" Mas\'uliyati Cheklangan Jamiyati',
        bank: 'Hamkorbank — Tashkent City (Yunusobod)',
        mfo: '00832',
        inn: '307284921',
        accountNumber: '20208 000 9001 2347 8965',
        currency: 'UZS',
      };
    }

    return {
      data,
      updateOrganizationType,
      updateBankData,
      $reset,
    };
  },
);
