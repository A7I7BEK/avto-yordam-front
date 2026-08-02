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
  id: string;
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

/**
 * Replace an existing organization file (e.g. "Upload new" cover photo).
 * Sends a PUT to `/organization/files/{id}` bound as a single
 * `OrganizationFileRequest` model attribute.
 */
export function updateOrganizationFile(
  fileId: string,
  file: File,
  type: OrganizationFileType,
  isCover = false,
): Promise<OrganizationFileResponse> {
  const formData = new FormData();
  formData.append('multipartFile', file);
  formData.append('type', type);
  formData.append('isCover', String(isCover));
  return apiClient.put(`/organization/files/${fileId}`, formData);
}

// ── Batch upload (`/organization/files/add-list`) — DISABLED ──────────────────
// The backend's `@ModelAttribute OrganizationFileListRequest` binding is not
// resolving `fileRequests` yet, so the batch endpoint is commented out for now.
// Multi-file creation falls back to the simple single-file upload API below.
// Re-enable once the backend binding is confirmed working.
//
// /** A single entry for a batch organization file upload */
// export interface OrganizationFileUploadItem {
//   file: File;
//   type: OrganizationFileType;
//   isCover?: boolean;
// }
//
// const FILE_LIST_ATTRIBUTE = 'request';
//
// export function uploadOrganizationFiles(
//   items: OrganizationFileUploadItem[],
// ): Promise<OrganizationFileResponse[]> {
//   const formData = new FormData();
//   for (const [index, item] of items.entries()) {
//     const prefix = `${FILE_LIST_ATTRIBUTE}.fileRequests[${index}].`;
//     formData.append(`${prefix}multipartFile`, item.file);
//     formData.append(`${prefix}type`, item.type);
//     formData.append(`${prefix}isCover`, String(item.isCover ?? false));
//   }
//   return apiClient.post('/organization/files/add-list', formData);
// }

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
