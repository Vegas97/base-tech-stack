import { Doc } from "../_generated/dataModel";
import {
  ValidEntityName,
  ValidTenantId,
  FIELD_PERMISSION_PRESETS,
  ENTITY_PERMISSION_PRESETS,
  ENTITY_PERMISSIONS,
} from "./constants";
import {
  ValidFieldPermissionArray,
  ValidEntityPermissionArray,
} from "./validation_utils";

// Permission-only schema - no type/validation info (that's in Convex schema)
export interface EntityPermissionSchema<TEntity extends ValidEntityName> {
  entity: TEntity;
  // Field permissions for each field in the entity
  fields: {
    [K in keyof Doc<TEntity>]: {
      // Default field permissions across all tenants
      defaultPermissions: ValidFieldPermissionArray;
      // Tenant-specific field permission overrides
      tenantOverrides?: Partial<
        Record<ValidTenantId, ValidFieldPermissionArray>
      >;
    };
  };
  // Default entity-level permissions for all tenants
  defaultEntityPermissions: ValidEntityPermissionArray;
  // Tenant-specific entity permission overrides
  tenantEntityOverrides?: Partial<
    Record<ValidTenantId, ValidEntityPermissionArray>
  >;
}

// Users entity permissions
export const USERS_PERMISSIONS: EntityPermissionSchema<ValidEntityName.USERS> =
  {
    entity: ValidEntityName.USERS,
    defaultEntityPermissions: ENTITY_PERMISSION_PRESETS.READ_ONLY,
    tenantEntityOverrides: {
      [ValidTenantId.ADMIN]: ENTITY_PERMISSION_PRESETS.FULL_ACCESS,
    },
    fields: {
      _id: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.READ_ONLY,
      },
      _creationTime: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.READ_ONLY,
      },
      clerkId: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.READ_ONLY,
        tenantOverrides: {
          [ValidTenantId.ADMIN]: FIELD_PERMISSION_PRESETS.FULL_ACCESS,
        },
      },
      email: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.READ_ONLY,
      },
      firstName: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.FULL_ACCESS,
      },
      lastName: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.FULL_ACCESS,
      },
      imageUrl: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.FULL_ACCESS,
      },
      createdAt: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.READ_ONLY,
      },
      updatedAt: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.READ_ONLY,
      },
      isActive: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.READ_ONLY,
        tenantOverrides: {
          [ValidTenantId.ADMIN]: FIELD_PERMISSION_PRESETS.FULL_ACCESS,
        },
      },
    },
  };

// Products entity permissions
export const PRODUCTS_PERMISSIONS: EntityPermissionSchema<ValidEntityName.PRODUCTS> =
  {
    entity: ValidEntityName.PRODUCTS,
    defaultEntityPermissions: ENTITY_PERMISSION_PRESETS.READ_ONLY,
    tenantEntityOverrides: {
      [ValidTenantId.ADMIN]: ENTITY_PERMISSION_PRESETS.FULL_ACCESS,
    },
    fields: {
      _id: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.READ_ONLY,
      },
      _creationTime: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.READ_ONLY,
      },
      name: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.FULL_ACCESS,
        tenantOverrides: {
          [ValidTenantId.SCUBADIVING]: FIELD_PERMISSION_PRESETS.READ_ONLY,
        },
      },
      price: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.FULL_ACCESS,
      },
      cost: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.READ_ONLY,
        tenantOverrides: {
          [ValidTenantId.ADMIN]: FIELD_PERMISSION_PRESETS.FULL_ACCESS,
        },
      },
      description: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.FULL_ACCESS,
      },
      category: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.FULL_ACCESS,
      },
      tenantId: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.READ_ONLY,
      },
      internalNotes: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.NO_ACCESS,
        tenantOverrides: {
          [ValidTenantId.ADMIN]: FIELD_PERMISSION_PRESETS.FULL_ACCESS,
        },
      },
      createdAt: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.READ_ONLY,
      },
      updatedAt: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.READ_ONLY,
      },
      isActive: {
        defaultPermissions: FIELD_PERMISSION_PRESETS.READ_ONLY,
        tenantOverrides: {
          [ValidTenantId.ADMIN]: FIELD_PERMISSION_PRESETS.FULL_ACCESS,
        },
      },
    },
  };

// Entity permissions registry - maps entity names to their permission schemas
export const ENTITY_PERMISSIONS_REGISTRY = {
  [ValidEntityName.USERS]: USERS_PERMISSIONS,
  [ValidEntityName.PRODUCTS]: PRODUCTS_PERMISSIONS,
} as const;
