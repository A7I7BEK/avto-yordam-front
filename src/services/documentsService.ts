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

// ── Batch upload (`/organization/files/add-list`) ─────────────────────────────

/** A single entry for a batch organization file upload */
export interface OrganizationFileUploadItem {
  file: File;
  type: OrganizationFileType;
  isCover?: boolean;
}

/**
 * Each nested `OrganizationFileRequest` is sent as an indexed field bound
 * directly to the `OrganizationFileListRequest` model attribute:
 *
 *   fileRequests[0].multipartFile
 *   fileRequests[0].type
 *   fileRequests[0].isCover
 *
 * Note: no model-attribute prefix (e.g. `request.`) is used. Spring binds
 * `@ModelAttribute OrganizationFileListRequest request` from these property
 * paths directly; a `request.` prefix would be treated as an unknown `request`
 * property and silently ignored unless the backend configures
 * `setFieldDefaultPrefix("request.")`.
 *
 * `organizationId` is not sent — the backend derives it from the JWT.
 */
export async function uploadOrganizationFiles(
  items: OrganizationFileUploadItem[],
): Promise<OrganizationFileResponse[]> {
  const formData = new FormData();
  for (const [index, item] of items.entries()) {
    const prefix = `fileRequests[${index}].`;
    formData.append(`${prefix}multipartFile`, item.file);
    formData.append(`${prefix}type`, item.type);
    formData.append(`${prefix}isCover`, String(item.isCover ?? false));
    // organizationId is omitted — derived from the authenticated user on the
    // backend.
  }
  return apiClient.post('/organization/files/add-list', formData);
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

/**
 * Host that serves uploaded files (no trailing slash).
 *
 * The backend returns file `path`s prefixed with `/app`, e.g.
 * `/app/files/<uuid>.xlsx`. To use them directly in `src` / `href` the
 * `/app` prefix must be stripped and the file host prepended:
 *
 *   `/app/files/f169f1f5-2a15-4f8d-bbac-e52d50b55b56.xlsx`
 *     → `https://autoflow.aislayd.uz/files/f169f1f5-2a15-4f8d-bbac-e52d50b55b56.xlsx`
 */
const FILE_BASE_URL = (
  import.meta.env.VITE_URL_FILES ||
  import.meta.env.VITE_URL_ADMIN ||
  'https://autoflow.aislayd.uz'
).replace(/\/+$/, '');

// Matches absolute URLs (e.g. `https://...`) passed straight through.
const ABSOLUTE_URL_REGEX = /^https?:\/\//i;
// Backend prefix stripped from file paths (e.g. `/app/files/...` → `/files/...`).
const APP_PATH_PREFIX_REGEX = /^\/app/;

/**
 * Resolve an API file `path` to a full URL usable in `<img src>` / `<a href>`.
 *
 * Returns the input unchanged when it is empty or already an absolute URL.
 */
export function getFileUrl(filePath: string): string {
  if (!filePath) {
    return '';
  }
  if (ABSOLUTE_URL_REGEX.test(filePath)) {
    return filePath;
  }
  const cleanPath = filePath.replace(APP_PATH_PREFIX_REGEX, '');
  return `${FILE_BASE_URL}${cleanPath}`;
}
