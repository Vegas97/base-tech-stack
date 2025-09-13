"use client";

import { ValidTenantId } from "@/../convex/lib/constants";
import "@/lib/ag-grid-setup"; // Register AG Grid modules
import { ProductsAgGrid } from "@/components/tables/products-ag-grid";

interface ProductsPageProps {
  params: Promise<{ tenantId: ValidTenantId }>;
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { tenantId } = await params;

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg shadow">
        <div className="p-6">
          <div className="border rounded-lg">
            <div className="p-8 text-center text-muted-foreground">
              {/* <ProductsAgGrid tenantId={tenantId} /> */}
              <ProductsAgGrid tenantId="admin" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
