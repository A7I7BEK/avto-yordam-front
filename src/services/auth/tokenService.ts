import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';
import type { RefreshTokenResponse } from '@/types/auth';

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';

export function saveAuthTokens(result: {
  accessToken?: string;
  refreshToken?: string;
  type?: string;
}): void {
  if (result.accessToken) {
    localStorage.setItem(TOKEN_KEY, result.accessToken);
  }
  if (result.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
  }
}

/**
 * Refreshes the access token by calling POST /user/refresh with the stored
 * refresh token. Stores the refreshed tokens and returns the response.
 * Returns null when in mock mode, no refresh token is stored, or the
 * refresh request fails (the caller should continue with the existing token).
 */
export async function refreshAccessToken(): Promise<RefreshTokenResponse | null> {
  if (isMockMode()) {
    return null;
  }

  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    return null;
  }

  try {
    const result = await apiClient.post(
      `/user/refresh?refreshToken=${encodeURIComponent(refreshToken)}`,
    );
    if (result?.accessToken) {
      saveAuthTokens(result);
    }
    return result;
  } catch {
    return null;
  }
}
