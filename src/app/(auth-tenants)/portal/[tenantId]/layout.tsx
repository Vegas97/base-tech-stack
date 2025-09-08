import { ValidTenantId } from "@/../convex/lib/constants";

interface PortalLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tenantId: ValidTenantId }>;
}

export default async function PortalLayout({
  children,
  params,
}: PortalLayoutProps) {
  const { tenantId } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Portal Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Tenant: {tenantId}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <div className="flex space-x-8">
            <a
              href={`/portal/${tenantId}`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Dashboard
            </a>
            <a
              href={`/portal/${tenantId}/products`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Products
            </a>
            <a
              href={`/portal/${tenantId}/categories`}
              className="text-blue-600 hover:text-blue-800 font-medium"
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
