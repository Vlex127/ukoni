export type UserRole = 'user' | 'admin' | 'moderator';

export interface Permission {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission> = {
  user: {
    canRead: true,
    canWrite: false,
    canDelete: false,
    canManageUsers: false,
  },
  moderator: {
    canRead: true,
    canWrite: true,
    canDelete: false,
    canManageUsers: false,
  },
  admin: {
    canRead: true,
    canWrite: true,
    canDelete: true,
    canManageUsers: true,
  },
};

export function hasPermission(
  userRole: UserRole,
  action: keyof Permission
): boolean {
  return ROLE_PERMISSIONS[userRole]?.[action] || false;
}

export function canAccessAdmin(userRole: UserRole): boolean {
  return ['admin', 'moderator'].includes(userRole);
}

export function canManageUsers(userRole: UserRole): boolean {
  return userRole === 'admin';
}

export function getHighestRole(roles: UserRole[]): UserRole {
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('moderator')) return 'moderator';
  return 'user';
}
