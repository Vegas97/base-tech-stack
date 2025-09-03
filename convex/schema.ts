import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Core user table - linked to Clerk authentication
  users: defineTable({
    clerkId: v.string(), // Clerk user ID
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    isActive: v.boolean(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // Tenants/Organizations - each subdomain represents a tenant
  tenants: defineTable({
    subdomain: v.string(), // e.g., "scubadiving", "skydiving"
    name: v.string(), // Display name
    description: v.optional(v.string()),
    settings: v.optional(
      v.object({
        theme: v.optional(v.string()),
        customDomain: v.optional(v.string()),
        features: v.optional(v.array(v.string())),
      })
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
    isActive: v.boolean(),
  })
    .index("by_subdomain", ["subdomain"])
    .index("by_active", ["isActive"]),

  // Roles - system-wide and tenant-specific roles (following design document structure)
  roles: defineTable({
    name: v.string(), // e.g., "SUPER_ADMIN", "PORTAL_SCUBADIVING_ADMIN"
    displayName: v.string(),
    description: v.optional(v.string()),
    isSystemRole: v.boolean(), // true for system roles, false for custom roles
    inheritsFrom: v.optional(v.id("roles")), // null for standalone roles, roleId for inherited roles

    // Base permissions (for system roles or standalone custom roles)
    entityPermissions: v.array(v.string()), // ["products_create", "products_edit", ...]
    featurePermissions: v.array(v.string()), // ["analytics_dashboard", "bulk_import", ...]

    // Override permissions (for inherited custom roles)
    addedEntityPermissions: v.optional(v.array(v.string())), // Additional entity permissions
    removedEntityPermissions: v.optional(v.array(v.string())), // Removed entity permissions
    addedFeaturePermissions: v.optional(v.array(v.string())), // Additional feature permissions
    removedFeaturePermissions: v.optional(v.array(v.string())), // Removed feature permissions
    customPermissions: v.optional(v.array(v.string())), // Super custom for testing/debugging

    tenantScope: v.optional(v.string()), // null for global, specific tenant for others
    createdAt: v.number(),
    updatedAt: v.number(),
    isActive: v.boolean(),
  })
    .index("by_tenant_scope", ["tenantScope"])
    .index("by_name", ["name"])
    .index("by_system_role", ["isSystemRole"])
    .index("by_inherits_from", ["inheritsFrom"])
    .index("by_active", ["isActive"]),

  // User-Tenant-Role assignments - many-to-many relationship
  userTenantRoles: defineTable({
    userId: v.id("users"),
    tenantId: v.id("tenants"),
    roleId: v.id("roles"),
    assignedBy: v.id("users"), // Who assigned this role
    assignedAt: v.number(),
    expiresAt: v.optional(v.number()), // Optional expiration
    isActive: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_tenant", ["tenantId"])
    .index("by_user_tenant", ["userId", "tenantId"])
    .index("by_role", ["roleId"])
    .index("by_active", ["isActive"]),

  // Entity permissions - CRUD operations per entity
  entityPermissions: defineTable({
    entity: v.string(), // "products", "users", etc.
    action: v.string(), // "_create", "_edit", "_delete"
    tenantId: v.optional(v.string()), // null for system-wide, specific tenant for tenant-specific
    createdAt: v.number(),
    isActive: v.boolean(),
  })
    .index("by_entity", ["entity"])
    .index("by_entity_tenant", ["entity", "tenantId"])
    .index("by_tenant", ["tenantId"])
    .index("by_active", ["isActive"]),

  // Field permissions - granular field access per tenant
  fieldPermissions: defineTable({
    entity: v.string(), // "products", etc.
    field: v.string(), // "price", "cost", "name", etc.
    tenantId: v.string(), // "scubadiving", "skydiving", "admin"
    actions: v.array(v.string()), // ["_fetch", "_view", "_update"]
    createdAt: v.number(),
    isActive: v.boolean(),
  })
    .index("by_entity_tenant", ["entity", "tenantId"])
    .index("by_entity_field", ["entity", "field"])
    .index("by_tenant", ["tenantId"])
    .index("by_active", ["isActive"]),

  // Feature permissions - business capabilities
  // this is an exactly duplicate of the featurePermissions in clerk auth
  featurePermissions: defineTable({
    name: v.string(), // "analytics_dashboard", "bulk_import", etc.
    displayName: v.string(),
    description: v.optional(v.string()),
    category: v.string(), // "analytics", "import_export", "user_management"
    createdAt: v.number(),
    isActive: v.boolean(),
  })
    .index("by_name", ["name"])
    .index("by_category", ["category"])
    .index("by_active", ["isActive"]),

  // Audit log for tracking user actions
  auditLogs: defineTable({
    userId: v.id("users"),
    tenantId: v.optional(v.id("tenants")),
    action: v.string(), // e.g., "user_created", "role_assigned", "login"
    resource: v.optional(v.string()), // What was affected
    resourceId: v.optional(v.string()),
    metadata: v.optional(
      v.object({
        userAgent: v.optional(v.string()),
        ipAddress: v.optional(v.string()),
        details: v.optional(v.any()),
      })
    ),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_tenant", ["tenantId"])
    .index("by_action", ["action"])
    .index("by_timestamp", ["timestamp"]),

  // Sessions - track active user sessions across tenants
  sessions: defineTable({
    userId: v.id("users"),
    tenantId: v.optional(v.id("tenants")),
    clerkSessionId: v.string(),
    lastActivity: v.number(),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    isActive: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_tenant", ["tenantId"])
    .index("by_clerk_session", ["clerkSessionId"])
    .index("by_last_activity", ["lastActivity"])
    .index("by_active", ["isActive"]),

  // Products table - main business entity
  products: defineTable({
    name: v.string(),
    price: v.optional(v.number()),
    cost: v.optional(v.number()),
    description: v.string(),
    category: v.string(),
    internalNotes: v.optional(v.string()),
    tenantId: v.string(), // Tenant subdomain
    createdAt: v.number(),
    updatedAt: v.number(),
    isActive: v.boolean(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_category", ["category"])
    .index("by_active", ["isActive"])
    .index("by_tenant_active", ["tenantId", "isActive"]),
});
