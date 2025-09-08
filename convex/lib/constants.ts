import { Doc } from "../_generated/dataModel";

// Entity permissions
export const ENTITY_PERMISSIONS = {
  CREATE: "_create", // POST
  EDIT: "_edit", // PATCH
  DELETE: "_delete", // DELETE
  ACCESS: "_access", // GET
  FULL_ACCESS: "_full_access", // All permissions
} as const;

// Field permissions
export const FIELD_PERMISSIONS = {
  FETCH: "_fetch", // Can retrieve in API calls (GET)
  VIEW: "_view", // Can display in UI (requires _fetch)
  UPDATE: "_update", // Can modify field value (PATCH)
} as const;

// Type for valid field permission values
export type ValidFieldPermission =
  (typeof FIELD_PERMISSIONS)[keyof typeof FIELD_PERMISSIONS];

// Type for valid entity permission values
export type ValidEntityPermission =
  (typeof ENTITY_PERMISSIONS)[keyof typeof ENTITY_PERMISSIONS];

// Predefined field permission presets - constant rules
export const FIELD_PERMISSION_PRESETS = {
  READ_ONLY: [
    FIELD_PERMISSIONS.FETCH,
    FIELD_PERMISSIONS.VIEW,
  ] as ValidFieldPermission[],
  FULL_ACCESS: [
    FIELD_PERMISSIONS.FETCH,
    FIELD_PERMISSIONS.VIEW,
    FIELD_PERMISSIONS.UPDATE,
  ] as ValidFieldPermission[],
  FETCH_ONLY: [FIELD_PERMISSIONS.FETCH] as ValidFieldPermission[],
  NO_ACCESS: [] as ValidFieldPermission[],
} as const;

// Predefined entity permission presets - constant rules
export const ENTITY_PERMISSION_PRESETS = {
  READ_ONLY: [ENTITY_PERMISSIONS.ACCESS] as ValidEntityPermission[],
  FULL_ACCESS: [
    ENTITY_PERMISSIONS.ACCESS,
    ENTITY_PERMISSIONS.CREATE,
    ENTITY_PERMISSIONS.EDIT,
    ENTITY_PERMISSIONS.DELETE,
  ] as ValidEntityPermission[],
  CREATE_EDIT: [
    ENTITY_PERMISSIONS.ACCESS,
    ENTITY_PERMISSIONS.CREATE,
    ENTITY_PERMISSIONS.EDIT,
  ] as ValidEntityPermission[],
  NO_ACCESS: [] as ValidEntityPermission[],
} as const;

// Valid tenant IDs (subdomains) - enum for type safety
export enum ValidTenantId {
  // Main domain (no subdomain)
  MAIN = "main",
  
  // Portal tenants (share same structure, different data/styling)
  SCUBADIVING = "scubadiving",
  SKYDIVING = "skydiving",

  // Standalone tenants (each has own folder structure with auth)
  ADMIN = "admin",
  INTEGRATORS = "integrators",
  VALIDATORS = "validators",
  TESTERS = "testers",

  // Public standalone tenants (each has own folder structure without auth)
  STATUS = "status",

  // API-only tenants (API routes only, no UI pages)
  API = "api",
  EXTERNAL_API = "external-api",
}

// Valid entity names - enum for type safety (matching Convex schema)
export enum ValidEntityName {
  PRODUCTS = "products",
  USERS = "users",
  TENANTS = "tenants",
  ROLES = "roles",
  USER_TENANT_ROLES = "userTenantRoles",
  ENTITY_PERMISSIONS = "entityPermissions",
  FIELD_PERMISSIONS = "fieldPermissions",
  FEATURE_PERMISSIONS = "featurePermissions",
  AUDIT_LOGS = "auditLogs",
  SESSIONS = "sessions",
}

// Type-safe field mapping for each entity - includes all entities
export type EntityFieldMap = {
  products: keyof Doc<"products">;
  users: keyof Doc<"users">;
  tenants: keyof Doc<"tenants">;
  roles: keyof Doc<"roles">;
  userTenantRoles: keyof Doc<"userTenantRoles">;
  entityPermissions: keyof Doc<"entityPermissions">;
  fieldPermissions: keyof Doc<"fieldPermissions">;
  featurePermissions: keyof Doc<"featurePermissions">;
  auditLogs: keyof Doc<"auditLogs">;
  sessions: keyof Doc<"sessions">;
};

// Permission categories - enum for type safety
export enum PermissionCategory {
  ENTITY_PERMISSIONS = "entity_permissions",
  FIELD_PERMISSIONS = "field_permissions",
  FEATURE_PERMISSIONS = "feature_permissions",
}

// System role names - enum for type safety
export enum SystemRoleName {
  SUPER_ADMIN = "SUPER_ADMIN",
  PORTAL_SCUBADIVING_ADMIN = "PORTAL_SCUBADIVING_ADMIN",
  PORTAL_SCUBADIVING_USER = "PORTAL_SCUBADIVING_USER",
  PORTAL_SKYDIVING_ADMIN = "PORTAL_SKYDIVING_ADMIN",
  PORTAL_SKYDIVING_USER = "PORTAL_SKYDIVING_USER",
}

// Feature permission names - enum for type safety
export enum FeaturePermissionName {
  ANALYTICS_DASHBOARD = "analytics_dashboard",
  BULK_IMPORT = "bulk_import",
  ADVANCED_SEARCH = "advanced_search",
  USER_MANAGEMENT = "user_management",
  TENANT_MANAGEMENT = "tenant_management",
  ROLE_MANAGEMENT = "role_management",
  PERMISSION_MANAGEMENT = "permission_management",
  AUDIT_LOGS = "audit_logs",
  SYSTEM_SETTINGS = "system_settings",
  BACKUP_RESTORE = "backup_restore",
  API_ACCESS = "api_access",
  WEBHOOK_MANAGEMENT = "webhook_management",
  INTEGRATION_MANAGEMENT = "integration_management",
}

// Entity permission actions - derived from constants
export type EntityPermissionAction =
  (typeof ENTITY_PERMISSIONS)[keyof typeof ENTITY_PERMISSIONS];

// Field permission actions - derived from constants
export type FieldPermissionAction =
  (typeof FIELD_PERMISSIONS)[keyof typeof FIELD_PERMISSIONS];

// Audit log action types - now imported from audit utils
export type { AuditLogAction, AuditCode, AuditCategory } from "./audit_utils";

// These types are removed as they should be stored in database tables
// and retrieved dynamically rather than hardcoded

// Tenant types - for routing logic
export enum TenantType {
  PORTAL = "portal", // Shared structure, different data/styling
  STANDALONE = "standalone", // Own folder structure with auth
  PUBLIC_STANDALONE = "public_standalone", // Own folder structure without auth
  API_ONLY = "api_only", // API routes only, no UI pages
}

// Tenant configuration - type-safe with enum keys
export const TENANT_CONFIG = {
  [ValidTenantId.SCUBADIVING]: {
    name: "Scuba Diving Portal",
    subdomain: "scubadiving",
    primaryColor: "#0066CC",
    type: TenantType.PORTAL,
  },
  [ValidTenantId.SKYDIVING]: {
    name: "Skydiving Portal",
    subdomain: "skydiving",
    primaryColor: "#FF6600",
    type: TenantType.PORTAL,
  },
  [ValidTenantId.ADMIN]: {
    name: "Admin Portal",
    subdomain: "admin",
    primaryColor: "#333333",
    type: TenantType.STANDALONE,
  },
  [ValidTenantId.INTEGRATORS]: {
    name: "Integrators Portal",
    subdomain: "integrators",
    primaryColor: "#4CAF50",
    type: TenantType.STANDALONE,
  },
  [ValidTenantId.VALIDATORS]: {
    name: "Validators Portal",
    subdomain: "validators",
    primaryColor: "#FF9800",
    type: TenantType.STANDALONE,
  },
  [ValidTenantId.TESTERS]: {
    name: "Testers Portal",
    subdomain: "testers",
    primaryColor: "#9C27B0",
    type: TenantType.STANDALONE,
  },
  [ValidTenantId.STATUS]: {
    name: "Status Page",
    subdomain: "status",
    primaryColor: "#10B981",
    type: TenantType.PUBLIC_STANDALONE,
  },
  [ValidTenantId.MAIN]: {
    name: "Main Site",
    subdomain: "main",
    primaryColor: "#6366F1",
    type: TenantType.PUBLIC_STANDALONE,
  },
  [ValidTenantId.API]: {
    name: "API Services",
    subdomain: "api",
    primaryColor: "#059669",
    type: TenantType.API_ONLY,
  },
  [ValidTenantId.EXTERNAL_API]: {
    name: "External API Services",
    subdomain: "external-api",
    primaryColor: "#DC2626",
    type: TenantType.API_ONLY,
  },
} as const satisfies Record<
  ValidTenantId,
  {
    name: string;
    subdomain: string;
    primaryColor: string;
    type: TenantType;
  }
>;

// Helper type to get tenant IDs from config
export type TenantId = keyof typeof TENANT_CONFIG;
