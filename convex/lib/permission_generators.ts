import { ValidEntityName, ENTITY_PERMISSIONS } from './constants';

// Generate full access permission names dynamically
export const generateFullAccessPermissionNames = () => {
  const result: Record<string, string> = {};
  
  Object.values(ValidEntityName).forEach(entity => {
    const key = `${entity.toUpperCase()}_FULL_ACCESS`;
    const value = `${entity}_full_access`;
    result[key] = value;
  });
  
  return result;
};

// Generate entity permissions dynamically
export const generateEntityPermissions = () => {
  const result: Record<string, Record<string, string>> = {};
  
  Object.values(ValidEntityName).forEach(entity => {
    const entityKey = entity.toUpperCase();
    result[entityKey] = {
      CREATE: `${entity}${ENTITY_PERMISSIONS.CREATE}`,
      EDIT: `${entity}${ENTITY_PERMISSIONS.EDIT}`,
      DELETE: `${entity}${ENTITY_PERMISSIONS.DELETE}`,
      ACCESS: `${entity}${ENTITY_PERMISSIONS.ACCESS}`,
    };
  });
  
  return result;
};

// Generate full access permission mappings dynamically
export const generateFullAccessPermissions = () => {
  const result: Record<string, string[]> = {};
  
  Object.values(ValidEntityName).forEach(entity => {
    const key = `${entity}_full_access`;
    result[key] = [
      `${entity}${ENTITY_PERMISSIONS.CREATE}`,
      `${entity}${ENTITY_PERMISSIONS.EDIT}`,
      `${entity}${ENTITY_PERMISSIONS.DELETE}`,
      `${entity}${ENTITY_PERMISSIONS.ACCESS}`,
    ];
  });
  
  return result;
};

// Helper to get all permission strings for an entity
export const getEntityPermissionStrings = (entity: ValidEntityName): string[] => {
  return [
    `${entity}${ENTITY_PERMISSIONS.CREATE}`,
    `${entity}${ENTITY_PERMISSIONS.EDIT}`,
    `${entity}${ENTITY_PERMISSIONS.DELETE}`,
    `${entity}${ENTITY_PERMISSIONS.ACCESS}`,
  ];
};

// Helper to get full access permission name for an entity
export const getFullAccessPermissionName = (entity: ValidEntityName): string => {
  return `${entity}_full_access`;
};

// Generated constants - call once and export
export const FULL_ACCESS_PERMISSION_NAMES = generateFullAccessPermissionNames();
export const GENERATED_ENTITY_PERMISSIONS = generateEntityPermissions();
export const FULL_ACCESS_PERMISSIONS = generateFullAccessPermissions();

// Type helpers for generated permissions
export type GeneratedFullAccessPermissionNames = typeof FULL_ACCESS_PERMISSION_NAMES;
export type GeneratedEntityPermissions = typeof GENERATED_ENTITY_PERMISSIONS;
export type GeneratedFullAccessPermissions = typeof FULL_ACCESS_PERMISSIONS;
