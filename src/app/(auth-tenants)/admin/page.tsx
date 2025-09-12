"use client";

import { ProductsAgGrid } from '@/components/tables/products-ag-grid';
import '@/lib/ag-grid-setup'; // Register AG Grid modules

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Products Management
        </h1>
        <div className="bg-card rounded-lg shadow p-6">
          <ProductsAgGrid tenantId="admin" />
        </div>
      </div>
    </div>
  );
}
