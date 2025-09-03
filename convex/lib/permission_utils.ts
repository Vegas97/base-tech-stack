import {
  ENTITY_PERMISSIONS,
  FIELD_PERMISSIONS,
  ValidEntityName,
  ValidTenantId,
  SystemRoleName,
  FeaturePermissionName,
  PermissionCategory,
  ValidFieldPermission,
} from "./constants";
import { FULL_ACCESS_PERMISSIONS } from "./permission_generators";

// Helper function to create type-safe field permissions (removes duplicates)
export function createFieldPermissions(
  ...permissions: ValidFieldPermission[]
): ValidFieldPermission[] {
  return Array.from(new Set(permissions));
}

// Helper function to generate full access permissions for an entity
export function generateFullAccessPermissions(
  entityName: ValidEntityName
): string[] {
  return [
    `${entityName}${ENTITY_PERMISSIONS.CREATE}`,
    `${entityName}${ENTITY_PERMISSIONS.EDIT}`,
    `${entityName}${ENTITY_PERMISSIONS.DELETE}`,
    `${entityName}${ENTITY_PERMISSIONS.ACCESS}`,
  ];
}

// Generate entity permissions for all entities - using enum values
export const generateEntityPermissions = (entity: ValidEntityName) => ({
  CREATE: `${entity}${ENTITY_PERMISSIONS.CREATE}`,
  EDIT: `${entity}${ENTITY_PERMISSIONS.EDIT}`,
  DELETE: `${entity}${ENTITY_PERMISSIONS.DELETE}`,
  ACCESS: `${entity}${ENTITY_PERMISSIONS.ACCESS}`,
  FULL_ACCESS: `${entity}${ENTITY_PERMISSIONS.FULL_ACCESS}`,
});

// Helper function to expand full access permissions
export function expandFullAccessPermission(permission: string): string[] {
  if (permission.endsWith("_full_access")) {
    const mapping =
      FULL_ACCESS_PERMISSIONS[
        permission as keyof typeof FULL_ACCESS_PERMISSIONS
      ];
    return mapping ? [...mapping] : [permission];
  }
  return [permission];
}

// Helper function to get field permissions for a specific entity and tenant
export function getFieldPermissions<T extends ValidEntityName>(
  entity: T,
  tenantId: ValidTenantId,
  entityPermissionsRegistry: any
): Record<string, string[]> {
  const schema = entityPermissionsRegistry[entity];
  const fieldPermissions: Record<string, string[]> = {};

  for (const [fieldName, fieldConfig] of Object.entries(schema.fields)) {
    const config = fieldConfig as any;
    // Start with default permissions
    let permissions = [...config.defaultPermissions];

    // Apply tenant-specific overrides if they exist
    if (config.tenantOverrides && config.tenantOverrides[tenantId]) {
      permissions = [...config.tenantOverrides[tenantId]!];
    }

    fieldPermissions[fieldName] = permissions;
  }

  return fieldPermissions;
}

// Helper function to get entity permissions for a specific tenant
export function getEntityPermissionsForTenant(
  entity: ValidEntityName,
  tenantId: ValidTenantId,
  entityPermissionsRegistry: any
): string[] {
  const schema = entityPermissionsRegistry[entity];
  if (!schema) return [];

  // Start with default entity permissions
  let permissions = [...schema.defaultEntityPermissions];

  // Apply tenant-specific overrides if they exist
  if (schema.tenantEntityOverrides && schema.tenantEntityOverrides[tenantId]) {
    permissions = schema.tenantEntityOverrides[tenantId];
  }

  return permissions;
}
