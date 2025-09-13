"use client";

import { AgGridReact } from "ag-grid-react";
import { useCallback, useMemo, useRef } from "react";
import { themeQuartz } from "ag-grid-community";
import { useTheme } from "next-themes";
import { productColumnDefs } from "./products-columns";
import { productsClient } from "@/lib/services/products/client";

interface ProductsAgGridProps {
  tenantId: string;
}

export function ProductsAgGrid({ tenantId }: ProductsAgGridProps) {
  const gridRef = useRef<AgGridReact>(null);
  const { theme } = useTheme();

  // Use Convex pagination hook
  const { results, status, loadMore, isLoading } = productsClient.useList({
    tenantId,
    filters: {},
    sort: { field: "_creationTime", direction: "desc" },
    initialNumItems: 1,
  });

  // Debug logging
  console.log("AG Grid Debug:", {
    tenantId,
    status,
    resultsCount: results?.length || 0,
    results: results?.slice(0, 2), // First 2 items for debugging
    isLoading,
  });

  // Customize the Quartz theme with modern Theming API and theme awareness
  const customTheme = useMemo(() => {
    const isDark = theme === "dark";

    if (isDark) {
      return themeQuartz.withParams({
        backgroundColor: "#1f2836",
        browserColorScheme: "dark",
        chromeBackgroundColor: {
          ref: "foregroundColor",
          mix: 0.07,
          onto: "backgroundColor",
        },
        foregroundColor: "#FFF",
        headerFontSize: 14,
        accentColor: "#60a5fa",
        spacing: 8,
        borderRadius: 6,
      });
    } else {
      return themeQuartz.withParams({
        browserColorScheme: "light",
        headerFontSize: 14,
      });
    }
  }, [theme]);

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
    }),
    []
  );

  const onGridReady = useCallback((params: any) => {
    // Auto-size columns to fit content
    params.api.autoSizeAllColumns();
  }, []);

  const onFirstDataRendered = useCallback((params: any) => {
    // Auto-size columns after data is loaded
    params.api.autoSizeAllColumns();
  }, []);

  // Handle load more when scrolling to bottom
  const onBodyScrollEnd = useCallback(() => {
    if (status === "CanLoadMore" && !isLoading) {
      loadMore(50);
    }
  }, [status, isLoading, loadMore]);

  return (
    <div className="w-full">
      {/* Loading indicator */}
      {status === "LoadingFirstPage" && (
        <div className="flex justify-center items-center h-32">
          <div className="text-gray-500">Loading products...</div>
        </div>
      )}

      {/* AG Grid */}
      <div
        className={`h-[600px] w-full ${
          theme === "dark" ? "ag-theme-quartz-dark" : "ag-theme-quartz"
        }`}
      >
        <AgGridReact
          ref={gridRef}
          theme={customTheme}
          columnDefs={productColumnDefs}
          defaultColDef={defaultColDef}
          rowData={results}
          onGridReady={onGridReady}
          onFirstDataRendered={onFirstDataRendered}
          onBodyScrollEnd={onBodyScrollEnd}
          pagination={false} // We handle pagination with Convex
          suppressPaginationPanel={true}
          animateRows={true}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          getRowId={(params) => params.data._id}
        />
      </div>

      {/* Load more button */}
      {status === "CanLoadMore" && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => loadMore(50)}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* Results info */}
      <div className="mt-2 text-sm text-gray-500">
        Showing {results.length} products
        {status === "CanLoadMore" && " (more available)"}
      </div>
    </div>
  );
}
