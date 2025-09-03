# Multi-Tenant Architecture Implementation Plan

## Overview
Complete implementation plan for building a multi-tenant SaaS architecture with subdomain-based portals using Next.js, Clerk, Convex, and Vercel.

## Architecture Summary
- **Subdomains**: `scubadiving.mywebsite.com`, `skydiving.mywebsite.com`, `admin.mywebsite.com`, `auth.mywebsite.com`
- **Single Next.js project** with middleware-based routing
- **Clean URLs**: No visible `/admin` or `/portal` paths
- **Tech Stack**: Next.js + Tailwind + Shadcn + Clerk + Convex + Vercel

---

## Phase 1: JWT Template Enhancement ✅

### 1.1 Update Existing JWT Template
- Keep existing working `convex` JWT template in Clerk Dashboard
- Add additional claims to existing template:
  - `tenantAccess`: `{{user.private_metadata.tenantAccess}}`
  - `roleIds`: `{{user.private_metadata.roleIds}}`

### 1.2 Environment Variables Update
Add to `.env.local`:
```
CLERK_JWT_ISSUER_DOMAIN=https://direct-leopard-80.clerk.accounts.dev
```

### 1.3 Clerk Domain Configuration
Add allowed origins in Clerk Dashboard:
- `http://localhost:3000` (development)
- `http://admin.dellavega.local:3000`
- `http://scubadiving.dellavega.local:3000`
- `http://skydiving.dellavega.local:3000`
- `http://auth.dellavega.local:3000`
- Production domains: `https://admin.dellavega.com`, etc.

---

## Phase 2: Local Development Environment

### 2.1 Subdomain Simulation Setup
Edit `/etc/hosts` file:
```
127.0.0.1 dellavega.local
127.0.0.1 admin.dellavega.local
127.0.0.1 scubadiving.dellavega.local
127.0.0.1 skydiving.dellavega.local
127.0.0.1 auth.dellavega.local
```

### 2.2 Development Testing
- Access via: `http://admin.dellavega.local:3000`
- Test subdomain detection in middleware
- Verify Clerk authentication across subdomains

### 2.3 Alternative Options
- **ngrok**: For external testing with real subdomains
- **dnsmasq**: For wildcard local domain resolution

---

## Phase 3: Database Schema Design

### 3.1 Core Schema Tables
Create `convex/schema.ts` with:

#### Users Table
```typescript
users: defineTable({
  clerkUserId: v.string(), // "user_329iBD8aENBuUflXxx2y9XEdjG9"
  email: v.string(), // For display/communication only
  firstTenantId: v.string(), // Portal where user first signed up
  accessibleTenants: v.array(v.string()), // ["scubadiving", "skydiving"]
  createdAt: v.number(),
  lastActiveAt: v.number(),
}).index("by_clerk_user_id", ["clerkUserId"]),
```

#### Tenants Table
```typescript
tenants: defineTable({
  tenantId: v.string(), // "scubadiving", "skydiving"
  name: v.string(), // "Scuba Diving Store"
  domain: v.string(), // "scubadiving.mywebsite.com"
  isActive: v.boolean(),
  settings: v.object({
    allowSelfRegistration: v.boolean(),
    requireApproval: v.boolean(),
  }),
}),
```

#### Unified Roles Table
```typescript
roles: defineTable({
  name: v.string(), // "SUPER_ADMIN", "PORTAL_SCUBADIVING_ADMIN", "CUSTOM_MARKETING_001"
  displayName: v.string(), // "Super Administrator"
  isSystemRole: v.boolean(), // true for system roles, false for custom roles
  inheritsFrom: v.optional(v.string()), // null for standalone, roleId for inherited
  
  // Base permissions (for system roles or standalone custom roles)
  entityPermissions: v.array(v.string()), // ["products_create", "orders_view"]
  featurePermissions: v.array(v.string()), // ["analytics_dashboard", "bulk_import"]
  
  // Override permissions (for inherited custom roles)
  addedEntityPermissions: v.array(v.string()), // Additional entity permissions
  removedEntityPermissions: v.array(v.string()), // Removed entity permissions
  addedFeaturePermissions: v.array(v.string()), // Additional feature permissions
  removedFeaturePermissions: v.array(v.string()), // Removed feature permissions
  customPermissions: v.array(v.string()), // Super custom for testing/debugging
  
  tenantScope: v.optional(v.string()), // null for SUPER_ADMIN, "scubadiving" for tenant-specific
}),
```

#### Features Table
```typescript
features: defineTable({
  name: v.string(), // "analytics_dashboard", "bulk_import"
  displayName: v.string(), // "Analytics Dashboard"
  description: v.string(),
  category: v.string(), // "analytics", "management", "export"
  isActive: v.boolean(),
  tenantScope: v.optional(v.string()), // null for SUPER_ADMIN, tenantId for tenant-specific
}),
```

#### User Role Assignments
```typescript
userRoles: defineTable({
  userId: v.id("users"),
  roleId: v.id("roles"),
  tenantId: v.optional(v.string()), // null for SUPER_ADMIN, specific tenant for others
  grantedAt: v.number(),
  grantedBy: v.id("users"),
}),
```

#### Permission Overrides
```typescript
userPermissionOverrides: defineTable({
  userId: v.id("users"),
  tenantId: v.optional(v.string()),
  grantedEntityPermissions: v.array(v.string()),
  grantedFeaturePermissions: v.array(v.string()),
  revokedEntityPermissions: v.array(v.string()),
  revokedFeaturePermissions: v.array(v.string()),
  reason: v.string(),
  grantedAt: v.number(),
  grantedBy: v.id("users"),
  expiresAt: v.optional(v.number()),
}),
```

#### Permission Cache
```typescript
userPermissions: defineTable({
  userId: v.id("users"),
  tenantId: v.optional(v.string()),
  entityPermissions: v.array(v.string()),
  featurePermissions: v.array(v.string()),
  lastUpdated: v.number(),
}),
```

### 3.2 Business Entity Example
```typescript
products: defineTable({
  id: v.id("products"),
  name: v.string(),
  description: v.string(),
  price: v.number(),
  internalNotes: v.string(), // Admin-only field
  createdAt: v.number(),
  tenantId: v.string(), // Required for all business entities
}).fieldPermissions({
  id: {
    admin: ["_fetch", "_view"],
    portal1: ["_fetch", "_view"], 
    portal2: ["_fetch", "_view"]
  },
  name: {
    admin: ["_fetch", "_view", "_update"],
    portal1: ["_fetch", "_view"],
    portal2: ["_fetch", "_view", "_update"]
  },
  price: {
    admin: ["_fetch", "_view", "_update"],
    portal1: ["_fetch", "_view"],
    portal2: ["_fetch"] // Can fetch for calculations but not display
  },
  internalNotes: {
    admin: ["_fetch", "_view", "_update"],
    portal1: [], // No access
    portal2: [] // No access
  }
}),
```

---

## Phase 4: Authentication Subdomain Strategy

### 4.1 Centralized Authentication
- **Domain**: `auth.mywebsite.com`
- **Purpose**: All sign-in/sign-up flows
- **Route structure**: `src/app/(auth)/`
- **Post-auth redirect**: Return to originating subdomain

### 4.2 Clerk Configuration Updates
- Set authentication domain in Clerk settings
- Configure redirect URLs for each subdomain
- Update environment variables for auth domain

### 4.3 Route Group Structure
```
src/app/
├── (auth)/              # Authentication pages
│   ├── sign-in/
│   ├── sign-up/
│   └── layout.tsx
├── admin/               # Admin portal routes
├── portal/              # Shared portal routes
└── layout.tsx           # Root layout
```

---

## Phase 5: Middleware and Routing

### 5.1 Subdomain Detection Middleware
Create `middleware.ts`:
- Extract subdomain from hostname
- Handle localhost development subdomains
- Route admin.* to /admin/* paths
- Route portal subdomains to /portal/* paths
- Route auth.* to /(auth)/* paths
- Add tenant context to search params
- Integrate with Clerk middleware

### 5.2 Middleware Logic
```typescript
// Pseudocode structure
export default clerkMiddleware((auth, req) => {
  const hostname = req.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  
  if (subdomain === 'auth') {
    // Route to authentication pages
  } else if (subdomain === 'admin') {
    // Route to admin portal
  } else if (VALID_TENANTS.includes(subdomain)) {
    // Route to portal with tenant context
  }
  
  return NextResponse.next();
});
```

### 5.3 Tenant Context Provider
Create `components/TenantProvider.tsx`:
- Extract tenant from URL/headers
- Provide tenant context to components
- Handle tenant switching logic

---

## Phase 6: Permission System Foundation

### 6.1 Permission Resolution Logic
Create `convex/permissions.ts`:
- `resolvePermissions()` function with inheritance support
- `getUserEffectivePermissions()` query
- `hasPermission()` query for permission checking
- Permission caching mechanism
- Role inheritance resolution for custom roles

### 6.2 Field Permission System
Create `convex/fieldPermissions.ts`:
- `getFieldPermissions()` function
- Schema-based field permission resolution
- Field filtering for queries and mutations

### 6.3 Convex OpenAPI Documentation Setup
**Install Convex Helpers:**
```bash
npm install convex-helpers
```

**Generate OpenAPI Specification:**
```bash
npx convex-helpers open-api-spec
```

**Features:**
- Auto-generates `convex-spec.yaml` from your Convex functions
- Creates interactive API documentation
- Shows permission examples for different user roles
- Updates automatically when functions change

### 6.4 Permission Types
#### Entity Permissions
- Format: `{entity}_{action}`
- Actions: `_create`, `_edit`, `_delete`, `_fetch`, `_view`
- Grouped: `{entity}_full_access`

#### Feature Permissions
- Business capabilities: `analytics_dashboard`, `bulk_import`
- High-level access control beyond CRUD

#### Field Permissions
- `_fetch`: Backend API access
- `_view`: UI display permission
- `_update`: Field modification permission

### 6.5 Permission Utilities
Create `lib/permissions.ts`:
- Frontend permission checking hooks
- Permission constants and types
- Role definition constants

---

## Phase 7: User Management System

### 7.1 User Registration Flow
Create `convex/users.ts`:
- `createUserOnFirstSignup()` mutation
- `requestTenantAccess()` mutation
- User profile management functions

### 7.2 Clerk Webhook Integration
Create `src/app/api/webhooks/clerk/route.ts`:
- Handle user.created, user.updated, user.deleted
- Sync user data between Clerk and Convex
- Verify webhook signatures

### 7.3 Role Assignment System
- `assignUserRole()` mutation
- `revokeUserRole()` mutation
- `grantUserPermission()` mutation (overrides)

---

## Phase 8: Admin Portal Development (Shadcn UI)

### 8.1 Admin Layout and Navigation
Create `src/app/admin/layout.tsx`:
- Admin-specific navigation using Shadcn components
- Permission-based menu items
- Tenant switching interface

### 8.2 User Management Interface
Create admin pages using Shadcn UI:
- User listing with tenant access (DataTable)
- **Unified role assignment interface** (Select, Dialog) - system + custom roles
- Permission override management (Form, Checkbox)
- **Custom role creation** with inheritance options (Form, Checkbox groups)
- Tenant management dashboard (Card, Badge)
- **API Documentation Hub** - Host generated Swagger UI

### 8.3 Swagger Documentation Integration
**Setup API Documentation:**
- Generate OpenAPI spec: `npx convex-helpers open-api-spec`
- Host Swagger UI at `/admin/api-docs`
- Show permission examples for different user scenarios
- Interactive testing with different JWT tokens
- Document all entity and field-level permission checks

### 8.4 Shadcn Components to Use
- **DataTable**: User listings, permission tables
- **Form**: Role assignments, permission overrides, custom role creation
- **Dialog**: Confirmation modals, user details
- **Select**: Role selection, tenant switching, inheritance selection
- **Badge**: Permission indicators, status labels
- **Card**: Dashboard widgets, summary cards
- **Tabs**: API documentation sections

---

## Phase 9: Portal Interface Development (Shadcn UI)

### 9.1 Portal Layout System
Create `src/app/portal/layout.tsx`:
- Tenant-aware navigation using Shadcn components
- Branding per tenant
- Permission-based UI elements

### 9.2 Dynamic Components
Create permission-aware components using Shadcn:
- Dynamic tables with field permissions (DataTable)
- Dynamic forms with update permissions (Form)
- Feature-gated UI elements (conditional rendering)

### 9.3 Business Logic Implementation
Create tenant-scoped queries/mutations:
- Product management with field permissions
- Order processing with tenant isolation
- User profile management

### 9.4 Shadcn Components for Portals
- **DataTable**: Product listings, order history
- **Form**: Product creation/editing, user profiles
- **Sheet**: Sidebar navigation, filters
- **Tabs**: Content organization
- **Button**: Actions with permission checks
- **Input**: Form fields with validation

---

## Phase 10: Advanced Permission Features

### 10.1 Enhanced Custom Role System
Implement unified custom role system using Shadcn:
- **Inherited Custom Roles**: Role builder with base role selection (Form, Select)
- **Standalone Custom Roles**: Independent permission builder (Form, Checkbox groups)
- Permission selection UI (Tree view, Accordion)
- Role inheritance logic with add/remove permissions
- Use cases: temporary roles, external integrations, testing roles

### 10.2 API Documentation Enhancement
**Advanced Swagger Features:**
- Multiple user scenario examples (admin, user, mixed roles)
- Permission matrix documentation
- Field-level filtering examples
- Error response documentation for permission denials
- JWT structure and claims documentation

### 10.3 Temporary Permission System
Implement time-limited access:
- Expiration tracking
- Automatic permission cleanup
- Notification system for expiring permissions

### 10.4 Audit and Compliance
Create audit logging:
- Permission grant/revoke tracking
- Data access logging
- Compliance reporting

---

## Phase 11: Vercel Deployment and Domain Setup

### 11.1 Vercel Configuration
Create `vercel.json`:
- Subdomain rewrites configuration
- Environment variable setup
- Build optimization settings

### 11.2 Domain Configuration
DNS Setup:
- CNAME records for subdomains
- SSL certificate configuration
- Domain verification in Vercel

### 11.3 Production Environment
Environment variables:
- Production Clerk keys
- Production Convex deployment
- Webhook endpoints configuration
- **Deploy Swagger Documentation** alongside application

### 11.4 API Documentation Deployment
**Production API Docs:**
- Host Swagger UI at `admin.mywebsite.com/api-docs`
- Secure with admin-only access
- Auto-update with deployment pipeline
- Include all permission scenarios and examples

---

## Phase 12: Testing and Optimization

### 12.1 Permission Testing
Create test suites:
- Permission resolution testing (all role types: system, inherited custom, standalone custom)
- Field-level access testing
- Cross-tenant isolation testing
- Role inheritance testing

### 12.2 API Documentation Validation
**Swagger Testing:**
- Validate all permission scenarios with real API calls
- Test with different JWT tokens and user roles
- Verify field-level filtering examples
- Document edge cases and error responses

### 12.3 Performance Optimization
Implement caching:
- Permission result caching
- Query optimization
- CDN configuration

### 12.4 Security Audit
Security validation:
- Permission bypass testing
- Data isolation verification
- Authentication flow testing

---

## Implementation Dependencies

### Critical Path
1. **JWT Template → Convex Auth** (Phases 1-2)
2. **Schema → Permissions** (Phases 3-6)
3. **Middleware → Routing** (Phase 5)
4. **User Management → Portals** (Phases 7-9)

### Parallel Development
- **Admin portal** can be built alongside **portal interfaces**
- **Advanced permissions** can be added after core system
- **Testing** should run continuously throughout

### Validation Checkpoints
- **Phase 2**: Authentication working across subdomains
- **Phase 6**: Basic permission checking functional
- **Phase 5**: Subdomain routing working locally
- **Phase 9**: Full tenant isolation verified
- **Phase 11**: Production deployment successful

---

## Technical Notes

### UI Framework
- **All components use Shadcn UI** via MCP server
- **Consistent design system** across all portals
- **Permission-aware components** that adapt to user permissions
- **Responsive design** with mobile-first approach

### Security Considerations
- **Tenant isolation**: Data automatically scoped by tenant
- **Permission validation**: Every operation checked against user permissions
- **Field-level security**: Column access control
- **Audit logging**: Track all permission grants and data access

### Performance Considerations
- **Permission caching**: Pre-computed effective permissions
- **Query optimization**: Efficient tenant filtering
- **CDN usage**: Static asset optimization
- **Database indexing**: Proper indexes for tenant queries

### Development Environment
- **Local subdomain testing**: Using hosts file modification
- **Environment variable management**: Across dev/staging/production
- **Webhook testing**: Local tunneling for Clerk integration
- **Database seeding**: Sample tenants and permission structures
