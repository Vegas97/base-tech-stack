# Multi-Tenant API Architecture Implementation Plan

## 🎯 Overview

This document outlines the complete architecture transformation from individual tenant folders to a unified, scalable multi-tenant system with dynamic routing, centralized service layer, and consistent data flow.

## 🔄 Complete Architecture Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Routes    │    │ Server Actions  │    │ Service Layer   │    │  BaseService    │    │     Convex      │
│                 │    │                 │    │                 │    │                 │    │                 │
│ /api/api/*      │───▶│ src/actions/    │───▶│ ProductService  │───▶│ Logging         │───▶│ entities/       │
│ /api/external/  │    │ products.ts     │    │ UserService     │    │ Error Handling  │    │ features/       │
│                 │    │ users.ts        │    │ AuthService     │    │ Caching         │    │ auth/           │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Data Flow Architecture

### Example 1: API Route Flow
```typescript
// API Route → Service → BaseService → Convex
/api/api/v1/products/route.ts
  ↓ calls
ProductService.getProducts()
  ↓ extends
BaseService.execute()
  ↓ calls
convex/entities/products.ts
```

### Example 2: Server Action Flow
```typescript
// Server Action → Service → BaseService → Convex
src/actions/products.ts
  ↓ calls
ProductService.createProduct()
  ↓ extends
BaseService.execute()
  ↓ calls
convex/entities/products.ts
```

### Example 3: Direct Component Flow
```typescript
// Server Component → Service → BaseService → Convex
portal/[tenantId]/page.tsx
  ↓ calls
ProductService.getProducts()
  ↓ extends
BaseService.execute()
  ↓ calls
convex/entities/products.ts
```

## 🔧 Implementation Changes

### Change 1: Portal Structure Fix

**BEFORE:**
```
src/app/(auth-tenants)/
└── portal/
    ├── scubadiving/
    │   ├── page.tsx
    │   ├── products/
    │   └── layout.tsx
    └── skydiving/
        ├── page.tsx
        ├── products/
        └── layout.tsx
```

**AFTER:**
```
src/app/(auth-tenants)/
└── portal/
    └── [tenantId]/
        ├── page.tsx
        ├── products/
        │   └── page.tsx
        ├── categories/
        │   └── page.tsx
        └── layout.tsx
```

### Change 2: Add API Routes Structure

**BEFORE:**
```
src/app/
├── (auth-tenants)/
├── (public-tenants)/
├── main/
├── favicon.ico
├── globals.css
└── layout.tsx
```

**AFTER:**
```
src/app/
├── (auth-tenants)/
├── (public-tenants)/
├── main/
├── api/                     ← NEW
│   ├── api/                 ← NEW: api.dellavega.local
│   │   ├── v1/
│   │   │   ├── products/
│   │   │   │   └── route.ts ← calls ProductService
│   │   │   └── users/
│   │   │       └── route.ts ← calls UserService
│   │   └── auth/
│   │       └── route.ts     ← calls AuthService
│   └── external-api/        ← NEW: external-api.dellavega.local
│       ├── webhooks/
│       │   └── route.ts     ← calls ProductService
│       └── integrations/
│           └── route.ts     ← calls AuthService
├── favicon.ico
├── globals.css
└── layout.tsx
```

### Change 3: Service Layer with BaseService Flow

**BEFORE:**
```
src/lib/
└── utils.ts
```

**AFTER:**
```
src/lib/
├── utils.ts
├── convex.ts                ← NEW: Convex client
└── services/                ← NEW: Service layer
    ├── base.ts              ← NEW: BaseService (logging, caching, error handling)
    ├── products.ts          ← NEW: ProductService → BaseService → Convex
    ├── users.ts             ← NEW: UserService → BaseService → Convex
    ├── auth.ts              ← NEW: AuthService → BaseService → Convex
    └── index.ts             ← NEW: Exports
```

### Change 4: Server Actions with Service Flow

**BEFORE:**
```
src/
├── app/
├── components/
├── lib/
└── middleware.ts
```

**AFTER:**
```
src/
├── app/
├── components/
├── lib/
├── actions/                 ← NEW: Server actions
│   ├── products.ts          ← NEW: calls ProductService
│   ├── users.ts             ← NEW: calls UserService
│   └── auth.ts              ← NEW: calls AuthService
└── middleware.ts
```

### Change 5: Convex Business Logic (Using Existing Folders)

**BEFORE:**
```
convex/
├── _generated/
├── auth/                    (empty)
├── entities/                (empty)
├── features/                (empty)
├── lib/
│   ├── constants.ts
│   ├── validation_utils.ts
│   ├── audit_utils.ts
│   └── permission_utils.ts
├── schema.ts
└── seed.ts
```

**AFTER:**
```
convex/
├── _generated/
├── auth/                    ← Use existing folder
│   ├── apiKeys.ts           ← NEW: API key validation
│   └── sessions.ts          ← NEW: Session management
├── entities/                ← Use existing folder
│   ├── products.ts          ← NEW: Product queries/mutations
│   ├── users.ts             ← NEW: User queries/mutations
│   └── tenants.ts           ← NEW: Tenant queries/mutations
├── features/                ← Use existing folder
│   ├── productCatalog.ts    ← NEW: Product catalog features
│   ├── userManagement.ts    ← NEW: User management features
│   └── apiIntegration.ts    ← NEW: API integration features
├── lib/
│   ├── constants.ts         ← UPDATED: Enhanced with new types
│   ├── field_permissions.ts ← UPDATED: Field-level permissions
│   ├── validation_utils.ts
│   ├── audit_utils.ts
│   └── permission_utils.ts
├── schema.ts
└── seed.ts
```

### Change 6: Update Middleware

**BEFORE:**
```typescript
// src/middleware.ts (partial)
if (tenantConfig.type === TenantType.PORTAL) {
  url.pathname = `/portal/${tenantId}${url.pathname}`;
  return NextResponse.rewrite(url);
}
if (tenantConfig.type === TenantType.STANDALONE) {
  url.pathname = `/${tenantId}${url.pathname}`;
  return NextResponse.rewrite(url);
}
// No API_ONLY handling
```

**AFTER:**
```typescript
// src/middleware.ts (partial)
if (tenantConfig.type === TenantType.PORTAL) {
  url.pathname = `/portal/${tenantId}${url.pathname}`;
  return NextResponse.rewrite(url);
}
if (tenantConfig.type === TenantType.STANDALONE) {
  url.pathname = `/${tenantId}${url.pathname}`;
  return NextResponse.rewrite(url);
}
if (tenantConfig.type === TenantType.API_ONLY) {    ← NEW
  url.pathname = `/api/${tenantId}${url.pathname}`;  ← NEW
  return NextResponse.rewrite(url);                  ← NEW
}                                                    ← NEW
```

## 🎯 BaseService Responsibilities

```typescript
// src/lib/services/base.ts
class BaseService {
  // 1. Centralized logging for all operations
  // 2. Error handling and standardized responses
  // 3. Caching layer (optional)
  // 4. Rate limiting tracking
  // 5. Audit trail for all operations
  // 6. Performance monitoring
}
```

## 📋 Files Created/Updated

### Service Layer Files:
- `src/lib/convex.ts` (Convex client setup)
- `src/lib/services/base.ts` (BaseService with logging, caching, error handling)
- `src/lib/services/products.ts` (ProductService extends BaseService)
- `src/lib/services/users.ts` (UserService extends BaseService)
- `src/lib/services/auth.ts` (AuthService extends BaseService)
- `src/lib/services/index.ts` (Export all services)

### Server Actions (call Services):
- `src/actions/products.ts` (calls ProductService methods)
- `src/actions/users.ts` (calls UserService methods)
- `src/actions/auth.ts` (calls AuthService methods)

### API Routes (call Services):
- `src/app/api/api/v1/products/route.ts` (calls ProductService methods)
- `src/app/api/api/v1/users/route.ts` (calls UserService methods)
- `src/app/api/api/auth/route.ts` (calls AuthService methods)
- `src/app/api/external-api/webhooks/route.ts` (calls ProductService methods)
- `src/app/api/external-api/integrations/route.ts` (calls AuthService methods)

### Convex Business Logic:
- `convex/entities/products.ts` (Product queries/mutations)
- `convex/entities/users.ts` (User queries/mutations)
- `convex/entities/tenants.ts` (Tenant queries/mutations)
- `convex/features/productCatalog.ts` (Product catalog features)
- `convex/features/userManagement.ts` (User management features)
- `convex/features/apiIntegration.ts` (API integration features)
- `convex/auth/apiKeys.ts` (API key validation)
- `convex/auth/sessions.ts` (Session management)
- `convex/lib/constants.ts` (Updated with enhanced types)
- `convex/lib/field_permissions.ts` (Field-level permissions)

### Portal Structure:
- `src/app/(auth-tenants)/portal/[tenantId]/page.tsx`
- `src/app/(auth-tenants)/portal/[tenantId]/layout.tsx`
- `src/app/(auth-tenants)/portal/[tenantId]/products/page.tsx`
- `src/app/(auth-tenants)/portal/[tenantId]/categories/page.tsx`

## 🏗️ Architecture Benefits

### 1. **Unified Data Flow**
- Every operation goes through the same BaseService layer
- Consistent logging, error handling, and monitoring
- Centralized caching and rate limiting

### 2. **Scalable Multi-Tenancy**
- Dynamic routing supports unlimited tenants
- No code changes needed for new tenants
- Proper tenant isolation and security

### 3. **Type Safety**
- Full TypeScript coverage across all layers
- Compile-time validation of tenant IDs and permissions
- Strongly typed API contracts

### 4. **Maintainability**
- Clear separation of concerns
- Reusable business logic in services
- Centralized configuration and constants

### 5. **Performance**
- Built-in caching at the service layer
- Efficient database queries through Convex
- Rate limiting to prevent abuse

### 6. **Security**
- API key authentication for API-only tenants
- Role-based access control
- Audit logging for compliance

## 🚀 Implementation Status

✅ **Completed:**
- Portal structure reorganization
- API routes implementation
- Service layer with BaseService
- Server actions implementation
- Convex business logic
- Middleware updates
- Type-safe constants and permissions

This architecture creates a unified, scalable multi-tenant system with consistent logging, error handling, and data flow across all operations.
