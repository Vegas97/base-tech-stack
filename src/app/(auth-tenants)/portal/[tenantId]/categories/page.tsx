import { ValidTenantId } from "@/../convex/lib/constants";

interface CategoriesPageProps {
  params: Promise<{ tenantId: ValidTenantId }>;
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { tenantId } = await params;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-600">
          Manage categories for {tenantId} tenant
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Category List
            </h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Add Category
            </button>
          </div>

          <div className="border rounded-lg">
            <div className="p-4 bg-gray-50 border-b">
              <p className="text-sm text-gray-600">
                Categories will be filtered by tenant:{" "}
                <strong>{tenantId}</strong>
              </p>
            </div>
            <div className="p-8 text-center text-gray-500">
              <p>No categories found for this tenant.</p>
              <p className="text-xs mt-2">
                This will call CategoryService.getCategories({tenantId})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
