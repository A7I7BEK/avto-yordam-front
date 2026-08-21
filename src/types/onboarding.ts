export interface ProfessionalOnboardingData {
  avatar?: File | null;
  fullName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  yearsOfExperience: number;
}

export interface ProfessionalInfoData {
  /** Id of the chosen specialization (from the master-specialization list). */
  specializationId: string;
  /** Ids of the selected languages (from the /language list). */
  languages: string[];
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
