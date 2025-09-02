# Roles & Permissions System Design

## Overview
This document defines the complete roles and permissions architecture for the multi-tenant system.

---

## Permission Types

### 1. Entity Permissions (CRUD Operations)
Format: `{entity}_{action}`

**Actions:**
- `_create`: Create new records (POST)
- `_edit`: Update existing records (PUT)  
- `_delete`: Delete records (DELETE)

**Grouped Permissions:**
- `{entity}_full_access`: Expands to all 3 actions above

**Examples:**
```
products_create
products_edit
products_delete
products_full_access  // = all 3 above
```

**Note:** `_fetch` and `_view` are field-level permissions only, not entity-level. If a user has access to at least one field with `_fetch`, they can fetch the entity.

### 2. Feature Permissions (Business Capabilities)
High-level business features beyond basic CRUD:

```
analytics_dashboard
bulk_import
advanced_search
export_data
manage_promotions
customer_support
user_management
tenant_management
```

### 3. Field-Level Permissions (Column Access)
Granular control over individual database fields:

**Actions:**
- `_fetch`: Can retrieve field in API calls (GET)
- `_view`: UI display permission (requires `_fetch`)
- `_update`: Can modify field value (PATCH)

**Defined in schema:**
```typescript
interface FieldPermissions {
  [fieldName: string]: {
    [tenantId: string]: FieldAction[];
  };
}

type FieldAction = "_fetch" | "_view" | "_update";
```

**Note:** When a tenantId is not specified, it means no access (equivalent to empty array):

```typescript
// These are equivalent:
internalNotes: {
  admin: ["_fetch", "_view", "_update"],
  scubadiving: [], // No access
  skydiving: []  // No access
}

// Same as:
internalNotes: {
  admin: ["_fetch", "_view", "_update"]
  // Missing tenants = no access
}
```

---

## Role Hierarchy

### System Roles (Predefined in Convex):
Predefined roles that cannot be deleted:

```typescript
const SYSTEM_ROLES = {
  SUPER_ADMIN: {
    name: "SUPER_ADMIN",
    displayName: "Super Administrator",
    entityPermissions: ["*"],
    featurePermissions: ["*"],
    tenantScope: null, // Global access
    isSystemRole: true
  },
  
  PORTAL_SCUBADIVING_ADMIN: {
    name: "PORTAL_SCUBADIVING_ADMIN",
    displayName: "Scuba Diving Portal Administrator",
    entityPermissions: [
      "products_full_access",
      "orders_full_access", 
      "reviews_edit",
      "reviews_delete",
      "users_view",
      "users_edit"
    ],
    featurePermissions: [
      "analytics_dashboard",
      "bulk_import",
      "manage_promotions"
    ],
    tenantScope: "scubadiving",
    isSystemRole: true
  },
  
  PORTAL_SCUBADIVING_USER: {
    name: "PORTAL_SCUBADIVING_USER",
    displayName: "Scuba Diving Customer",
    entityPermissions: [
      "products_view",
      "orders_create",
      "orders_view", // Own orders only
      "reviews_create",
      "reviews_edit" // Own reviews only
    ],
    featurePermissions: [
      "advanced_search"
    ],
    tenantScope: "scubadiving",
    isSystemRole: true
  },
  
  PORTAL_SKYDIVING_ADMIN: {
    name: "PORTAL_SKYDIVING_ADMIN",
    displayName: "Sky Diving Portal Administrator",
    entityPermissions: [
      "products_full_access",
      "orders_full_access",
      "reviews_full_access",
      "users_view",
      "users_edit"
    ],
    featurePermissions: [
      "analytics_dashboard",
      "bulk_import",
      "export_data"
    ],
    tenantScope: "skydiving",
    isSystemRole: true
  },
  
  PORTAL_SKYDIVING_USER: {
    name: "PORTAL_SKYDIVING_USER", 
    displayName: "Sky Diving Customer",
    entityPermissions: [
      "products_view",
      "orders_create",
      "orders_view",
      "reviews_create",
      "reviews_edit"
    ],
    featurePermissions: [
      "advanced_search"
    ],
    tenantScope: "skydiving",
    isSystemRole: true
  }
};
```

## Database Schema

### Unified Roles Table
Both system and custom roles use the same entity structure:

```typescript
interface Role {
  id: string; // "SUPER_ADMIN", "PORTAL_SCUBADIVING_ADMIN", "CUSTOM_MARKETING_001", etc.
  name: string;
  displayName: string;
  isSystemRole: boolean; // true for system roles, false for custom roles
  inheritsFrom: string | null; // null for standalone roles, roleId for inherited roles
  
  // Base permissions (for system roles or standalone custom roles)
  entityPermissions: string[]; // ["products_create", "products_edit", ...]
  featurePermissions: string[]; // ["analytics_dashboard", "bulk_import", ...]
  
  // Override permissions (for inherited custom roles)
  addedEntityPermissions: string[]; // Additional entity permissions
  removedEntityPermissions: string[]; // Removed entity permissions
  addedFeaturePermissions: string[]; // Additional feature permissions
  removedFeaturePermissions: string[]; // Removed feature permissions
  customPermissions: string[]; // Super custom for testing/debugging
  
  tenantScope: string | null; // null for global, specific tenant for others
}
```

**Role Types:**
- **System Roles**: `isSystemRole: true`, `inheritsFrom: null` (standalone base roles)
- **Inherited Custom Roles**: `isSystemRole: false`, `inheritsFrom: roleId` (extends existing role)
- **Standalone Custom Roles**: `isSystemRole: false`, `inheritsFrom: null` (completely independent)

**Use Cases for Standalone Custom Roles (`inheritsFrom: null`):**
- **Temporary Roles**: Event-specific permissions
- **External Integrations**: API-only roles with specific permission sets
- **Testing Roles**: Isolated permission combinations for debugging
- **Special Projects**: One-off permission combinations that don't fit existing roles

### Custom Roles (User-Created):
Inherit from system roles with add/remove permissions OR create standalone roles:

**Example - Inherited Custom Role (Marketing - Add permissions):**
```typescript
{
  id: "custom_marketing_001",
  name: "PORTAL_SCUBADIVING_MARKETING",
  displayName: "Scuba Diving Marketing Specialist",
  isSystemRole: false,
  inheritsFrom: "PORTAL_SCUBADIVING_USER", // Inherits base permissions
  entityPermissions: [], // Uses inherited permissions
  featurePermissions: [], // Uses inherited permissions
  addedEntityPermissions: [],
  removedEntityPermissions: [],
  addedFeaturePermissions: [
    "analytics_dashboard",
    "export_data",
    "manage_promotions"
  ],
  removedFeaturePermissions: [],
  customPermissions: [], // For testing/debugging only
  tenantScope: "scubadiving"
}
```

**Example - Inherited Custom Role (Restricted Admin - Remove permissions):**
```typescript
{
  id: "custom_restricted_admin_001",
  name: "PORTAL_SCUBADIVING_RESTRICTED_ADMIN",
  displayName: "Scuba Diving Restricted Admin",
  isSystemRole: false,
  inheritsFrom: "PORTAL_SCUBADIVING_ADMIN", // Inherits base permissions
  entityPermissions: [], // Uses inherited permissions
  featurePermissions: [], // Uses inherited permissions
  addedEntityPermissions: [],
  removedEntityPermissions: [
    "products_delete",
    "users_delete"
  ],
  addedFeaturePermissions: [],
  removedFeaturePermissions: [
    "user_management"
  ],
  customPermissions: [],
  tenantScope: "scubadiving"
}
```

**Example - Standalone Custom Role (Independent permissions):**
```typescript
{
  id: "custom_api_integration_001",
  name: "EXTERNAL_API_INTEGRATION",
  displayName: "External API Integration",
  isSystemRole: false,
  inheritsFrom: null, // Completely independent
  entityPermissions: ["products_view", "orders_create"], // Only specific permissions
  featurePermissions: ["api_access"], // API-specific features
  addedEntityPermissions: [], // Not used for standalone roles
  removedEntityPermissions: [], // Not used for standalone roles
  addedFeaturePermissions: [], // Not used for standalone roles
  removedFeaturePermissions: [], // Not used for standalone roles
  customPermissions: ["external_webhook_access"], // Special API permissions
  tenantScope: "scubadiving"
}
```

---

## Permission Resolution Logic

### Priority Order:
1. **Base Role Permissions** (from assigned roles)
2. **+ Granted Overrides** (additional permissions)
3. **- Revoked Overrides** (removed permissions)
4. **Wildcard Resolution** (`*` and `_full_access` expansion)

### Permission Checking Flow:
```typescript
async function hasPermission(userId, permission, tenantId, resourceId?) {
  // 1. Get user's effective permissions (cached)
  const userPerms = await getUserEffectivePermissions(userId, tenantId);
  
  // 2. Check entity/feature permission
  const hasEntityPerm = userPerms.entityPermissions.includes(permission) || 
                       userPerms.entityPermissions.includes("*");
  const hasFeaturePerm = userPerms.featurePermissions.includes(permission) || 
                        userPerms.featurePermissions.includes("*");
  
  const hasAccess = hasEntityPerm || hasFeaturePerm;
  
  // 3. Row-level security check (if resourceId provided)
  if (hasAccess && resourceId) {
    return await checkRowLevelAccess(userId, permission, resourceId, tenantId);
  }
  
  return hasAccess;
}
```

### Grouped Permission Expansion:
```typescript
function resolvePermissions(permissions: string[]): string[] {
  const resolved = new Set<string>();
  
  permissions.forEach(permission => {
    if (permission === "*") {
      // Add all possible permissions
      resolved.add("*");
    } else if (permission.endsWith("_full_access")) {
      const entity = permission.replace("_full_access", "");
      resolved.add(`${entity}_create`);
      resolved.add(`${entity}_edit`);
      resolved.add(`${entity}_delete`);
      resolved.add(`${entity}_fetch`);
      resolved.add(`${entity}_view`);
    } else {
      resolved.add(permission);
    }
  });
  
  return Array.from(resolved);
}
```

---

## JWT Claims Structure

### Current Clerk JWT Template:
```json
{
  "aud": "convex",
  "name": "{{user.full_name}}",
  "email": "{{user.primary_email_address}}",
  "picture": "{{user.image_url}}",
  "nickname": "{{user.username}}",
  "given_name": "{{user.first_name}}",
  "updated_at": "{{user.updated_at}}",
  "family_name": "{{user.last_name}}",
  "phone_number": "{{user.primary_phone_number}}",
  "email_verified": "{{user.email_verified}}",
  "phone_number_verified": "{{user.phone_number_verified}}"
}
```

### Simplified JWT Claims (Add to template):
- **`roleIds`**: Array of role names `["PORTAL_SCUBADIVING_USER", "PORTAL_SKYDIVING_ADMIN"]`
- **`tenantIds`**: Array of tenant domains `["scubadiving", "skydiving"]`

### Updated JWT Template:
```json
{
  "aud": "convex",
  "name": "{{user.full_name}}",
  "email": "{{user.primary_email_address}}",
  "picture": "{{user.image_url}}",
  "nickname": "{{user.username}}",
  "given_name": "{{user.first_name}}",
  "updated_at": "{{user.updated_at}}",
  "family_name": "{{user.last_name}}",
  "phone_number": "{{user.primary_phone_number}}",
  "email_verified": "{{user.email_verified}}",
  "phone_number_verified": "{{user.phone_number_verified}}",
  "roleIds": "{{user.public_metadata.roleIds}}",
  "tenantIds": "{{user.public_metadata.tenantIds}}"
}
```

### Claim Purposes:

**tenantIds:**
- Fast tenant access validation
- UI: Portal switching options
- Middleware: Subdomain access control

**roleIds:**
- Direct Convex role lookup
- Avoid user queries in every request
- Permission cache keys

---

## Data Storage Strategy

### Clerk Stores:
- Basic auth data (email, password, MFA)
- User metadata (name, profile info)
- **Tenant access list** (via `publicMetadata.tenantIds`)
- **Role IDs** (via `publicMetadata.roleIds`)

### Convex Stores:
- **Detailed role definitions** (permissions, scope)
- **User role assignments** (user-role-tenant mappings)
- **Permission overrides** (user-specific grants/revokes)
- **Custom roles** (user-created roles)
- **Permission cache** (computed effective permissions)
- **Audit logs** (permission changes, access tracking)

---

## Row-Level Security

### Ownership-Based Access:
```typescript
// Users can only access their own orders
async function checkRowLevelAccess(userId, permission, resourceId, tenantId) {
  if (permission.startsWith("orders_")) {
    const order = await db.get(resourceId);
    return order?.userId === userId || hasPermission(userId, "orders_full_access", tenantId);
  }
  
  if (permission.startsWith("reviews_")) {
    const review = await db.get(resourceId);
    return review?.userId === userId || hasPermission(userId, "reviews_full_access", tenantId);
  }
  
  return true; // Default allow for other resources
}
```

---

## Permission Override System

### Temporary Permissions:
```typescript
// Grant temporary access
{
  userId: "user_123",
  tenantId: "scubadiving",
  grantedEntityPermissions: ["analytics_dashboard"],
  reason: "Q4 campaign analysis",
  expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
  grantedBy: "admin_user_456"
}
```

### Permission Revocation:
```typescript
// Remove specific permission from user's role
{
  userId: "user_789",
  tenantId: "scubadiving", 
  revokedEntityPermissions: ["products_delete"],
  reason: "Security incident - removing delete permissions",
  grantedBy: "admin_user_456"
}
```

---

## Implementation Notes

### Performance Considerations:
- **Permission caching**: Pre-compute effective permissions
- **JWT claims**: Include frequently-checked permissions
- **Database indexes**: Efficient tenant and user filtering
- **Cache invalidation**: Update when permissions change

### Security Considerations:
- **Tenant isolation**: All queries filtered by tenantId
- **Permission validation**: Every operation checked
- **Audit logging**: Track all permission changes
- **Field-level security**: Column access control

### UI Adaptation:
- **Dynamic forms**: Show only editable fields
- **Dynamic tables**: Display only viewable columns
- **Feature gates**: Hide unavailable features
- **Permission-aware components**: Adapt to user permissions

---

## Example Scenarios

### Scenario 1: Regular Customer
**User:** Sarah (Scuba diving customer)  
**Role:** `PORTAL_SCUBADIVING_USER`  
**Tenant Access:** `["scubadiving"]`

**Permissions:**
- Can view scuba diving products (but not cost fields)
- Can create bookings for herself
- Cannot access admin features
- Cannot see internal pricing data

**JWT Claims:**
```json
{
  "roleIds": ["PORTAL_SCUBADIVING_USER"],
  "tenantIds": ["scubadiving"]
}
```

**Real Data Example:**
```json
{
  "aud": "convex",
  "name": "Sarah Johnson",
  "email": "sarah@email.com",
  "picture": "https://img.clerk.com/sarah.jpg",
  "nickname": "sarah_diver",
  "given_name": "Sarah",
  "updated_at": "2024-01-15T10:30:00Z",
  "family_name": "Johnson",
  "phone_number": "+1234567890",
  "email_verified": true,
  "phone_number_verified": true,
  "roleIds": ["PORTAL_SCUBADIVING_USER"],
  "tenantIds": ["scubadiving"]
}
```

### Scenario 2: Multi-Portal Admin
**User:** Mike (Operations manager)  
**Roles:** `PORTAL_SCUBADIVING_ADMIN`, `PORTAL_SKYDIVING_ADMIN`  
**Tenant Access:** `["scubadiving", "skydiving"]`

**Permissions:**
- Full access to both portals
- Can manage users and products
- Can view all financial data including costs
- Cannot access super admin features

**JWT Claims:**
```json
{
  "roleIds": ["PORTAL_SCUBADIVING_ADMIN", "PORTAL_SKYDIVING_ADMIN"],
  "tenantIds": ["scubadiving", "skydiving"]
}
```

**Real Data Example:**
```json
{
  "aud": "convex",
  "name": "Mike Rodriguez",
  "email": "mike@company.com",
  "picture": "https://img.clerk.com/mike.jpg",
  "nickname": "mike_ops",
  "given_name": "Mike",
  "updated_at": "2024-01-15T14:22:00Z",
  "family_name": "Rodriguez",
  "phone_number": "+1987654321",
  "email_verified": true,
  "phone_number_verified": true,
  "roleIds": ["PORTAL_SCUBADIVING_ADMIN", "PORTAL_SKYDIVING_ADMIN"],
  "tenantIds": ["scubadiving", "skydiving"]
}
```

### Scenario 3: Mixed Role User
**User:** Carlos (Operations manager)  
**Roles:** Admin in scubadiving, User in skydiving  
**Tenant Access:** `["scubadiving", "skydiving"]`

**Permissions:**
- Full admin access in scubadiving portal
- Basic user access in skydiving portal
- Cannot cross-manage between portals

**JWT Claims:**
```json
{
  "roleIds": ["PORTAL_SCUBADIVING_ADMIN", "PORTAL_SKYDIVING_USER"],
  "tenantIds": ["scubadiving", "skydiving"]
}
```

**Real Data Example:**
```json
{
  "aud": "convex",
  "name": "Carlos Martinez",
  "email": "carlos@company.com",
  "picture": "https://img.clerk.com/carlos.jpg",
  "nickname": "carlos_ops",
  "given_name": "Carlos",
  "updated_at": "2024-01-15T11:45:00Z",
  "family_name": "Martinez",
  "phone_number": "+1444555666",
  "email_verified": true,
  "phone_number_verified": true,
  "roleIds": ["PORTAL_SCUBADIVING_ADMIN", "PORTAL_SKYDIVING_USER"],
  "tenantIds": ["scubadiving", "skydiving"]
}
```

### Scenario 4: Multi-Portal User with Super Admin
**User:** Emma (Regular user + System admin)  
**Roles:** User in both portals + Super Admin  
**Tenant Access:** `["*"]` (super admin overrides)

**Permissions:**
- Basic user access in both portals
- Full system admin capabilities
- Can manage all tenants and system settings

**JWT Claims:**
```json
{
  "roleIds": ["PORTAL_SCUBADIVING_USER", "PORTAL_SKYDIVING_USER", "SUPER_ADMIN"],
  "tenantIds": ["*"]
}
```

**Real Data Example:**
```json
{
  "aud": "convex",
  "name": "Emma Wilson",
  "email": "emma@company.com",
  "picture": "https://img.clerk.com/emma.jpg",
  "nickname": "emma_superuser",
  "given_name": "Emma",
  "updated_at": "2024-01-15T16:20:00Z",
  "family_name": "Wilson",
  "phone_number": "+1777888999",
  "email_verified": true,
  "phone_number_verified": true,
  "roleIds": ["PORTAL_SCUBADIVING_USER", "PORTAL_SKYDIVING_USER", "SUPER_ADMIN"],
  "tenantIds": ["*"]
}
```

### Scenario 5: Super Admin Only
**User:** Alex (System administrator)  
**Role:** `SUPER_ADMIN`  
**Tenant Access:** `["*"]` (all tenants)

**Permissions:**
- Access to all portals and admin interface
- Can create new tenants
- Can manage system-wide settings
- Full access to all data and features

**JWT Claims:**
```json
{
  "roleIds": ["SUPER_ADMIN"],
  "tenantIds": ["*"]
}
```

**Real Data Example:**
```json
{
  "aud": "convex",
  "name": "Alex Chen",
  "email": "alex@company.com",
  "picture": "https://img.clerk.com/alex.jpg",
  "nickname": "alex_admin",
  "given_name": "Alex",
  "updated_at": "2024-01-15T09:15:00Z",
  "family_name": "Chen",
  "phone_number": "+1555123456",
  "email_verified": true,
  "phone_number_verified": true,
  "roleIds": ["SUPER_ADMIN"],
  "tenantIds": ["*"]
}
```

---

## HTTP Method Examples with Entity & Field Mapping

### Entity Schema with Permissions
```typescript
interface ProductEntity {
  // Entity-level permissions
  entityPermissions: {
    [tenantId: string]: EntityAction[];
  };
  
  // Field-level permissions
  fieldPermissions: {
    name: {
      [tenantId: string]: FieldAction[];
    };
    price: {
      admin: ["_fetch", "_view", "_update"],
      scubadiving: ["_fetch", "_view"], // Can see but not edit
      skydiving: [] // No access
    };
    cost: {
      admin: ["_fetch", "_view", "_update"],
      // Missing tenants = no access (internal data)
    };
    description: {
      admin: ["_fetch", "_view", "_update"],
      scubadiving: ["_fetch", "_view", "_update"],
      skydiving: ["_fetch", "_view", "_update"]
    };
  };
}

type EntityAction = "_create" | "_edit" | "_delete";
type FieldAction = "_fetch" | "_view" | "_update";
```

### API Call Examples

#### 1. GET /api/products (Sarah - PORTAL_SCUBADIVING_USER)
**Request:**
```http
GET /api/products?tenantId=scubadiving
Authorization: Bearer <jwt_with_PORTAL_SCUBADIVING_USER>
```

**Permission Check:**
- Entity: Check if user has any field with `_fetch` permission
- Fields: Return only fields with `_fetch` permission for scubadiving tenant

**Response:**
```json
{
  "products": [
    {
      "id": "prod_001",
      "name": "Diving Mask",
      "price": 89.99,
      "description": "Professional diving mask"
      // cost field excluded (no _fetch permission)
    }
  ]
}
```

#### 2. GET /api/products (Mike - PORTAL_SCUBADIVING_ADMIN)
**Request:**
```http
GET /api/products?tenantId=scubadiving
Authorization: Bearer <jwt_with_PORTAL_SCUBADIVING_ADMIN>
```

**Permission Check:**
- Entity: Admin has `products_full_access` → includes all entity actions
- Fields: Admin role has access to all fields including cost

**Response:**
```json
{
  "products": [
    {
      "id": "prod_001",
      "name": "Diving Mask",
      "price": 89.99,
      "cost": 45.50,
      "description": "Professional diving mask"
    }
  ]
}
```

#### 3. POST /api/products (Sarah - PORTAL_SCUBADIVING_USER)
**Request:**
```http
POST /api/products
Authorization: Bearer <jwt_with_PORTAL_SCUBADIVING_USER>
Content-Type: application/json

{
  "name": "New Product",
  "price": 99.99,
  "description": "Test product"
}
```

**Permission Check:**
- Entity: Check `products_create` permission → DENIED (user role doesn't have create)

**Response:**
```json
{
  "error": "Insufficient permissions",
  "code": "PERMISSION_DENIED",
  "required": "products_create"
}
```

#### 4. POST /api/products (Mike - PORTAL_SCUBADIVING_ADMIN)
**Request:**
```http
POST /api/products
Authorization: Bearer <jwt_with_PORTAL_SCUBADIVING_ADMIN>
Content-Type: application/json

{
  "name": "New Diving Gear",
  "price": 199.99,
  "cost": 89.50,
  "description": "Advanced diving equipment"
}
```

**Permission Check:**
- Entity: Admin has `products_create` → ALLOWED
- Fields: All fields have `_update` permission for admin

**Response:**
```json
{
  "id": "prod_002",
  "name": "New Diving Gear",
  "price": 199.99,
  "cost": 89.50,
  "description": "Advanced diving equipment",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### 5. PATCH /api/products/prod_001 (Sarah - PORTAL_SCUBADIVING_USER)
**Request:**
```http
PATCH /api/products/prod_001
Authorization: Bearer <jwt_with_PORTAL_SCUBADIVING_USER>
Content-Type: application/json

{
  "description": "Updated description"
}
```

**Permission Check:**
- Entity: Check `products_edit` permission → DENIED (user role doesn't have edit)

**Response:**
```json
{
  "error": "Insufficient permissions",
  "code": "PERMISSION_DENIED", 
  "required": "products_edit"
}
```

#### 6. PATCH /api/products/prod_001 (Carlos - Mixed Roles)
**Request to Scubadiving (Admin access):**
```http
PATCH /api/products/prod_001?tenantId=scubadiving
Authorization: Bearer <jwt_with_mixed_roles>
Content-Type: application/json

{
  "price": 95.99,
  "cost": 47.00
}
```

**Permission Check:**
- Tenant: scubadiving → User has PORTAL_SCUBADIVING_ADMIN role
- Entity: Admin has `products_edit` → ALLOWED
- Fields: price and cost both have `_update` permission for admin

**Response:**
```json
{
  "id": "prod_001",
  "name": "Diving Mask",
  "price": 95.99,
  "cost": 47.00,
  "description": "Professional diving mask",
  "updatedAt": "2024-01-15T11:45:00Z"
}
```

**Request to Skydiving (User access):**
```http
PATCH /api/products/prod_sky_001?tenantId=skydiving
Authorization: Bearer <jwt_with_mixed_roles>
Content-Type: application/json

{
  "description": "Updated skydiving gear description"
}
```

**Permission Check:**
- Tenant: skydiving → User has PORTAL_SKYDIVING_USER role
- Entity: User role doesn't have `products_edit` → DENIED

**Response:**
```json
{
  "error": "Insufficient permissions",
  "code": "PERMISSION_DENIED",
  "required": "products_edit"
}
```

#### 7. DELETE /api/products/prod_001 (Emma - Super Admin)
**Request:**
```http
DELETE /api/products/prod_001?tenantId=scubadiving
Authorization: Bearer <jwt_with_super_admin>
```

**Permission Check:**
- Role: SUPER_ADMIN has `*` permissions → ALLOWED for all operations
- Tenant: `*` access overrides specific tenant restrictions

**Response:**
```json
{
  "message": "Product deleted successfully",
  "id": "prod_001",
  "deletedAt": "2024-01-15T16:20:00Z"
}
```

#### 8. Field-Level Filtering Example
**GET /api/products with different users:**

**Sarah (PORTAL_SCUBADIVING_USER):**
```json
{
  "id": "prod_001",
  "name": "Diving Mask",
  "price": 89.99,
  "description": "Professional diving mask"
  // cost excluded - no _fetch permission
}
```

**Mike (PORTAL_SCUBADIVING_ADMIN):**
```json
{
  "id": "prod_001", 
  "name": "Diving Mask",
  "price": 89.99,
  "cost": 45.50,
  "description": "Professional diving mask"
  // All fields included - admin has full access
}
```

**Carlos accessing Skydiving tenant (PORTAL_SKYDIVING_USER):**
```json
{
  "id": "prod_sky_001",
  "name": "Parachute",
  "description": "Professional parachute"
  // price excluded - skydiving tenant has no _fetch permission for price
  // cost excluded - no access to internal data
}
```
