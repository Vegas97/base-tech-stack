import { ValidTenantId } from "@/../convex/lib/constants";

interface PortalLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tenantId: string }>;
}

export default async function PortalLayout({
  children,
  params,
}: PortalLayoutProps) {
  const { tenantId } = await params;
  
  // Validate tenantId is a valid tenant
  const validTenantId = tenantId as ValidTenantId;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Portal Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Tenant: {validTenantId}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <div className="flex space-x-8">
            <a
              href={`/portal/${validTenantId}`}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Dashboard
            </a>
            <a
              href={`/portal/${validTenantId}/products`}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Products
            </a>
            <a
              href={`/portal/${validTenantId}/categories`}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Categories
            </a>
          </div>
        </nav>

        {children}
      </div>
    </div>
  );
}
