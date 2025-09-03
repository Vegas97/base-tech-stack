import auditCodes from "./audit_codes.json";
import {
  ValidEntityName,
  FeaturePermissionName,
  ENTITY_PERMISSIONS,
  FIELD_PERMISSIONS,
} from "./constants";

// Types derived from the audit codes JSON
export type AuditCategory = keyof typeof auditCodes.categories;
export type AuditCode = string; // A0001, A0002, etc.
export type AuditAction = string; // login, logout, etc.

// Main audit log action type - now uses codes
export type AuditLogAction = {
  code: AuditCode;
  action: AuditAction;
  category: AuditCategory;
  description?: string;
  entityId?: string;
  entityType?: ValidEntityName;
  userId: string;
  tenantId?: string;
  metadata?: Record<string, any>;
};

// Get audit code for entity permission
export function getEntityAuditCode(
  entityName: ValidEntityName,
  action: keyof typeof ENTITY_PERMISSIONS
): AuditCode | null {
  const actionKey = ENTITY_PERMISSIONS[action].replace("_", "");
  const mapping =
    auditCodes.entity_mappings[
      entityName as keyof typeof auditCodes.entity_mappings
    ];
  return mapping?.[actionKey as keyof typeof mapping] || null;
}

// Get audit code for feature permission
export function getFeatureAuditCode(
  featureName: FeaturePermissionName
): AuditCode | null {
  return (
    auditCodes.feature_mappings[
      featureName as keyof typeof auditCodes.feature_mappings
    ] || null
  );
}

// Get audit code by action name (reverse lookup)
export function getAuditCodeByAction(actionName: string): AuditCode | null {
  for (const category of Object.values(auditCodes.categories)) {
    for (const [code, action] of Object.entries(category.actions)) {
      if (action === actionName) {
        return code;
      }
    }
  }
  return null;
}

// Get audit action details by code
export function getAuditActionByCode(code: AuditCode): {
  action: AuditAction;
  category: AuditCategory;
  description: string;
} | null {
  for (const [categoryName, category] of Object.entries(
    auditCodes.categories
  )) {
    if (code in category.actions) {
      return {
        action: category.actions[code as keyof typeof category.actions],
        category: categoryName as AuditCategory,
        description: category.description,
      };
    }
  }
  return null;
}

// Generate audit log entry
export function createAuditLogEntry(
  code: AuditCode,
  userId: string,
  options: {
    entityId?: string;
    entityType?: ValidEntityName;
    tenantId?: string;
    metadata?: Record<string, any>;
  } = {}
): AuditLogAction | null {
  const auditDetails = getAuditActionByCode(code);
  if (!auditDetails) return null;

  return {
    code,
    action: auditDetails.action,
    category: auditDetails.category,
    description: auditDetails.description,
    userId,
    ...options,
  };
}

// Helper to create entity-specific audit entries
export function createEntityAuditEntry(
  entityName: ValidEntityName,
  action: keyof typeof ENTITY_PERMISSIONS,
  userId: string,
  entityId: string,
  tenantId?: string,
  metadata?: Record<string, any>
): AuditLogAction | null {
  const code = getEntityAuditCode(entityName, action);
  if (!code) return null;

  return createAuditLogEntry(code, userId, {
    entityId,
    entityType: entityName,
    tenantId,
    metadata,
  });
}

// Helper to create feature-specific audit entries
export function createFeatureAuditEntry(
  featureName: FeaturePermissionName,
  userId: string,
  tenantId?: string,
  metadata?: Record<string, any>
): AuditLogAction | null {
  const code = getFeatureAuditCode(featureName);
  if (!code) return null;

  return createAuditLogEntry(code, userId, {
    tenantId,
    metadata,
  });
}

// Get all audit codes for a category
export function getAuditCodesByCategory(
  category: AuditCategory
): Record<AuditCode, AuditAction> {
  return auditCodes.categories[category]?.actions || {};
}

// Validate audit code format
export function isValidAuditCode(code: string): code is AuditCode {
  return /^A\d{4}$/.test(code) && getAuditActionByCode(code) !== null;
}

// Get next available audit code for a category
export function getNextAuditCode(category: AuditCategory): AuditCode {
  const categoryData = auditCodes.categories[category];
  if (!categoryData) throw new Error(`Invalid category: ${category}`);

  const existingCodes = Object.keys(categoryData.actions);
  const prefix = categoryData.prefix;

  // Find the highest number in this category
  let maxNumber = 0;
  existingCodes.forEach((code) => {
    if (code.startsWith(prefix)) {
      const number = parseInt(code.slice(1), 10);
      if (number > maxNumber) maxNumber = number;
    }
  });

  // Return next available code
  const nextNumber = maxNumber + 1;
  return `A${nextNumber.toString().padStart(4, "0")}` as AuditCode;
}
