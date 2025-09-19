# Clerk Authentication Architecture Guide

## Overview

This document explains the complete authentication architecture for our multi-tenant SaaS platform using Clerk and Convex. Our system supports multiple subdomains with unified authentication and permission management.

---

## Architecture Components

### Tech Stack Integration
- **Clerk**: Authentication provider and user management
- **Convex**: Backend database and API with JWT validation
- **Next.js**: Frontend framework with middleware for subdomain routing
- **Vercel**: Hosting platform with subdomain support

### Domain Structure
```
auth.mywebsite.com     → Authentication flows (sign-in/sign-up)
admin.mywebsite.com    → Super admin portal
portal1.mywebsite.com  → Tenant-specific portal (e.g., scuba diving)
portal2.mywebsite.com  → Tenant-specific portal (e.g., skydiving)
```

---

## Clerk Configuration

### JWT Template Setup
Custom JWT template named `convex` in Clerk Dashboard:

```json
{
  "iss": "https://direct-leopard-80.clerk.accounts.dev",
  "sub": "{{user.id}}",
  "aud": "convex",
  "exp": {{token.exp}},
  "iat": {{token.iat}},
  "tenantAccess": "{{user.private_metadata.tenantAccess}}",
  "roleIds": "{{user.private_metadata.roleIds}}"
}
```

### Allowed Origins Configuration
All subdomains must be added to Clerk's allowed origins:

**Development:**
```
http://localhost:3000
http://admin.dellavega.local:3000
http://scubadiving.dellavega.local:3000
http://skydiving.dellavega.local:3000
http://auth.dellavega.local:3000
```

**Production:**
```
https://dellavega.com
https://admin.dellavega.com
https://scubadiving.dellavega.com
https://skydiving.dellavega.com
https://auth.dellavega.com
```

### User Metadata Structure
Clerk stores essential user data in `private_metadata`:

```typescript
interface ClerkPrivateMetadata {
  tenantAccess: string[];        // ["scubadiving", "skydiving"]
  roleIds: string[];             // ["PORTAL_SCUBADIVING_USER", "PORTAL_SKYDIVING_ADMIN"]
  firstTenantId: string;         // "scubadiving"
}
```

---

## Convex Integration

### Authentication Setup
Convex validates JWT tokens from Clerk:

```typescript
// convex/auth.config.js
export default {
  providers: [
    {
      domain: "https://direct-leopard-80.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
```

### User Identity Resolution
Convex functions access authenticated user data:

```typescript
// convex/users.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => 
        q.eq("clerkUserId", identity.subject)
      )
      .unique();
  },
});
```

### Permission Validation
Functions validate user permissions before data access:

```typescript
export const getProducts = query({
  args: { tenantId: v.string() },
  handler: async (ctx, { tenantId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    
    // Validate tenant access
    const tenantAccess = identity.tenantAccess || [];
    if (!tenantAccess.includes(tenantId)) {
      throw new Error("Access denied to tenant");
    }
    
    // Check specific permissions
    const hasPermission = await checkPermission(
      ctx, 
      identity.subject, 
      "products_view", 
      tenantId
    );
    
    if (!hasPermission) {
      throw new Error("Insufficient permissions");
    }
    
    return await ctx.db
      .query("products")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
  },
});
```

---

## Authentication Flows

### 1. Initial Sign-Up Flow
```
User visits: scubadiving.dellavega.local
↓
Middleware detects no auth → Redirect to auth.dellavega.local
↓
Clerk handles sign-up → Sets tenantAccess: ["scubadiving"]
↓
Convex creates user record with firstTenantId: "scubadiving"
↓
Redirect back to: scubadiving.dellavega.local
```

### 2. Cross-Tenant Access
```
User visits: skydiving.dellavega.local (different tenant)
↓
Middleware checks JWT → User has access to ["scubadiving"] only
↓
Show "Request Access" page or redirect to scubadiving
↓
Admin grants access → Updates tenantAccess: ["scubadiving", "skydiving"]
↓
User can now access both portals
```

### 3. Admin Portal Access
```
User visits: admin.dellavega.local
↓
Middleware checks role → Validates SUPER_ADMIN role
↓
If authorized → Show admin interface
↓
If not → Show "Access Denied" page
```

---

## Domain-Specific Logic

### Auth Domain (`auth.dellavega.local`)
**Purpose**: Centralized authentication flows
- Handles all Clerk sign-in/sign-up components
- Processes OAuth callbacks
- Manages password resets and email verification
- Redirects to appropriate tenant after authentication

**Key Features**:
- Clean, branded authentication experience
- Tenant detection from referrer or query params
- Post-auth redirect logic to original destination

### Portal Domains (`scubadiving.dellavega.local`, `skydiving.dellavega.local`)
**Purpose**: Tenant-specific application interfaces
- Serve tenant-scoped data and functionality
- Validate tenant access on every request
- Provide tenant-specific branding and configuration

**Authentication Requirements**:
- Valid JWT token with tenant in `tenantAccess`
- Appropriate role permissions for requested actions
- Session management across page refreshes

### Admin Domain (`admin.dellavega.local`)
**Purpose**: System administration and tenant management
- Cross-tenant data access for SUPER_ADMIN users
- User and role management interfaces
- System configuration and monitoring

**Special Permissions**:
- Bypass tenant restrictions for SUPER_ADMIN
- Access to all tenant data and user management
- System-level configuration capabilities

---

## Security Considerations

### JWT Token Security
- **Short Expiration**: Tokens expire every hour for security
- **Automatic Refresh**: Clerk handles token refresh transparently
- **Secure Storage**: Tokens stored in httpOnly cookies when possible

### Cross-Domain Security
- **CORS Configuration**: Strict origin validation in Clerk
- **Subdomain Isolation**: Each tenant operates in isolated subdomain
- **Permission Validation**: Every API call validates user permissions

### Session Management
- **Single Sign-On**: One login works across all authorized subdomains
- **Logout Propagation**: Logout from one domain clears all sessions
- **Concurrent Sessions**: Multiple browser tabs work seamlessly

---

## Development Setup

### Local Environment
Edit `/etc/hosts` for subdomain simulation:
```bash
127.0.0.1 dellavega.local
127.0.0.1 admin.dellavega.local
127.0.0.1 scubadiving.dellavega.local
127.0.0.1 skydiving.dellavega.local
127.0.0.1 auth.dellavega.local
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWT_ISSUER_DOMAIN=https://direct-leopard-80.clerk.accounts.dev
CONVEX_DEPLOYMENT=your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### Testing Authentication
1. Start development server: `npm run dev`
2. Visit: `http://scubadiving.dellavega.local:3000`
3. Should redirect to: `http://auth.dellavega.local:3000`
4. Complete sign-up flow
5. Verify redirect back to original subdomain
6. Test cross-subdomain navigation

---

## Advanced Features

### Multi-Tenant Role Management
- Users can have different roles in different tenants
- Role inheritance from system roles to custom roles
- Permission overrides at user level

### Dynamic Tenant Creation
- New subdomains can be created programmatically
- Automatic DNS and SSL certificate provisioning
- Tenant-specific configuration and branding

### API Documentation Integration
- Convex OpenAPI generation with permission examples
- Interactive Swagger UI in admin portal
- Permission-aware API documentation

### Audit Trail
- All authentication events logged
- Permission changes tracked
- Cross-tenant access monitoring

---

## Troubleshooting

### Common Issues

**"Unauthorized" errors in Convex**:
- Check JWT template configuration in Clerk
- Verify allowed origins include current domain
- Ensure user has required tenant access

**Redirect loops during authentication**:
- Verify middleware subdomain detection logic
- Check for conflicting redirect rules
- Ensure auth domain is properly configured

**Cross-subdomain session issues**:
- Verify cookie domain settings
- Check CORS configuration
- Ensure all subdomains in Clerk allowed origins

### Debug Tools
- Clerk Dashboard: Monitor authentication events
- Convex Dashboard: View function logs and errors
- Browser DevTools: Inspect JWT tokens and network requests
- Next.js middleware logs: Debug subdomain routing

---

## Production Deployment

### DNS Configuration
```
auth.dellavega.com     → CNAME to Vercel
admin.dellavega.com    → CNAME to Vercel
*.dellavega.com        → CNAME to Vercel (wildcard)
```

### SSL Certificates
- Vercel automatically provisions SSL for all subdomains
- Wildcard certificate recommended for scalability
- Custom domain configuration in Vercel dashboard

### Performance Optimization
- CDN caching for static assets
- JWT token caching in Redis for high-traffic scenarios
- Database connection pooling in Convex
- Preload critical authentication resources

This architecture provides a scalable, secure foundation for multi-tenant authentication while maintaining a seamless user experience across all subdomains.
