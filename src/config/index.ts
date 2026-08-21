export function isMockMode(): boolean {
  return import.meta.env.VITE_USE_MOCK !== 'false';
}

export interface JwtUserPayload {
  fullName?: string;
  name?: string;
  platformRole?: string;
  organizationRole?: string;
  organizationName?: string;
  organizationId?: string;
  specialization?: string;
}

/**
 * Decode the JWT payload stored in localStorage (the same shape used by
 * OrdersKanban/SchedulesSlots). Returns an empty object when there is no
 * token or it cannot be parsed.
 */
export function decodeUserToken(): JwtUserPayload {
  const token = localStorage.getItem('token');
  if (!token) {
    return {};
  }
  try {
    const parts = token.split('.');
    const payloadPart = parts[1];
    if (parts.length === 3 && payloadPart) {
      return JSON.parse(
        atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')),
      ) as JwtUserPayload;
    }
  } catch {
    // Ignore malformed tokens
  }
  return {};
}

/** Format an uppercase role enum (e.g. OWNER, RECEPTIONIST) for display. */
export function formatRoleLabel(role: string): string {
  if (!role) {
    return '';
  }
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

/** Build initials (max 2) from a full name. */
export function initialsFromName(name: string): string {
  return (
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  );
}
