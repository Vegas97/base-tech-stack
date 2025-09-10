import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ValidTenantId } from '@/../convex/lib/constants';

/**
 * Get tenant ID from server-side headers (middleware sets x-tenant-id)
 * Use this in Server Components, Server Actions, and API routes
 */
export async function getTenantFromHeaders(): Promise<ValidTenantId | null> {
  const headersList = await headers();
  const tenantId = headersList.get('x-tenant-id');
  
  if (!tenantId) {
    return null;
  }
  
  return tenantId as ValidTenantId;
}

/**
 * Get tenant ID from server-side headers with error throwing
 * Use when tenant is required
 */
export async function requireTenantFromHeaders(): Promise<ValidTenantId> {
  const tenantId = await getTenantFromHeaders();
  
  if (!tenantId) {
    throw new Error('Tenant ID is required but not found in headers');
  }
  
  return tenantId;
}

/**
 * Extract tenant from API route request headers
 * Throws an error if tenant is not found - let the try/catch handle it
 * Use this in API routes for clean error handling
 */
export function extractTenantFromRequest(request: NextRequest): ValidTenantId {
  const tenantId = request.headers.get('x-tenant-id');
  
  if (!tenantId) {
    throw new Error('tenantId is required');
  }
  
  return tenantId as ValidTenantId;
}
