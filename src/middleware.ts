import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  TENANT_CONFIG,
  type ValidTenantId,
  TenantType,
} from "../convex/lib/constants";
import { isValidTenantId } from "../convex/lib/validation_utils";

export default clerkMiddleware((auth, req: NextRequest) => {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";

  // Extract subdomain from hostname
  const subdomain = getSubdomain(hostname);

  // Log subdomain detection for debugging
  console.log(
    `[Middleware] Host: ${hostname}, Subdomain: ${subdomain}, Path: ${url.pathname}`
  );

  // Handle main domain routing (dellavega.local, dellavega.com without subdomains)
  if (!subdomain) {
    // System routes that should not be rewritten
    const systemRoutes = [
      "/_next", // Next.js internal files (JS, CSS, images, etc.)
      "/api", // API routes
    ];

    // Skip system routes
    const isSystemRoute = systemRoutes.some((route) =>
      url.pathname.startsWith(route)
    );

    if (!isSystemRoute) {
      // Always route main domain to /main folder
      if (!url.pathname.startsWith("/main")) {
        url.pathname = `/main${url.pathname}`;
        console.log(`[Middleware] Rewriting main domain to: ${url.pathname}`);
        return NextResponse.rewrite(url);
      }
    }
  }

  // Handle subdomain routing with type-safe tenant validation
  if (subdomain) {
    // Type-safe tenant validation
    if (!isValidTenantId(subdomain)) {
      console.log(`[Middleware] Invalid tenant subdomain: ${subdomain}`);
      return new NextResponse(null, { status: 404 });
    }

    // Type-safe tenant routing - subdomain is validated above
    const tenantId: ValidTenantId = subdomain as ValidTenantId;
    const tenantConfig = TENANT_CONFIG[tenantId];

    console.log(
      `[Middleware] Valid tenant: ${tenantConfig.name} (${tenantId}) - Type: ${tenantConfig.type}`
    );


    // System routes that should not be rewritten
    const systemRoutes = ["/_next", "/api"];
    const isSystemRoute = systemRoutes.some((route) =>
      url.pathname.startsWith(route)
    );

    if (!isSystemRoute) {
      if (tenantConfig.type === TenantType.PORTAL) {
        // Portal tenants (scubadiving, skydiving) - route to /portal/{tenantId}
        if (!url.pathname.startsWith("/portal")) {
          url.pathname = `/portal/${tenantId}${url.pathname}`;
          console.log(
            `[Middleware] Rewriting portal ${tenantId} to: ${url.pathname}`
          );
          return NextResponse.rewrite(url);
        }
      } else if (tenantConfig.type === TenantType.STANDALONE) {
        // Standalone tenants with auth (admin, integrators, validators, testers) - route to /{tenantId}
        if (!url.pathname.startsWith(`/${tenantId}`)) {
          url.pathname = `/${tenantId}${url.pathname}`;
          console.log(
            `[Middleware] Rewriting auth tenant ${tenantId} to: ${url.pathname}`
          );
          return NextResponse.rewrite(url);
        }
      } else if (tenantConfig.type === TenantType.PUBLIC_STANDALONE) {
        // Public standalone tenants without auth (status) - route to /{tenantId}
        if (!url.pathname.startsWith(`/${tenantId}`)) {
          url.pathname = `/${tenantId}${url.pathname}`;
          console.log(
            `[Middleware] Rewriting public tenant ${tenantId} to: ${url.pathname}`
          );
          return NextResponse.rewrite(url);
        }
      } else if (tenantConfig.type === TenantType.API_ONLY) {
        // API-only tenants (api, external-api) - route to /api/{tenantId}
        if (!url.pathname.startsWith(`/api/${tenantId}`)) {
          url.pathname = `/api/${tenantId}${url.pathname}`;
          console.log(
            `[Middleware] Rewriting API tenant ${tenantId} to: ${url.pathname}`
          );
          return NextResponse.rewrite(url);
        }
      }
    }
  }

  return NextResponse.next();
});

/**
 * Extract subdomain from hostname
 * Examples:
 * - admin.dellavega.local -> "admin"
 * - scubadiving.dellavega.local -> "scubadiving"
 * - dellavega.local -> null (no subdomain)
 * - localhost -> null (no subdomain)
 */
function getSubdomain(hostname: string): string | null {
  // Remove port if present
  const host = hostname.split(":")[0];

  // Skip localhost and direct IP access
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    /^\d+\.\d+\.\d+\.\d+$/.test(host)
  ) {
    return null;
  }

  // Split by dots and check if we have a subdomain
  const parts = host.split(".");

  // For dellavega.local or dellavega.com, we need at least 3 parts for a subdomain
  // admin.dellavega.local = ["admin", "dellavega", "local"]
  if (parts.length >= 3) {
    return parts[0];
  }

  return null;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
