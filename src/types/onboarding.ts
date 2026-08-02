export interface ProfessionalOnboardingData {
  avatar?: File | null;
  fullName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  languages: string[];
}

export interface ProfessionalInfoData {
  specializations: string[];
  yearsOfExperience: number;
  workingHours: {
    from: string;
    to: string;
  };
  workingDays: string[];
}

export type OrganizationType = 'MCHJ' | 'YATT' | 'SELF_EMPLOYED';

export interface BusinessOnboardingData {
  organizationType: OrganizationType;
  accountHolder: string;
  bank: string;
  mfo: string;
  inn: string;
  accountNumber: string;
  currency: 'UZS';
}
