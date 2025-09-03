import { v } from "convex/values";

// Common validation schemas
export const emailValidator = v.string(); // Could add regex validation in production
export const subdomainValidator = v.string(); // Could add regex validation in production

// User validation schemas
export const userCreateSchema = {
  clerkId: v.string(),
  email: emailValidator,
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
};

// Tenant validation schemas
export const tenantCreateSchema = {
  subdomain: subdomainValidator,
  name: v.string(),
  description: v.optional(v.string()),
};

// Role validation schemas
export const roleCreateSchema = {
  name: v.string(),
  displayName: v.string(),
  description: v.optional(v.string()),
  tenantScope: v.optional(v.string()),
  entityPermissions: v.array(v.string()),
  featurePermissions: v.array(v.string()),
  isSystemRole: v.optional(v.boolean()),
};

// Permission validation schemas
export const entityPermissionSchema = {
  entity: v.string(),
  action: v.string(),
  description: v.optional(v.string()),
};

export const fieldPermissionSchema = {
  entity: v.string(),
  field: v.string(),
  tenantId: v.string(),
  actions: v.array(v.string()),
};

export const featurePermissionSchema = {
  name: v.string(),
  description: v.optional(v.string()),
  category: v.optional(v.string()),
};

// Product validation schemas
export const productCreateSchema = {
  name: v.string(),
  price: v.optional(v.number()),
  cost: v.optional(v.number()),
  description: v.string(),
  category: v.string(),
  tenantId: v.string(),
  internalNotes: v.optional(v.string()),
};


// Validation helper functions
export const validatePermissionFormat = (permission: string): boolean => {
  // Check if permission follows entity_action format or is wildcard
  if (permission === "*") return true;
  
  const parts = permission.split("_");
  return parts.length >= 2 && parts.every(part => part.length > 0);
};

export const validateFieldAction = (action: string): boolean => {
  const validActions = ["_fetch", "_view", "_update"];
  return validActions.includes(action);
};
