import { isMockMode } from '@/config';
import { members as rawMembers } from '@/data/members';
import type { TeamMember } from '@/types/business';

export function getMembers(): TeamMember[] {
  if (isMockMode()) {
    return rawMembers as TeamMember[];
  }
  throw new Error('API not implemented');
}

export function getMember(id: string): TeamMember | null {
  if (isMockMode()) {
    return (rawMembers as TeamMember[]).find((m) => m.id === id) || null;
  }
  throw new Error('API not implemented');
}
