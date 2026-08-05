import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import type {
  LanguageResponse,
  MasterInfoRequest,
  MasterInfoResponse,
  MasterSpecializationResponse,
  UserResponse,
} from '@/types/user';

const mockLanguages: LanguageResponse[] = [
  { id: '1', name: 'Uzbek', code: 'uz' },
  { id: '2', name: 'Russian', code: 'ru' },
  { id: '3', name: 'English', code: 'en' },
  { id: '4', name: 'German', code: 'de' },
  { id: '5', name: 'Tajik', code: 'tg' },
  { id: '6', name: 'Turkish', code: 'tr' },
  { id: '7', name: 'French', code: 'fr' },
  { id: '8', name: 'Korean', code: 'ko' },
];

const mockUser: UserResponse = {
  id: 'pro-001',
  fullName: 'Aziz Ismoilov',
  phone: '+998 90 123 45 67',
  email: 'aziz.karimov@masters.uz',
  isVerified: true,
  type: 'PROFESSIONAL',
  birthDay: '1991-02-14',
  languages: [
    { id: '1', name: 'Uzbek', code: 'uz' },
    { id: '2', name: 'Russian', code: 'ru' },
    { id: '3', name: 'English', code: 'en' },
  ],
};

export async function getUserProfile(): Promise<UserResponse> {
  if (isMockMode()) {
    return mockUser;
  }
  return await apiClient.get('/user/me');
}

export async function uploadProfilePhoto(file: File): Promise<UserResponse> {
  if (isMockMode()) {
    return {
      ...mockUser,
      profilePhoto: {
        id: 'profile-photo-001',
        originalName: file.name,
        contentType: file.type,
        size: file.size,
        path: '',
        createdDate: new Date().toISOString(),
      },
    };
  }
  const formData = new FormData();
  formData.append('file', file);
  return await apiClient.post('/user/upload-photo', formData);
}

export async function deleteProfilePhoto(): Promise<void> {
  if (isMockMode()) {
    return;
  }
  await apiClient.delete('/user/photo');
}

export async function getAllLanguages(): Promise<LanguageResponse[]> {
  if (isMockMode()) {
    return mockLanguages;
  }
  return await apiClient.get('/language');
}

export async function addUserLanguage(languageId: string): Promise<void> {
  if (isMockMode()) {
    return;
  }
  await apiClient.post(`/user/add-language/${languageId}`);
}

export async function removeUserLanguage(languageId: string): Promise<void> {
  if (isMockMode()) {
    return;
  }
  await apiClient.post(`/user/remove-language/${languageId}`);
}

export async function saveBirthday(birthday: string): Promise<void> {
  if (isMockMode()) {
    return;
  }
  await apiClient.post(`/user/birthday?birthday=${birthday}`);
}

const mockMasterSpecializations: MasterSpecializationResponse[] = [
  {
    id: 'spec-001',
    name: 'Engine',
    description: 'Engine repair and maintenance',
  },
  { id: 'spec-002', name: 'Transmission', description: 'Transmission systems' },
  {
    id: 'spec-003',
    name: 'Bodywork',
    description: 'Body repair and painting',
  },
  { id: 'spec-004', name: 'Paint', description: 'Painting services' },
  {
    id: 'spec-005',
    name: 'Electrical',
    description: 'Electrical systems',
  },
  {
    id: 'spec-006',
    name: 'Diagnostics',
    description: 'Vehicle diagnostics',
  },
  { id: 'spec-007', name: 'Tires', description: 'Tire services' },
  { id: 'spec-008', name: 'A/C', description: 'Air conditioning' },
  {
    id: 'spec-009',
    name: 'Suspension',
    description: 'Suspension systems',
  },
  { id: 'spec-010', name: 'Glass', description: 'Glass replacement' },
];

const mockMasterInfo: MasterInfoResponse = {
  id: 'master-info-001',
  master: mockUser,
  experienceStartDate: '2016-03-01',
  description:
    'Master mechanic specializing in European brands. 8 years of hands-on garage experience in Tashkent.',
  specializationId: 'spec-001',
  specializationName: 'Engine',
  workingTimeStart: '09:00',
  workingTimeEnd: '19:00',
  experienceYears: 8,
  completedOrders: 342,
  rating: 4.9,
};

export async function getOwnMasterInfo(): Promise<MasterInfoResponse | null> {
  if (isMockMode()) {
    return mockMasterInfo;
  }
  try {
    return await apiClient.get('/master-info/get-own');
  } catch {
    return null;
  }
}

export async function saveMasterInfo(
  data: MasterInfoRequest,
  existingId?: string,
): Promise<MasterInfoResponse> {
  if (isMockMode()) {
    return mockMasterInfo;
  }
  if (existingId) {
    return await apiClient.put(`/master-info/${existingId}`, data);
  }
  return await apiClient.post('/master-info', data);
}

export async function getAllMasterSpecializations(): Promise<
  MasterSpecializationResponse[]
> {
  if (isMockMode()) {
    return mockMasterSpecializations;
  }
  return await apiClient.get('/master-specialization');
}

export async function sendOtpToPhone(phone: string): Promise<void> {
  if (isMockMode()) {
    return;
  }
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  await apiClient.post(`/user/send-otp-phone/${cleanPhone}`);
}

export async function changePhone(phone: string, otp: string): Promise<void> {
  if (isMockMode()) {
    return;
  }
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  await apiClient.put(
    `/user/change-phone?phone=${encodeURIComponent(cleanPhone)}&otp=${encodeURIComponent(otp)}`,
  );
}

export async function sendOtpToEmail(email: string): Promise<void> {
  if (isMockMode()) {
    return;
  }
  await apiClient.post(`/user/send-otp-email/${email}`);
}

export async function changeEmail(email: string, otp: string): Promise<void> {
  if (isMockMode()) {
    return;
  }
  await apiClient.put(
    `/user/change-email?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`,
  );
}
