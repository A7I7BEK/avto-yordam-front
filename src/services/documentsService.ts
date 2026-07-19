import { apiClient } from '@/api/client';

export type OrganizationFileType = 'PHOTO' | 'DOCUMENT' | 'LICENSE' | 'LOGO';

export interface FileResponse {
  id: string;
  originalName: string;
  contentType: string;
  size: number;
  path: string;
  createdDate: string;
}

export interface OrganizationFileResponse {
  organization?: any;
  file: FileResponse;
  type: OrganizationFileType;
  isCover: boolean;
}

export function getOrganizationFiles(): Promise<OrganizationFileResponse[]> {
  return apiClient.get('/organization/files');
}

export function getOrganizationFilesByType(
  type: OrganizationFileType,
): Promise<OrganizationFileResponse[]> {
  return apiClient.get('/organization/files/by-type', { params: { type } });
}

export function uploadOrganizationFile(
  file: File,
  type: OrganizationFileType,
  isCover = false,
): Promise<OrganizationFileResponse> {
  const formData = new FormData();
  formData.append('multipartFile', file);
  formData.append('type', type);
  formData.append('isCover', String(isCover));
  return apiClient.post('/organization/files', formData);
}

export function deleteOrganizationFile(fileId: string): Promise<void> {
  return apiClient.delete(`/organization/files/${fileId}`);
}

export function deleteOrganizationFiles(fileIds: string[]): Promise<void> {
  return apiClient.delete('/organization/files', fileIds);
}

/** Resolve a full download URL for a given file id */
export function getDownloadUrl(fileId: string): string {
  const base = import.meta.env.VITE_URL_API || 'http://localhost:8700/api';
  return `${base}/files/${fileId}/download`;
}
