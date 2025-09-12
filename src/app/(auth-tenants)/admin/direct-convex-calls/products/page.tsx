"use client";

import { useState, useCallback } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function DirectConvexProductsPage() {
  const [resetKey, setResetKey] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  // Direct Convex call without wrapper
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.entities.products.listProducts,
    {
      tenantId: "admin", // Replace with actual tenant ID
      filters: {},
      sort: { field: "_creationTime", direction: "desc" },
    },
    { initialNumItems: 1 }
  );

  const handleReset = useCallback(async () => {
    setIsResetting(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setResetKey((prev) => prev + 1);
    setIsResetting(false);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Direct Convex Products Demo
          </h1>
          <p className="text-muted-foreground">
            Testing direct usePaginatedQuery without wrapper
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={isResetting}
          onClick={handleReset}
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isResetting ? "animate-spin" : ""}`}
          />
          {isResetting ? "Resetting..." : "Reset Cache"}
        </Button>
      </div>

      <div className="bg-card border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          Query Debug Info
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex gap-4">
            <span className="font-medium text-foreground">Status:</span>
            <span className="text-muted-foreground">{status}</span>
          </div>
          <div className="flex gap-4">
            <span className="font-medium text-foreground">Results Count:</span>
            <span className="text-muted-foreground">
              {results?.length || 0}
            </span>
          </div>
          <div className="flex gap-4">
            <span className="font-medium text-foreground">Is Loading:</span>
            <span className="text-muted-foreground">
              {isLoading ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex gap-4">
            <span className="font-medium text-foreground">Reset Key:</span>
            <span className="text-muted-foreground">{resetKey}</span>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          Products Data
        </h2>

        {status === "LoadingFirstPage" && (
          <div className="flex justify-center items-center h-32">
            <div className="text-muted-foreground">Loading products...</div>
          </div>
        )}

        {results && results.length > 0 ? (
          <div className="space-y-4">
            {results.map((product, index) => (
              <div
                key={product._id}
                className="border rounded-lg p-4 bg-background"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-foreground">
                    {product.name}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    #{index + 1}
                  </span>
                </div>
                <p className="text-muted-foreground mb-2">
                  {product.description}
                </p>
                <div className="flex gap-4 text-sm">
                  <span className="text-foreground">
                    Category: {product.category}
                  </span>
                  <span className="text-foreground">
                    Price: ${product.price?.toFixed(2) || "0.00"}
                  </span>
                  <span className="text-foreground">
                    Active: {product.isActive ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            ))}

            {status === "CanLoadMore" && (
              <Button
                onClick={() => loadMore(1)}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Loading..." : "Load More"}
              </Button>
            )}
          </div>
        ) : (
          status !== "LoadingFirstPage" && (
            <div className="text-center py-8 text-muted-foreground">
              No products found
            </div>
          )
        )}
      </div>
    </div>
  );
}
