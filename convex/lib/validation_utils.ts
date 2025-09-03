import { 
  ValidTenantId, 
  ValidEntityName, 
  SystemRoleName, 
  FeaturePermissionName, 
  PermissionCategory,
  FIELD_PERMISSIONS,
  ENTITY_PERMISSIONS,
  ValidFieldPermission
} from './constants';

// Type-safe permission arrays
export type ValidFieldPermissionArray = ValidFieldPermission[];
export type ValidEntityPermission = (typeof ENTITY_PERMISSIONS)[keyof typeof ENTITY_PERMISSIONS];
export type ValidEntityPermissionArray = ValidEntityPermission[];

// Type guard to validate tenant IDs at runtime - enum-safe
export function isValidTenantId(tenantId: string): tenantId is ValidTenantId {
  return Object.values(ValidTenantId).includes(tenantId as ValidTenantId);
}

// Type guard to validate field permissions at runtime - enum-safe
export function isValidFieldPermission(permission: string): boolean {
  return Object.values(FIELD_PERMISSIONS).includes(permission as any);
}

// Type guard to validate entity permissions at runtime - enum-safe
export function isValidEntityPermission(permission: string): permission is ValidEntityPermission {
  return Object.values(ENTITY_PERMISSIONS).includes(permission as ValidEntityPermission);
}

// Type guard to validate entity names at runtime - enum-safe
export function isValidEntityName(entity: string): entity is ValidEntityName {
  return Object.values(ValidEntityName).includes(entity as ValidEntityName);
}

// Type guard to validate system role names - enum-safe
export function isValidSystemRoleName(role: string): role is SystemRoleName {
  return Object.values(SystemRoleName).includes(role as SystemRoleName);
}

// Type guard to validate feature permission names - enum-safe
export function isValidFeaturePermissionName(
  permission: string
): permission is FeaturePermissionName {
  return Object.values(FeaturePermissionName).includes(
    permission as FeaturePermissionName
  );
}

// Type guard to validate permission categories - enum-safe
export function isValidPermissionCategory(
  category: string
): category is PermissionCategory {
  return Object.values(PermissionCategory).includes(
    category as PermissionCategory
  );
}
