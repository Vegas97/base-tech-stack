import { ValidTenantId } from "@/../convex/lib/constants";

interface PortalPageProps {
  params: Promise<{ tenantId: ValidTenantId }>;
}

export default async function PortalPage({ params }: PortalPageProps) {
  const { tenantId } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to {tenantId} Portal
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your {tenantId} tenant data and settings from this dashboard.
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Dynamic Routing Test:</strong> This page serves all portal
            tenants ({tenantId}) with the same structure but different data.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Products</h3>
            <p className="text-sm text-gray-600 mb-3">
              Manage your product catalog
            </p>
            <a
              href={`/portal/${tenantId}/products`}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Products →
            </a>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Categories</h3>
            <p className="text-sm text-gray-600 mb-3">
              Organize your product categories
            </p>
            <a
              href={`/portal/${tenantId}/categories`}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Categories →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
